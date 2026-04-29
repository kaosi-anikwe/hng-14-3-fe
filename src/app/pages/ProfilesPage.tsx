import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import { queryKeys } from '../services/queryKeys'

const AGE_GROUPS = ['child', 'teen', 'adult', 'senior'] as const

export default function ProfilesPage() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    age_group: '',
    country_id: '',
  })

  const limit = 10

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.profiles.list({ page, limit, ...filters }),
    queryFn: () => api.getProfiles({ page, limit, ...filters }),
  })

  const profiles = data?.profiles ?? []
  const total = data?.total ?? 0
  const totalPages = data?.total_pages ?? 1

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1>Profiles</h1>
          <p className="text-base-content/60">{total} profiles found</p>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="input input-bordered flex items-center gap-2">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search profiles..."
                  className="grow"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            <select
              title="Filter by age group"
              className="select select-bordered w-full md:w-40"
              value={filters.age_group}
              onChange={(e) => handleFilterChange('age_group', e.target.value)}
            >
              <option value="">All Ages</option>
              {AGE_GROUPS.map(g => (
                <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="card bg-base-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Age Group</th>
                    <th>Country</th>
                    <th>Added</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map(profile => (
                    <tr key={profile.id} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                              <span className="text-xs">{profile.name.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                          </div>
                          <span>{profile.name}</span>
                        </div>
                      </td>
                      <td className="capitalize">{profile.gender}</td>
                      <td>{profile.age}</td>
                      <td>
                        <span className="badge badge-outline capitalize">{profile.age_group}</span>
                      </td>
                      <td>{profile.country_name}</td>
                      <td className="text-base-content/60 text-sm">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <Link to={`/profiles/${profile.id}`} className="btn btn-ghost btn-sm">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-base-content/60">
              Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
            </div>
            <div className="join">
              <button
                aria-label="Previous page"
                className="join-item btn btn-sm"
                disabled={page === 1}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  className={`join-item btn btn-sm ${page === pageNum ? 'btn-active' : ''}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
              <button
                aria-label="Next page"
                className="join-item btn btn-sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

