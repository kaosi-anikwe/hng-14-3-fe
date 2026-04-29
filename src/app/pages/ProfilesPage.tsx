import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import { queryKeys } from '../services/queryKeys'
import ProfilesTable from '../components/ProfilesTable'

const AGE_GROUPS = ['child', 'teen', 'adult', 'senior'] as const

export default function ProfilesPage() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    age_group: '',
    country_id: '',
  })

  const limit = 10

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.profiles.list({ page, limit, ...filters }),
    queryFn: () => api.getProfiles({ page, limit, ...filters }),
  })

  const profiles = data?.data ?? []
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
        <>
          <ProfilesTable profiles={[]} isLoading skeletonRows={limit} />
          <div className="flex items-center justify-between mt-6">
            <div className="skeleton h-4 w-40"></div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="skeleton h-8 w-8 rounded"></div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <ProfilesTable profiles={profiles} />

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-base-content/60">
              Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
            </div>
            <div className="join">
              <button
                aria-label="Previous page"
                className="join-item btn btn-sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
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

