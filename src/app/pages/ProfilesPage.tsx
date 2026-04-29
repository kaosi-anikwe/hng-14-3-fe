import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import type { ProfilesParams } from '../services/api'
import { queryKeys } from '../services/queryKeys'
import ProfilesTable from '../components/ProfilesTable'

const AGE_GROUPS = ['child', 'teenager', 'adult', 'senior'] as const
const GENDERS = ['male', 'female'] as const
const SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Added' },
  { value: 'age', label: 'Age' },
  { value: 'gender_probability', label: 'Gender Probability' },
] as const
const LIMIT_OPTIONS = [10, 25, 50] as const

type SortBy = ProfilesParams['sort_by']
type Order = ProfilesParams['order']

export default function ProfilesPage() {
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    gender: '',
    age_group: '',
    country_id: '',
    min_age: '',
    max_age: '',
    min_gender_probability: '',
    min_country_probability: '',
  })
  const [sortBy, setSortBy] = useState<SortBy>('created_at')
  const [order, setOrder] = useState<Order>('desc')
  const [limit, setLimit] = useState(10)

  // Build params, omitting empty strings
  const params: ProfilesParams = { page, limit, sort_by: sortBy, order }
  if (filters.gender) params.gender = filters.gender
  if (filters.age_group) params.age_group = filters.age_group
  if (filters.country_id) params.country_id = filters.country_id
  if (filters.min_age) params.min_age = Number(filters.min_age)
  if (filters.max_age) params.max_age = Number(filters.max_age)
  if (filters.min_gender_probability) params.min_gender_probability = Number(filters.min_gender_probability)
  if (filters.min_country_probability) params.min_country_probability = Number(filters.min_country_probability)

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.profiles.list(params),
    queryFn: () => api.getProfiles(params),
  })

  const profiles = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = data?.total_pages ?? 1

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }, [])

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const clearFilters = useCallback(() => {
    setFilters({
      gender: '',
      age_group: '',
      country_id: '',
      min_age: '',
      max_age: '',
      min_gender_probability: '',
      min_country_probability: '',
    })
    setPage(1)
  }, [])

  // Sliding pagination window
  const paginationPages = (() => {
    const windowSize = 5
    let start = Math.max(1, page - Math.floor(windowSize / 2))
    if (start + windowSize - 1 > totalPages) start = Math.max(1, totalPages - windowSize + 1)
    return Array.from({ length: Math.min(windowSize, totalPages) }, (_, i) => start + i)
  })()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1>Profiles</h1>
          <p className="text-base-content/60">{total} profiles found</p>
        </div>
        <button
          className={`btn btn-sm gap-2 ${showFilters ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setShowFilters(v => !v)}
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="badge badge-sm badge-secondary">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Sort & limit bar — always visible */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-sm text-base-content/60">Sort by</span>
        <select
          title="Sort field"
          className="select select-bordered select-sm w-44"
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value as SortBy); setPage(1) }}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          title="Sort order"
          className="select select-bordered select-sm w-28"
          value={order}
          onChange={(e) => { setOrder(e.target.value as Order); setPage(1) }}
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-base-content/60">Show</span>
          <select
            title="Results per page"
            className="select select-bordered select-sm w-20"
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1) }}
          >
            {LIMIT_OPTIONS.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span className="text-sm text-base-content/60">per page</span>
        </div>
      </div>

      {/* Collapsible filter panel */}
      {showFilters && (
        <div className="card bg-base-100 shadow-sm mb-6">
          <div className="card-body gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Filter Profiles</h3>
              {activeFilterCount > 0 && (
                <button className="btn btn-ghost btn-xs gap-1" onClick={clearFilters}>
                  <X size={14} /> Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Gender */}
              <div className="form-control">
                <label className="label"><span className="label-text text-xs">Gender</span></label>
                <select
                  title="Filter by gender"
                  className="select select-bordered select-sm"
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                >
                  <option value="">All</option>
                  {GENDERS.map(g => (
                    <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Age group */}
              <div className="form-control">
                <label className="label"><span className="label-text text-xs">Age Group</span></label>
                <select
                  title="Filter by age group"
                  className="select select-bordered select-sm"
                  value={filters.age_group}
                  onChange={(e) => handleFilterChange('age_group', e.target.value)}
                >
                  <option value="">All</option>
                  {AGE_GROUPS.map(g => (
                    <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Country */}
              <div className="form-control">
                <label className="label"><span className="label-text text-xs">Country Code</span></label>
                <input
                  type="text"
                  placeholder="e.g. NG, US"
                  className="input input-bordered input-sm uppercase"
                  maxLength={2}
                  value={filters.country_id}
                  onChange={(e) => handleFilterChange('country_id', e.target.value.toUpperCase())}
                />
              </div>

              {/* Age range */}
              <div className="form-control">
                <label className="label"><span className="label-text text-xs">Age Range</span></label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="input input-bordered input-sm w-full"
                    min={0}
                    max={120}
                    value={filters.min_age}
                    onChange={(e) => handleFilterChange('min_age', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="input input-bordered input-sm w-full"
                    min={0}
                    max={120}
                    value={filters.max_age}
                    onChange={(e) => handleFilterChange('max_age', e.target.value)}
                  />
                </div>
              </div>

              {/* Min gender probability */}
              <div className="form-control">
                <label className="label"><span className="label-text text-xs">Min Gender Probability</span></label>
                <input
                  type="number"
                  placeholder="0.0 – 1.0"
                  className="input input-bordered input-sm"
                  min={0}
                  max={1}
                  step={0.05}
                  value={filters.min_gender_probability}
                  onChange={(e) => handleFilterChange('min_gender_probability', e.target.value)}
                />
              </div>

              {/* Min country probability */}
              <div className="form-control">
                <label className="label"><span className="label-text text-xs">Min Country Probability</span></label>
                <input
                  type="number"
                  placeholder="0.0 – 1.0"
                  className="input input-bordered input-sm"
                  min={0}
                  max={1}
                  step={0.05}
                  value={filters.min_country_probability}
                  onChange={(e) => handleFilterChange('min_country_probability', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

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

          {totalPages > 1 && (
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
                {paginationPages.map(pageNum => (
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
          )}
        </>
      )}
    </div>
  )
}

