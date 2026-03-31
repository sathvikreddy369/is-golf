export function CardSkeleton() {
  return (
    <div className="card animate-pulse space-y-3">
      <div className="h-4 w-1/3 rounded bg-brand-100" />
      <div className="h-10 w-full rounded bg-brand-50" />
      <div className="h-10 w-2/3 rounded bg-brand-50" />
    </div>
  );
}
