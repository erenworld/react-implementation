# react-implementation
Re-implementation of React

>The point of using a framework is to abstract away the manipulation of the DOM, so we want to avoid accessing the DOM. Any piece of information that’s relevant to the application should be part of the state.

Part 2
Having the entire application’s state confined
to a single object managed by the application isn’t the most practical approach.
Wouldn’t it be more efficient if each component could take charge of its own
piece of the state, focusing solely on the view it oversees?

> Stateful components

A stateful component can’t be a pure function anymore because the output of pure functions depends
exclusively on their arguments; hence, they can’t maintain state

A stateful component maintains its own state. Stateful components
can be instantiated, with each instance having a separate state and lifecycle. A
stateful component updates its view when its state changes.

The **useState()** hook, used to maintain state inside a functional component, has
side effects. In this context, a side effect occurs when a function modifies something
outside its scope. In this case, useState() is clearly storing the component’s state
somewhere; thus, the component function where it’s used can’t be a pure function.
A pure function is deterministic: given the same input, it always returns the same output and doesn’t have any side effects. But you clearly don’t get the same result every
time you call the component’s function because some state is maintained somewhere, and based on that state, the component returns a different virtual DOM.
When you use the useState() hook, React stores the state of that component inside
an array at application level. By keeping track of the position of the state of each component, React can update the state of the component when you call the setState()
method and get you the correct value when you ask for it.

