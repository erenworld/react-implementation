import { mountDOM } from "./mount-dom";
import { destroyDOM } from './destroy-dom'
import { hElement } from "./h";

export function createApp(RootComponent, props = {}) {
    let parentEl = null;
    let isMounted = false;
    let vdom = null;

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
            mountDOM(vdom, parentEl);

            isMounted = true;
        },
        unmount() {
            if (!isMounted) {
                throw new Error('The application is not mounted');
            }
            destroyDOM(vdom);
            reset();
        }
    }
}
