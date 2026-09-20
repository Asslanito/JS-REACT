# Async Café

A small vanilla JavaScript project: order a coffee and follow the actual execution order of synchronous functions, Promise reactions, microtasks, and timer callbacks.

[Live application](https://asslanito.github.io/aslan-react-portfolio/task1/) · [Repository](https://github.com/Asslanito/aslan-react-portfolio)

## Run locally

Use Node.js 24 LTS or a compatible version supported by Vite.

```sh
npm ci
npm run dev
```

Open the address shown in the terminal. Vite is a development/build tool; the application itself uses only HTML, CSS, and vanilla JavaScript.

```sh
npm test
npm run format:check
npm run build
npm run preview
```

## Try it

1. Choose a drink and a brewing delay.
2. Predict whether the Promise callback or the zero-delay timer will run first.
3. Place an order and inspect the numbered trace.
4. Filter by Sync, Microtasks, or Tasks while the coffee is brewing.
5. Place another order. The private closure counters remember the previous one.
6. Enable the out-of-stock option to follow the rejection, `catch`, and `finally` path.

Prices are fictional. Nothing is purchased, stored remotely, or sent to an API. Counters reset on a page reload.

## Assignment criteria

| Concept     | Implementation                                                                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Closures    | `createOrderTracker()` encloses private counters. Returned methods read and update them across multiple orders. The trace logger also closes over its start time and sequence number. |
| Call stack  | `placeOrder()` calls `getPrice()`, which calls `addTax()`. Enter/return trace messages show the nested calls completing from the inside out.                                          |
| Promises    | `brewCoffee()` returns a Promise settled by a timer. Its executor logs synchronously.                                                                                                 |
| async/await | `placeOrder()` waits for brewing, then returns the order result. The submit handler awaits it without blocking interaction.                                                           |
| Event loop  | Actual callbacks create the trace; the displayed ordering is not a scripted animation.                                                                                                |
| Tasks       | The zero-delay timer and brewing timer execute in later tasks.                                                                                                                        |
| Microtasks  | `Promise.then()`, `queueMicrotask()`, and the continuation after `await` demonstrate microtask execution.                                                                             |

The trace records selected application operations. It is not an inspector of every browser task or internal stack frame. The initial synchronous operations run within the form's event handler. `catch` and `finally` execute inside the same async continuation; each trace line is not necessarily a separate queued job. Timer delays are minimum scheduling delays, and elapsed values depend on the browser.

## Files

- `index.html`: interface and semantic structure.
- `src/style.css`: responsive styling.
- `src/cafe.js`: order logic and asynchronous experiment.
- `src/main.js`: DOM updates and events.
- `tests/cafe.test.js`: closure isolation, ordering, validation, and rejection tests.
- `../.github/workflows/deploy.yml`: checks, build, and GitHub Pages deployment.
- `DEFENSE-RU.md`: explanation and a short demonstration plan.

## Deployment

GitHub Pages uses the GitHub Actions source. The shared workflow in the repository root checks and builds both tasks, then publishes this app at `/task1/`. Relative asset paths support deployment under the repository URL.

## References

- [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- [MDN: JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
- [MDN: Using microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)
- [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [Vite: GitHub Pages deployment](https://vite.dev/guide/static-deploy.html#github-pages)

Typography: DM Sans and DM Serif Display, served by Google Fonts with local system fallbacks. The favicon is an original SVG.
