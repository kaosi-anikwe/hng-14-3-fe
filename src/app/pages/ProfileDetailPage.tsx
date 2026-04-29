import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import { queryKeys } from '../services/queryKeys'

export default function ProfileDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: profile, isLoading } = useQuery({
    queryKey: queryKeys.profiles.detail(id!),
    queryFn: () => api.getProfile(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2>Profile not found</h2>
        <Link to="/profiles" className="btn btn-primary mt-4">
          Back to Profiles
        </Link>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => navigate('/profiles')} className="btn btn-ghost btn-sm gap-2 mb-6">
        <ArrowLeft size={16} />
        Back to Profiles
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-start gap-4">
                <div className="avatar placeholder">
                  <div className="flex justify-center items-center bg-neutral text-neutral-content rounded-full w-20">
                    <span className="text-2xl">{profile.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                </div>
                <div>
                  <h1 className="mb-2">{profile.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="badge badge-outline capitalize">{profile.age_group}</span>
                    <span className="badge badge-outline capitalize">{profile.gender}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Demographics</h2>
              <div className="space-y-3 mt-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/60">Age</span>
                  <span>{profile.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Gender</span>
                  <span className="capitalize">{profile.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Gender confidence</span>
                  <span>{(profile.gender_probability * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Country</span>
                  <span>{profile.country_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Country confidence</span>
                  <span>{(profile.country_probability * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Added</span>
                  <span>{new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

