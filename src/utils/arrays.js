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

    // Remove.
    isRemoval(index, newArray) {
        if (index >= this.length) { // Nothing to remove.
            return false;
        }
        const item = this.#array[index]; // Gets the item in the old array at the given index.
        const indexInNewArray = newArray.findIndex((newItem) =>
            this.#equalsFn(item, newItem)
        )

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

    // Noop.
    isNoop(index, newArray) {
        if (index >= this.length) {
            return false;
        }
        const item = this.#array[index];
        const newItem = newArray[index];

        return this.#equalsFn(item, newItem);
    }
    originalIndexAt(index) {
        return this.#originalIndices[index];
    }
    noopItem(index) {
        return {
            op: ARRAY_DIFF_OP.NOOP,
            originalIndex: this.originalIndexAt(index),
            index,
            item: this.#array[index]
        }
    }

    // Add.
    isAddition(item, fromIdx) {
        return this.findIndexFrom(item, fromIdx) == -1;
    }
    findIndexFrom(item, fromIdx) {
        for (let i = fromIdx; i < this.length; i++) {
            if (this.#equalsFn(item, this.#array[i])) {
                return i;
            }
        }
        return -1;
    }
    addItem(item, index) {
        const operation = {
            op: ARRAY_DIFF_OP.ADD,
            index,
            item
        }
        this.#array.splice(index, 0, item);
        this.#originalIndices.splice(index, 0, -1);

        return operation;
    }
    // Move.
    moveItem(item, toIndex) {
        const fromIndex = this.findIndexFrom(item, toIndex);

        const operation = {
            op: ARRAY_DIFF_OP.MOVE,
            originalIndex: this.#originalIndices[fromIndex],
            from: fromIndex,
            index: toIndex,
            item: this.#array[fromIndex]
        }

        const [_item] = this.#array.splice(fromIndex, 1);
        this.#array.splice(toIndex, 0, _item);

        const [originalIndex] =
            this.#originalIndices.splice(fromIndex, 1)
        this.#originalIndices.splice(toIndex, 0, originalIndex);

        return operation;
    }

    // Remove the outstanding items.
    removeRemaining(index) {
        const operations = [];

        while (this.length > index) {
            operations.push(this.removeItem(index));
        }

        return operations;
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
        if (array.isNoop(index, newArray)) {
            sequence.push(array.noopItem(index));
            continue;
        }
        
        const item = newArray[index];
        if (array.isAddition(item, index)) {
            sequence.push(array.addItem(item, index));
            continue;
        }
        sequence.push(array.moveItem(item, index));
    }
    sequence.push(...array.removeRemaining(newArray.length));

    return sequence;
}
