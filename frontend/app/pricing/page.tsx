import { Navbar } from '@/components/shared/Navbar';

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
      </section>
    </main>
  );
}
