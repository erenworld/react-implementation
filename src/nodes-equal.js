import { DOM_TYPES } from "./h";

export function areNodesEqual(nodeOne, nodeTwo) {
    if (nodeOne.type !== nodeTwo.type) {
        return false;
    }
    if (nodeOne === DOM_TYPES.ELEMENT) {
        const { tag: tagOne } = nodeOne;
        const { tag: tagTwo } = nodeTwo;

        return tagOne === tagTwo;
    }
    return true;
}
