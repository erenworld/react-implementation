
import { DOM_TYPES } from "./h";

export function areNodesEqual(nodeOne, nodeTwo) {
    if (nodeOne.type !== nodeTwo.type) {
        return false;
    }
    if (nodeOne.type === DOM_TYPES.ELEMENT) {
        const { tag: tagOne } = nodeOne;
        const { tag: tagTwo } = nodeTwo;

        return tagOne === tagTwo;
    }
    if (nodeOne.type === DOM_TYPES.COMPONENT) {
        const { tag: componentOne, props: { key: keyOne } } = nodeOne;
        const { tag: componentTwo, props: { key: keyTwo } } = nodeTwo;

        return componentOne === componentTwo && keyOne === keyTwo;
    }
}

