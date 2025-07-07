# The reconciliation algorithm: Diffing virtual trees

1. Figuring out what changed and applying only those changes is efficient.
2. These two nodes were added.

> Text nodes are always equal.
> Fragment nodes are always equal.
> Element nodes are equal if they have the same tag.
> Nodes of different types are never equal.

## The three key functions of the reconciliation algorithm

- A function to find the differences between two objects, returning the keys that were added, the keys that were removed, and the keys whose associated values changed (used to compare the attributes and CSS style objects)
- A function to find the differences between two arrays, returning the items that were
added and the items that were removed (used to compare two CSS classes’ arrays)
- A function that, given two arrays, figures out a sequence of operations to apply to the first array and transform it into the second array (used to turn the array of a node’s children into its new shape)

The view is a function of the state: when the state changes, the virtual DOM representing the view also changes.

The reconciliation algorithm compares the *old virtual DOM* - the one used to render the current view with the 
new virtual DOM after the state changes. 
It's job is to **reconcile** the two virtual DOM trees—that is, figure out what
changed and apply those changes to the real DOM so that the view reflects the new state.

## How 

1. To compare two virtual DOM trees, start comparing the **two root nodes**, checking
whether they’re equal and whether their attributes or event listeners have changed

2. If you find that the node isn’t the same, you look no further. First, you destroy the subtree rooted at the old node and replace it with the new node and everything under it.

3. Then you compare the children of the two nodes, traversing the trees recursively in a
depth-first manner. When you compare two arrays of child nodes, you need to figure out whether a node was added, removed, or moved to a different position. In a sense, depth-first traversal is the natural order in which the DOM is modified.

> By traversing the tree in a depth-first manner, we ensure that the changes are applied to a complete branch of the tree before moving to the next branch. Traversing the tree this way is important in the case of fragments because the children of a fragment are added to the fragment’s parent, and if the number of children changes, that change could potentially alter the indices where the siblings of the fragment’s parent are inserted.

The application’s instance mount() method doesn’t need to use the renderApp()
function anymore; renderApp() is called only when the state changes. mount() calls
the view() function to get the virtual DOM and then calls the mountDOM() function to
mount the DOM.

## Diffing objects
When comparing two virtual nodes, you need to find the differences between the
attributes of the two nodes (the props object) to patch the DOM accordingly. 
Finding the difference between two objects. Which keys were added, removed, or changed?

- Take a key in the old object. If you don’t see it in the new object, you know that
the key was removed. Repeat with all keys.
- Take a key in the new object. If you don’t see it in the old object, you know that
the key was added. Repeat with all keys.
- Take a key in the new object. If you see it in the old object and the value associated with the key is different, you know that the value associated with the key changed.
