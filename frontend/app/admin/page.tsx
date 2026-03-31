import Link from 'next/link';

const links = [
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/draw', label: 'Draw management' },
  { href: '/admin/charities', label: 'Charities' },
  { href: '/admin/reports', label: 'Reports' }
];

export default function AdminHomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-4xl font-extrabold">Admin command center</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="card text-lg font-semibold hover:border-brand-500">
            {link.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
