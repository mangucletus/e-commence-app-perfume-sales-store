import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuthStore } from '../store/useAuthStore';

vi.mock('../store/useCartStore', () => ({
  useCartStore: vi.fn(() => ({ count: 0, fetchCount: vi.fn(), reset: vi.fn() })),
}));

function renderNavbar(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Navbar />
    </MemoryRouter>
  );
}

describe('Navbar', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, email: null, firstName: null, lastName: null });
  });

  it('shows brand logo', () => {
    renderNavbar();
    expect(screen.getByText('PARFUM')).toBeInTheDocument();
  });

  it('shows Sign in and Register when unauthenticated', () => {
    renderNavbar();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('does not show Orders or Sign out when unauthenticated', () => {
    renderNavbar();
    expect(screen.queryByText('Orders')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
  });

  it('shows Orders and Sign out when authenticated', () => {
    useAuthStore.setState({ token: 'tok', email: 'john@ex.com', firstName: 'John', lastName: 'Doe' });
    renderNavbar();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('greets authenticated user by first name', () => {
    useAuthStore.setState({ token: 'tok', email: 'john@ex.com', firstName: 'John', lastName: 'Doe' });
    renderNavbar();
    expect(screen.getByText('Hi, John')).toBeInTheDocument();
  });

  it('hides Sign in and Register when authenticated', () => {
    useAuthStore.setState({ token: 'tok', email: 'john@ex.com', firstName: 'John', lastName: 'Doe' });
    renderNavbar();
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  it('sign out clears auth state', () => {
    useAuthStore.setState({ token: 'tok', email: 'john@ex.com', firstName: 'John', lastName: 'Doe' });
    renderNavbar();
    fireEvent.click(screen.getByText('Sign out'));
    expect(useAuthStore.getState().token).toBeNull();
  });
});
