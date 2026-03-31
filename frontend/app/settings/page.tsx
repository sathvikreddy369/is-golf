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
  const [charities, setCharities] = useState<Charity[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setFullName(user?.fullName ?? '');
    setCharityId(user?.charityId ?? '');
  }, [user]);

  useEffect(() => {
    charityApi.list().then((res) => setCharities(res.data));
  }, []);

  const saveProfile = async () => {
    setMessage('');
    await userApi.updateProfile({
      fullName,
      charityId: charityId || undefined
    });
    await refreshProfile();
    setMessage('Profile updated successfully.');
  };

  return (
    <MemberLayout
      title="Profile Management"
      subtitle="Keep your account details and preferred charity current."
    >
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
        <button onClick={saveProfile} className="btn-primary">
          Save profile
        </button>
        {message ? <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-700">{message}</p> : null}
      </section>
    </MemberLayout>
  );
}
