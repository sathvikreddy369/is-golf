'use client';

import { useState } from 'react';
import { charityApi } from '@/lib/api/endpoints';

export default function AdminCharitiesPage() {
  const [message, setMessage] = useState('');

  const createDemoCharity = async () => {
    await charityApi.create({
      name: `Community Trust ${Date.now()}`,
      description: 'Supports local social initiatives with transparent grant programs.',
      image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800',
      website: 'https://example.org/community-trust',
      active: true
    });

    setMessage('Charity created. Use API for full CRUD lifecycle management.');
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-4xl font-extrabold">Charity management</h1>
      <p className="mt-3 text-sm text-ink/70">Create, update, and activate/deactivate charity partners.</p>
      <button className="btn-primary mt-6" onClick={createDemoCharity}>
        Create sample charity
      </button>
      {message && <p className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">{message}</p>}
    </main>
  );
}
