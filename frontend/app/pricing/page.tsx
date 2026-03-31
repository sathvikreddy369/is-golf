import { Navbar } from '@/components/shared/Navbar';
import Link from 'next/link';

const plans = [
  {
    name: 'Monthly',
    type: 'MONTHLY',
    price: 'INR 29',
    description: 'Flexible plan for regular monthly contribution.'
  },
  {
    name: 'Yearly',
    type: 'YEARLY',
    price: 'INR 299',
    description: 'Discounted annual plan with uninterrupted impact.'
  }
];

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="font-display text-4xl font-extrabold">Transparent pricing</h1>
        <p className="mt-3 text-ink/75">No hidden fees. Built for recurring impact.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <article key={plan.name} className="card">
              <h2 className="font-display text-2xl font-bold">{plan.name}</h2>
              <p className="mt-1 text-sm text-ink/60">{plan.type}</p>
              <p className="mt-4 text-4xl font-extrabold">{plan.price}</p>
              <p className="mt-2 text-sm text-ink/75">{plan.description}</p>
            </article>
          ))}
        </div>
        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="card">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-700">Charity contribution</p>
            <p className="mt-2 text-sm text-ink/75">At least 10% from every successful subscription is routed to charity.</p>
          </article>
          <article className="card">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-700">Prize pool</p>
            <p className="mt-2 text-sm text-ink/75">A fixed split contributes to monthly draw tiers for active participants.</p>
          </article>
          <article className="card">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-700">Audit trail</p>
            <p className="mt-2 text-sm text-ink/75">Draw results, winner verification, and payout states remain trackable.</p>
          </article>
        </section>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className="btn-primary">
            Start subscription
          </Link>
          <Link href="/how-it-works" className="btn-secondary">
            Understand flow
          </Link>
        </div>
      </section>
    </main>
  );
}
