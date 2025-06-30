
export class Dispatcher {
    #subs = new Map();
    #afterHandlers = [];

    subscribe(commandName, handler) {
        if (!this.#subs.has(commandName)) {
            this.#subs.set(commandName, []);
        }
        const handlers = this.#subs.get(commandName);
        
        if (handlers.includes(handler)) {
            return () => {};
        }
        handlers.push(handler);

        return () => {
            const index = handlers.indexOf(handler);
            handlers.splice(index, 1);
        }
    }

    // Notification mechanism.
    afterEveryCommand(handler) {
        this.#afterHandlers.push(handler);

        return () => {
            const index = this.#afterHandlers.indexOf(handler);
            this.#afterHandlers.splice(index, 1);
        }
    }

    // Dispatches a command and calls all the registered handlers.
    dispatch(commandName, payload) {
        if (this.#subs.has(commandName)) {
            this.#subs.get(commandName).forEach((handler) => handler(payload));
        } else {
            console.warn(`No handlers for command: ${commandName}`);
        }
        this.#afterHandlers.forEach((handler) => handler());
    }
}

// Example
// dispatcher.subscribe("INCREMENT", (state, payload) => {
//     return { count: state.count + 1 };
// });
// dispatch("INCREMENT");
