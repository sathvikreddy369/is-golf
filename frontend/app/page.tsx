'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ImpactChart } from '@/components/charts/ImpactChart';
import { Navbar } from '@/components/shared/Navbar';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <p className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            Subscription meets social impact
          </p>
          <h1 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
            Every score funds a story worth telling.
          </h1>
          <p className="text-lg text-ink/80">
            ImpactLinks turns your golf rhythm into recurring support for trusted charities, while giving
            you transparent chances to win from a purpose-driven draw pool.
          </p>
          <div className="flex gap-3">
            <Link href="/signup" className="btn-primary">
              Subscribe now
            </Link>
            <Link href="/how-it-works" className="btn-secondary">
              See the flow
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <ImpactChart />
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-3">
        {[
          { title: 'Transparent splits', body: 'Track charity and prize-pool allocation from every subscription payment.' },
          { title: '5-score model', body: 'Your latest five scores power matching tiers and keep gameplay fast and fair.' },
          { title: 'Admin controls', body: 'Manage draws, charities, users, and verification workflows in one command center.' }
        ].map((item) => (
          <article key={item.title} className="card">
            <h3 className="font-display text-xl font-bold">{item.title}</h3>
            <p className="mt-2 text-sm text-ink/70">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="card grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">Charity first</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">
              More than golf, this is a recurring community funding engine.
            </h2>
            <p className="mt-4 text-sm leading-7 text-ink/75">
              Each subscription is split transparently into three outcomes: direct charity support,
              a draw pool for subscribers, and platform continuity. That means every game cycle
              compounds into tangible social impact instead of one-off donations with limited traceability.
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/75">
              Subscribers choose a preferred charity, admins publish traceable results, and the platform
              keeps all movement auditable from payment to payout to contribution reporting.
            </p>
          </div>
          <div className="space-y-4">
            <article className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">Contribution model</p>
              <p className="mt-2 text-sm text-ink/80">
                Minimum 10% of each subscription is pushed toward charity, and members can choose higher contribution percentages.
              </p>
            </article>
            <article className="rounded-2xl border border-brand-100 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">Verified outcomes</p>
              <p className="mt-2 text-sm text-ink/80">
                Winner claims include proof verification and payout status tracking before funds are marked complete.
              </p>
            </article>
            <article className="rounded-2xl border border-brand-100 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">Monthly rhythm</p>
              <p className="mt-2 text-sm text-ink/80">
                Score updates, draw simulation, publication, and reporting happen in a predictable monthly cadence.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
