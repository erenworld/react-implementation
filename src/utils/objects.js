export function objectsDiff(oldObj, newObj) {
    const oldKeys = Object.keys(oldObj);
    const newKeys = Object.keys(newObj);

    // TODOS: Avoiding iterating the newKeys set twice. 
    // TODOS: I could have avoided that part by performing a single iteration in a
    // TODOS: for loop where I saved the added and updated keys.
    return {
        added: newKeys.filter((key) => !(key in oldObj)),
        removed: oldKeys.filter((key) => !(key in newObj)),
        updated: newKeys.filter(
            (key) => key in oldObj && oldKeys[key] !== newObj[key]
        )
    }
}
