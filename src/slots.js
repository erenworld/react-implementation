import { traverseDFS } from "./utils/traverse-dom";
import { DOM_TYPES, hFragment } from "./h";

// Replaces the slot nodes with the external content (or their default content). 
// You want to traverse the virtual DOM tree and if the encountered node is a slot, 
// replace it with the external or default content.
export function fillSlots(vdom, externalContent = []) {
    function processNodeFn(node, parent, index) {
        insertViewInSlot(node, parent, index, externalContent);
    }

    traverseDFS(vdom, processNodeFn, shouldSkipBranch);
}

function insertViewInSlot(node, parent, index, externalContent) {
    if (node.type !== DOM_TYPES.SLOT) return;

    const defaultValue = node.children;
    const views = externalContent.length > 0 ? externalContent : defaultValue;

    const hasContent = views.length > 0;
    if (hasContent) {
        parent.children.splice(index, 1, hFragment(views));
    } else {
        parent.children.splice(index, 1);
    }
}

function shouldSkipBranch(node) {
    return node.type === DOM_TYPES.COMPONENT;
}

// processNode
// node: the node being processed.
// parent: the parent node of the node being processed.
// index: the index of the node being processed in the parent’s children array.
