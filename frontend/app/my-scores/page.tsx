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

  return (
    <MemberLayout title="Score History" subtitle="Latest score entries that drive draw matching tiers.">
      <section className="space-y-4">
        {!scores && <CardSkeleton />}
        {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
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
