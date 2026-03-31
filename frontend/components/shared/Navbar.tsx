'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  const signOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-[#fbf9f3]/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-bold text-ink">
          ImpactLinks
        </Link>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <Link href="/pricing" className="text-ink/80 hover:text-ink">
            Pricing
          </Link>
          <Link href="/charities" className="text-ink/80 hover:text-ink">
            Charities
          </Link>
          <Link href="/how-it-works" className="text-ink/80 hover:text-ink">
            How it works
          </Link>
          {isAuthenticated ? (
            <>
              <Link href={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} className="btn-secondary px-4 py-2">
                {user?.role === 'ADMIN' ? 'Admin' : 'Dashboard'}
              </Link>
              <button onClick={signOut} className="btn-primary px-4 py-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary px-4 py-2">
                Login
              </Link>
              <Link href="/signup" className="btn-primary px-4 py-2">
                Subscribe
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
