import type { ProfilesParams, SearchParams } from './api'

export const queryKeys = {
    dashboard: {
        stats: () => ['dashboard', 'stats'] as const,
    },
    profiles: {
        all: () => ['profiles'] as const,
        list: (params: ProfilesParams) => ['profiles', 'list', params] as const,
        detail: (id: string) => ['profiles', 'detail', id] as const,
        search: (params: SearchParams) => ['profiles', 'search', params] as const,
    },
    user: {
        me: () => ['users', 'me'] as const,
    },
}
