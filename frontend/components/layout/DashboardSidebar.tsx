'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/enter-score', label: 'Enter Score' },
  { href: '/my-scores', label: 'My Scores' },
  { href: '/history', label: 'History' },
  { href: '/my-winnings', label: 'My Winnings' },
  { href: '/subscription', label: 'Subscription Plan' },
  { href: '/profile', label: 'Profile' }
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="card h-fit md:sticky md:top-24">
      <h3 className="font-display text-lg font-bold">Subscriber panel</h3>
      <p className="mt-1 text-xs text-ink/60">Manage account, scores, and draw participation.</p>
      <div className="mt-4 flex flex-col gap-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                active ? 'bg-brand-500 text-white' : 'hover:bg-brand-50'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
