"use client";

import { useEffect, useState } from 'react';
import { MemberLayout } from '@/components/layout/MemberLayout';
import { useAuth } from '@/components/auth/AuthProvider';
import { charityApi, userApi } from '@/lib/api/endpoints';
import { Charity } from '@/types/app';

export default function SettingsPage() {
  const { user, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [charityId, setCharityId] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [participation, setParticipation] = useState({
    scores: 0,
    drawsEntered: 0,
    totalContribution: 0
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setFullName(user?.fullName ?? '');
    setCharityId(user?.charityId ?? '');
    setEmailNotifications(user?.emailNotifications ?? true);
  }, [user]);

  useEffect(() => {
    charityApi
      .list()
      .then((res) => setCharities(res.data))
      .catch(() => setCharities([]));

    userApi
      .history()
      .then((res) => {
        const scores = res.data.scores ?? [];
        const payments = res.data.payments ?? [];
        const totalContribution = payments.reduce(
          (acc: number, payment: { charityContribution: string | number }) => acc + Number(payment.charityContribution),
          0
        );

        setParticipation({
          scores: scores.length,
          drawsEntered: payments.length,
          totalContribution
        });
      })
      .catch(() => {
        setParticipation({ scores: 0, drawsEntered: 0, totalContribution: 0 });
      });
  }, []);

  const saveProfile = async () => {
    setMessage('');
    setError('');

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    try {
      await userApi.updateProfile({
        fullName: fullName.trim(),
        charityId: charityId || undefined,
        emailNotifications
      });
      await refreshProfile();
      setMessage('Profile updated successfully.');
    } catch {
      setError('Unable to update profile right now. Please retry.');
    }
  };

  const selectedCharity = charities.find((charity) => charity.id === charityId) ?? user?.charity;

  return (
    <MemberLayout
      title="Profile Management"
      subtitle="Keep account identity, charity intent, and system notifications aligned with your monthly participation."
    >
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Subscription</p>
          <p className="mt-2 font-display text-2xl font-bold text-brand-700">{user?.subscription?.status ?? 'INACTIVE'}</p>
          <p className="mt-1 text-xs text-ink/65">
            Renewal: {user?.subscription?.renewalDate ? new Date(user.subscription.renewalDate).toLocaleDateString() : 'Not available'}
          </p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Draw entries</p>
          <p className="mt-2 font-display text-2xl font-bold text-brand-700">{participation.drawsEntered}</p>
          <p className="mt-1 text-xs text-ink/65">Based on successful subscription payments</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Charity contribution</p>
          <p className="mt-2 font-display text-2xl font-bold text-brand-700">INR {participation.totalContribution.toFixed(2)}</p>
          <p className="mt-1 text-xs text-ink/65">Cumulative amount routed to charity</p>
        </article>
      </section>

      <section className="card space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Full name</label>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full rounded-xl border border-brand-100 px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Charity</label>
          <select
            value={charityId}
            onChange={(event) => setCharityId(event.target.value)}
            className="w-full rounded-xl border border-brand-100 px-4 py-3"
          >
            <option value="">No charity selected</option>
            {charities.map((charity) => (
              <option key={charity.id} value={charity.id}>
                {charity.name}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-800">Email notifications</p>
              <p className="mt-1 text-xs text-brand-700">
                Receive draw results, payout updates, and subscription reminders.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEmailNotifications((current) => !current)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                emailNotifications ? 'bg-brand-600 text-white' : 'bg-white text-ink/70'
              }`}
            >
              {emailNotifications ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
        <button onClick={saveProfile} className="btn-primary">
          Save profile
        </button>
        {selectedCharity ? (
          <article className="rounded-xl border border-brand-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Preferred charity</p>
            <h3 className="mt-2 font-display text-xl font-bold">{selectedCharity.name}</h3>
            <p className="mt-2 text-sm text-ink/70">{selectedCharity.description}</p>
            {selectedCharity.upcomingEventTitle ? (
              <p className="mt-3 text-xs font-semibold text-brand-700">
                Upcoming event: {selectedCharity.upcomingEventTitle}
              </p>
            ) : null}
          </article>
        ) : null}
        {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        {message ? <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-700">{message}</p> : null}
      </section>
    </MemberLayout>
  );
}
