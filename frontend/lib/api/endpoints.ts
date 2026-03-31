import { api } from './client';

export const authApi = {
  register: (payload: {
    fullName: string;
    email: string;
    password: string;
    charityId?: string;
  }) => api.post('/auth/register', payload),
  login: (payload: { email: string; password: string }) => api.post('/auth/login', payload)
};

export const userApi = {
  profile: () => api.get('/user/profile'),
  updateProfile: (payload: { fullName?: string; charityId?: string; emailNotifications?: boolean }) => api.put('/user/profile', payload),
  history: () => api.get('/user/history'),
  winnings: () => api.get('/user/winnings')
};

export const subscriptionApi = {
  create: (payload: { planType: 'MONTHLY' | 'YEARLY'; charityPercentage: number; simulateSuccess: boolean }) =>
    api.post('/subscription/create', payload),
  status: () => api.get('/subscription/status'),
  cancel: () => api.patch('/subscription/cancel')
};

export const scoreApi = {
  create: (payload: { value: number; date: string }) => api.post('/scores', payload),
  list: () => api.get('/scores')
};

export const drawApi = {
  latest: () => api.get('/draw/latest'),
  run: (payload: { mode: 'RANDOM' | 'WEIGHTED'; simulation: boolean }) => api.post('/draw/run', payload)
};

export const charityApi = {
  list: (params?: { search?: string; category?: string; featured?: boolean }) => api.get('/charities', { params }),
  create: (payload: {
    name: string;
    category?: string;
    description: string;
    image: string;
    website: string;
    featured?: boolean;
    location?: string;
    upcomingEventTitle?: string;
    upcomingEventDate?: string;
    impactMetric?: string;
    active: boolean;
  }) => api.post('/charities', payload)
};

export const adminApi = {
  users: () => api.get('/admin/users'),
  reports: () => api.get('/admin/reports'),
  updateUserStatus: (id: string, payload: { isActive: boolean }) => api.patch(`/admin/users/${id}/status`, payload)
};
