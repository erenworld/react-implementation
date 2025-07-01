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

    isRemoval(index, newArray) {
        if (index >= this.length) { // Nothing to remove.
            return false;
        }
        const item = this.#array[index]; // Gets the item in the old array at the given index.
        const indexInNewArray = newArray.findIndex((newItem) => {
            this.#equalsFn(item, newItem)
        })

        return indexInNewArray === -1; // Removed.
    }
    removeItem(index) {
        const operation = {
            op: ARRAY_DIFF_OP.REMOVE,
            index,
            item: this.#array[index] // Current index in old array.
        }
        this.#array.splice(index, 1);
        this.#originalIndices.splice(index, 1);

        return operation;
    }
}

export function arraysDiffSequence(
    oldArray,
    newArray,
    equalsFn = (a, b) => a === b
) {
    const sequence = [];
    const array = new ArrayWithOriginalIndices(oldArray, equalsFn);

    for (let index = 0; index < newArray.length; index++) { // new array
        if (array.isRemoval(index, newArray)) {
            sequence.push(array.removeItem(index));
            index--;
            continue;
        }
        
        // TODO: noop case

        // TODO: addition case

        // TODO: move case
    }
    // TODO: remove extra items

    return sequence;
}
