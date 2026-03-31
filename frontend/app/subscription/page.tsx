'use client';

import { useEffect, useState } from 'react';
import { MemberLayout } from '@/components/layout/MemberLayout';
import { subscriptionApi } from '@/lib/api/endpoints';

export default function SubscriptionPage() {
  const [message, setMessage] = useState('');
  const [subscription, setSubscription] = useState<{
    planType: 'MONTHLY' | 'YEARLY';
    status: 'ACTIVE' | 'CANCELED' | 'EXPIRED';
    renewalDate: string;
  } | null>(null);

  const loadStatus = async () => {
    try {
      const response = await subscriptionApi.status();
      setSubscription(response.data);
    } catch {
      setSubscription(null);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const choosePlan = async (planType: 'MONTHLY' | 'YEARLY') => {
    const response = await subscriptionApi.create({
      planType,
      charityPercentage: 0.1,
      simulateSuccess: true
    });

    setMessage(`Simulated Razorpay order created: ${response.data.order.id}`);
    await loadStatus();
  };

  const cancelCurrentPlan = async () => {
    await subscriptionApi.cancel();
    setMessage('Subscription canceled successfully. You can re-subscribe anytime.');
    await loadStatus();
  };

  return (
    <MemberLayout title="Subscription Management" subtitle="Choose, monitor, and update your active plan.">
      <section className="space-y-4">
        <article className="card">
          <h2 className="font-display text-xl font-bold">Current status</h2>
          <p className="mt-2 text-sm text-ink/70">
            {subscription
              ? `${subscription.planType} • ${subscription.status} • renews ${new Date(subscription.renewalDate).toLocaleDateString()}`
              : 'No active subscription found.'}
          </p>
          {subscription?.status === 'ACTIVE' ? (
            <button className="btn-secondary mt-4" onClick={cancelCurrentPlan}>
              Cancel plan
            </button>
          ) : null}
        </article>
        <article className="card">
          <h2 className="font-display text-xl font-bold">Monthly</h2>
          <p className="mt-2 text-sm text-ink/70">INR 29</p>
          <button className="btn-primary mt-4" onClick={() => choosePlan('MONTHLY')}>
            Choose monthly
          </button>
        </article>
        <article className="card">
          <h2 className="font-display text-xl font-bold">Yearly</h2>
          <p className="mt-2 text-sm text-ink/70">INR 299</p>
          <button className="btn-primary mt-4" onClick={() => choosePlan('YEARLY')}>
            Choose yearly
          </button>
        </article>
        {message && <p className="text-sm text-brand-700">{message}</p>}
      </section>
    </MemberLayout>
  );
}
