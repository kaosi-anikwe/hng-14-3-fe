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
import { ToastProvider, useToast } from './contexts/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import ProfileDetailPage from './pages/ProfileDetailPage'
import UploadPage from './pages/UploadPage'
import { setApiErrorHandler } from './services/api'
import { useEffect } from 'react'

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
          { path: '/upload', element: <UploadPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

/** Bridges the Axios error interceptor → Toast context */
function ApiErrorBridge() {
  const { toast } = useToast()
  useEffect(() => {
    setApiErrorHandler((msg) => toast(msg, 'error'))
    return () => setApiErrorHandler(null)
  }, [toast])
  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ApiErrorBridge />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}
