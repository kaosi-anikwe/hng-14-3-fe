import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

