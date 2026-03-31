'use client';

import { useEffect, useState } from 'react';
import { CardSkeleton } from '@/components/skeletons/CardSkeleton';
import { MemberLayout } from '@/components/layout/MemberLayout';
import { scoreApi } from '@/lib/api/endpoints';

interface Score {
  id: string;
  value: number;
  date: string;
}

export default function MyScoresPage() {
  const [scores, setScores] = useState<Score[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadScores = async () => {
      try {
        const res = await scoreApi.list();
        setScores(res.data);
      } catch {
        setError('Unable to load score history right now.');
      }
    };

    loadScores();
  }, []);

  const highest = scores?.length ? Math.max(...scores.map((item) => item.value)) : 0;
  const latest = scores?.[0]?.value ?? 0;

  return (
    <MemberLayout title="Score History" subtitle="Latest score entries that drive draw matching tiers.">
      <section className="grid gap-4 md:grid-cols-3">
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Stored scores</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">{scores?.length ?? '--'}</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Latest score</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">{scores ? latest : '--'}</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Highest score</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">{scores ? highest : '--'}</p>
        </article>
      </section>
      <section className="space-y-4">
        {!scores && <CardSkeleton />}
        {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        {scores?.length === 0 ? <p className="rounded-xl bg-white p-3 text-sm text-ink/70">No scores yet. Add one from Enter Score to begin draw participation.</p> : null}
        {scores?.map((score) => (
          <article key={score.id} className="card flex items-center justify-between">
            <p className="font-semibold">Score: {score.value}</p>
            <p className="text-sm text-ink/70">{new Date(score.date).toLocaleDateString()}</p>
          </article>
        ))}
      </section>
    </MemberLayout>
  );
}
