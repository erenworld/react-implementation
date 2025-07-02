import { hElement, hString, hFragment, DOM_TYPES } from '../src/h';
import { withoutNulls } from '../src/utils/arrays';

test('withoutNulls removes null and undefined values', () => {
    const input = [1, null, 2, undefined, 3];
    const result = withoutNulls(input);
    expect(result).toEqual([1, 2, 3]);
});

test('hString returns a text node', () => {
    expect(hString('hi')).toEqual({ type: DOM_TYPES.TEXT, value: 'hi' });
});

test('h returns a DOM element with text children', () => {
    const node = hElement('p', {}, ['Hello']);
    expect(node).toEqual({
        tag: 'p',
        props: {},
        children: [{ type: DOM_TYPES.TEXT, value: 'Hello' }],
        type: DOM_TYPES.ELEMENT
    });
});

test('hFragment removes nulls and wraps elements in fragment', () => {
    const frag = hFragment([null, hString('br'), 'text']);
    expect(frag.type).toBe(DOM_TYPES.FRAGMENT);
    expect(frag.children.length).toBe(2);
    expect(frag.children[1]).toEqual({ type: DOM_TYPES.TEXT, value: 'text' });
});

test('h creates a login form with input fields', () => {
    const loginForm = hElement('form', { class: 'login-form', action: 'login' }, [
        hElement('input', { type: 'text', name: 'user' }),
        hElement('input', { type: 'password', name: 'pass' }),
    ]);

    expect(loginForm).toEqual({
        tag: 'form',
        props: { class: 'login-form', action: 'login' },
        children: [
            {
                tag: 'input',
                props: { type: 'text', name: 'user' },
                children: [],
                type: DOM_TYPES.ELEMENT
            },
            {
                tag: 'input',
                props: { type: 'password', name: 'pass' },
                children: [],
                type: DOM_TYPES.ELEMENT
            }
        ],
        type: DOM_TYPES.ELEMENT
    });
});

test('withoutNulls deeply filters nested null/undefined values in arrays', () => {
    const input = [1, null, [2, undefined, [3, null]], 4];
    const result = withoutNulls(input.flat(2));
    expect(result).toEqual([1, 2, 3, 4]);
});

test('hString handles empty string and trims', () => {
    expect(hString('')).toEqual({ type: DOM_TYPES.TEXT, value: '' });
    expect(hString('  spaced  ')).toEqual({ type: DOM_TYPES.TEXT, value: '  spaced  ' });
});

test('h supports deeply nested elements', () => {
    const node = hElement('div', { id: 'container' }, [
        hElement('section', {}, [
            hElement('h1', {}, ['Title']),
            hElement('p', {}, ['Paragraph']),
            hElement('ul', {}, [
                hElement('li', {}, ['Item 1']),
                hElement('li', {}, ['Item 2']),
            ])
        ])
    ]);

    expect(node.tag).toBe('div');
    expect(node.children[0].children[2].children.length).toBe(2); // ul > li x2
    expect(node.children[0].children[0].children[0].value).toBe('Title'); // h1 > text
});

test('hFragment deeply removes nulls and includes nested text nodes', () => {
    const frag = hFragment([
        null,
        hElement('span', {}, [null, 'valid']),
        undefined,
        hElement('div', {}, [hElement('br'), null]),
        'tail'
    ]);

    expect(frag.type).toBe(DOM_TYPES.FRAGMENT);
    expect(frag.children.length).toBe(3);
    expect(frag.children[0].tag).toBe('span');
    expect(frag.children[2]).toEqual({ type: DOM_TYPES.TEXT, value: 'tail' });
});

test('h supports dynamic attributes and conditional rendering', () => {
    const isLoggedIn = true;
    const user = 'Alice';

    const nav = hElement('nav', {}, [
        isLoggedIn
            ? hElement('span', {}, [`Welcome, ${user}`])
            : hElement('a', { href: '/login' }, ['Login']),
        hElement('ul', {}, [
            hElement('li', {}, ['Home']),
            hElement('li', {}, ['About']),
        ])
    ]);

    expect(nav.children[0].tag).toBe('span');
    expect(nav.children[1].children.length).toBe(2);
    expect(nav.children[0].children[0].value).toBe('Welcome, Alice');
});

test('h creates an element with mixed children', () => {
    const res = hElement('div', { id: 'main' }, [
        'hello',
        hElement('span', {}, ['world'])
    ]);

    expect(res).toEqual({
        type: DOM_TYPES.ELEMENT,
        tag: 'div',
        props: {id: 'main'},
        children: [
            { type: DOM_TYPES.TEXT, value: 'hello' },
            {
                type: DOM_TYPES.ELEMENT,
                tag: 'span',
                props: {},
                children: [{ type: DOM_TYPES.TEXT, value: 'world' }]
            }
        ]
    });
})
