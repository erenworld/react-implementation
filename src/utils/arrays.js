import { hString } from '../h'

export function withoutNulls(arr) {
    return arr.filter(item => item != null) // null & undefined
}

// strings into text virtual nodes
export function mapTextNodes(childrenArray) {
    return childrenArray.map((child) =>
        typeof child === 'string' ? hString(child) : child);
}

export function arraysDiff(oldArray, newArray) {
    // TODOS: More robust solution to maintain the order of classes in the classList.
    return {
        added: newArray.filter((newItem) => !oldArray.includes(newItem)),
        removed: oldArray.filter((oldItem) => !newArray.includes(oldItem))
    }
}

export const ARRAY_DIFF_OP = {
    ADD: 'add',
    REMOVE: 'remove',
    MOVE: 'move',
    NOOP: 'noop'
};

// Keep track of the old array’s original indices so that when you modify a copy 
// of the old array and you apply each operation, you can keep the original indices
class ArrayWithOriginalIndices {
    #array = [];
    #originalIndices = [];
    #equalsFn

    constructor(array, equalsFn) {
        this.#array = [...array];
        this.#originalIndices = array.map((_, i) => i);
        this.#equalsFn = equalsFn; // Save the function used to compare items
    }

    get length() {
        return this.#array.length;
    }
}
