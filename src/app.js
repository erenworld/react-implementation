import { destroyDOM } from './destroy-dom';
import { mountDOM } from './mount-dom';
import { Dispatcher } from './dispatcher';

export function createApp({ state, view, reducers = {} }) {
    let parentEl = null;
    let vdom = null; 

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
        if (vdom) {
            destroyDOM(vdom); // If a previous view exists, unmounts it.
        }
        vdom = view(state, dispatchEvent);
        mountDOM(vdom, parentEl);
    }
    return {
        mount(_parentEl) { // Mount to the DOM.
            parentEl = _parentEl;
            renderApp();
        },
        unmount() {
            destroyDOM(vdom);
            vdom = null;
            subscriptions.forEach((unsubscribe) => unsubscribe());
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

