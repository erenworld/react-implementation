
let isScheduled = false; // To indicate if processJobs() function is scheduled
const jobs = [];

export function enqueueJob(job) {
    jobs.push(job);
    scheduleUpdate();
}

export function scheduleUpdate() {
    if (isScheduled) return;

    isScheduled = true;
    queueMicrotask(processJobs);
}

// Pops and executes job functions until the queue is empty
function processJobs() {
    while (jobs.length > 0) {
        const job = jobs.shift();
        const result = job();

        Promise.resolve(result).then(
            () => {
                // Job completed successfully
            },
            (error) => {
                console.error(`[scheduler]: ${error}`);
            }
        )
    }

    isScheduled = false;
}
