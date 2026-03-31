'use client';

import { useEffect, useState } from 'react';
import { ImpactChart } from '@/components/charts/ImpactChart';
import { adminApi } from '@/lib/api/endpoints';

interface Reports {
  totalUsers: number;
  totalRevenue: string;
  totalCharityContributions: string;
  drawCount: number;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Reports | null>(null);

  useEffect(() => {
    adminApi.reports().then((res) => setReports(res.data));
  }, []);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-12">
      <h1 className="font-display text-4xl font-extrabold">Reports</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <article className="card"><p className="text-sm">Total users</p><p className="mt-2 text-3xl font-bold">{reports?.totalUsers ?? '--'}</p></article>
        <article className="card"><p className="text-sm">Revenue</p><p className="mt-2 text-3xl font-bold">{reports?.totalRevenue ?? '--'}</p></article>
        <article className="card"><p className="text-sm">Charity contributions</p><p className="mt-2 text-3xl font-bold">{reports?.totalCharityContributions ?? '--'}</p></article>
        <article className="card"><p className="text-sm">Draw count</p><p className="mt-2 text-3xl font-bold">{reports?.drawCount ?? '--'}</p></article>
      </div>
      <ImpactChart />
    </main>
  );
}
