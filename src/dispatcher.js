export class Dispatcher {
    #subs = new Map();
    #afterHandlers = [];

// Creates the array of subscriptions if it doesn’t exist for a given command name
    subscribe(commandName, handler) {
        if (!this.#subs.has(commandName)) {
            this.#subs.set(commandName, []);
        }
        const handlers = this.#subs.get(commandName);
        // Checks whether the handler is registered
        if (handlers.includes(handler)) {
            return () => {};
        }
        // register handler
        handlers.push(handler);
        return () => {
            // Returns a function to unregister the handler
            const idx = handlers.indexOf(handler);
            handlers.splice(idx, 1);
        }
    }

    afterEveryCommand(handler) {
        this.#afterHandlers.push(handler);

        return () => {
            const idx = this.#afterHandlers.indexOf(handler);
            this.#afterHandlers.splice(idx, 1);
        }
    }

    dispatch(commandName, payload) {
        if (this.#subs.has(commandName)) {
            this.#subs.get(commandName).forEach((handler) => handler(payload));
        } else {
            console.warn(`No handlers for command: ${commandName}`)
        }
        this.#afterHandlers.forEach((handler) => handler());
    }
}
