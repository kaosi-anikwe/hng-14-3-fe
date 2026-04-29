import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center space-y-4">
        <p className="text-9xl font-bold text-base-content/20">404</p>
        <h1 className="text-2xl">Page not found</h1>
        <p className="text-base-content/60">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/dashboard" className="btn btn-primary mt-4">
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
