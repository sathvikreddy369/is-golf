import { Navbar } from '@/components/shared/Navbar';

const steps = [
  'Sign up and choose your charity.',
  'Pick a monthly or yearly subscription.',
  'Enter your latest 5 golf scores.',
  'Wait for monthly draw simulation or published result.',
  'Track winnings, payouts, and social impact reports.'
];

export default function HowItWorksPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="font-display text-4xl font-extrabold">How ImpactLinks works</h1>
        <p className="mt-3 text-ink/75">Simple recurring giving, fair draw mechanics, and audit-friendly transparency.</p>
        <div className="mt-8 space-y-4">
          {steps.map((step, index) => (
            <div key={step} className="card flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                {index + 1}
              </span>
              <p className="font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
