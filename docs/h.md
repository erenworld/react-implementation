## h(), hyperscript(), or createElement()
React uses the React.createElement() function to create virtual nodes. The name
is a long one, but typically, you never call that function directly; you use JSX instead.
Each HTML element you write in JSX is transpiled to a React.createElement() call.

```js
function messageComponent({ level, message }) {
    return h('div', { class: `message message--${level}` }, [
        h('p', {}, [message]),
    ])
}
```

