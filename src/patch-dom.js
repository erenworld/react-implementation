import { destroyDOM } from './destroy-dom';
import { mountDOM } from './mount-dom';
import { DOM_TYPES, extractChildren } from './h';
import { areNodesEqual } from './nodes-equal';
import { objectsDiff } from './utils/objects';
import { arraysDiff, arraysDiffSequence, ARRAY_DIFF_OP } from './utils/arrays';
import { isNotBlankOrEmptyString } from './utils/string';
import {
    setAttribute,
    removeAttribute,
    removeStyle,
    setStyle
} from './attributes';
import { addEventListener } from './events';
import { extractPropsAndEvents } from './utils/props';


export function patchDOM(
    oldVdom,
    newVdom,
    parentEl,
    hostComponent = null
) {
    if (!areNodesEqual(oldVdom, newVdom)) {
        const index = findIndexInParent(parentEl, oldVdom.el);
        destroyDOM(oldVdom);
        mountDOM(newVdom, parentEl, index, hostComponent);

        return newVdom;
    }

    newVdom.el = oldVdom.el;

    switch (newVdom.type) {
        case DOM_TYPES.TEXT: {
            patchText(oldVdom, newVdom);
            return newVdom;
        }
        case DOM_TYPES.ELEMENT: {
            patchElement(oldVdom, newVdom, hostComponent);
            break;
        }
        case DOM_TYPES.COMPONENT: {
            patchComponent(oldVdom, newVdom);
            break;
        }
    }
    patchChildren(oldVdom, newVdom, hostComponent);

    return newVdom;
}

function patchComponent(oldVdom, newVdom) { 
    const { component } = oldVdom;  // Extracts the component instance from the old virtual node
    const { children } = newVdom;
    const { props } = extractPropsAndEvents(newVdom);

    component.setExternalContent(children);
    component.updateProps(props);

    newVdom.component = component; // Save component instance in the new virtual node
    newVdom.el = component.firstElement; // Save the component instance in the new virtual node
}

function patchText(oldVdom, newVdom) {
    const el = oldVdom.el;
    const { value: oldValue } = oldVdom;
    const { value: newValue } = newVdom;

    if (oldValue !== newValue) {
        el.nodeValue = newValue;
    }
}

function patchElement(oldVdom, newVdom, hostComponent) {
    const el = oldVdom.el;
    const {
        class: oldClass,
        style: oldStyle,
        on: oldEvents,
        ...oldAttrs
    } = oldVdom.props;
    const {
        class: newClass,
        style: newStyle,
        on: newEvents,
        ...newAttrs
    } = newVdom.props;
    const { listeners: oldListeners } = oldVdom;

    patchAttrs(el, oldAttrs, newAttrs);
    patchClasses(el, oldClass, newClass);
    patchStyles(el, oldStyle, newStyle);
    newVdom.listeners = patchEvents(
                el, 
                oldListeners, 
                oldEvents, 
                newEvents,
                hostComponent);
}

function patchAttrs(el, oldAttrs, newAttrs) {
    const { added, removed, updated } = objectsDiff(oldAttrs, newAttrs);

    for (const attr of removed) {
        removeAttribute(el, attr);
    }
    for (const attr of added.concat(updated)) {
        setAttribute(el, attr, newAttrs[attr]);
    }
}

function patchClasses(el, oldClass, newClass) {
    const oldClasses = toClassList(oldClass);
    const newClasses = toClassList(newClass);

    const { added, removed } = arraysDiff(oldClasses, newClasses);
    
    if (removed.length > 0) {
        el.classList.remove(...removed);
    }
    if (added.length > 0) {
        el.classList.add(...added);
    }
}

function patchStyles(el, oldStyle = {}, newStyle = {}) {
    const { added, removed, updated } = objectsDiff(oldStyle, newStyle);

    for (const style of removed) {
        removeStyle(el, style);
    }
    for (const style of added.concat(updated)) {
        setStyle(el, style, newStyle[style]);
    }
}

function patchEvents(
    el,
    oldListeners = {},
    oldEvents = {},
    newEvents = {},
    hostComponent
) {
    const { removed, added, updated } = objectsDiff(oldEvents, newEvents);

    for (const eventName of removed.concat(updated)) {
        el.removeEventListener(eventName, oldListeners[eventName]);
    }

    const addedListeners = {};
    for (const eventName of added.concat(updated)) {
        const listener = addEventListener(
            eventName, 
            newEvents[eventName], 
            el,
            hostComponent)
        addedListeners[eventName] = listener;
    }
    return addedListeners;
}

function patchChildren(oldVdom, newVdom, hostComponent) {
    // Extracts the old children array or uses an empty array
    const oldChildren = extractChildren(oldVdom); 
    const newChildren = extractChildren(newVdom);
    const parentEl = oldVdom.el;

    // Finds the operation to transform the old array into new one
    const diffSeq = arraysDiffSequence(
        oldChildren,
        newChildren,
        areNodesEqual
    )

    for (const operation of diffSeq) {
        const { originalIndex, index, item } = operation;
        const offset = hostComponent?.offset ?? 0;

        switch (operation.op) {
            case ARRAY_DIFF_OP.ADD: {
                mountDOM(item, parentEl, index + offset, hostComponent);
                break;
            }
            case ARRAY_DIFF_OP.REMOVE: {
                destroyDOM(item);
                break;
            }
            case ARRAY_DIFF_OP.MOVE: {
                const oldChild = oldChildren[originalIndex];
                const newChild = newChildren[index];
                const el = oldChild.el;
                const elAtTargetIndex = parentEl.childNodes[index + offset];

                parentEl.insertBefore(el, elAtTargetIndex);
                patchDOM(
                    oldChild, 
                    newChild, 
                    parentEl,
                    hostComponent
                );

                break;
            }
            case ARRAY_DIFF_OP.NOOP: {
                patchDOM(
                    oldChildren[originalIndex], 
                    newChildren[index], 
                    parentEl,
                    hostComponent
                );
                break;
            }
        }
    }
}

function toClassList(classes = '') {
    return Array.isArray(classes)
        ? classes.filter(isNotBlankOrEmptyString) // Filters blank and empty strings
        : classes.split(/(\s+)/)
            .filter(isNotBlankOrEmptyString) // Splits the string on whitespace and filters blank and empty strings
}

function findIndexInParent(parentEl, el) {
    const index = Array.from(parentEl.childNodes).indexOf(el);
    if (index < 0) {
        return null;
    }
    
    return index;
}
