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
    // TODOS: Add more robust solution is to maintain the order of classes in the classList.
    return {
        added: newArray.filter((newItem) => !oldArray.includes(newItem)),
        removed: oldArray.filter((oldItem) => !newArray.includes(oldItem))
    }
}

