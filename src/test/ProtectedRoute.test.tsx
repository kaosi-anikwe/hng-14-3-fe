import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

let mockAuth = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
};

vi.mock('../app/contexts/AuthContext', () => ({
    useAuth: () => mockAuth,
}));

import ProtectedRoute from '../app/components/ProtectedRoute';

describe('ProtectedRoute', () => {
    it('shows a loading spinner while auth is loading', () => {
        mockAuth = { ...mockAuth, isLoading: true, isAuthenticated: false };

        const { container } = render(
            <MemoryRouter>
                <ProtectedRoute />
            </MemoryRouter>,
        );

        expect(container.querySelector('.loading')).toBeInTheDocument();
    });

    it('redirects to /login when not authenticated', () => {
        mockAuth = { ...mockAuth, isLoading: false, isAuthenticated: false };

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<div>Dashboard</div>} />
                    </Route>
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    it('renders child routes when authenticated', () => {
        mockAuth = { ...mockAuth, isLoading: false, isAuthenticated: true };

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<div>Dashboard</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
});
