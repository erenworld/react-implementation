export const DOM_TYPES = {
    TEXT: 'text',
    ELEMENT: 'element',
    FRAGMENT: 'fragment',
}

export function withoutNulls(arr) {
    return arr.filter((item) => item != null); // != for null and undefined !
}

function mapTextNodes(children) {
    return children.map((child) => typeof child === 'string' ? hString(child) : child);
}

export function h(tag, props = {}, children = []) {
    return {
        tag,
        props,
        children: mapTextNodes(withoutNulls(children)),
        type: DOM_TYPES.ELEMENT,
    }
}

// Text nodes are the nodes in the DOM that contain text. They have no tag name, no
// attributes, and no children—only text.
export function hString(str) {
    return {
        type: DOM_TYPES.TEXT,
        value: str
    }
}

// A fragment is a type of virtual node used to group multiple nodes that need to be
// attached to the DOM together but don’t have a parent node in the DOM
export function hFragment(vNodes) {
    return {
        type: DOM_TYPES.FRAGMENT,
        children: mapTextNodes(withoutNulls(vNodes))
    }
}
