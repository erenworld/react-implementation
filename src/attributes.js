export function setAttributes(el, attrs) {
    const { class: className, style, ...otherAttrs } = attrs; // split

    if (className) {
        setClass(el, className);
    }
    if (style) {
        Object.entries(style).forEach(([prop, value]) => {
            setStyle(el, prop, value)
        })
    }
    for (const [name, value] of Object.entries(otherAttrs)) {
        setAttributes(el, name, value); // set the rest
    }
}

// TODOS: implement setClass

// TODOS: implement setStyle

// TODOS: implement setAttribute
