import { createApp,
         hElement,
         hFragment
} from 'https://unpkg.com/tiny-react-lib@1.0.1/dist/index.js'

const state = {
    currentTodo: '',
    edit: {
        idx: null,
        original: null,
        edited: null,
    },
    todos: ['walk the dog', 'water the plants']
}

const reducers = {
    'update-current-todo': (state, currentTodo) => ({ // Reducer receives the current todo.
        ...state,
        currentTodo, // Update the current TODO in the state.
    }),
    // no payload because now the new todo is part of the state
    'add-todo': (state) => ({
        ...state,
        currentTodo: '', // Sets an empty string as the current todo.
        todos: [...state.todos, state.currentTodo], // Add new todo.
    }),
    'start-editing-todo': (state, idx) => ({ // Reducer receives the index of the todo to edit as payload.
        ...state,
        edit: {
            idx,
            original: state.todos[idx],
            edited: state.todos[idx]
        }
    }),
    'edit-todo': (state, edited) => ({
        ...state,
        edit: { ...state.edit, edited },
    }),
    'save-edited-todo': (state) => {
        const todos = [...state.todos];
        todos[state.edit.idx] = state.edit.edited

        return {
            ...state,
            edit: { idx: null, original: null, edited: null },
            todos,
        }
    },
    'cancel-editing-todo': (state) => ({
        ...state,
        edit: { idx: null, original: null, edited: null },
    }),
    'remove-todo': (state, idx) => ({
        ...state,
        todos: state.todos.filter((_, i) => i !== idx),
    }),

}

// top level view
function App(state, emit) {
    return hFragment([
        hElement('h1', {}, ['My todos']),
        CreateTodo(state, emit),
        TodoList(state, emit),
    ])
}

function CreateTodo({ currentTodo }, emit) {
    return hElement('div', {}, [
        hElement('label', { for: 'todo-input' }, ['New todo']),
        hElement('input', {
            type: 'text',
            id: 'todo-input',
            value: currentTodo,
            on: {
                input: ({ target }) =>
                    emit('update-current-todo', target.value),
                keydown: ({ key }) => {
                    if (key === 'Enter' && currentTodo.length >= 3) {
                        emit('add-todo')
                    }
                }
            }
        }),
        hElement('button', {
            disabled: currentTodo.length < 3,
            on: { click: () => emit('add-todo') }, // Dispatch add-todo command when the user clicks the button
        },
        ['Add']),
    ])
}

function TodoList({ todos, edit }, emit) {
    return hElement(
        'ul',
        {},
        todos.map((todo, i) => TodoItem({ todo, i, edit }, emit))
    )
}

function TodoItem({ todo, i, edit }, emit) {
    const isEditing = edit.idx === i;

    return hElement('li', {}, [
        isEditing
            ? hFragment([
                hElement('input', {
                    value: edit.edited,
                    on: {
                        input: ({ target }) => emit('edit-todo', target.value)
                    },
                }),
                hElement('button', {
                    on: { click: () => emit('save-edited-todo') }
                }, ['Save']),
                hElement('button', {
                    on: { click: () => emit('cancel-editing-todo') }
                }, ['Cancel']),
            ])
            : hFragment([
                hElement('span', {
                    on: { dblclick: () => emit('start-editing-todo', i) }
                }, [todo]),
                hElement('button', {
                    on: { click: () => emit('remove-todo', i) }
                }, ['Done']),
            ])
    ]);
}

createApp({
    state, reducers, view: App
}).mount(document.body);

// createApp({
//     state: 0,
//     view: (state, emit) => 
//         hElement(
//             'button',
//             { on: { click: () => emit('add', 1) } },
//             [hString(state)]
//         )
// }).mount(document.body);
