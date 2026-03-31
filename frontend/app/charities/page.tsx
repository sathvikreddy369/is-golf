'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar';
import { charityApi } from '@/lib/api/endpoints';
import { Charity } from '@/types/app';

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharities = async () => {
      setIsLoading(true);

      try {
        const res = await charityApi.list({
          search: search.trim() || undefined,
          category: category === 'all' ? undefined : category
        });

        setCharities(res.data);
        setError(null);
      } catch {
        setError('Unable to load charities right now. Please try again in a minute.');
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = window.setTimeout(loadCharities, 250);
    return () => window.clearTimeout(timeoutId);
  }, [search, category]);

  const categories = Array.from(new Set(charities.map((charity) => charity.category).filter(Boolean))) as string[];

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="font-display text-4xl font-extrabold">Charity directory</h1>
        <p className="mt-3 max-w-2xl text-sm text-ink/70">
          Discover verified impact partners, review upcoming initiatives, and select an organization that aligns with your subscription intent.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_220px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, location, or mission"
            className="rounded-xl border border-brand-100 bg-white px-4 py-3"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-brand-100 bg-white px-4 py-3"
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        {isLoading && <p className="mt-4 text-sm text-ink/70">Loading charities...</p>}
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {charities.map((charity) => (
            <article key={charity.id} className="card overflow-hidden p-0">
              <Image src={charity.image} alt={charity.name} width={800} height={400} className="h-40 w-full object-cover" />
              <div className="p-5">
                {charity.category ? (
                  <p className="inline-block rounded-full bg-brand-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-700">
                    {charity.category}
                  </p>
                ) : null}
                <h3 className="font-display text-xl font-bold">{charity.name}</h3>
                <p className="mt-2 text-sm text-ink/70">{charity.description}</p>
                {charity.impactMetric ? (
                  <p className="mt-3 rounded-lg bg-brand-50 p-2 text-xs font-semibold text-brand-800">{charity.impactMetric}</p>
                ) : null}
                {charity.upcomingEventTitle ? (
                  <p className="mt-3 text-xs text-ink/75">
                    Upcoming: <span className="font-semibold text-ink">{charity.upcomingEventTitle}</span>
                  </p>
                ) : null}
                <a href={charity.website} target="_blank" className="mt-4 inline-block text-sm font-semibold text-brand-700" rel="noreferrer">
                  Visit charity site
                </a>
              </div>
            </article>
          ))}
        </div>
        {!isLoading && !error && charities.length === 0 ? (
          <p className="mt-8 rounded-xl border border-brand-100 bg-white p-4 text-sm text-ink/70">
            No charities matched your filters. Try a different search or category.
          </p>
        ) : null}
      </section>
    </main>
  );
}
