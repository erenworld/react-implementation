
export function isNotEmptyString(string) {
    return string !== '';
}

export function isNotBlankOrEmptyString(string) {
    return isNotEmptyString(string.trim());
}
