# Study Atlas — React SPA

A responsive directory of study spaces in Almaty, Astana, and Qyzylorda. Explore libraries, cafés, coworking spaces, and campus rooms, save favorites, and add a new place through a controlled form.

- Application: https://asslanito.github.io/JS-REACT/midterm/
- Repository: https://github.com/Asslanito/JS-REACT
- Source: https://github.com/Asslanito/JS-REACT/tree/main/midterm

All initial venues, addresses, hours, prices, and ratings are simulated. This is an educational project, not a real venue recommendation service. New records and favorites persist in the current browser; they are not shared between devices.

[Desktop screenshot](docs/desktop.png) · [Mobile screenshot](docs/mobile.png)

## Run locally

Use Node.js 24. From the repository root:

```sh
npm ci
npm run setup
npm run dev:midterm
```

Open http://127.0.0.1:5177. Alternatively, run `npm ci` and `npm run dev` inside `midterm`.

## Checks

```sh
npm --prefix midterm test
npm --prefix midterm run lint
npm --prefix midterm run build
```

`npm run check` checks formatting, tests, and linting for the repository. `npm run build` builds every assignment into `dist`, including `dist/midterm`. The existing GitHub Actions workflow publishes the complete collection to GitHub Pages on a push to `main`.

## Features

| Requirement                               | Implementation                                                                                                                              |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| One data source with 100+ initial records | Simulated asynchronous API backed by 120 JSON records and localStorage                                                                      |
| Reusable components                       | Header, Hero, SpaceArt, PlaceCard, FilterBar, Pagination, AsyncState, PlaceDetail, PlaceForm, and Explorer                                  |
| List and detail views                     | Catalog with nine items per page; shareable `#/places/:id` routes                                                                           |
| Controlled form                           | Name, category, city, district, address, atmosphere, price, seats, opening and closing time, description, Wi-Fi, and outlets                |
| Search and filters                        | Case-insensitive search across place name, city, district, type, and description; city, category, atmosphere, free entry, and Wi-Fi filters |
| Sorting                                   | Rating, price, name, and creation date with deterministic tie breakers                                                                      |
| Pagination                                | Boundary-safe pagination, automatic page reset when filters change                                                                          |
| State and events                          | Local form and filter state; immutable favorite updates; validation, submissions, retries, and navigation                                   |
| Effects and cleanup                       | AbortController cancels list, detail, and creation requests; hash listener and notification timer clean up                                  |
| Async states                              | Loading skeletons, visible recoverable errors, empty results, and successful creation notification                                          |
| Component identity                        | Stable record IDs; detail component keyed by record ID; catalog filters preserved while navigating to details                               |
| Responsive UI                             | Three, two, and one-column layouts; accessible labels and keyboard focus styles; reduced-motion support                                     |
| Public deployment                         | Relative Vite assets and hash routing work under the GitHub Pages project subdirectory                                                      |

## Structure

```text
src/
  components/     Reusable views and UI components
  data/places.json
  hooks/          useAsync, useFavorites, useRoute
  lib/            API, filtering, validation, shared constants
  App.jsx
  main.jsx
  styles.css
scripts/generate-seed.mjs
tests/catalog.test.js
```

## Data flow

`Explorer` owns the filter state. Its memoized request calls `placesApi.list`. `useAsync` tracks the response and cancels stale requests when query dependencies change or the component unmounts. The API waits before reading JSON or persisted records, then applies filtering, sorting, and pagination. Results flow into cards through props.

`PlaceForm` owns its controlled input values, validation errors, and pending submission. On success the API creates a UUID, stores the complete collection, and returns the new record. `App` refreshes the catalog, shows a success message, and navigates to the record’s detail route.

`useFavorites` owns saved IDs and writes them to localStorage before updating React state. The same IDs control hearts in both list and detail views. The saved list queries the same API with an additional ID filter.

## Error recovery

The catalog validates persisted records. Corrupt data produces a visible error with a retry action and an optional restore action. Restoring requires an explicit in-app confirmation because it removes user-added records. It restores the 120 initial records and keeps favorite IDs. Storage access and quota failures produce readable messages.

The browser uses two storage keys: `study-atlas:places:v1` and `study-atlas:favorites:v1`. An empty browser starts with the bundled JSON; no backend or API key is required. `npm run seed` inside `midterm` regenerates the deterministic JSON dataset.

## Defense preparation

See [DEFENSE.md](DEFENSE.md) for an explanation in Russian, a demonstration sequence, and examples of small changes you can practice before defending the project.

The assignment deadline is October 22, 2026 at 1:00 PM, as stated in the assignment. Submit the repository URL and deployed application URL and press **Turn in** before the deadline.
