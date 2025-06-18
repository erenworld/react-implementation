// import { expect, test } from 'vitest'
import { objectsDiff } from '../src/utils/objects'

test('same object, no change', () => {
    const oldObj = { name: 'eren' };
    const newObj = { name: 'eren' };
    const { added, removed, updated } = objectsDiff(oldObj, newObj);

    expect(added).toEqual([]);
    expect(removed).toEqual([]);
    expect(updated).toEqual([]);
})

test('add a key', () => {
    const oldObj = { name: 'eren' };
    const newObj = { name: 'eren', age: 18 };
    const { added, removed, updated } = objectsDiff(oldObj, newObj);

    expect(added).toEqual(["age"]);
    expect(removed).toEqual([]);
    expect(updated).toEqual([]);
})

test('remove a key', () => {
    const oldObj = { name: 'eren' };
    const newObj = { age: 18 };
    const { added, removed, updated } = objectsDiff(oldObj, newObj);

    expect(added).toEqual(["age"]);
    expect(removed).toEqual(["name"]);
    expect(updated).toEqual([]);
})


test('update a key', () => {
    const oldObj = { name: 'eren' };
    const newObj = { name: 'sana' };
    const { added, removed, updated } = objectsDiff(oldObj, newObj);

    expect(added).toEqual([]);
    expect(removed).toEqual([]);
    expect(updated).toEqual(["name"]);
})

