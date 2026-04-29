import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import { queryKeys } from '../services/queryKeys'
import ProfilesTable from '../components/ProfilesTable'

export default function SearchPage() {
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10

  const searchParams = { q: query, page, limit }

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

  return (
    <div>
      <div className="mb-8">
        <h1>Search Profiles</h1>
        <p className="text-base-content/60">Search across all profile data</p>
      </div>

      <div className="card bg-base-100 shadow-sm mb-8">
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="join w-full">
              <input
                type="text"
                placeholder="e.g. females from nigeria above 30"
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
          <div className="mb-4">
            <h2>Search Results</h2>
            <p className="text-base-content/60">{total} profiles found</p>
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
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let start = Math.max(1, page - 2)
                      if (start + 4 > totalPages) start = Math.max(1, totalPages - 4)
                      const pageNum = start + i
                      if (pageNum > totalPages) return null
                      return (
                        <button
                          key={pageNum}
                          className={`join-item btn btn-sm ${page === pageNum ? 'btn-active' : ''}`}
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
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
            <p className="text-base-content/60">Enter a search query to find profiles</p>
          </div>
        </div>
      )}
    </div>
  )
}

