import { destroyDOM } from "../destroy-dom";
import { mountDOM } from "../mount-dom";
import { patchDOM } from "../patch-dom";
import { DOM_TYPES, extractChildren } from "../h";
import { hasOwnProperty } from "../utils/objects";
import { Dispatcher } from "../dispatcher";
import { fillSlots } from './slots';

const emptyFn = () => {};

export function defineComponent({ render, 
                                  state, 
                                  onMounted = emptyFn,
                                  onUnmounted = emptyFn,
                                  ...methods }) {
    class Component {
        #isMounted = false;
        #vdom = null;
        #hostEl = null;
        #eventsHandlers = null;
        #parentComponent = null;
        #dispatcher = new Dispatcher();
        #subscriptions = []; // An array for the unsubscribe functions
        #children = []; // Slots

        
        constructor(
            props = {},
            eventHandlers = {},
            parentComponent = null,
        ) {
            this.props = props;
            this.state = state ? state(props) : {};
            this.#eventsHandlers = eventHandlers;
            this.#parentComponent = parentComponent;
        }
        
        setExternalContent(children) {
            this.#children = children;
        }

        #wireEventHandlers() {
            this.#subscriptions = Object.entries(this.#eventsHandlers)
                                    .map(([eventName, handler]) => 
                                        this.#wireEventHandler(eventName, handler))
        }

        #wireEventHandler(eventName, handler) {
            return this.#dispatcher.subscribe(eventName, (payload) => {
                if (this.#parentComponent) {
                    handler.call(this.#parentComponent, payload);
                } else {
                    handler(payload);
                }
            })
        }

        get elements() {
            // If the vdom is null, return empty array
            if (this.#vdom == null) {
                return [];
            }
            if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
                // If the vdom top node is a fragment, returns the elements inside the fragment
                return extractChildren(this.#vdom).flatMap((child) => {
                    // Check whether the node is a component.
                    if (child.type === DOM_TYPES.COMPONENT) {
                        return child.component.elements; // Calls the elements getter recursively.
                    }
                    return [child.el]; // Otherwise, returns the node’s element inside an array
                })
            }
            // If vdom top node is a single node
            return [this.#vdom.el];
        }

        get componentFirstElement() {
            return this.elements[0];
        }

        get offset() {
            if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
                return Array.from(this.#hostEl.children).indexOf(this.componentFirstElement);
            }
            return 0; // When the component’s view isn’t a fragment, the offset is 0.
        }

        updateState(state) {
            this.state = { ...this.state, ...state };
            this.#patch(); // To reflect the changes in the DOM
        }

        updateProps(props) {
            // TODOS: By comparing the old new prop objects, we can avoid patching and
            // TODOS:the component—and all its subcomponents—if its props haven’t changed (deep-equal package)
            this.props = { ...this.props, ...props }; // Merge new and old props.
            this.#patch(); // Re-render
        }

        render() {
            // returns its view as a virtual DOM based on the state.
            // return render.call(this);
            const vdom = render.call(this);
            fillSlots(vdom, this.#children);

            return vdom;
        }

        mount(hostEl, index = null) {
            if (this.#isMounted) {
                throw new Error('Component is already mounted');
            }

            this.#vdom = this.render(); // Save the result.
            mountDOM(this.#vdom, hostEl, index, this);
            this.#wireEventHandlers();
        
            this.#hostEl = hostEl;
            this.#isMounted = true;
        }

        unmount() {
            if (!this.#isMounted) {
                throw new Error('Component is not mounted');
            }

            destroyDOM(this.#vdom);
            this.#subscriptions.forEach((unsubscribe) => unsubscribe());
        
            this.#vdom = null;
            this.#hostEl = null;
            this.#isMounted = false;
            this.#subscriptions = [];
        }

        emit(eventName, payload) {
            this.#dispatcher.dispatch(eventName, payload);
        }

        #patch() {
            if (!this.#isMounted) {
                throw new Error('Cannot unmount: component is not mounted.');
            }

            const vdom = this.render();
            this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl, this); // Save the result.
        }

        onMounted() {
            return Promise.resolve(onMounted.call(this));
        }

        onUnmounted() {
            return Promise.resolve(onUnmounted.call(this));
        }

        // async onMounted() {
        //     const data = await fetch('https://api.example.com/data')
        //     this.updateState({ data })
        // }
    }
    
    for (const methodName in methods) {
        if (hasOwnProperty(Component, methodName)) {
            throw new Error(`Method "${methodName}()" already exists in the component.`);
        }
        Component.prototype[methodName] = methods[methodName];
    }

    return Component;
}

// issues
// const component = new MyComponent()
// component.unmount() // Unmounting a component that's not mounted!
