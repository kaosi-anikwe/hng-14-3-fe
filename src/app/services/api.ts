import axios, { isAxiosError } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // HTTP-only cookies are sent automatically
  headers: {
    'X-API-Version': '1',
  },
})

// --- Error toast bridge ---
// The interceptor runs outside React, so we use a simple subscriber.
type ErrorHandler = (message: string) => void
let errorHandler: ErrorHandler | null = null

export function setApiErrorHandler(handler: ErrorHandler | null) {
  errorHandler = handler
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      const msg: string =
        error.response?.data?.message ??
        error.message ??
        'An unexpected error occurred'

      // Don't toast auth-refresh failures (the refresh interceptor handles those)
      const url: string = error.config?.url ?? ''
      const is401 = error.response?.status === 401
      if (!(is401 && url.startsWith('/auth/'))) {
        errorHandler?.(msg)
      }
    }
    return Promise.reject(error)
  },
)

// --- Refresh interceptor ---

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(undefined)
  })
  failedQueue = []
}

let refreshInterceptorAdded = false

export function setupRefreshInterceptor(onUnauthenticated: () => void) {
  if (refreshInterceptorAdded) return
  refreshInterceptorAdded = true

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config as typeof error.config & { _retry?: boolean }

      // Don't retry auth endpoints or non-401 errors
      const url: string = original.url ?? ''
      if (
        error.response?.status !== 401 ||
        original._retry ||
        url.startsWith('/auth/')
      ) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => apiClient(original))
          .catch((err) => Promise.reject(err))
      }

      original._retry = true
      isRefreshing = true

      try {
        // Cookies are sent automatically; body is required by the endpoint
        await apiClient.post('/auth/refresh', {})
        processQueue(null)
        return apiClient(original)
      } catch (refreshError) {
        processQueue(refreshError)
        onUnauthenticated()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    },
  )
}

export interface User {
  id: string
  github_id: string
  username: string
  email: string
  avatar_url: string
  role: 'admin' | 'analyst'
  is_active: boolean
  last_login_at: string
}

export interface Profile {
  id: string
  name: string
  gender: string
  gender_probability: number
  age: number
  age_group: 'child' | 'teenager' | 'adult' | 'senior'
  country_id: string
  country_name: string
  country_probability: number
  created_at: string
}

export interface TopCountry {
  country_id: string
  country_name: string
  count: number
}

export interface ProfileSummary {
  id: string
  name: string
  gender: string
  age: number
  age_group: string
  country_id: string
  created_at: string
}

export interface DashboardStats {
  total_profiles: number
  gender_breakdown: Record<string, number>
  age_group_breakdown: Record<string, number>
  top_countries: TopCountry[]
  averages: {
    age: string | null
    gender_probability: number | null
    country_probability: number | null
  }
  recent_profiles: ProfileSummary[]
}

export interface ProfilesParams {
  page?: number
  limit?: number
  gender?: string
  age_group?: string
  country_id?: string
  min_age?: number
  max_age?: number
  min_gender_probability?: number
  min_country_probability?: number
  sort_by?: 'age' | 'created_at' | 'gender_probability'
  order?: 'asc' | 'desc'
}

export interface SearchParams {
  q: string
  page?: number
  limit?: number
  sort_by?: 'age' | 'created_at' | 'gender_probability'
  order?: 'asc' | 'desc'
}

export interface ProfilesResponse {
  data: Profile[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export const api = {
  getDashboardStats: () =>
    apiClient
      .get<{ status: string; dashboard: DashboardStats }>('/api/dashboard')
      .then((r) => r.data.dashboard),

  getProfiles: (params: ProfilesParams) =>
    apiClient.get<ProfilesResponse>('/api/profiles', { params }).then((r) => r.data),

  getProfile: (id: string) =>
    apiClient
      .get<{ data: Profile }>(`/api/profiles/${id}`)
      .then((r) => r.data.data),

  searchProfiles: (params: SearchParams) =>
    apiClient
      .get<ProfilesResponse>('/api/profiles/search', { params })
      .then((r) => r.data),

  logout: () => apiClient.post('/auth/logout'),

  // Skip the refresh interceptor — a 401 here means no session exists yet
  getMe: () =>
    apiClient
      .get<{ user: User }>('/api/users/me', { _retry: true } as object)
      .then((r) => r.data.user),
}
