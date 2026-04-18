import api from './client';
import type { AuthResponse } from '../types';

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password }).then(r => r.data);

export const register = (email: string, password: string, firstName: string, lastName: string) =>
  api.post<AuthResponse>('/auth/register', { email, password, firstName, lastName }).then(r => r.data);
