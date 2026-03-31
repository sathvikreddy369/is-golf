"use client";

import { useEffect, useState } from 'react';
import { MemberLayout } from '@/components/layout/MemberLayout';
import { userApi } from '@/lib/api/endpoints';

interface WinningsItem {
  id: string;
  tier: 'MATCH_3' | 'MATCH_4' | 'MATCH_5';
  amount: string;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  payoutStatus: 'PENDING' | 'PAID';
  drawDate: string | null;
}

export default function MyWinningsPage() {
  const [winnings, setWinnings] = useState<WinningsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    userApi
      .winnings()
      .then((res) => {
        setWinnings(res.data);
        setError('');
      })
      .catch(() => setError('Unable to load winnings right now.'))
      .finally(() => setIsLoading(false));
  }, []);

  const totalWon = winnings.reduce((acc, item) => acc + Number(item.amount), 0);
  const paidCount = winnings.filter((item) => item.payoutStatus === 'PAID').length;

  return (
    <MemberLayout title="Winnings & Payouts" subtitle="Track winner verification and payout progress for each draw.">
      {isLoading ? <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-700">Loading winnings...</p> : null}
      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Winning entries</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">{winnings.length}</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Total won</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">INR {totalWon.toFixed(2)}</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Paid payouts</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">{paidCount}</p>
        </article>
      </section>
      <section className="space-y-4">
        {winnings.length === 0 ? (
          <article className="card">
            <p className="text-sm text-ink/70">No winnings yet. Keep your scores updated for upcoming draws.</p>
          </article>
        ) : (
          winnings.map((item) => (
            <article key={item.id} className="card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-xl font-bold">{item.tier.replace('_', ' ')}</h2>
                <p className="text-sm font-semibold">INR {Number(item.amount).toFixed(2)}</p>
              </div>
              <p className="mt-2 text-sm text-ink/70">
                Draw date: {item.drawDate ? new Date(item.drawDate).toLocaleDateString() : 'N/A'}
              </p>
              <p className="mt-1 text-xs text-ink/60">
                Verification: {item.verificationStatus} • Payout: {item.payoutStatus}
              </p>
            </article>
          ))
        )}
      </section>
    </MemberLayout>
  );
}
