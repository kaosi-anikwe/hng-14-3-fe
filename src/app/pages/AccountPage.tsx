import { useAuth } from '../contexts/AuthContext'
import { User, Shield, Key, Bell } from 'lucide-react'

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
        <h1>Account Settings</h1>
        <p className="text-base-content/60">Manage your account preferences and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">
                <User size={20} />
                Profile Information
              </h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input type="text" className="input input-bordered" defaultValue={user.username} />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="email" title="Email" className="input input-bordered" defaultValue={user.email} disabled />
              </div>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">
                <Key size={20} />
                API Access
              </h2>
              <p className="text-sm text-base-content/60 mb-4">
                Generate API tokens for CLI and programmatic access
              </p>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">API Token</span>
                </label>
                <div className="join">
                  <input
                    type="text"
                    title='Password key'
                    className="input input-bordered join-item flex-1"
                    value="insighta_********************************"
                    disabled
                  />
                  <button className="btn join-item">Copy</button>
                </div>
              </div>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-outline">Regenerate Token</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">
                <Bell size={20} />
                Notifications
              </h2>
              <div className="space-y-3">
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input type="checkbox" className="checkbox" defaultChecked />
                    <div>
                      <div className="label-text">Email notifications</div>
                      <div className="text-xs text-base-content/60">Receive updates via email</div>
                    </div>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input type="checkbox" className="checkbox" defaultChecked />
                    <div>
                      <div className="label-text">Profile updates</div>
                      <div className="text-xs text-base-content/60">Get notified of profile changes</div>
                    </div>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input type="checkbox" className="checkbox" />
                    <div>
                      <div className="label-text">Weekly digest</div>
                      <div className="text-xs text-base-content/60">Summary of weekly activity</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-20">
                    <span className="text-2xl">{user.username.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                </div>
                <div>
                  <h3>{user.username}</h3>
                  <p className="text-sm text-base-content/60">{user.email}</p>
                </div>
              </div>
              <button className="btn btn-outline btn-sm w-full">Change Avatar</button>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">
                <Shield size={20} />
                Role & Permissions
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Role</span>
                  <span className={`badge ${getRoleBadge(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <div className="divider my-2"></div>
                <div className="text-sm text-base-content/60">
                  <p className="mb-2">Your permissions:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>View all profiles</li>
                    <li>Create and edit profiles</li>
                    <li>Access API endpoints</li>
                    {user.role === 'admin' && (
                      <>
                        <li>Manage users</li>
                        <li>System configuration</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Security</h2>
              <div className="space-y-2">
                <button className="btn btn-outline btn-sm w-full">
                  Change Password
                </button>
                <button className="btn btn-outline btn-sm w-full">
                  2FA Settings
                </button>
                <button className="btn btn-outline btn-error btn-sm w-full">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
