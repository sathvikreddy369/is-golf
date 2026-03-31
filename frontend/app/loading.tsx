import { CardSkeleton } from '@/components/skeletons/CardSkeleton';

export default function Loading() {
  return (
    <main className="mx-auto max-w-4xl space-y-4 px-6 py-12">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </main>
  );
}
