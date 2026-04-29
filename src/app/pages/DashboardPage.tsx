import { useQuery } from '@tanstack/react-query'
import { Users, TrendingUp } from 'lucide-react'
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

  const statCards = [
    {
      title: 'Total Profiles',
      value: stats?.total_profiles ?? 0,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'New This Month',
      value: stats?.new_this_month ?? 0,
      icon: TrendingUp,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1>Dashboard</h1>
        <p className="text-base-content/60">Overview of your profile intelligence system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base-content/60 text-sm">{stat.title}</p>
                  <p className="text-3xl mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

