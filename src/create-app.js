import { destroyDOM } from './destroy-dom';
import { mountDOM } from './mount-dom';
import { Dispatcher } from './dispatcher';
import { patchDOM } from './patch-dom';

// re-render the application after every command
export function createApp({ state, view, reducers = {}}) {
    let parentEl = null;
    let vdom = null;
    let isMounted = false;
    const dispatcher = new Dispatcher();
    // Re-renders the application after every command
    const subscriptions = [dispatcher.afterEveryCommand(renderApp)];

    for (const actionName in reducers) {
        const reducer = reducers[actionName];
        const subs = dispatcher.subscribe(actionName, (payload) => {
            state = reducer(state, payload);
        });
        subscriptions.push(subs);
    }

    function emit(eventName, payload) {
        dispatcher.dispatch(eventName, payload);
    }

    function renderApp() {
        const newVdom = view(state, emit);
        vdom = patchDOM(vdom, newVdom, parentEl); // Patches the DOM every time the state changes
    }

    return {
        mount(_parentEl) {
            if (isMounted) {
                throw new Error('The application is already mounted');
            }
            parentEl = _parentEl;
            vdom = view(state, emit);
            mountDOM(vdom, parentEl); // Mounts the DOM only once
            isMounted = true;
        },
        unmount() {
            destroyDOM(vdom);
            vdom = null;
            subscriptions.forEach((unsubscribe) => unsubscribe());
            isMounted = false;
        }
    };
}
