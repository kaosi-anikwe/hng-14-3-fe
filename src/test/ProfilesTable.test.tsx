import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ProfilesTable from '../app/components/ProfilesTable';
import type { Profile } from '../app/services/api';

const mockProfile: Profile = {
    id: '1',
    name: 'Jane Doe',
    gender: 'female',
    gender_probability: 0.95,
    age: 30,
    age_group: 'adult',
    country_id: 'NG',
    country_name: 'Nigeria',
    country_probability: 0.88,
    created_at: '2026-01-15T00:00:00Z',
};

describe('ProfilesTable', () => {
    it('renders skeleton rows when loading', () => {
        const { container } = render(
            <MemoryRouter>
                <ProfilesTable profiles={[]} isLoading skeletonRows={3} />
            </MemoryRouter>,
        );

        const skeletons = container.querySelectorAll('.skeleton');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders profile data', () => {
        render(
            <MemoryRouter>
                <ProfilesTable profiles={[mockProfile]} />
            </MemoryRouter>,
        );

        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('female')).toBeInTheDocument();
        expect(screen.getByText('30')).toBeInTheDocument();
        expect(screen.getByText('adult')).toBeInTheDocument();
        expect(screen.getByText('Nigeria')).toBeInTheDocument();
        expect(screen.getByText('View')).toBeInTheDocument();
    });

    it('renders initials in the avatar', () => {
        render(
            <MemoryRouter>
                <ProfilesTable profiles={[mockProfile]} />
            </MemoryRouter>,
        );

        expect(screen.getByText('JD')).toBeInTheDocument();
    });
});
