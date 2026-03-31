'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { useAuth } from '@/components/auth/AuthProvider';

export function MemberLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const signOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[250px_1fr]">
      <DashboardSidebar />
      <section className="space-y-5">
        <header className="card flex flex-wrap items-center justify-between gap-4 bg-gradient-to-br from-white via-brand-50/40 to-white">
          <div>
            <h1 className="font-display text-3xl font-bold">{title}</h1>
            {subtitle ? <p className="mt-2 text-sm text-ink/70">{subtitle}</p> : null}
          </div>
          <div className="w-full text-left sm:w-auto sm:text-right">
            <p className="text-sm font-semibold">{user?.fullName}</p>
            <p className="text-xs text-ink/60">{user?.email}</p>
            <div className="mt-2 flex flex-wrap gap-2 sm:justify-end">
              <Link href="/" className="btn-secondary px-3 py-2 text-xs">
                Home
              </Link>
              <Link href="/profile" className="btn-secondary px-3 py-2 text-xs">
                Profile
              </Link>
              <button onClick={signOut} className="btn-primary px-3 py-2 text-xs">
                Logout
              </button>
            </div>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
