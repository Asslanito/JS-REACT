# ShopDesk

React + React Router + Firebase Authentication + TanStack Query.

Features: product catalog (search, category filter, pagination, all stored in the URL), create/edit/delete,
Email/Password and Google sign-in, persistent sessions, protected `/profile`, conditional NavBar.

**Bonus features (beyond the assignment):** password reset by email (`/forgot-password`),
per-user favorites ("Save" button and "Favorites only" filter), light/dark theme.

## Setup

1. `npm install`
2. Firebase Console: create a project, then Authentication > Sign-in method > enable **Email/Password** and **Google**.
3. Project settings > Your apps > add a Web app and copy its config.
4. `cp .env.example .env.local` and fill in the `VITE_FIREBASE_*` values.
5. `npm run dev`

`.env.local` is in `.gitignore`; only `.env.example` is committed.

## Deploy (Vercel / Netlify)

Add the same `VITE_FIREBASE_*` variables in the hosting dashboard. SPA fallback is already configured
(`vercel.json`, `public/_redirects`). Then add the deployed domain in
Firebase Console > Authentication > Settings > **Authorized domains**, otherwise Google sign-in fails.

## Architecture

- `src/firebase.js` - Firebase initialization from `VITE_` variables
- `src/services/` - `authService` (Firebase), `productsService` (API + query keys), `storageService` (the only code that touches localStorage)
- `src/context/AuthContext.jsx` - `AuthProvider` / `useAuth`, `onAuthStateChanged`, loading and error state
- `src/hooks/` - `useProducts` (TanStack Query), `useFavorites`, `useTheme`
- UI components call hooks only; they never call `fetch` or `localStorage` directly.

## Caching strategy

API: DummyJSON, cached with TanStack Query.

- **Query keys:** `['products', 'list', { q, category, page }]` and `['products', 'categories']`. Each filter/page combination gets its own cache entry.
- **Expiration:** product lists are fresh for 60 seconds (`staleTime`), kept in memory for 5 minutes after last use (`gcTime`). Categories are fresh for 1 hour. Stale data is shown instantly and revalidated in the background (stale-while-revalidate), also on window focus.
- **Invalidation:** after any successful create, update or delete, the whole `['products']` key is invalidated, so every cached list refetches.
- **Outdated requests:** each request receives the query's `AbortSignal`; when filters or page change, the previous request is cancelled, and results are stored under their own key, so an old response can never overwrite a newer one.
- **States:** loading, error (with "Try again"), and empty states are all handled. `keepPreviousData` keeps the old page visible while the next loads.

Note: DummyJSON simulates writes and does not persist them, so refetched data will not show your new product. The invalidation still runs and works.
## State management with Redux Toolkit

The whole app state lives in one Redux store (`src/app/store.js`, created with `configureStore` and provided through `<Provider>` in `main.jsx`). Authentication stays in `AuthContext` (Firebase user, login, logout) and temporary UI state (form editing, notices, search input) stays in local component state.

### Folder structure

| Layer | Location |
|---|---|
| Store | `src/app/store.js` |
| Feature slices, thunks, selectors | `src/features/<feature>/` |
| API services | `src/services/productsService.js` |
| Custom hooks | `src/hooks/` |
| UI components and pages | `src/pages/`, `src/components/`, `src/pwa/` |

### Slices

- **products** (`features/products/productsSlice.js`): `createEntityAdapter` keeps every product once, by id. The current list stores only ids, the total and a request status. It also holds the details request state and the mutation state.
- **categories** (`features/categories/categoriesSlice.js`): list of categories with status and error.
- **favorites** (`features/favorites/favoritesSlice.js`): favorite ids per signed-in user. A listener middleware saves them to localStorage after every toggle.
- **theme** (`features/theme/themeSlice.js`): light or dark mode.

### Async thunks (`createAsyncThunk`)

| Thunk | Purpose |
|---|---|
| `fetchProducts` | list with search, category, sorting and pagination |
| `fetchProductById` | product details page |
| `fetchCategories` | category filter |
| `createProduct`, `updateProduct`, `deleteProduct` | CRUD mutations |

`pending`, `fulfilled` and `rejected` are handled in `extraReducers`.

- **Loading, errors, empty results**: each request has a status (`idle`, `loading`, `succeeded`, `failed`) and an error message. The UI shows a loader, an error with a Try again button (retry dispatches the thunk again with `force`), and an empty state.
- **Stale requests**: every `pending` stores `meta.requestId`. A `fulfilled` or `rejected` action with a different id is ignored, so a slow older response never overwrites a newer one.
- **No duplicated or unnecessary requests**: each thunk has a `condition`. It skips a request that is already loading, and a list or details request that is still fresh (60 s for lists, 5 min for details), and categories that are already loaded. The service retries a failed GET once.
- **Refresh after mutations**: the demo API does not store changes. After a successful create, update or delete the affected product is changed in the shared entity store, the list ids and the total are updated, and the details page reads the same entity, so every screen is refreshed without a refetch that would discard the change.

### Selectors (`features/products/productsSelectors.js`)

- `selectProductById`, `selectListMeta`, `selectDetailsMeta`, `selectMutation`: reusable plain selectors.
- `selectVisibleProducts` (memoized with `createSelector`): turns the list ids into product objects.
- `selectTotalPages` (memoized): page count from the total.
- `selectFavoriteSet` (memoized): set of favorite ids.
- `selectProductsForView` (memoized): applies the favorites-only filter on top of the visible products.

Components use `useSelector` and `useDispatch` only inside custom hooks (`useProductsList`, `useProduct`, `useCategories`, `useProductActions`, `useFavorites`, `useTheme`).

### URL parameters, debounce, sorting

Search text, category, sort order and page number are stored in the URL (`?q=&category=&sort=&page=`), so every state can be shared and restored. The search input is debounced by 400 ms before it changes the URL. Sorting is sent to the API (`sortBy`, `order`).

### PWA and offline

The Service Worker, manifest, offline page and offline catalog are unchanged. The thunks go through the same service layer, so product lists and details viewed online are served from the Service Worker cache when offline, and the "Viewing cached data" badge is shown.
