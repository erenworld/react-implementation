export function withoutNulls(arr) {
    return arr.filter((item) => item != null); // != for null and undefined !!!
}

export function arraysDiff(oldArr, newArr) {
    return {
        added: newArr.filter(newItem => !oldArr.includes(newItem)),
        removed: oldArr.filter(oldItem => !newArr.includes(oldItem))
    }
}

export const ARRAY_DIFF_OP = {
    ADD: 'add',
    REMOVE: 'remove',
    MOVE: 'move',
    NOOP: 'noop'
};

class ArrayWithOriginalIndices {
    #array = [];
    #originalIndices = [];
    #equalsFn;

    constructor(arr, equalsFn) {
        this.#array = [...arr];
        this.#originalIndices = arr.map((_, i) => i);
        this.#equalsFn = equalsFn; // save function used to compare items in the arr
    }
    get length() {
        return this.#array.length;
    }

    isRemoval(index, newArr) {
        if (index >= this.length) { // if index out of bounds, nothing to remove.
            return false;
        }
        const item = this.#array[index]; // oldarr 
        const indexInNewArray = newArr.findIndex((newItem) => // Tries to find the same item in the new array, returning its index
            this.#equalsFn(item, newItem)) 
        return indexInNewArray === -1; // if -1, its removed
    }
    removeItem(index) {
        const operation = {
            op: ARRAY_DIFF_OP.REMOVE,
            index,
            item: this.#array[index], // The current index of the item in the old array
        }
        this.#array.splice(index, 1);
        this.#originalIndices.splice(index, 1);
        return operation;
    }
    // noop: at the current index, both the old and new arrays have the same item.
    isNoop(index, newArr) {
        if (index >= this.length) {
            return false;
        }
        const item = this.#array[index];
        const newItem = newArr[index]; 
        return this.#equalsFn(item, newItem);
    }
    // original index of the item in the old array
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

    isAddition(item, fromIdx) {
        return this.findIndexFrom(item, fromIdx) === -1;
    }
    findIndexFrom(item, fromIndex) {
        for (let i = fromIndex; i < this.length; i++) {
            if (this.#equalsFn(item, this.#array[i])) {
                return i;
            }
        }
        return -1;
    }
    addItem(item, index) {
        const operation = {
            op: ARRAY_DIFF_OP.ADD,
            item,
            index,
        }
        this.#array.splice(index, 0, item); // Adds the new item to the old array at the given index
        this.#originalIndices.splice(index, 0, -1);
        return operation;
    }

    moveItem(item, toIndex) {
        const fromIndex = this.findIndexFrom(item, toIndex);

        const operation = {
            op: ARRAY_DIFF_OP.MOVE,
            originalIndex: this.originalIndexAt(fromIndex),
            from: fromIndex,
            index: toIndex,
            item: this.#array[fromIndex]
        }
        // Extracts the item from the old array
        const [_item] = this.#array.splice(fromIndex, 1);
        this.#array.splice(toIndex, 0, _item);

        const [originalIndex] = this.#originalIndices.splice(fromIndex, 1);
        this.#originalIndices.splice(toIndex, 0, originalIndex);
        return operation;
    }

    removeItemsAfter(index) {
        const operations = [];

        while (this.length > index) { // while the old array is longer than the index
            operations.push(this.removeItem(index)); // Adds the removal operation to the array
        }
        return operations;
    }
}

// two main steps: diffing (finding the differences between two virtual trees)
// patching (applying the differences to the real DOM)
export function arraysDiffSequence(
    oldArr,
    newArr,
    equalsFn = (a, b) => a === b
) {
    const sequence = [];
    const arr = new ArrayWithOriginalIndices(oldArr, equalsFn);

    for (let index = 0; index < newArr.length; index++) {
        if (arr.isRemoval(index, newArr)) {
            sequence.push(arr.removeItem(index));
            index--;
            continue;
        }
        if (arr.isNoop(index, newArr)) {
            sequence.push(arr.noopItem(index));
            continue;
        }

        const item = newArr[index];
        if (arr.isAddition(item, index)) {
            sequence.push(arr.addItem(item, index));
            continue;
        }
        // else 
        sequence.push(arr.moveItem(item, index));
    }
    sequence.push(...arr.removeItemsAfter(newArr.length));
    return sequence;
}
