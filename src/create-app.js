import { destroyDOM } from './destroy-dom'
import { mountDOM } from './mount-dom'
import { Dispatcher } from './dispatcher'

// re-render the application after every command
export function createApp({ state, view, reducers = {}}) {
    let parentEl = null;
    let vdom = null;
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
        if (vdom) {
            destroyDOM(vdom);
        }
        vdom = view(state, emit);
        mountDOM(vdom, parentEl);
    }

    return {
        mount(_parentEl) {
            parentEl = _parentEl;
            renderApp();
        },
        unmount() {
            destroyDOM(vdom);
            vdom = null;
            subscriptions.forEach((unsubscribe) => unsubscribe());
        }
    };
}
