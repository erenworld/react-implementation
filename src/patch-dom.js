import { destroyDOM } from './destroy-dom';
import { mountDOM } from './mount-dom';
import { DOM_TYPES } from './h';
import { areNodesEqual } from './nodes-equal';

export function patchDOM(oldVdom, newVdom, parentEl) {
    if (!areNodesEqual(oldVdom, newVdom)) {
        const index = findIndexInParent(parentEl, oldVdom.el);
        destroyDOM(oldVdom);
        mountDOM(newVdom, parentEl, index);

        return newVdom;
    }

    newVdom.el = oldVdom.el;

    switch (newVdom.type) {
        case DOM_TYPES.TEXT: {
            patchText(oldVdom, newVdom);
            return newVdom;
        }
        case DOM_TYPES.ELEMENT: {
            patchElement(oldVdom, newVdom);
            break;
        }
    }

    return newVdom;
}

function patchText(oldVdom, newVdom) {
    const el = oldVdom.el;
    const { value: oldValue } = oldVdom;
    const { value: newValue } = newVdom;

    if (oldValue !== newValue) {
        el.nodeValue = newValue;
    }
}

function findIndexInParent(parentEl, el) {
    const index = Array.from(parentEl.childNodes).indexOf(el);
    if (index < 0) {
        return null;
    }
    
    return index;
}
