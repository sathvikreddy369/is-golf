import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/services/auth.service', () => ({
  registerUser: vi.fn(async () => ({
    token: 'token',
    user: { id: 'u1', email: 'user@example.com', fullName: 'User One', role: 'USER' }
  })),
  loginUser: vi.fn(async () => ({
    token: 'token',
    user: { id: 'u1', email: 'user@example.com', fullName: 'User One', role: 'USER' }
  }))
}));

import app from '../src/app';

describe('auth routes', () => {
  it('POST /api/auth/register returns 201 for valid payload', async () => {
    const response = await request(app).post('/api/auth/register').send({
      fullName: 'User One',
      email: 'user@example.com',
      password: 'password123'
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('POST /api/auth/login returns 400 for invalid payload', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'bad-email',
      password: '123'
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Validation failed');
  });
});
