export function withoutNulls(arr) {
    return arr.filter((item) => item != null); // != for null and undefined !
}

export function arraysDiff(oldArr, newArr) {
    return {
        added: newArr.filter(newItem => !oldArr.includes(newItem)),
        removed: oldArr.filter(oldItem => !newArr.includes(oldItem))
    }
}
