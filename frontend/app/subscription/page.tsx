'use client';

import { useEffect, useState } from 'react';
import { MemberLayout } from '@/components/layout/MemberLayout';
import { subscriptionApi } from '@/lib/api/endpoints';

export default function SubscriptionPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscription, setSubscription] = useState<{
    planType: 'MONTHLY' | 'YEARLY';
    status: 'ACTIVE' | 'CANCELED' | 'EXPIRED';
    renewalDate: string;
  } | null>(null);

  const loadStatus = async () => {
    try {
      const response = await subscriptionApi.status();
      setSubscription(response.data);
      setError('');
    } catch {
      setSubscription(null);
      setError('Unable to load subscription status right now.');
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const choosePlan = async (planType: 'MONTHLY' | 'YEARLY') => {
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await subscriptionApi.create({
        planType,
        charityPercentage: 0.1,
        simulateSuccess: true
      });

      setMessage(`Simulated Razorpay order created: ${response.data.order.id}`);
      await loadStatus();
    } catch {
      setError('Subscription action failed. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelCurrentPlan = async () => {
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      await subscriptionApi.cancel();
      setMessage('Subscription canceled successfully. You can re-subscribe anytime.');
      await loadStatus();
    } catch {
      setError('Unable to cancel subscription right now.');
    } finally {
      setIsSubmitting(false);
    }
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
            <button className="btn-secondary mt-4" onClick={cancelCurrentPlan} disabled={isSubmitting}>
              Cancel plan
            </button>
          ) : null}
        </article>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="card">
            <h2 className="font-display text-xl font-bold">Monthly</h2>
            <p className="mt-2 text-sm text-ink/70">INR 29</p>
            <ul className="mt-3 space-y-1 text-xs text-ink/65">
              <li>Flexible monthly participation</li>
              <li>Standard draw eligibility</li>
              <li>Minimum 10% charity contribution</li>
            </ul>
            <button className="btn-primary mt-4" onClick={() => choosePlan('MONTHLY')} disabled={isSubmitting}>
              Choose monthly
            </button>
          </article>
          <article className="card">
            <h2 className="font-display text-xl font-bold">Yearly</h2>
            <p className="mt-2 text-sm text-ink/70">INR 299</p>
            <ul className="mt-3 space-y-1 text-xs text-ink/65">
              <li>Discounted annual pricing</li>
              <li>Long-term impact continuity</li>
              <li>No monthly renewal interruptions</li>
            </ul>
            <button className="btn-primary mt-4" onClick={() => choosePlan('YEARLY')} disabled={isSubmitting}>
              Choose yearly
            </button>
          </article>
        </div>
        {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        {message ? <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-700">{message}</p> : null}
      </section>
    </MemberLayout>
  );
}
