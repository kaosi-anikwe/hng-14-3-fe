import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { api, type Profile } from '../services/api'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Profile[]>([])
  const [searched, setSearched] = useState(false)

  const { mutate: runSearch, isPending } = useMutation({
    mutationFn: api.searchProfiles,
    onSuccess: (data) => {
      setResults(data)
      setSearched(true)
    },
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    runSearch(query)
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
                placeholder="Search by name, country..."
                className="input input-bordered join-item flex-1"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary join-item" disabled={isPending}>
                <Search size={18} />
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {isPending ? (
        <div className="flex items-center justify-center min-h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : searched ? (
        <div>
          <div className="mb-4">
            <h2>Search Results</h2>
            <p className="text-base-content/60">{results.length} profiles found</p>
          </div>

          {results.length === 0 ? (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body text-center py-12">
                <p className="text-base-content/60">No profiles found matching your search</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map(profile => (
                <div key={profile.id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body">
                    <div className="flex items-start gap-4">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-12">
                          <span className="text-sm">{profile.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="card-title text-lg">{profile.name}</h3>
                        <p className="text-sm text-base-content/60 capitalize">{profile.gender} · {profile.age_group}</p>
                        <p className="text-sm text-base-content/60">{profile.country_name}</p>

                        <div className="card-actions justify-end mt-4">
                          <Link to={`/profiles/${profile.id}`} className="btn btn-primary btn-sm">
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

