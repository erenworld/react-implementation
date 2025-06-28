export function setAttributes(el, attrs) {
    const { class: className, style, ...otherAttrs } = attrs; // split

    if (className) {
        setClass(el, className);
    }
    if (style) {
        // el, 'fontSize', '14px'..
        // [['color', 'red'], ['fontSize', '14px']]
        Object.entries(style).forEach(([prop, value]) => { 
            setStyle(el, prop, value)
        })
    }
    for (const [name, value] of Object.entries(otherAttrs)) {
        setAttributes(el, name, value); // set the rest
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

function setStyle(el, key, value) {
    el.style[key] = value;
}

function removeStyle (el, key) {
    el.style[key] = null;
}

// TODOS: implement setAttribute
