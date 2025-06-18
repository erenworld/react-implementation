// 1. Take a key in the old object. If you don’t see it in the new object, you know that
// the key was removed. Repeat with all keys
// 2. Take a key in the new object. If you don’t see it in the old object, you know that
// the key was added. Repeat with all keys.
// 3. Take a key in the new object. If you see it in the old object and the value associated 
// with the key is different, you know that the value associated with the key changed

// I’m iterating the newKeys set twice. I could have avoided that part by performing a single iteration in a
// for loop where I saved the added and updated keys.
export function objectsDiff(oldObj, newObj) {
    const oldKeys = Object.keys(oldObj);
    const newKeys = Object.keys(newObj);

    return {
        added: newKeys.filter(key => !(key in oldObj)),
        removed: oldKeys.filter(key => !(key in newObj)),
        updated: newKeys.filter(key => key in oldObj && oldObj[key] !== newObj[key])
    }
}

