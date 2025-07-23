four main characteristics of the component
- The view of a component depends on its props and state. Every time one of
these changes, the view needs to be patched.
- Components can have other components as children as part of their view’s
virtual DOM.
- A component can pass data to its children, and the child components receive
this data as props.
- A component can communicate with its parent component by emitting events
to which the parent component can listen.

The public properties of a stateful component (simply called component from now on) are
- props—The data that the component receives from its parent component
- state—The data that the component maintains internally

Even though these properties are public, they shouldn’t be modified directly.

1. The mounted lifecycle hook is scheduled to run after the component is mounted
into the DOM.
2. The unmounted lifecycle hook is scheduled to run after the component is
removed from the DOM.
3. The scheduler, which is in charge or running jobs in the order in which they’re
scheduled, is based on the microtask queue.


### Slots
A slot is a placeholder inside a component that can be filled with external content. Slots can have default content, which is used when no external content is provided.

