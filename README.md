# Insighta Labs+ — Web Portal

[![CI](https://github.com/kaosi-anikwe/hng-14-3-fe/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/kaosi-anikwe/hng-14-3-fe/actions/workflows/ci.yml)

The web portal for **Insighta Labs+**, a secure profile intelligence platform. This is the frontend component of a multi-interface system (API, CLI, Web) that shares a single backend. Built with React, TypeScript, Tailwind CSS, and DaisyUI.

> **Related repositories:** Backend · CLI
>
> **Live URL:** _\<deployed web portal URL\>_

---

## System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│  Web Portal │───▶│              │    │  External APIs    │
│  (this repo)│     │   Backend   │────▶│  (Genderize,     │
├─────────────┤     │   Server    │     │   Agify,         │
│     CLI     │────▶│             │     │   Nationalize)   │
└─────────────┘     └──────┬──────┘     └──────────────────┘
                           │
                    ┌──────▼──────┐
                    │  PostgreSQL  │
                    └─────────────┘
```

The web portal communicates exclusively with the backend via REST APIs. It shares the same endpoints, data, and access control rules as the CLI — ensuring **consistency across all interfaces**.

---

## Features

### Authentication

- **GitHub OAuth** login — user clicks "Sign in with GitHub", backend handles the full OAuth flow and sets HTTP-only cookies
- **HTTP-only cookies** — tokens are never accessible to JavaScript (no `localStorage` token storage)
- **Silent token refresh** — an Axios interceptor automatically calls `POST /auth/refresh` on 401 responses, queuing concurrent requests during refresh
- **Session rehydration** — on page load, `GET /api/users/me` validates the existing cookie; if invalid, the user is redirected to login
- **Protected routes** — all pages except `/login` are wrapped in a `ProtectedRoute` guard that checks authentication state before rendering

### Role-Based Access Control

Two roles as defined by the backend:

| Role        | Permissions                                                   |
| ----------- | ------------------------------------------------------------- |
| **admin**   | Full access — create profiles, delete profiles, query, search |
| **analyst** | Read-only — view profiles, search, dashboard                  |

- The portal displays the user's role on the sidebar and account page
- Role enforcement is handled server-side; the portal respects 403 responses

### Pages

| Page               | Route           | Description                                                                                                                                                                                             |
| ------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Login**          | `/login`        | GitHub OAuth entry point. Redirects to dashboard if already authenticated                                                                                                                               |
| **Dashboard**      | `/dashboard`    | Total profiles, gender breakdown, age group breakdown, top countries, averages (age, gender probability, country probability), recent profiles                                                          |
| **Profiles**       | `/profiles`     | Paginated table with advanced filters (gender, age group, country code, age range, gender probability, country probability), sorting (date, age, gender probability), configurable page size (10/25/50) |
| **Profile Detail** | `/profiles/:id` | Full profile view — name, initials avatar, age, gender, probabilities, country, date added                                                                                                              |
| **Search**         | `/search`       | Natural language search with example queries, results table with sort/pagination                                                                                                                        |
| **Account**        | `/account`      | User avatar, username, email, role badge, last login timestamp, active status                                                                                                                           |
| **Error**          | (route error)   | Catches route-level errors and displays a friendly error card                                                                                                                                           |
| **404**            | `*`             | Catch-all not-found page                                                                                                                                                                                |

### API Integration

All requests go through a centralized Axios client (`src/app/services/api.ts`) configured with:

- `withCredentials: true` — sends HTTP-only cookies on every request
- `X-API-Version: 1` header — required by the backend for all profile endpoints
- **Error interceptor** — surfaces backend error messages as toast notifications
- **Refresh interceptor** — transparently handles token expiry (access token: 3 min, refresh token: 5 min)

### Theming

Supports all 35 built-in DaisyUI themes. Cycle through themes via the sidebar toggle or mobile navbar button. Preference is persisted to `localStorage`.

---

## Tech Stack

| Tool           | Version | Purpose                           |
| -------------- | ------- | --------------------------------- |
| React          | 19.x    | UI framework                      |
| React Router   | 7.x     | Client-side routing               |
| TanStack Query | 5.x     | Server state management & caching |
| Axios          | 1.x     | HTTP client with interceptors     |
| Tailwind CSS   | 4.x     | Utility-first CSS                 |
| DaisyUI        | 5.x     | Component library & theming       |
| Lucide React   | latest  | Icon set                          |
| Vite           | 8.x     | Build tool & dev server           |
| TypeScript     | 6.x     | Type safety                       |

---

## Backend API Endpoints Used

The portal consumes these backend endpoints:

### Authentication

| Method | Endpoint        | Description                                    |
| ------ | --------------- | ---------------------------------------------- |
| `GET`  | `/auth/github`  | Initiates GitHub OAuth flow (browser redirect) |
| `POST` | `/auth/refresh` | Refreshes access token using HTTP-only cookie  |
| `POST` | `/auth/logout`  | Invalidates the current session                |

### Users

| Method | Endpoint        | Description                              |
| ------ | --------------- | ---------------------------------------- |
| `GET`  | `/api/users/me` | Returns the authenticated user's profile |

### Dashboard

| Method | Endpoint         | Description                                                             |
| ------ | ---------------- | ----------------------------------------------------------------------- |
| `GET`  | `/api/dashboard` | Returns dashboard stats (totals, breakdowns, averages, recent profiles) |

### Profiles

| Method | Endpoint               | Description                                         |
| ------ | ---------------------- | --------------------------------------------------- |
| `GET`  | `/api/profiles`        | List profiles with filters, sorting, and pagination |
| `GET`  | `/api/profiles/:id`    | Get a single profile by ID                          |
| `GET`  | `/api/profiles/search` | Natural language search with pagination             |

#### Query Parameters (GET /api/profiles)

| Parameter                 | Type    | Description                                               |
| ------------------------- | ------- | --------------------------------------------------------- |
| `page`                    | integer | Page number (default: 1)                                  |
| `limit`                   | integer | Results per page (default: 10)                            |
| `gender`                  | string  | Filter by gender (`male`/`female`)                        |
| `age_group`               | string  | Filter by age group (`child`/`teenager`/`adult`/`senior`) |
| `country_id`              | string  | Filter by country code (e.g. `NG`, `US`)                  |
| `min_age`                 | integer | Minimum age filter                                        |
| `max_age`                 | integer | Maximum age filter                                        |
| `min_gender_probability`  | float   | Minimum gender probability (0.0–1.0)                      |
| `min_country_probability` | float   | Minimum country probability (0.0–1.0)                     |
| `sort_by`                 | string  | Sort field (`age`/`created_at`/`gender_probability`)      |
| `order`                   | string  | Sort direction (`asc`/`desc`)                             |

#### Query Parameters (GET /api/profiles/search)

| Parameter | Type    | Description                   |
| --------- | ------- | ----------------------------- |
| `q`       | string  | Natural language search query |
| `page`    | integer | Page number                   |
| `limit`   | integer | Results per page              |
| `sort_by` | string  | Sort field                    |
| `order`   | string  | Sort direction                |

---

## Authentication Flow

```
User visits /dashboard
        │
        ▼
ProtectedRoute checks auth state
        │
        ├── Loading? → Show spinner
        ├── Not authenticated? → Redirect to /login
        └── Authenticated? → Render page
                                │
                                ▼
                        GET /api/users/me
                        (cookie sent automatically)
                                │
                        ┌───────┴───────┐
                        │               │
                    200 OK          401 Unauthorized
                    Set user          │
                                      ▼
                              POST /auth/refresh
                                      │
                              ┌───────┴───────┐
                              │               │
                          200 OK          Refresh failed
                          Retry original    │
                          request           ▼
                                      Redirect to /login
```

### Token Handling

- **Access tokens** and **refresh tokens** are stored as **HTTP-only cookies** by the backend — they are never exposed to JavaScript
- The Axios client sends cookies automatically via `withCredentials: true`
- On a 401 response, the refresh interceptor:
  1. Pauses all pending requests
  2. Calls `POST /auth/refresh`
  3. On success: replays all queued requests with the new cookie
  4. On failure: clears user state and redirects to `/login`
- Auth endpoints (`/auth/*`) are excluded from the refresh interceptor to prevent loops

---

## Project Structure

```
src/
├── main.tsx                         # App entry point
├── app/
│   ├── App.tsx                      # Router + providers (QueryClient, Auth, Toast)
│   ├── components/
│   │   ├── Layout.tsx               # Drawer layout, sidebar nav, theme toggle
│   │   ├── ProfilesTable.tsx        # Reusable profiles table with skeleton loading
│   │   └── ProtectedRoute.tsx       # Auth guard — redirects to /login if unauthenticated
│   ├── contexts/
│   │   ├── AuthContext.tsx           # Auth state, login/logout, session rehydration
│   │   └── ToastContext.tsx          # Toast notification system
│   ├── pages/
│   │   ├── LoginPage.tsx            # GitHub OAuth login
│   │   ├── DashboardPage.tsx        # Metrics & stats overview
│   │   ├── ProfilesPage.tsx         # Filterable, sortable, paginated profiles list
│   │   ├── ProfileDetailPage.tsx    # Single profile view
│   │   ├── SearchPage.tsx           # Natural language search
│   │   ├── AccountPage.tsx          # User account info & role display
│   │   ├── ErrorPage.tsx            # Route error boundary
│   │   └── NotFoundPage.tsx         # 404 catch-all
│   └── services/
│       ├── api.ts                   # Axios client, interceptors, API methods, types
│       └── queryKeys.ts             # TanStack Query key factory
└── styles/
    ├── index.css                    # Style entry (imports tailwind + theme)
    ├── tailwind.css                 # Tailwind + DaisyUI plugin config
    └── theme.css                    # Base typography tokens
```

---

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Set the backend URL
cp .env.example .env
# Edit .env and set VITE_API_URL to your backend URL

# Start dev server
npm run dev
```

### Environment Variables

| Variable       | Description          | Default |
| -------------- | -------------------- | ------- |
| `VITE_API_URL` | Backend API base URL | `/api`  |

> **Do not hardcode API URLs.** All API calls use the `VITE_API_URL` environment variable.

### Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start Vite dev server               |
| `npm run build`   | Type-check and build for production |
| `npm run preview` | Preview the production build        |
| `npm run lint`    | Run ESLint                          |

---

## Deployment

The web portal must be deployed and publicly accessible. Build output is a static site:

```bash
npm run build
# Output: dist/
```

Serve the `dist/` directory with any static hosting provider (Vercel, Netlify, Cloudflare Pages, etc.). Ensure `VITE_API_URL` is set to the live backend URL at build time.

---

## Role Enforcement Logic

Role enforcement is **server-side**. The backend rejects unauthorized actions with `403 Forbidden`. The portal's responsibilities:

1. Display the user's role (sidebar + account page)
2. Surface error toasts when the backend rejects an action
3. Never expose admin-only UI to analyst users (future enhancement)

---

## Error Handling

- **API errors** — the Axios error interceptor extracts the `message` field from the backend's standardized error response (`{ "status": "error", "message": "..." }`) and displays it as a toast notification
- **401 Unauthorized** — triggers the silent refresh flow; if refresh fails, redirects to login
- **Route errors** — caught by React Router's `errorElement` and rendered via `ErrorPage`
- **404** — unmatched routes render `NotFoundPage`

---

## Conventions

- **Conventional commits**: `feat(auth): ...`, `fix(profiles): ...`, `chore(deps): ...`
- **Branch naming**: `feat/...`, `fix/...`, `chore/...`
- **Pull requests**: All changes go through PRs before merging to `main`
