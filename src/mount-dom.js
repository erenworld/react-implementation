import { DOM_TYPES } from './h';
import { setAttributes } from './attributes';
import { addEventListeners } from './events';

export function mountDOM(vdom, parentElement, index) {
    switch (vdom.type) {
        case DOM_TYPES.TEXT: {
            createTextNode(vdom, parentElement, index);
            break;
        }
        case DOM_TYPES.ELEMENT: {
            createElementNode(vdom, parentElement, index);
            break;
        }
        case DOM_TYPES.FRAGMENT: {
            createFragmentNode(vdom, parentElement, index);
            break;
        }
        default: {
            throw new Error(`Can't mount DOM of type: ${vdom.type}`);
        }
    }
}

function createTextNode(vdom, parentElement, index) {
    const { value } = vdom;
    const textNode = document.createTextNode(value);

    vdom.el = textNode;
    
    insert(textNode, parentElement, index);
}

// Object.getPrototypeOf(document.createElement('foobar')) // HTMLUnknownElement
function createElementNode(vdom, parentElement, index) {
    const { tag, props, children } = vdom;
    const elementNode = document.createElement(tag);

    addProps(elementNode, props, vdom);
    vdom.el = elementNode;
    children.forEach((child) => mountDOM(child, elementNode));

    insert(elementNode, parentElement, index);
}

function createFragmentNode(vdom, parentElement, index) {
    const { children } = vdom;
    vdom.el = parentElement;

    children.forEach((child, i) =>
        mountDOM(child, parentElement, index ? index + i : null)
    );
}

function addProps(element, props, vdom) {
    const { on: events, ...attrs } = props;

    vdom.listeners = addEventListeners(events, element);
    setAttributes(element, attrs);
}

// insert a node at a given index inside a parent node
function insert(el, parentEl, index) {
    // If index is null or undefined, simply append.
    if (index == null) {
        parentEl.append(el);
        return;
    }
    if (index < 0) {
        throw new Error(`Index must be positive integer`);
    }

    const children = parentEl.childNodes;

    if (index >= children.length) {
        parentEl.append(el);
    } else {
        parentEl.insertBefore(el, children[index]);
    }
}
