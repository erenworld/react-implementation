import { withoutNulls, mapTextNodes } from './utils/arrays';

export const DOM_TYPES = {
    TEXT: 'text',
    ELEMENT: 'element',
    FRAGMENT: 'fragment',
    COMPONENT: 'component',
    SLOT: 'slot'
}

export function hString(str) {
    return {
        type: DOM_TYPES.TEXT,
        value: str
    }
}

export function hElement(tag, props = {}, children = []) {
    const type =
        typeof tag === 'string' ? DOM_TYPES.ELEMENT : DOM_TYPES.COMPONENT;
    
    return {
        tag,
        props,
        type,
        children: mapTextNodes(withoutNulls(children))
    }
}

export function hFragment(vNodes) {
    return {
        type: DOM_TYPES.FRAGMENT,
        children: mapTextNodes(withoutNulls(vNodes))
    }
}

export function hSlot(children = []) {
    return { type: DOM_TYPES.SLOT, children };
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


