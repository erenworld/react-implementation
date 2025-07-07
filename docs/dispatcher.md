The application instance is the object that manages the lifecycle of the application. It
manages the state, renders the views, and updates the state in response to user input.
Developers need to pass three things to pass to the application instance:
- The initial state of the application
- The reducers that update the state in response to commands
- The top-level component of the application

The createApp() function takes an object with two properties: state and view.
The state property is the initial state of the application, and the view property is the
top-level component of the application

## Objectif fondamental
Quand plusieurs composants doivent réagir à un événement global (comme "ajouter une tâche"), ils doivent communiquer.
Or en React, il n’y a pas de système de communication global intégré entre composants (à part Context ou Redux).

### Créer un système centralisé qui permet à un composant de :
1. Écouter un événement (via subscribe)
2. Déclencher un événement avec une donnée (dispatch)
3. S’assurer que d’autres fonctions peuvent être appelées après chaque événement (afterEveryCommand)

`#subs = new Map()`
#subs est une map privée qui stocke les abonnés à chaque commande.
Clé = nom de la commande (string)
Valeur = tableau des fonctions (handlers) à appeler

`#afterHandlers = []`
Liste de fonctions à appeler après chaque commande dispatchée, quelle qu’elle soit.

`subscribe(commandName, handler)`
Permet à une fonction (handler) de s’abonner à une commande spécifique, comme “ajouter une tâche” ou “jouer un son”.
Quand cette commande est dispatchée, on appelle tous les abonnés associés.

### Exemple
1. Un bouton déclenche la commande "add-task"
2. D’autres fonctions veulent être notifiées à chaque fois qu'une tâche est ajoutée

```js
const showToast = (task) => {
  console.log("Tâche ajoutée : " + task);
};

const unsubscribe = dispatcher.subscribe("add-task", showToast);
```

3. Chaque fois que "add-task" est dispatchée, la fonction showToast sera appelée.
`dispatcher.dispatch("add-task", "Faire les courses");`
`Tâche ajoutée : Faire les courses`

4. se désabonner: même si on appelle dispatch("add-task", ...)
`unsubscribe();`

## Objectif de afterEveryCommand
Dans certaines situations, tu veux exécuter une action systématique après chaque commande, peu importe son nom.
Exemple : enregistrer un log, afficher une animation de chargement, ou synchroniser l’interface après n’importe quel événement.

## Dispatcher()
"Je lance un événement → tout le monde écoute → tout le monde réagit."

## Exemple concret
```js
dispatcher.subscribe("add-task", (task) => {
  console.log("Tâche reçue :", task);
});

dispatcher.afterEveryCommand(() => {
  console.log("Commande terminée !");
});

dispatcher.dispatch("add-task", "Écrire un article");
```

To avoid re-rendering the application when the state didn’t change,
you could compare the state before and after the command was handled.
This comparison can become expensive if the state is a heavy and deeply
nested object and the commands are frequent. In chapters 7 and 8, you’ll
improve the performance of the renderer by patching the DOM only where
necessary, so re-rendering the application will be a reasonably fast operation.
Not checking whether the state changed is a tradeoff we’re making to keep
the code simple.

The dispatcher is like a remote control: each button dispatches a command whose handler function can modify the state of the application.

