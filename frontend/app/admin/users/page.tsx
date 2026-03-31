'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api/endpoints';

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  charity?: { name: string } | null;
  subscription?: { status: 'ACTIVE' | 'CANCELED' | 'EXPIRED' } | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.users();
      setUsers(res.data);
      setError('');
    } catch {
      setError('Unable to load users right now.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleStatus = async (user: AdminUser) => {
    try {
      await adminApi.updateUserStatus(user.id, { isActive: !user.isActive });
      setMessage(`${user.fullName} is now ${!user.isActive ? 'active' : 'inactive'}.`);
      await loadUsers();
    } catch {
      setError('Failed to update user status.');
    }
  };

  const totalAdmins = users.filter((user) => user.role === 'ADMIN').length;
  const activeUsers = users.filter((user) => user.isActive).length;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-4xl font-extrabold">User management</h1>
      <p className="mt-2 text-sm text-ink/70">Manage access state, monitor subscription status, and maintain account integrity.</p>
      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Total users</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">{users.length}</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Active users</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">{activeUsers}</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Admin accounts</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">{totalAdmins}</p>
        </article>
      </section>
      <div className="mt-8 space-y-3">
        {isLoading ? <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-700">Loading users...</p> : null}
        {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        {message ? <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-700">{message}</p> : null}
        {users.map((user) => (
          <article key={user.id} className="card flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{user.fullName}</p>
              <p className="text-sm text-ink/70">{user.email}</p>
              <p className="mt-1 text-xs text-ink/60">
                Joined {new Date(user.createdAt).toLocaleDateString()} • Subscription {user.subscription?.status ?? 'NONE'}
              </p>
              <p className="mt-1 text-xs text-ink/60">Charity: {user.charity?.name ?? 'Not selected'}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                {user.role} • {user.isActive ? 'Active' : 'Inactive'}
              </p>
              {user.role === 'USER' ? (
                <button className="btn-secondary px-3 py-2 text-xs" onClick={() => toggleStatus(user)}>
                  Mark {user.isActive ? 'Inactive' : 'Active'}
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
