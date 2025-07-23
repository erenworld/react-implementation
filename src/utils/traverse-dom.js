
// Explore a node’s children before exploring its siblings. Algorithm 101 :)

export function traverseDFS(
    vdom, 
    processNodeFn,
    shouldSkipBranch = () => false,
    parentNode = null,
    index = null,
) {
    if (shouldSkipBranch(vdom)) return;

    processNodeFn(vdom, parentNode, index);

    if (vdom.children) {
        vdom.children.forEach((child, i) =>
            traverseDFS(child, processNodeFn, shouldSkipBranch, vdom, i)
        )
    }
}

// Skip the traversal of a branch of the virtual node tree when a component is encountered.
