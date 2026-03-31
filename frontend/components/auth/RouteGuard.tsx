'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

const publicRoutes = ['/', '/how-it-works', '/charities', '/pricing', '/login', '/signup'];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    const isPublic = publicRoutes.includes(pathname);

    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      if (!isPublic) {
        router.replace('/login');
      }
      return;
    }

    if (pathname === '/login' || pathname === '/signup') {
      router.replace(user?.role === 'ADMIN' ? '/admin' : '/dashboard');
      return;
    }

    if (pathname.startsWith('/admin') && user?.role !== 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [pathname, router, isLoading, isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="card animate-pulse space-y-3">
          <div className="h-5 w-2/5 rounded bg-brand-100" />
          <div className="h-8 w-full rounded bg-brand-50" />
          <div className="h-8 w-4/5 rounded bg-brand-50" />
        </div>
      </div>
    );
  }

  const isPublic = publicRoutes.includes(pathname);
  if (!isPublic && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
