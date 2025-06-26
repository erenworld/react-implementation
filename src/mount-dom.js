import { DOM_TYPES } from './h';
import { setAttributes } from './attributes';
import { addEventListeners } from './events';

export function mountDOM(vdom, parentElement) {
    switch (vdom.type) {
        case DOM_TYPES.TEXT: {
            createTextNode(vdom, parentElement);
            break;
        }
        case DOM_TYPES.ELEMENT: {
            createElementNode(vdom, parentElement);
            break;
        }
        case DOM_TYPES.FRAGMENT: {
            createFragmentNode(vdom, parentElement);
            break;
        }
        default: {
            throw new Error(`Can't mount DOM of type: ${vdom.type}`);
        }
    }
}

function createTextNode(vdom, parentElement) {
    const { value } = vdom;
    const textNode = document.createTextNode(value);

    vdom.el = textNode;
    parentElement.append(textNode);
}

function createFragmentNode(vdom, parentElement) {
    const { children } = vdom;
    vdom.el = parentElement;

    children.forEach((child) => mountDOM(child, parentElement));
}

// Object.getPrototypeOf(document.createElement('foobar')) // HTMLUnknownElement
function createElementNode(vdom, parentElement) {
    const { tag, props, children } = vdom;
    const elementNode = document.createElement(tag);

    addProps(element, props, vdom);
    vdom.el = elementNode;
    children.forEach((child) => mountDOM(child, elementNode));
    parentElement.append(elementNode);
}

function addProps(element, props, vdom) {
    const { on: events, ...attrs } = props;

    vdom.listeners = addEventListeners(events, el);
    setAttributes(el, attrs);
}
