import { defineComponent } from "./component";
import { hElement } from "../h";

// eslint-disable-next-line no-unused-vars
const List = defineComponent({
    render() {
        const { todos } = this.props;
        return hElement('ul', {}, todos.map((todo) => hElement(ListItem, { todo })));
    }
})

const ListItem = defineComponent({
    render() {
        const { todo } = this.props;
        return hElement('li', {}, [todo])
    }
})
