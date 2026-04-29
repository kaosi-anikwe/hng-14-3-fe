import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Users, BarChart3, Globe, Calculator } from 'lucide-react'
import { api } from '../services/api'
import { queryKeys } from '../services/queryKeys'

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: api.getDashboardStats,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1>Dashboard</h1>
        <p className="text-base-content/60">Overview of your profile intelligence system</p>
      </div>

      {/* Total Profiles */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body flex-row items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Users className="text-primary" size={24} />
          </div>
          <div>
            <p className="text-base-content/60 text-sm">Total Profiles</p>
            <p className="text-3xl">{stats?.total_profiles ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gender Breakdown */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base">
              <BarChart3 size={18} /> Gender Breakdown
            </h2>
            <div className="space-y-3 mt-2">
              {stats?.gender_breakdown && Object.entries(stats.gender_breakdown).map(([gender, count]) => {
                const pct = stats.total_profiles ? Math.round((count / stats.total_profiles) * 100) : 0
                const colorClass = gender === 'male' ? 'progress-primary' : 'progress-secondary'
                return (
                  <div key={gender}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{gender}</span>
                      <span>{count} ({pct}%)</span>
                    </div>
                    <progress
                      className={`progress ${colorClass} w-full`}
                      value={pct}
                      max={100}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Age Group Breakdown */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base">
              <BarChart3 size={18} /> Age Groups
            </h2>
            <div className="space-y-3 mt-2">
              {stats?.age_group_breakdown && Object.entries(stats.age_group_breakdown).map(([group, count]) => {
                const pct = stats.total_profiles ? Math.round((count / stats.total_profiles) * 100) : 0
                return (
                  <div key={group}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{group}</span>
                      <span>{count} ({pct}%)</span>
                    </div>
                    <progress
                      className="progress progress-info w-full"
                      value={pct}
                      max={100}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Countries */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base">
              <Globe size={18} /> Top Countries
            </h2>
            <div className="overflow-x-auto mt-2">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Country</th>
                    <th>Code</th>
                    <th className="text-right">Profiles</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.top_countries?.map((c) => (
                    <tr key={c.country_id}>
                      <td>{c.country_name}</td>
                      <td className="uppercase text-base-content/60">{c.country_id}</td>
                      <td className="text-right">{c.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Averages */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base">
              <Calculator size={18} /> Averages
            </h2>
            <div className="grid grid-cols-1 gap-4 mt-2">
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title">Age</div>
                <div className="stat-value text-2xl">{stats?.averages?.age ?? '—'}</div>
              </div>
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title">Gender Probability</div>
                <div className="stat-value text-2xl">
                  {stats?.averages?.gender_probability != null
                    ? `${(stats.averages.gender_probability * 100).toFixed(1)}%`
                    : '—'}
                </div>
              </div>
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title">Country Probability</div>
                <div className="stat-value text-2xl">
                  {stats?.averages?.country_probability != null
                    ? `${(stats.averages.country_probability * 100).toFixed(1)}%`
                    : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Profiles */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base">Recent Profiles</h2>
          <div className="overflow-x-auto mt-2">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Country</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recent_profiles?.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link to={`/profiles/${p.id}`} className="link link-hover link-primary">
                        {p.name}
                      </Link>
                    </td>
                    <td className="capitalize">{p.gender}</td>
                    <td>{p.age}</td>
                    <td className="uppercase">{p.country_id}</td>
                    <td className="text-base-content/60">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

