import type { ProfilesParams } from './api'

export const queryKeys = {
    dashboard: {
        stats: () => ['dashboard', 'stats'] as const,
    },
    profiles: {
        all: () => ['profiles'] as const,
        list: (params: ProfilesParams) => ['profiles', 'list', params] as const,
        detail: (id: string) => ['profiles', 'detail', id] as const,
        search: (query: string) => ['profiles', 'search', query] as const,
    },
    user: {
        me: () => ['users', 'me'] as const,
    },
}
