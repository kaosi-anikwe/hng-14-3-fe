import { useAuth } from '../contexts/AuthContext'
import { Shield, Mail, Clock, User } from 'lucide-react'

import { type User as AccountUser } from '../services/api'

export default function AccountPage() {
  const { user } = useAuth()

  if (!user) return null

  const getRoleBadge = (role: AccountUser["role"]) => {
    switch (role) {
      case 'admin': return 'badge-error'
      case 'analyst': return 'badge-primary'
      default: return ''
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1>Account</h1>
        <p className="text-base-content/60">Your profile details</p>
      </div>

      <div className="card bg-base-100 shadow-sm max-w-2xl">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user.avatar_url} alt={user.username} />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl">{user.username}</h2>
              <span className={`badge ${getRoleBadge(user.role)} mt-1 capitalize`}>
                {user.role}
              </span>
            </div>
          </div>

          <div className="divider"></div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-base-content/50 shrink-0" />
              <div>
                <p className="text-xs text-base-content/50">Email</p>
                <p>{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User size={18} className="text-base-content/50 shrink-0" />
              <div>
                <p className="text-xs text-base-content/50">Username</p>
                <p>{user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield size={18} className="text-base-content/50 shrink-0" />
              <div>
                <p className="text-xs text-base-content/50">Role</p>
                <p className="capitalize">{user.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={18} className="text-base-content/50 shrink-0" />
              <div>
                <p className="text-xs text-base-content/50">Last Login</p>
                <p>{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-4.5 h-4.5 shrink-0 flex items-center justify-center">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${user.is_active ? 'bg-success' : 'bg-error'}`}></span>
              </div>
              <div>
                <p className="text-xs text-base-content/50">Status</p>
                <p>{user.is_active ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
