import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ token: null, email: null, firstName: null, lastName: null });
  });

  it('initial state is null when localStorage is empty', () => {
    const { token, email, firstName, lastName } = useAuthStore.getState();
    expect(token).toBeNull();
    expect(email).toBeNull();
    expect(firstName).toBeNull();
    expect(lastName).toBeNull();
  });

  it('setAuth updates store state and persists to localStorage', () => {
    useAuthStore.getState().setAuth('tok123', 'john@example.com', 'John', 'Doe');

    const state = useAuthStore.getState();
    expect(state.token).toBe('tok123');
    expect(state.email).toBe('john@example.com');
    expect(state.firstName).toBe('John');
    expect(state.lastName).toBe('Doe');

    expect(localStorage.getItem('token')).toBe('tok123');
    expect(localStorage.getItem('email')).toBe('john@example.com');
    expect(localStorage.getItem('firstName')).toBe('John');
    expect(localStorage.getItem('lastName')).toBe('Doe');
  });

  it('logout clears store state and removes from localStorage', () => {
    useAuthStore.getState().setAuth('tok123', 'john@example.com', 'John', 'Doe');
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.email).toBeNull();
    expect(state.firstName).toBeNull();
    expect(state.lastName).toBeNull();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('email')).toBeNull();
  });

  it('setAuth can be called multiple times and overwrites previous values', () => {
    useAuthStore.getState().setAuth('tok1', 'a@example.com', 'Alice', 'Smith');
    useAuthStore.getState().setAuth('tok2', 'b@example.com', 'Bob', 'Jones');

    const state = useAuthStore.getState();
    expect(state.token).toBe('tok2');
    expect(state.email).toBe('b@example.com');
    expect(localStorage.getItem('token')).toBe('tok2');
  });
});
