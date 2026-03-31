'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api/endpoints';

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    adminApi.users().then((res) => setUsers(res.data));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-4xl font-extrabold">User management</h1>
      <div className="mt-8 space-y-3">
        {users.map((user) => (
          <article key={user.id} className="card flex items-center justify-between">
            <div>
              <p className="font-semibold">{user.fullName}</p>
              <p className="text-sm text-ink/70">{user.email}</p>
            </div>
            <p className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              {user.role} • {user.isActive ? 'Active' : 'Inactive'}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
