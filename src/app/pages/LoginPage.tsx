import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { siGithub } from 'simple-icons'
import { Search } from "lucide-react"

function SimpleIcon({ icon, size = 20 }: { icon: { path: string; title: string }; size?: number }) {
  return (
    <svg role="img" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  )
}

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleGitHubLogin = () => {
    login()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={30} className="text-primary-content" />
            </div>
            <h1 className="card-title text-3xl">Insighta Labs+</h1>
            <p className="text-base-content/60">Profile Intelligence Platform</p>
          </div>

          <div className="divider">Sign in to continue</div>

          <button
            onClick={handleGitHubLogin}
            className="btn btn-primary btn-wide gap-2"
          >
            <SimpleIcon icon={siGithub} size={20} />
            Sign in with GitHub
          </button>

          <p className="text-xs text-base-content/50 mt-4">
            Secure authentication powered by GitHub OAuth
          </p>
        </div>
      </div>
    </div>
  )
}

