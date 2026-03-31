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

  useEffect(() => {
    userApi.history().then((res) => {
      setHistory({
        scores: res.data.scores ?? [],
        payments: res.data.payments ?? []
      });
    });
  }, []);

  return (
    <MemberLayout title="Activity History" subtitle="Review your score timeline and payment records.">
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
