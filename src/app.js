import { destroyDOM } from './destroy-dom';
import { mountDOM } from './mount-dom';
import { Dispatcher } from './dispatcher';
import { patchDOM } from './patch-dom';

export function createApp({ state, view, reducers = {} }) {
    let parentEl = null;
    let vdom = null; 
    let isMounted = null;

    const dispatcher = new Dispatcher(); 
    //  Subscribed the renderApp() function to be an after-command handler
    // so that the application is re-rendered after every command is handled.
    const subscriptions = [dispatcher.afterEveryCommand(renderApp)]

    function dispatchEvent(eventName, payload) {
        dispatcher.dispatch(eventName, payload);
    }

    for (const actionName in reducers) {
        const reducer = reducers[actionName];
        const subs = dispatcher.subscribe(actionName, (payload) => {
            state = reducer(state, payload);
        }) 
        subscriptions.push(subs);
    }
    // Draw UI.
    function renderApp() {
        const newVdom = view(state, emit);
        vdom = patchDOM(vdom, newVdom, parentEl);
    }
    return {
        mount(_parentEl) { // Mount to the DOM.
            if (isMounted) {
                throw new Error('The application is already mounted');
            }

            parentEl = _parentEl;
            vdom = view(state, emit);
            mountDOM(vdom, parentEl); // Only once.

            isMounted = true;
        },
        unmount() {
            destroyDOM(vdom);
            vdom = null;
            subscriptions.forEach((unsubscribe) => unsubscribe());

            isMounted = false;
        }
    }
}

// createApp({
//     state: { count: 0 },
//     view: (state, dispatch) => `<div>${state.count}</div>`,
//     reducers: {
//       increment: (state) => ({ count: state.count + 1 })
//     }
// });

