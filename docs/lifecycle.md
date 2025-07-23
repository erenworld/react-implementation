A lifecycle hook is a user-defined function that is executed when a component goes
through a lifecycle event. Lifecycle events include the creation, mounting, updating,
and unmounting of a component.

scheduleUpdate() — Queues the processJobs() function to be executed as
a microtask

processJobs() — Runs all the jobs in the scheduler

mountDOM() and destroyDOM() functions to enqueue the
onMounted() and onUnmounted() hooks, respectively, as jobs in the scheduler.
