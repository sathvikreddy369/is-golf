'use client';

import { useState } from 'react';
import { charityApi } from '@/lib/api/endpoints';

export default function AdminCharitiesPage() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800');
  const [website, setWebsite] = useState('https://example.org/community-trust');
  const [impactMetric, setImpactMetric] = useState('');
  const [featured, setFeatured] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const createCharity = async () => {
    setMessage('');
    setError('');

    if (!name.trim() || !description.trim()) {
      setError('Name and description are required.');
      return;
    }

    setIsSaving(true);

    try {
      await charityApi.create({
        name: name.trim(),
        category: category.trim() || undefined,
        description: description.trim(),
        image: image.trim(),
        website: website.trim(),
        impactMetric: impactMetric.trim() || undefined,
        featured,
        active: true
      });

      setMessage('Charity created successfully.');
      setName('');
      setCategory('');
      setDescription('');
      setImpactMetric('');
      setFeatured(false);
    } catch {
      setError('Unable to create charity. Please verify URL fields and retry.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-4xl font-extrabold">Charity management</h1>
      <p className="mt-3 text-sm text-ink/70">Create, update, and activate/deactivate charity partners.</p>
      <section className="card mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Name</label>
          <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-brand-100 px-4 py-3" placeholder="Community Trust Foundation" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Category</label>
          <input value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-xl border border-brand-100 px-4 py-3" placeholder="Healthcare, Youth Development, Climate Action" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Description</label>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="w-full rounded-xl border border-brand-100 px-4 py-3" placeholder="Describe the mission and target outcomes." />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Image URL</label>
            <input value={image} onChange={(event) => setImage(event.target.value)} className="w-full rounded-xl border border-brand-100 px-4 py-3" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Website URL</label>
            <input value={website} onChange={(event) => setWebsite(event.target.value)} className="w-full rounded-xl border border-brand-100 px-4 py-3" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Impact metric</label>
            <input value={impactMetric} onChange={(event) => setImpactMetric(event.target.value)} className="w-full rounded-xl border border-brand-100 px-4 py-3" placeholder="2,000 families supported" />
          </div>
          <div className="flex items-center gap-3 pt-7">
            <input id="featured" type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
            <label htmlFor="featured" className="text-sm font-semibold text-ink/80">Set as featured charity</label>
          </div>
        </div>
        <button className="btn-primary" onClick={createCharity} disabled={isSaving}>
          {isSaving ? 'Creating...' : 'Create charity'}
        </button>
      </section>
      {error ? <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      {message && <p className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">{message}</p>}
    </main>
  );
}
