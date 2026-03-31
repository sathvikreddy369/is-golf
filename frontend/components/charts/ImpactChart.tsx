'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { month: 'Jan', charity: 12000, pool: 18000 },
  { month: 'Feb', charity: 16000, pool: 21000 },
  { month: 'Mar', charity: 18000, pool: 25000 },
  { month: 'Apr', charity: 22000, pool: 29000 }
];

export function ImpactChart() {
  return (
    <div className="card h-[320px]">
      <p className="mb-4 font-display text-xl font-semibold">Impact momentum</p>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d9e9e4" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="charity" fill="#0fa37f" radius={[6, 6, 0, 0]} />
          <Bar dataKey="pool" fill="#ff7a59" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
