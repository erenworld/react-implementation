// When the execution stack empties, the
// processJobs() function starts executing.

// The processJobs() function schedules the
// microtasks created by the jobs it executes.

// This process of scheduling a microtask via a task is commonly referred to as flushing
// promises

import { scheduleUpdate } from "./scheduler";

export function nextTick() {
    scheduleUpdate();
    return flushPromises();
}

function flushPromises() {
    return new Promise((resolve) => setTimeout(resolve));
}
