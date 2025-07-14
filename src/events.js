export function addEventListener(
        eventName, 
        handler, 
        el,
        hostComponent = null) {

        function boundHandler() {
            hostComponent 
                // If a host component exists, binds it to the event handler context.
                ? handler.apply(hostComponent, arguments)
                // Otherwise, calls the event handler.
                : handler(...arguments);
        }
        // Adds the bound event listener to the element.
        el.addEventListener(eventName, boundHandler);

        return handler;
}

export function addEventListeners(
    listeners = {},
    el,
    hostComponent = null
) {
    const addedListeners = {};

    Object.entries(listeners).forEach(([eventName, handler]) => {
        const listener = addEventListener(
                            eventName, 
                            handler, 
                            el,
                            hostComponent);
        addedListeners[eventName] = listener;
    })

    return addedListeners;
}

export function removeEventListeners(listeners = {}, el) {
    Object.entries(listeners).forEach(([eventName, handler]) => {
        el.removeEventListener(eventName, handler);
    })
} 

