'use client';

import { useState } from 'react';
import { drawApi } from '@/lib/api/endpoints';

export default function AdminDrawPage() {
  const [mode, setMode] = useState<'RANDOM' | 'WEIGHTED'>('RANDOM');
  const [result, setResult] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');

  const run = async (simulation: boolean) => {
    setIsRunning(true);
    setError('');

    try {
      const response = await drawApi.run({ mode, simulation });
      setResult(
        `${simulation ? 'Simulation' : 'Published draw'} ${response.data.draw.id} completed with values ${response.data.draw.winningValues.join(', ')}`
      );
    } catch {
      setError('Draw execution failed. Please retry.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-4xl font-extrabold">Draw management</h1>
      <p className="mt-2 text-sm text-ink/70">Run monthly simulations safely and publish verified draw outcomes.</p>
      <div className="mt-6 max-w-xs">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">Draw mode</label>
        <select value={mode} onChange={(event) => setMode(event.target.value as 'RANDOM' | 'WEIGHTED')} className="w-full rounded-xl border border-brand-100 px-4 py-3">
          <option value="RANDOM">Random</option>
          <option value="WEIGHTED">Weighted</option>
        </select>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="btn-secondary" onClick={() => run(true)} disabled={isRunning}>
          Simulate draw
        </button>
        <button className="btn-primary" onClick={() => run(false)} disabled={isRunning}>
          Publish draw
        </button>
      </div>
      {isRunning ? <p className="mt-4 rounded-xl bg-brand-50 p-3 text-sm text-brand-700">Running draw, please wait...</p> : null}
      {error ? <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      {result && <p className="mt-5 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">{result}</p>}
    </main>
  );
}
