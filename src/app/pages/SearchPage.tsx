import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import type { SearchParams } from '../services/api'
import { queryKeys } from '../services/queryKeys'
import ProfilesTable from '../components/ProfilesTable'

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Added' },
  { value: 'age', label: 'Age' },
  { value: 'gender_probability', label: 'Gender Probability' },
] as const
const LIMIT_OPTIONS = [10, 25, 50] as const

const EXAMPLE_QUERIES = [
  'females from Nigeria above 30',
  'male adults from France',
  'teenagers below 16',
  'adults from Germany with above 40',
]

type SortBy = SearchParams['sort_by']
type Order = SearchParams['order']

export default function SearchPage() {
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortBy>('created_at')
  const [order, setOrder] = useState<Order>('desc')
  const [limit, setLimit] = useState(10)

  const searchParams: SearchParams = { q: query, page, limit, sort_by: sortBy, order }

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.profiles.search(searchParams),
    queryFn: () => api.searchProfiles(searchParams),
    enabled: query.length > 0,
  })

  const results = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = data?.total_pages ?? 1

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setQuery(input.trim())
    setPage(1)
  }

  const handleExampleClick = (example: string) => {
    setInput(example)
    setQuery(example)
    setPage(1)
  }

  // Sliding pagination window
  const paginationPages = (() => {
    const windowSize = 5
    let start = Math.max(1, page - Math.floor(windowSize / 2))
    if (start + windowSize - 1 > totalPages) start = Math.max(1, totalPages - windowSize + 1)
    return Array.from({ length: Math.min(windowSize, totalPages) }, (_, i) => start + i)
  })()

  return (
    <div>
      <div className="mb-6">
        <h1>Search Profiles</h1>
        <p className="text-base-content/60">Use natural language to query across all profile data</p>
      </div>

      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="join w-full">
              <input
                type="text"
                placeholder="Describe what you're looking for..."
                className="input input-bordered join-item flex-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary join-item" disabled={isLoading}>
                <Search size={18} />
                Search
              </button>
            </div>
          </form>

          {/* Example queries */}
          {!query && (
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs text-base-content/40 flex items-center gap-1">
                <Sparkles size={12} /> Try:
              </span>
              {EXAMPLE_QUERIES.map(example => (
                <button
                  key={example}
                  className="badge badge-outline badge-sm cursor-pointer hover:badge-primary transition-colors"
                  onClick={() => handleExampleClick(example)}
                >
                  {example}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <>
          <div className="mb-4">
            <div className="skeleton h-6 w-36 mb-2"></div>
            <div className="skeleton h-4 w-28"></div>
          </div>
          <ProfilesTable profiles={[]} isLoading skeletonRows={6} />
        </>
      ) : query ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2>Search Results</h2>
              <p className="text-base-content/60">{total} profiles found</p>
            </div>

            {/* Sort & limit controls */}
            {results.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
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
                <span className="text-sm text-base-content/60 ml-2">Show</span>
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
              </div>
            )}
          </div>

          {results.length === 0 ? (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body text-center py-12">
                <p className="text-base-content/60">No profiles found matching your search</p>
              </div>
            </div>
          ) : (
            <>
              <ProfilesTable profiles={results} />
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
      ) : (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body text-center py-12">
            <Search size={48} className="mx-auto text-base-content/30 mb-4" />
            <p className="text-lg font-medium mb-1">Natural Language Search</p>
            <p className="text-base-content/60 max-w-md mx-auto">
              Describe the profiles you're looking for in plain English — filter by gender, age, country, and more.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

