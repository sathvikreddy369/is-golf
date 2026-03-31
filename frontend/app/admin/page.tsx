"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api/endpoints';

const links = [
  {
    href: '/admin/users',
    label: 'Users',
    description: 'Review member profiles, account status, and access state.'
  },
  {
    href: '/admin/draw',
    label: 'Draw management',
    description: 'Run simulations, publish draws, and maintain monthly cadence.'
  },
  {
    href: '/admin/charities',
    label: 'Charities',
    description: 'Manage charity listings, spotlight content, and media details.'
  },
  {
    href: '/admin/reports',
    label: 'Reports',
    description: 'Track users, pool totals, and contribution performance in one view.'
  }
];

interface Reports {
  totalUsers: number;
  totalRevenue: string;
  totalCharityContributions: string;
  drawCount: number;
}

export default function AdminHomePage() {
  const [reports, setReports] = useState<Reports | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .reports()
      .then((response) => {
        setReports(response.data);
        setError(null);
      })
      .catch(() => {
        setError('Unable to load admin summary right now.');
      });
  }, []);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-12">
      <section className="card bg-gradient-to-br from-white via-brand-50 to-white">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">Operations panel</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold">Admin command center</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/75">
          Manage the full platform lifecycle from member access and draw integrity to charity visibility and payout reporting.
          This panel is your operational source of truth for monthly execution.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Total users</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">{reports?.totalUsers ?? '--'}</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Revenue</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">{reports?.totalRevenue ?? '--'}</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Charity contributions</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">{reports?.totalCharityContributions ?? '--'}</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Draw cycles</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">{reports?.drawCount ?? '--'}</p>
        </article>
      </section>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="card hover:border-brand-500">
            <p className="text-lg font-semibold">{link.label}</p>
            <p className="mt-2 text-sm text-ink/70">{link.description}</p>
          </Link>
        ))}
      </section>

      <section className="card grid gap-6 md:grid-cols-2">
        <article>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">Recommended monthly workflow</p>
          <div className="mt-4 space-y-2 text-sm text-ink/75">
            <p>1. Confirm active subscriptions and user status changes.</p>
            <p>2. Validate latest score windows and run draw simulation.</p>
            <p>3. Publish official draw and monitor winner claims.</p>
            <p>4. Verify payouts and review charity contribution totals.</p>
          </div>
        </article>
        <article>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">Access and permissions</p>
          <div className="mt-4 space-y-2 text-sm text-ink/75">
            <p>Admin routes are protected by JWT authentication.</p>
            <p>Only ADMIN role can access user controls, draw actions, and reports.</p>
            <p>Winner verification and payout states are maintained as auditable records.</p>
            <p>Charity content updates are centralized to keep messaging consistent.</p>
          </div>
        </article>
      </section>
    </main>
  );
}
