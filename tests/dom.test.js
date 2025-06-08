import { h, hString, hFragment, withoutNulls, DOM_TYPES } from '../src/h';

test('withoutNulls removes null and undefined values', () => {
    const input = [1, null, 2, undefined, 3];
    const result = withoutNulls(input);
    expect(result).toEqual([1, 2, 3]);
});

test('hString returns a text node', () => {
    expect(hString('hi')).toEqual({ type: DOM_TYPES.TEXT, value: 'hi' });
});

test('h returns a DOM element with text children', () => {
    const node = h('p', {}, ['Hello']);
    expect(node).toEqual({
        tag: 'p',
        props: {},
        children: [{ type: DOM_TYPES.TEXT, value: 'Hello' }],
        type: DOM_TYPES.ELEMENT
    });
});

test('hFragment removes nulls and wraps elements in fragment', () => {
    const frag = hFragment([null, h('br'), 'text']);
    expect(frag.type).toBe(DOM_TYPES.FRAGMENT);
    expect(frag.children.length).toBe(2);
    expect(frag.children[1]).toEqual({ type: DOM_TYPES.TEXT, value: 'text' });
});

test('h creates a login form with input fields', () => {
    const loginForm = h('form', { class: 'login-form', action: 'login' }, [
        h('input', { type: 'text', name: 'user' }),
        h('input', { type: 'password', name: 'pass' }),
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

