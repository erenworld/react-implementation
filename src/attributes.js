export function setAttributes(el, attrs) {
    const { class: className, style, ...otherAttrs } = attrs;

    if (className) {
        setClass(el, className);
    }
    if (style) {
        Object.entries(style).forEach(([prop, value]) => {
            setStyle(el, prop, value);
        });
    }
    for (const [name, value] of Object.entries(otherAttrs)) {
        setAttribute(el, name, value);
    }
}

// The classList property returns an object—a DOMTokenList
// A DOMTokenList object has an add() method that takes multiple class names and adds them to the element
function setClass(el, className) {
    el.className = '';

    if (typeof className === 'string') {
        el.className = className;
    }
    if (Array.isArray(className)) {
        el.classList.add(...className);
    }
}

// The style property of an HTMLElement instance is a CSSStyleDeclaration object
export function setStyle(el, key, value) {
    el.style[key] = value;
}

export function removeStyle(el, key) {
    el.style[key] = null;
}

export function setAttribute(el, key, value) {
    if (value == null) {
        removeAttribute(el, key);
    } else if (key.startsWith('data-')) {
        el.setAttribute(key, value);
    } else {
        el[name] = value;
    }
}

export function removeAttribute(el, key) {
    el[key] = null;
    el.removeAttribute(key);
}
