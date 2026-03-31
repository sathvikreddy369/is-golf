'use client';

import { useState } from 'react';
import { MemberLayout } from '@/components/layout/MemberLayout';
import { scoreApi } from '@/lib/api/endpoints';

export default function EnterScorePage() {
  const [value, setValue] = useState(18);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    setMessage('');
    try {
      await scoreApi.create({ value, date: new Date().toISOString() });
      setMessage('Score submitted. Latest five scores are now updated.');
    } catch {
      setMessage('Unable to save score at the moment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MemberLayout title="Score Management" subtitle="Enter one score at a time. The newest five are always retained.">
      <section className="card">
        <h2 className="font-display text-2xl font-bold">Enter latest score</h2>
        <p className="mt-2 text-sm text-ink/70">Valid values are 1 through 45.</p>
        <div className="mt-6 flex max-w-sm items-center gap-3">
          <input
            type="number"
            min={1}
            max={45}
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            className="w-full rounded-xl border border-brand-100 px-4 py-3"
          />
          <button className="btn-primary" onClick={submit} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
        {message && <p className="mt-4 text-sm text-brand-700">{message}</p>}
      </section>
    </MemberLayout>
  );
}
