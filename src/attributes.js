export function setAttributes(el, attrs) {
    const { class: className, style, ...otherAttrs } = attrs; // split

    if (className) {
        setClass(el, className);
    }
    if (style && typeof style === 'object') {
        // el, 'fontSize', '14px'..
        // [['color', 'red'], ['fontSize', '14px']]
        Object.entries(style).forEach(([prop, value]) => { 
            setStyle(el, prop, value)
        })
    }
    for (const [name, value] of Object.entries(otherAttrs)) {
        setAttribute(el, name, value); // set the rest
    }
}

// The classList property returns an object—a DOMTokenList
function setClass(el, className) {
    el.className = '';

    if (typeof className === 'string') {
        el.className = className;
    }
    if (Array.isArray(className)) {
        el.classList.add(...className);
    }
}

function setStyle(el, name, value) {
    el.style[name] = value;
}

function removeStyle (el, name) {
    el.style[name] = null;
}

function setAttribute(el, name, value) {
    if (value == null) {
        removeAttribute(el);
    } else if (name.startsWith('data-')) {
        el.setAttribute(name, value);
    } else {
        el[name] = value;
    }
}

function removeAttribute(el, name) {
    el[name] = null;
    el.removeAttribute(name);
}
