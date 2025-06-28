export function setAttributes(element, attrs) {
    const { class: className, style, ...otherAttrs } = attrs; // split

    if (className) {
        setClass(element, className);
    }
    if (style && typeof style === 'object') {
        // element, 'fontSize', '14px'..
        // [['color', 'red'], ['fontSize', '14px']]
        Object.entries(style).forEach(([prop, value]) => { 
            setStyle(element, prop, value)
        })
    }
    for (const [name, value] of Object.entries(otherAttrs)) {
        setAttribute(element, name, value); // set the rest
    }
}

// The classList property returns an object—a DOMTokenList
function setClass(element, className) {
    element.className = '';

    if (typeof className === 'string') {
        element.className = className;
    }
    if (Array.isArray(className)) {
        element.classList.add(...className);
    }
}

function setStyle(element, name, value) {
    element.style[name] = value;
}

function removeStyle (element, name) {
    element.style[name] = null;
}

function setAttribute(element, name, value) {
    if (value == null) {
        removeAttribute(element);
    } else if (name.startsWith('data-')) {
        element.setAttribute(name, value);
    } else {
        element[name] = value;
    }
}

function removeAttribute(element, name) {
    element[name] = null;
    element.removeAttribute(name);
}
