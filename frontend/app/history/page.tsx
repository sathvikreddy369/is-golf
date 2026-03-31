'use client';

import { useEffect, useState } from 'react';
import { MemberLayout } from '@/components/layout/MemberLayout';
import { userApi } from '@/lib/api/endpoints';

interface HistoryState {
  scores: Array<{ id: string; value: number; date: string }>;
  payments: Array<{
    id: string;
    subscriptionAmount: string;
    charityContribution: string;
    poolContribution: string;
    status: 'CREATED' | 'SUCCESS' | 'FAILED';
    createdAt: string;
  }>;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryState>({ scores: [], payments: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    userApi
      .history()
      .then((res) => {
        setHistory({
          scores: res.data.scores ?? [],
          payments: res.data.payments ?? []
        });
        setError('');
      })
      .catch(() => setError('Unable to load activity history right now.'))
      .finally(() => setIsLoading(false));
  }, []);

  const totalContributed = history.payments.reduce(
    (acc, payment) => acc + Number(payment.charityContribution),
    0
  );

  return (
    <MemberLayout title="Activity History" subtitle="Review your score timeline and payment records.">
      {isLoading ? <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-700">Loading activity history...</p> : null}
      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Scores logged</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">{history.scores.length}</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Payments made</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">{history.payments.length}</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Total charity contribution</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">INR {totalContributed.toFixed(2)}</p>
        </article>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        <article className="card space-y-3">
          <h2 className="font-display text-2xl font-bold">Score timeline</h2>
          {history.scores.length ? (
            history.scores.map((score) => (
              <div key={score.id} className="rounded-xl border border-brand-100 p-3">
                <p className="font-semibold">Score {score.value}</p>
                <p className="text-xs text-ink/60">{new Date(score.date).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-ink/70">No score records yet.</p>
          )}
        </article>
        <article className="card space-y-3">
          <h2 className="font-display text-2xl font-bold">Payment timeline</h2>
          {history.payments.length ? (
            history.payments.map((payment) => (
              <div key={payment.id} className="rounded-xl border border-brand-100 p-3">
                <p className="font-semibold">INR {Number(payment.subscriptionAmount).toFixed(2)}</p>
                <p className="text-xs text-ink/60">
                  Charity: INR {Number(payment.charityContribution).toFixed(2)} • Pool: INR {Number(payment.poolContribution).toFixed(2)}
                </p>
                <p className="text-xs text-ink/60">
                  {payment.status} • {new Date(payment.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-ink/70">No payment records yet.</p>
          )}
        </article>
      </section>
    </MemberLayout>
  );
}
