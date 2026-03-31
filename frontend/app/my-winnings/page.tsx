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

  useEffect(() => {
    userApi.winnings().then((res) => setWinnings(res.data));
  }, []);

  return (
    <MemberLayout title="Winnings & Payouts" subtitle="Track winner verification and payout progress for each draw.">
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
