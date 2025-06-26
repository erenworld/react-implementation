import { DOM_TYPES } from "./h";

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

