import { destroyDOM } from '../src/destroy-dom';
import { DOM_TYPES } from '../src/h';
import { removeEventListeners } from '../src/events';

jest.mock('../src/events', () => ({
  removeEventListeners: jest.fn(),
}));

describe('destroyDOM', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should remove a text node from the DOM', () => {
    const textNode = document.createTextNode('text');
    document.body.appendChild(textNode);

    const vdom = {
      type: DOM_TYPES.TEXT,
      el: textNode,
    };

    expect(document.body.contains(textNode)).toBe(true);

    destroyDOM(vdom);

    expect(document.body.contains(textNode)).toBe(false);
    expect(vdom.el).toBeUndefined();
  });

  test('should remove an element node with children and listeners', () => {
    const childTextNode = document.createTextNode('child');
    const childVdom = {
      type: DOM_TYPES.TEXT,
      el: childTextNode,
    };
    const parentEl = document.createElement('div');
    parentEl.appendChild(childTextNode);
    document.body.appendChild(parentEl);

    const listeners = {
      click: () => {},
    };

    const vdom = {
      type: DOM_TYPES.ELEMENT,
      el: parentEl,
      children: [childVdom],
      listeners,
    };

    expect(document.body.contains(parentEl)).toBe(true);
    expect(document.body.contains(childTextNode)).toBe(true);

    destroyDOM(vdom);

    expect(document.body.contains(parentEl)).toBe(false);
    expect(document.body.contains(childTextNode)).toBe(false);

    expect(removeEventListeners).toHaveBeenCalledWith(listeners, parentEl);
    expect(vdom.listeners).toBeUndefined();
    expect(vdom.el).toBeUndefined();
  });

  test('should recursively remove fragment children', () => {
    const textNode1 = document.createTextNode('text1');
    const textNode2 = document.createTextNode('text2');
    document.body.appendChild(textNode1);
    document.body.appendChild(textNode2);

    const vdom1 = { type: DOM_TYPES.TEXT, el: textNode1 };
    const vdom2 = { type: DOM_TYPES.TEXT, el: textNode2 };

    const fragmentVdom = {
      type: DOM_TYPES.FRAGMENT,
      children: [vdom1, vdom2],
      el: document.body, // fragment reuses parent node
    };

    expect(document.body.contains(textNode1)).toBe(true);
    expect(document.body.contains(textNode2)).toBe(true);

    destroyDOM(fragmentVdom);

    expect(document.body.contains(textNode1)).toBe(false);
    expect(document.body.contains(textNode2)).toBe(false);

    expect(fragmentVdom.el).toBeUndefined();
  });

  test('should throw error for unknown DOM type', () => {
    const vdom = { type: 'UNKNOWN' };

    expect(() => destroyDOM(vdom)).toThrow("Can't destroy DOM of type: UNKNOWN");
  });
});
