import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'

export default function ErrorPage() {
    const error = useRouteError()

    const title = isRouteErrorResponse(error)
        ? `${error.status} ${error.statusText}`
        : 'Unexpected error'

    const message = isRouteErrorResponse(error)
        ? error.data
        : error instanceof Error
            ? error.message
            : 'Something went wrong.'

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-full max-w-md bg-base-100 shadow-sm">
                <div className="card-body items-center text-center space-y-3">
                    <div className="text-error text-6xl">⚠</div>
                    <h1 className="card-title text-xl">{title}</h1>
                    {message && (
                        <p className="text-base-content/60 text-sm">{String(message)}</p>
                    )}
                    <div className="card-actions mt-2">
                        <Link to="/dashboard" className="btn btn-primary btn-sm">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
