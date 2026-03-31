'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar';
import { charityApi } from '@/lib/api/endpoints';

interface Charity {
  id: string;
  name: string;
  description: string;
  image: string;
  website: string;
}

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharities = async () => {
      try {
        const res = await charityApi.list();
        setCharities(res.data);
      } catch {
        setError('Unable to load charities right now. Please try again in a minute.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCharities();
  }, []);

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="font-display text-4xl font-extrabold">Featured charities</h1>
        {isLoading && <p className="mt-4 text-sm text-ink/70">Loading charities...</p>}
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {charities.map((charity) => (
            <article key={charity.id} className="card overflow-hidden p-0">
              <Image src={charity.image} alt={charity.name} width={800} height={400} className="h-40 w-full object-cover" />
              <div className="p-5">
                <h3 className="font-display text-xl font-bold">{charity.name}</h3>
                <p className="mt-2 text-sm text-ink/70">{charity.description}</p>
                <a href={charity.website} target="_blank" className="mt-4 inline-block text-sm font-semibold text-brand-700" rel="noreferrer">
                  Visit charity site
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
