import { arraysDiffSequence, ARRAY_DIFF_OP } from '../src/utils/arrays';

function applyArraysDiffSequence(oldArray, diffSeq) {
    return diffSeq.reduce((array, { op, item, index, from }) => {
        switch (op) {
            case ARRAY_DIFF_OP.ADD:
                array.splice(index, 0, item);
                break;
            case ARRAY_DIFF_OP.REMOVE:
                array.splice(index, 1);
                break;
            case ARRAY_DIFF_OP.MOVE:
                array.splice(index, 0, array.splice(from, 1)[0]);
                break;
        }
        return array;
    }, [...oldArray]); // clone to avoid mutating input
}

describe('arraysDiffSequence', () => {
    const testCases = [
        {
            name: 'add item',
            oldArray: ['A', 'B'],
            newArray: ['A', 'B', 'C']
        },
        {
            name: 'remove item',
            oldArray: ['A', 'B', 'C'],
            newArray: ['A', 'C']
        },
        {
            name: 'move item',
            oldArray: ['A', 'B', 'C'],
            newArray: ['B', 'A', 'C']
        },
        {
            name: 'add and remove',
            oldArray: ['X', 'Y'],
            newArray: ['Y', 'Z']
        },
        {
            name: 'duplicate items',
            oldArray: ['A', 'A', 'B'],
            newArray: ['B', 'A', 'A']
        },
        {
            name: 'completely different',
            oldArray: ['X', 'Y', 'Z'],
            newArray: ['A', 'B', 'C']
        },
        {
            name: 'empty to filled',
            oldArray: [],
            newArray: ['A', 'B']
        },
        {
            name: 'filled to empty',
            oldArray: ['A', 'B'],
            newArray: []
        },
        {
            name: 'no changes',
            oldArray: ['A', 'B', 'C'],
            newArray: ['A', 'B', 'C']
        }
    ];

    testCases.forEach(({ name, oldArray, newArray }) => {
        test(name, () => {
            const sequence = arraysDiffSequence(oldArray, newArray);
            const result = applyArraysDiffSequence(oldArray, sequence);
            expect(result).toEqual(newArray);
        });
    });
});
