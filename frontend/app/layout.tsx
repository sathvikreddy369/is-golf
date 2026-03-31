import type { Metadata } from 'next';
import './globals.css';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { AuthProvider } from '@/components/auth/AuthProvider';

export const metadata: Metadata = {
  title: 'ImpactLinks | Golf Charity Subscription Platform',
  description: 'Play with purpose. Subscribe, score, and power meaningful community charity outcomes.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <RouteGuard>{children}</RouteGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
