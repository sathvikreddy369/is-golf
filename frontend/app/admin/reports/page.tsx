'use client';

import { useEffect, useState } from 'react';
import { ImpactChart } from '@/components/charts/ImpactChart';
import { adminApi } from '@/lib/api/endpoints';

interface Reports {
  totalUsers: number;
  totalRevenue: string;
  totalCharityContributions: string;
  drawCount: number;
  drawStats: Array<{ drawId: string; date: string; poolAmount: number; winners: number }>;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Reports | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .reports()
      .then((res) => {
        setReports(res.data);
        setError('');
      })
      .catch(() => setError('Unable to load report data right now.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-12">
      <h1 className="font-display text-4xl font-extrabold">Reports</h1>
      {isLoading ? <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-700">Loading reports...</p> : null}
      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-4">
        <article className="card"><p className="text-sm">Total users</p><p className="mt-2 text-3xl font-bold">{reports?.totalUsers ?? '--'}</p></article>
        <article className="card"><p className="text-sm">Revenue</p><p className="mt-2 text-3xl font-bold">{reports?.totalRevenue ?? '--'}</p></article>
        <article className="card"><p className="text-sm">Charity contributions</p><p className="mt-2 text-3xl font-bold">{reports?.totalCharityContributions ?? '--'}</p></article>
        <article className="card"><p className="text-sm">Draw count</p><p className="mt-2 text-3xl font-bold">{reports?.drawCount ?? '--'}</p></article>
      </div>
      <section className="card">
        <h2 className="font-display text-2xl font-bold">Published draw statistics</h2>
        <div className="mt-4 space-y-3">
          {reports?.drawStats?.length ? (
            reports.drawStats.map((item) => (
              <div key={item.drawId} className="rounded-xl border border-brand-100 p-3 text-sm text-ink/75">
                <p className="font-semibold text-ink">Draw {item.drawId.slice(0, 10)}...</p>
                <p className="mt-1">
                  Date {new Date(item.date).toLocaleDateString()} • Pool INR {item.poolAmount.toFixed(2)} • Winners {item.winners}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-ink/70">No published draw statistics yet.</p>
          )}
        </div>
      </section>
      <ImpactChart />
    </main>
  );
}
