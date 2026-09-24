# Task 1 — Async Café

[Open the app](https://asslanito.github.io/JS-REACT/task1/)

The order form shows a detailed execution trace. Below it, three coffee tasks have separate counters, random delays of 500–2000 ms, and a 25% chance of failure. Run tasks individually, reset their counters, or compare sequential and concurrent runs. The separate **Run Event Loop Demo** button prints to both the page and the browser console.

## Closures

`createTask(name)` keeps `count`, `status`, and timing values inside its function scope. It returns `run()`, `getCount()`, `reset()`, and `snapshot()`, which keep access to those variables after the factory returns. Every call creates an independent counter. The values survive between runs but reset when the page reloads. `snapshot()` returns a new object, so changing it does not change the private state.

## Call stack

In the order form, `placeOrder()` calls `getPrice()`, which calls `addTax()`. The last function called returns first: `addTax`, then `getPrice`, then execution continues in `placeOrder`. The journal marks these selected calls; it is not a complete debugger trace.

## Waiting without blocking

`setTimeout()` schedules a callback and returns immediately. The browser manages the wait. `await` suspends the async function, allowing other work to run on the JavaScript thread. The Promise executor itself runs synchronously. No worker thread or network request is used.

## Predicted and actual event loop output

Before running the demo, the prediction is displayed on the page:

```text
Script start
Async start
Script end
Promise 1
Promise 2
After await
Timer 1
Timer 2
```

The actual order matches this prediction. The synchronous calls finish first. `Promise 1`, `Promise 2`, and the continuation after `await` enter the microtask queue in that order. After the current task ends and the call stack is empty, those microtasks run. The event loop then runs the two zero-delay timer tasks, which were scheduled in that order. A zero delay does not mean immediate execution. Timer timestamps are observed durations, not exact scheduling guarantees.

## Tasks and microtasks

The timer callbacks are tasks. Promise reactions and the continuation after `await` run as microtasks. Queued microtasks are drained before the browser proceeds to the next task. In the original order trace, the final `finally` message belongs to the same async continuation; it is not a separate microtask.

## Promise errors

A randomly failed coffee task throws after its delay and updates its status to `Failed`. The concurrent batch uses `Promise.allSettled()` so one rejection cannot finish the batch early. The sequential batch catches each rejection and continues with the remaining tasks. **All tasks finished** appears only after every task has either completed or failed. The original order form also demonstrates a manually triggered rejection and handles it with `try/catch/finally`.

## Sequential and concurrent execution

Sequential execution awaits each task before starting the next. Its total time is approximately the sum of the delays. Concurrent execution starts all tasks first and awaits their combined results, so its total is approximately the longest delay, plus overhead. These are overlapping waits on one JavaScript thread, not parallel JavaScript execution. Both durations are shown in the UI. Each run draws new random delays, so individual measurements vary.

## Run

From the repository root, run `npm run dev:task1`. Use `npm test` to check the task logic and event order.
