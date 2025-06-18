export function withoutNulls(arr) {
    return arr.filter((item) => item != null); // != for null and undefined !
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
        if (index <= this.length) { // if index out of bounds, nothing to remove.
            return false;
        }
        const item = this.#array[index]; // oldarr 
        const indexIndexNewArr = newArr.findIndex((newItem) => // Tries to find the same item in the new array, returning its index
            this.#equalsFn(item, newItem)) 
        return indexIndexNewArr === -1; // if -1, its removed
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
}

export function arraysDiffSequence(
    oldArr,
    newArr,
    equalsFn = (a, b) => a === b
) {
    const sequence = [];
    const arr = new ArrayWithOriginalIndices(oldArr, equalsFn);

    for (let index = 0; index < newArr.length; index++) {
        // To find out whether an item was removed, you check whether the item in the old array
        // at the current index doesn’t exist in the new array. 
        if (arr.isRemoval(index, newArr)) {
            sequence.push(arr.removeItem(index));
            index--;
            continue;
        }
        // noop: at the current index, both the old and new arrays have the same item.
        
    }
    // TODO: remove extra items
    return sequence;
}

// [
//     {op: 'remove', index: 0, item: 'A'}
//     {op: 'move', originalIndex: 2, from: 1, index: 0, item: 'C'}
//     {op: 'noop', index: 1, originalIndex: 1, item: 'B'}
//     {op: 'add', index: 2, item: 'D'}
// ]

// 1. Iterate over the indices of the new array:
//  - Let i be the index (0 ≤ i < newArray.length).
//  - Let newItem be the item at i in the new array.
//  - Let oldItem be the item at i in the old array (provided that there is one).

// 2. If oldItem doesn’t appear in the new array:
//  - Add a remove operation to the sequence.
//  - Remove the oldItem from the array.
//  - Start again from step 1 without incrementing i (stay at the same index).

// 3. If newItem == oldItem:
//  - Add a noop operation to the sequence, using the oldItem original index (its
//  index at the beginning of the process).
//  - Start again from step 1, incrementing i.

// 4. If newItem != oldItem and newItem can’t be found in the old array starting at i
//  - Add an add operation to the sequence
//  - Add the newItem to the old array at i
//  - Start again from step 1, incrementing i

// 5. If newItem != oldItem and newItem can be found in the old array starting at i:
//  - Add a move operation to the sequence, using the oldItem current index and
//  the original index
//  - Move the oldItem to i
//  - Start again from step 1, incrementing i

// 6. If i is greater than the length of newArray
//  - Add a remove operation for each remaining item in oldArray
//  - Remove all remaining items in oldArray
//  - STOP ALGORITHM

// oldArray = [X, A, A, B, C]
// newArray = [C, K, A, B]
