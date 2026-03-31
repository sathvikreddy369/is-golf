'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ImpactChart } from '@/components/charts/ImpactChart';
import { Navbar } from '@/components/shared/Navbar';
import { charityApi } from '@/lib/api/endpoints';
import { Charity } from '@/types/app';

export default function HomePage() {
  const [charities, setCharities] = useState<Charity[]>([]);

  useEffect(() => {
    charityApi
      .list()
      .then((response) => setCharities(response.data))
      .catch(() => setCharities([]));
  }, []);

  const spotlight = useMemo(() => charities.find((charity) => charity.featured) ?? charities[0], [charities]);

  return (
    <main>
      <Navbar />
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-14 md:grid-cols-2 md:py-24">
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
            Play your five. Fund what matters.
          </h1>
          <p className="text-lg text-ink/80">
            ImpactLinks is not a golf club website. It is a recurring impact platform where your active
            subscription keeps charity initiatives moving while your rolling five scores determine draw
            eligibility each month.
          </p>
          <div className="flex gap-3">
            <Link href="/signup" className="btn-primary">
              Subscribe now
            </Link>
            <Link href="/how-it-works" className="btn-secondary">
              How the draw works
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Minimum charity contribution', value: '10%' },
              { label: 'Rolling score model', value: 'Last 5 scores' },
              { label: 'Draw cadence', value: 'Monthly' }
            ].map((stat) => (
              <article key={stat.label} className="rounded-2xl border border-brand-100 bg-white px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">{stat.label}</p>
                <p className="mt-1 font-display text-xl font-bold text-brand-700">{stat.value}</p>
              </article>
            ))}
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
          {
            title: 'Transparent splits',
            body: 'Track exactly how each payment is divided into charity contributions, prize pool, and platform operations.'
          },
          {
            title: 'Tiered winnings',
            body: 'Match 3, 4, or all 5 draw values to unlock progressive rewards with jackpot rollover behavior.'
          },
          {
            title: 'Winner verification',
            body: 'Winners upload proof screenshots, admins approve claims, and payouts move from pending to paid.'
          }
        ].map((item) => (
          <article key={item.title} className="card">
            <h3 className="font-display text-xl font-bold">{item.title}</h3>
            <p className="mt-2 text-sm text-ink/70">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="card">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">Why this game matters</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold">Every monthly cycle can change a real story.</h2>
            <p className="mt-4 text-sm leading-7 text-ink/75">
              A child scholarship gets funded. A preventive health camp reaches one more neighborhood. A
              restoration drive gets one more week of resources. ImpactLinks turns your game participation
              into predictable support that charities can plan around, not just hope for.
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/75">
              You are not donating in the dark. You can see where your contribution goes, how draws are
              run, and what outcomes were verified month after month.
            </p>
          </article>
          <article className="card">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">How gameplay helps</p>
            <div className="mt-4 space-y-3">
              {[
                {
                  title: 'Step 1: Subscribe',
                  body: 'Choose monthly or yearly plan and select your preferred charity partner.'
                },
                {
                  title: 'Step 2: Enter latest 5 scores',
                  body: 'Your rolling score set keeps participation active and draw eligibility fair.'
                },
                {
                  title: 'Step 3: Draw + distribution',
                  body: 'Prize tiers are allocated automatically while charity contribution is logged transparently.'
                },
                {
                  title: 'Step 4: Public accountability',
                  body: 'Winners are verified and payout status is tracked from pending to paid.'
                }
              ].map((step) => (
                <div key={step.title} className="rounded-xl border border-brand-100 p-3">
                  <p className="text-sm font-semibold text-brand-800">{step.title}</p>
                  <p className="mt-1 text-xs leading-6 text-ink/70">{step.body}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="card grid gap-6 p-0 md:grid-cols-[1.2fr_1fr] md:overflow-hidden">
          {spotlight ? (
            <Image
              src={spotlight.image}
              alt={spotlight.name}
              width={900}
              height={600}
              className="h-64 w-full object-cover md:h-full"
            />
          ) : (
            <div className="h-64 bg-brand-100 md:h-full" />
          )}
          <div className="space-y-4 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">Spotlight charity</p>
            <h2 className="font-display text-3xl font-extrabold">{spotlight?.name ?? 'Impact partner loading...'}</h2>
            <p className="text-sm leading-7 text-ink/75">
              {spotlight?.description ??
                'Our platform continuously highlights one partner each cycle so members can see where recurring contributions are creating measurable outcomes.'}
            </p>
            <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-800">
              {spotlight?.impactMetric ?? 'Verified impact metrics and campaign updates are published from the charity dashboard.'}
            </p>
            {spotlight?.upcomingEventTitle ? (
              <p className="text-sm text-ink/70">
                Next event: <span className="font-semibold text-ink">{spotlight.upcomingEventTitle}</span>
              </p>
            ) : null}
            <Link href="/charities" className="btn-secondary inline-flex px-4 py-2 text-sm">
              Browse all charities
            </Link>
          </div>
        </div>
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

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="card grid gap-6 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">From game to good</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold">A platform where competition and compassion coexist.</h2>
            <p className="mt-4 text-sm leading-7 text-ink/75">
              Golf gives the cadence. Community gives the meaning. ImpactLinks is designed to reward consistency,
              celebrate winners, and still keep the central promise intact: every active member helps fund real,
              ongoing work by verified charities.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary">
                Join the next cycle
              </Link>
              <Link href="/charities" className="btn-secondary">
                Choose your charity
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
            <p className="text-sm font-semibold text-brand-800">Impact promise</p>
            <ul className="mt-3 space-y-2 text-sm text-ink/75">
              <li>At least 10% of every subscription supports charity directly</li>
              <li>Monthly draw logic remains transparent and auditable</li>
              <li>Winnings, verification, and payout statuses are trackable</li>
              <li>Members can update profile, charity choice, and participation at any time</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
