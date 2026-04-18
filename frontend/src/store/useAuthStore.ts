import { create } from 'zustand';

interface AuthState {
  token: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  setAuth: (token: string, email: string, firstName: string, lastName: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  email: localStorage.getItem('email'),
  firstName: localStorage.getItem('firstName'),
  lastName: localStorage.getItem('lastName'),
  setAuth: (token, email, firstName, lastName) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    set({ token, email, firstName, lastName });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    set({ token: null, email: null, firstName: null, lastName: null });
  },
}));
