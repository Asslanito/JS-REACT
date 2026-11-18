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
