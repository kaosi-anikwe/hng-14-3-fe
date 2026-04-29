import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import SearchPage from './pages/SearchPage'
import AccountPage from './pages/AccountPage'
import ProfilesPage from './pages/ProfilesPage'
import DashboardPage from './pages/DashboardPage'
import ErrorPage from './pages/ErrorPage'
import NotFoundPage from './pages/NotFoundPage'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ProfileDetailPage from './pages/ProfileDetailPage'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage />, errorElement: <ErrorPage /> },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/profiles', element: <ProfilesPage /> },
          { path: '/profiles/:id', element: <ProfileDetailPage /> },
          { path: '/search', element: <SearchPage /> },
          { path: '/account', element: <AccountPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  )
}
