import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { useAuthStore } from '../store/useAuthStore';

vi.mock('../api/auth', () => ({
  login: vi.fn(),
}));

import { login } from '../api/auth';
const mockLogin = vi.mocked(login);

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ token: null, email: null, firstName: null, lastName: null });
  });

  it('renders email and password inputs', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('renders link to register page', () => {
    renderLogin();
    expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument();
  });

  it('successful login sets auth and navigates home', async () => {
    mockLogin.mockResolvedValue({
      token: 'tok123',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
    });

    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('john@example.com', 'password123');
      expect(useAuthStore.getState().token).toBe('tok123');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message on failed login', async () => {
    mockLogin.mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } },
    });

    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('shows Signing in... while loading', async () => {
    mockLogin.mockImplementation(() => new Promise(() => {}));

    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Signing in...' })).toBeInTheDocument();
    });
  });
});
