import { withoutNulls, mapTextNodes } from './utils/arrays';

export const DOM_TYPES = {
    TEXT: 'text',
    ELEMENT: 'element',
    FRAGMENT: 'fragment'
}

export function hString(str) {
    return {
        type: DOM_TYPES.TEXT,
        value: str
    }
}

export function hElement(tag, props = {}, children = []) {
    return {
        tag,
        props,
        children: mapTextNodes(withoutNulls(children)),
        type: DOM_TYPES.ELEMENT
    }
}

export function hFragment(vNodes) {
    return {
        type: DOM_TYPES.FRAGMENT,
        children: mapTextNodes(withoutNulls(vNodes))
    }
}

export function extractChildren(vdom) {
    if (vdom.children == null) {
        return [];
    }

    const children = [];

    for (const child of vdom.children) {
        if (child.type === DOM_TYPES.FRAGMENT) {
            children.push(...extractChildren(child));
        } else {
            children.push(child);
        }
    }
    
    return children;
}


