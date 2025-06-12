# The virtual DOM
The word virtual describes something that isn’t real but mimics something that is. A
virtual machine (VM), for example, is software written to mimic the behavior of a real
machine—hardware. A VM gives you the impression that you’re running a real
machine, but it’s software running on top of your computer’s hardware.

# The DOM
The **DOM** is an in-memory tree structure managed *by the browser engine*, representing the HTML structure of the we page. By contrast, the **virtual DOM** is a *JavaScript-based in-memory tree of virtual nodes* that mirrors the structure of the actual DOM. Each node in this virtual tree is called a virtual node, and the entire construct is the virtual DOM

# Why Virtual DOM
The nodes in the actual DOM are heavy objects that have hundreds of properties, whereas the virtual nodes are lightweight objects that contain only the information needed to render the view.

## Types of Nodes
Each node in the virtual DOM is an object with a type property that identifies what kind of node it is
- **element**: Represents a regular HTML element, such as form, input, or button
- **text**: a text node, such as the 'Log in' text of the button element in the example
- **fragment**: which groups other nodes together but has no semantic meaning of its own

### Element virtual nodes have three properties
- tag: The tag name of the HTML element.
- props: The attributes of the HTML element, including the event handlers inside an on property.
- children: The ordered children of the HTML element. If the children array is absent from the node, the element is a leaf node

### Component
A component is a pure function—a function with no side effects—that takes the state of the application as input and returns a virtual DOM tree representing a chunk of the view of the application.

## Different types of virtual nodes require different DOM nodes to be created
- A virtual node of type text requires a Text node to be created (via the document
*.createTextNode()* method).
- A virtual node of type element requires an Element node to be created (via the
*document.createElement()* method).
