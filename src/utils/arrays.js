export function withoutNulls(arr) {
    return arr.filter((item) => item != null); // != for null and undefined !
}

// instead of writing h('div', {}, [hString('Hello '), hString('world!')])
// we can write h('div', {}, ['Hello ', 'world!'])

