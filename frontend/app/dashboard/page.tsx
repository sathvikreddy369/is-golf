"use client";

import { useEffect, useState } from 'react';
import { ImpactChart } from '@/components/charts/ImpactChart';
import { MemberLayout } from '@/components/layout/MemberLayout';
import { drawApi, userApi } from '@/lib/api/endpoints';

interface DashboardState {
  scoreCount: number;
  paymentCount: number;
  totalContributed: number;
  latestDraw: number[];
}

export default function DashboardPage() {
  const [state, setState] = useState<DashboardState>({
    scoreCount: 0,
    paymentCount: 0,
    totalContributed: 0,
    latestDraw: []
  });

  useEffect(() => {
    const load = async () => {
      const [historyRes, drawRes] = await Promise.all([userApi.history(), drawApi.latest()]);
      const payments = historyRes.data.payments ?? [];
      const total = payments.reduce(
        (acc: number, payment: { subscriptionAmount: string | number }) =>
          acc + Number(payment.subscriptionAmount),
        0
      );

      setState({
        scoreCount: (historyRes.data.scores ?? []).length,
        paymentCount: payments.length,
        totalContributed: total,
        latestDraw: drawRes.data?.winningValues ?? []
      });
    };

    load();
  }, []);

  return (
    <MemberLayout
      title="Subscriber Overview"
      subtitle="Track contribution momentum, game activity, and upcoming draw signals."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="card">
          <p className="text-sm text-ink/70">Recent scores</p>
          <p className="mt-2 font-display text-4xl font-extrabold">{state.scoreCount}</p>
        </article>
        <article className="card">
          <p className="text-sm text-ink/70">Successful payments</p>
          <p className="mt-2 font-display text-4xl font-extrabold">{state.paymentCount}</p>
        </article>
        <article className="card">
          <p className="text-sm text-ink/70">Total contribution</p>
          <p className="mt-2 font-display text-4xl font-extrabold">INR {state.totalContributed.toFixed(2)}</p>
        </article>
      </section>
      <section className="card">
        <h2 className="font-display text-2xl font-bold">Latest draw values</h2>
        <p className="mt-3 text-sm text-ink/70">
          {state.latestDraw.length
            ? state.latestDraw.join(', ')
            : 'Draw values will appear once the latest result is published.'}
        </p>
      </section>
      <section>
        <ImpactChart />
      </section>
    </MemberLayout>
  );
}
