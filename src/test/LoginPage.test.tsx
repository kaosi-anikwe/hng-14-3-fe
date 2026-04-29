import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../app/pages/LoginPage';

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../app/contexts/AuthContext', () => ({
    useAuth: () => ({
        isAuthenticated: false,
        isLoading: false,
        login: mockLogin,
        logout: vi.fn(),
        user: null,
    }),
}));

describe('LoginPage', () => {
    it('renders the login page with branding', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>,
        );

        expect(screen.getByText('Insighta Labs+')).toBeInTheDocument();
        expect(screen.getByText('Profile Intelligence Platform')).toBeInTheDocument();
        expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument();
    });

    it('calls login when the GitHub button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>,
        );

        await user.click(screen.getByText('Sign in with GitHub'));
        expect(mockLogin).toHaveBeenCalledOnce();
    });
});
