import { Skeleton } from '@/components/ui/skeleton';

export const CardSkeleton = () => (
  <div className="rounded-lg border border-border bg-card p-6 space-y-3">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-3 w-20" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="rounded-lg border border-border bg-card p-6 space-y-4">
    <Skeleton className="h-5 w-32" />
    <Skeleton className="h-[250px] w-full" />
  </div>
);

export const TableSkeleton = () => (
  <div className="rounded-lg border border-border bg-card p-6 space-y-3">
    <Skeleton className="h-5 w-40" />
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-10 w-full" />
    ))}
  </div>
);

export const PageSkeleton = () => (
  <div className="space-y-6 p-6">
    <Skeleton className="h-8 w-48" />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  </div>
);
