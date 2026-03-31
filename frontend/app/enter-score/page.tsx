'use client';

import { useState } from 'react';
import { MemberLayout } from '@/components/layout/MemberLayout';
import { scoreApi } from '@/lib/api/endpoints';

export default function EnterScorePage() {
  const [value, setValue] = useState(18);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    setMessage('');
    setIsError(false);

    if (value < 1 || value > 45) {
      setMessage('Score must be between 1 and 45.');
      setIsError(true);
      setSaving(false);
      return;
    }

    try {
      await scoreApi.create({ value, date: new Date().toISOString() });
      setMessage('Score submitted. Latest five scores are now updated.');
      setIsError(false);
    } catch {
      setMessage('Unable to save score at the moment. Please try again.');
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <MemberLayout title="Score Management" subtitle="Enter one score at a time. The newest five are always retained.">
      <section className="card">
        <h2 className="font-display text-2xl font-bold">Enter latest score</h2>
        <p className="mt-2 text-sm text-ink/70">Valid values are 1 through 45.</p>
        <p className="mt-1 text-xs text-ink/60">Only your latest five entries are retained for draw logic.</p>
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
        {message ? (
          <p className={`mt-4 rounded-xl p-3 text-sm ${isError ? 'bg-red-50 text-red-700' : 'bg-brand-50 text-brand-700'}`}>
            {message}
          </p>
        ) : null}
      </section>
    </MemberLayout>
  );
}
