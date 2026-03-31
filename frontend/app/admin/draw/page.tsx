'use client';

import { useState } from 'react';
import { drawApi } from '@/lib/api/endpoints';

export default function AdminDrawPage() {
  const [result, setResult] = useState<string>('');

  const run = async (simulation: boolean) => {
    const response = await drawApi.run({ mode: 'RANDOM', simulation });
    setResult(`Draw ${response.data.draw.id} completed with values ${response.data.draw.winningValues.join(', ')}`);
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-4xl font-extrabold">Draw management</h1>
      <div className="mt-6 flex gap-3">
        <button className="btn-secondary" onClick={() => run(true)}>
          Simulate draw
        </button>
        <button className="btn-primary" onClick={() => run(false)}>
          Publish draw
        </button>
      </div>
      {result && <p className="mt-5 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">{result}</p>}
    </main>
  );
}
