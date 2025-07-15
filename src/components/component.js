import { destroyDOM } from "../destroy-dom";
import { mountDOM } from "../mount-dom";
import { patchDOM } from "../patch-dom";
import { DOM_TYPES, extractChildren } from "../h";
import { hasOwnProperty } from "../utils/objects";

// A factory function that, given a render() function,
// creates a component class that uses that function to render its view.
export function defineComponent({ render, state, ...methods }) {
    class Component {
        #isMounted = false;
        #vdom = null;
        #hostEl = null;

        constructor(props = {}) {
            this.props = props;
            this.state = state ? state(props) : {};
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

        render() {
            // returns its view as a virtual DOM based on the state.
            return render.call(this);
        }

        mount(hostEl, index = null) {
            if (this.#isMounted) {
                throw new Error('Component is already mounted');
            }

            this.#vdom = this.render(); // Save the result.
            mountDOM(this.#vdom, hostEl, index, this);
        
            this.#hostEl = hostEl;
            this.#isMounted = true;
        }

        unmount() {
            if (!this.#isMounted) {
                throw new Error('Component is not mounted');
            }

            destroyDOM(this.#vdom);
        
            this.#vdom = null;
            this.#hostEl = null;
            this.#isMounted = false;
        }

        #patch() {
            if (!this.#isMounted) {
                throw new Error('Component is not mounted');
            }

            const vdom = this.render();
            this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl, this); // Save the result.
        }
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
