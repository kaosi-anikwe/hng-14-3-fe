# Insighta Labs+ Web Portal

A secure, multi-interface platform for profile intelligence with authentication, role-based access control, and DaisyUI theming.

## Features

### Authentication

- GitHub OAuth login (mock implementation ready for backend integration)
- Session persistence with localStorage
- Protected routes with authentication checks

### Role-Based Access Control (RBAC)

- **Admin**: Full system access, user management
- **User**: Create, view, and edit profiles
- **Viewer**: Read-only access

### Pages

1. **Login** (`/login`)
   - GitHub OAuth integration
   - Automatic redirect if already authenticated

2. **Dashboard** (`/dashboard`)
   - Key metrics: total profiles, active profiles, new this month, average score
   - Recent activity feed
   - Quick stats with progress bars

3. **Profiles List** (`/profiles`)
   - Advanced filtering (status, company, search)
   - Pagination (10 per page)
   - Table view with profile scores
   - Quick actions to view details

4. **Profile Detail** (`/profiles/:id`)
   - Complete profile information
   - Contact details and social links
   - Skills and bio
   - Activity timeline

5. **Search** (`/search`)
   - Natural language search
   - Search across name, skills, company, location, bio
   - Grid view results
   - Search suggestions

6. **Account** (`/account`)
   - Profile settings
   - API token management (for CLI access)
   - Notification preferences
   - Role and permissions display
   - Theme switcher

### Theming

Built with DaisyUI, supports multiple themes:

- Light
- Dark
- Cupcake
- Business
- Cyberpunk
- Forest

Theme preference is persisted to localStorage.

## Tech Stack

- **React** 18.3.1
- **React Router** 7.14.2
- **Tailwind CSS** 4.1.12
- **DaisyUI** 5.5.19
- **Lucide React** (icons)
- **Vite** 6.3.5

## API Integration

The application is built with a mock API service layer (`src/app/services/api.ts`) that simulates backend calls. To integrate with your actual backend:

1. Update the API base URL in `src/app/services/api.ts`
2. Replace mock responses with actual fetch calls
3. Update the OAuth flow in `src/app/contexts/AuthContext.tsx`
4. Add proper error handling and loading states

### Expected Backend Endpoints

```
GET  /api/dashboard/stats
GET  /api/profiles?page=1&limit=10&status=active&company=TechCorp&search=query
GET  /api/profiles/:id
POST /api/profiles/search
POST /api/auth/github/callback
POST /api/auth/logout
GET  /api/user/me
```

## Development

The Vite dev server is already running. The application is accessible through the preview surface.

## Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Layout.tsx          # Main layout with sidebar
│   │   └── ProtectedRoute.tsx  # Route guard
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication state
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ProfilesPage.tsx
│   │   ├── ProfileDetailPage.tsx
│   │   ├── SearchPage.tsx
│   │   └── AccountPage.tsx
│   ├── services/
│   │   └── api.ts              # API service layer (mock)
│   └── App.tsx                 # Main app with routing
└── styles/
    ├── tailwind.css            # Tailwind + DaisyUI
    └── theme.css               # Custom theme tokens
```

## Authentication Flow

1. User visits any protected route
2. `ProtectedRoute` checks authentication status
3. If not authenticated, redirect to `/login`
4. User clicks "Sign in with GitHub"
5. Mock OAuth flow authenticates user
6. Session stored in localStorage
7. User redirected to `/dashboard`

## Customization

### Adding New Themes

Edit `src/app/components/Layout.tsx` and add theme names to the `themes` array.

### Adding New Routes

1. Create page component in `src/app/pages/`
2. Add route in `src/app/App.tsx`
3. Add navigation item in `src/app/components/Layout.tsx` (if needed)
