import { mountDOM } from "./mount-dom";
import { destroyDOM } from './destroy-dom'
import { hElement } from "./h";
import { NoopRouter } from "./routing/hash-router";

export function createApp(RootComponent, props = {}, options = {}) {
    let parentEl = null;
    let isMounted = false;
    let vdom = null;

    const context = {
        router: options.router || new NoopRouter(),
    }

    // Reset internal properties of the app.
    function reset() {
        parentEl = null;
        isMounted = false;
        vdom = null;
    }
    
    return {
        mount(_parentEl) {
            if (isMounted) {
                throw new Error('The application is already mounted');
            }
            parentEl = _parentEl;
            vdom = hElement(RootComponent, props);
            // mountDOM(vdom, parentEl);
            mountDOM(vdom, parentEl, null, { appContext: context });

            context.router.init();
            isMounted = true;
        },
        unmount() {
            if (!isMounted) {
                throw new Error('The application is not mounted');
            }
            destroyDOM(vdom);
            context.router.destroy();
            reset();
        }
    }
}
