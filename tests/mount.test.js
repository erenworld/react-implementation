import { DOM_TYPES } from '../src/h';
import { mountDOM } from '../src/mount-dom';
import {
    setAttributes,
    setClass,
    setStyle,
    removeStyle,
    setAttribute,
    removeAttribute,
  } from '../src/attributes';
  
test('mountDOM mounts a text node with special characters', () => {
    const vdom = {
      type: DOM_TYPES.TEXT,
      value: 'Hello <b>World</b>'
    };
    const parent = document.createElement('div');
  
    mountDOM(vdom, parent);
    expect(parent.textContent).toBe('Hello <b>World</b>');
    expect(vdom.el.nodeType).toBe(Node.TEXT_NODE);
});
  
test('mountDOM mounts an empty text node and attaches to parent', () => {
    const vdom = {
        type: DOM_TYPES.TEXT,
        value: ''
    };
    const parent = document.createElement('section');

    mountDOM(vdom, parent);
    expect(parent.childNodes.length).toBe(1);
    expect(vdom.el.nodeType).toBe(Node.TEXT_NODE);
    expect(vdom.el.nodeValue).toBe('');
});

test('mountDOM mounts a fragment with mixed children', () => {
    const vdom = {
        type: DOM_TYPES.FRAGMENT,
        children: [
            { type: DOM_TYPES.TEXT, value: 'Welcome' },
            { 
                type: DOM_TYPES.ELEMENT,
                tag: 'strong',
                props: {},
                children: [{ type: DOM_TYPES.TEXT, value: 'React' }]
            }
        ]
    };
    const parent = document.createElement('div');

    mountDOM(vdom, parent);
    expect(parent.childNodes.length).toBe(2);
    expect(parent.textContent).toBe('WelcomeReact');
    expect(vdom.el).toBe(parent);
});

test('mountDOM sets attributes correctly on real DOM element', () => {
    const vdom = {
      type: DOM_TYPES.ELEMENT,
      tag: 'div',
      props: {
        id: 'myDiv',
        class: 'container',
        style: { color: 'red' },
        'data-role': 'main'
      },
      children: []
    };
  
    const parent = document.createElement('section');
    mountDOM(vdom, parent);
  
    const el = parent.querySelector('#myDiv');
    expect(el).not.toBeNull();
    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el.className).toBe('container');
    expect(el.style.color).toBe('red');
    expect(el.getAttribute('data-role')).toBe('main');
});
  
test('mountDOM mounts an element with attributes, event listener and children', () => {
    const onClick = jest.fn();
  
    const vdom = {
      type: DOM_TYPES.ELEMENT,
      tag: 'button',
      props: {
        id: 'myBtn',
        on: { click: onClick }
      },
      children: [{ type: DOM_TYPES.TEXT, value: 'Click me' }]
    };
  
    const parent = document.createElement('div');
    mountDOM(vdom, parent);
  
    const button = parent.querySelector('button');
    expect(button.id).toBe('myBtn');
    button.click();
    expect(onClick).toHaveBeenCalled();
    expect(button.textContent).toBe('Click me');
});
  
test('setClass handles string, array, and overwrites previous classes', () => {
    const el = document.createElement('div');
  
    setClass(el, 'btn primary');
    expect(el.className).toBe('btn primary');
  
    setClass(el, ['alert', 'warning']);
    expect(el.classList.contains('btn')).toBe(false);
    expect(el.classList.contains('alert')).toBe(true);
    expect(el.classList.contains('warning')).toBe(true);
  
    setClass(el, null);
    expect(el.className).toBe('');
    setClass(el, 'card');
    expect(el.className).toBe('card');
});

describe('setClass', () => {
    test('sets class from string and array', () => {
      const el = document.createElement('div');
  
      setClass(el, 'btn primary');
      expect(el.className).toBe('btn primary');
  
      setClass(el, ['alert', 'warning']);
      expect(el.classList.contains('alert')).toBe(true);
      expect(el.classList.contains('warning')).toBe(true);
      expect(el.classList.contains('btn')).toBe(false);
    });
  
    test('clears classes if passed null or undefined', () => {
      const el = document.createElement('div');
      setClass(el, 'hello');
      setClass(el, null);
      expect(el.className).toBe('');
    });
});
  
describe('setStyle', () => {
    test('sets CSS style property', () => {
      const el = document.createElement('div');
      setStyle(el, 'color', 'red');
      expect(el.style.color).toBe('red');
    });
});
  
describe('removeStyle', () => {
    test('removes CSS style property by setting to empty string', () => {
      const el = document.createElement('div');
      el.style.color = 'blue';
      removeStyle(el, 'color');
      expect(el.style.color).toBe('');
    });
});
  
describe('setAttribute', () => {
    test('sets data-* attributes with setAttribute', () => {
      const el = document.createElement('div');
      setAttribute(el, 'data-test', '123');
      expect(el.getAttribute('data-test')).toBe('123');
    });
  
    test('sets normal properties directly on element', () => {
      const el = document.createElement('input');
      setAttribute(el, 'value', 'hello');
      expect(el.value).toBe('hello');
    });
  
    test('removes attribute if value is null or undefined', () => {
      const el = document.createElement('input');
      el.value = 'text';
      el.setAttribute('placeholder', 'Enter text');
      setAttribute(el, 'placeholder', null);
      expect(el.getAttribute('placeholder')).toBe(null);
      expect(el.placeholder).toBe('');
    });
});
  
describe('removeAttribute', () => {
    test('removes attribute and sets property to null/empty', () => {
      const el = document.createElement('input');
      el.setAttribute('placeholder', 'Enter');
      el.placeholder = 'Enter';
      removeAttribute(el, 'placeholder');
      expect(el.getAttribute('placeholder')).toBe(null);
      expect(el.placeholder).toBe('');
    });
});
  
describe('setAttributes', () => {
    test('sets class, style and other attributes', () => {
      const el = document.createElement('div');
      setAttributes(el, {
        class: 'my-class',
        style: { color: 'green', backgroundColor: 'yellow' },
        id: 'myId',
        'data-custom': 'abc'
      });
  
      expect(el.className).toBe('my-class');
      expect(el.style.color).toBe('green');
      expect(el.style.backgroundColor).toBe('yellow');
      expect(el.id).toBe('myId');
      expect(el.getAttribute('data-custom')).toBe('abc');
    });
});
  