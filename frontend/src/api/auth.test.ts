import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./client', () => ({
  default: { post: vi.fn() },
}));

import { login, register } from './auth';
import api from './client';

const mockPost = vi.mocked(api.post);

describe('auth API', () => {
  const mockResponse = {
    token: 'tok123',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  beforeEach(() => {
    mockPost.mockResolvedValue({ data: mockResponse });
  });

  it('login posts to /auth/login with credentials', async () => {
    const result = await login('john@example.com', 'password123');

    expect(mockPost).toHaveBeenCalledWith('/auth/login', {
      email: 'john@example.com',
      password: 'password123',
    });
    expect(result.token).toBe('tok123');
    expect(result.email).toBe('john@example.com');
  });

  it('register posts to /auth/register with all fields', async () => {
    const result = await register('john@example.com', 'password123', 'John', 'Doe');

    expect(mockPost).toHaveBeenCalledWith('/auth/register', {
      email: 'john@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    });
    expect(result.firstName).toBe('John');
  });

  it('login rejects when API returns error', async () => {
    mockPost.mockRejectedValue(new Error('Network error'));

    await expect(login('john@example.com', 'wrong')).rejects.toThrow('Network error');
  });
});
