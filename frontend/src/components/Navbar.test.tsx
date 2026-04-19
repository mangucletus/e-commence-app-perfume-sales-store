import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuthStore } from '../store/useAuthStore';

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
    expect(screen.getByText('Parfum')).toBeInTheDocument();
  });

  it('shows Login and Register when unauthenticated', () => {
    renderNavbar();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('does not show Cart, Orders or Logout when unauthenticated', () => {
    renderNavbar();
    expect(screen.queryByText('Cart')).not.toBeInTheDocument();
    expect(screen.queryByText('Orders')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('shows Cart, Orders and Logout when authenticated', () => {
    useAuthStore.setState({ token: 'tok', email: 'john@ex.com', firstName: 'John', lastName: 'Doe' });
    renderNavbar();
    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('greets authenticated user by first name', () => {
    useAuthStore.setState({ token: 'tok', email: 'john@ex.com', firstName: 'John', lastName: 'Doe' });
    renderNavbar();
    expect(screen.getByText('Hi, John')).toBeInTheDocument();
  });

  it('hides Login and Register when authenticated', () => {
    useAuthStore.setState({ token: 'tok', email: 'john@ex.com', firstName: 'John', lastName: 'Doe' });
    renderNavbar();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  it('logout clears auth state and navigates home', () => {
    useAuthStore.setState({ token: 'tok', email: 'john@ex.com', firstName: 'John', lastName: 'Doe' });
    renderNavbar();

    fireEvent.click(screen.getByText('Logout'));

    expect(useAuthStore.getState().token).toBeNull();
  });
});
