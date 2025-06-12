### How to create the real DOM nodes from the virtual DOM nodes and insert them into the browser’s document?
By using the Document API

### What is Mounting ? 
It's the process. Given a virtual DOM tree, you want your framework to create the real DOM tree from
it and attach it to the browser’s document

```js
mountDOM(virtualDOM, parentElement)
```

### Why we need an el or listeners property ?
When the mountDOM() function creates each DOM node for the virtual DOM, it needs to save a reference to the real DOM node in the virtual node under the el property (el for element).
Listeners property for the node includes event listeners.

