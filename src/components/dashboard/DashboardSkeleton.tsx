import { Skeleton } from '@/components/ui/skeleton';

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="space-y-1">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-4 w-64" />
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-4 w-36" />
        </div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
      <div className="rounded-xl border border-border bg-card p-5 lg:col-span-4 space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-[280px] w-full rounded-lg" />
      </div>
      <div className="rounded-xl border border-border bg-card p-5 lg:col-span-3 space-y-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-[280px] w-full rounded-lg" />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2 space-y-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-[250px] w-full rounded-lg" />
      </div>
      <div className="rounded-xl border border-border bg-card p-5 lg:col-span-3 space-y-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-[250px] w-full rounded-lg" />
      </div>
    </div>

    {/* Table */}
    <div className="rounded-xl border border-border bg-card">
      <div className="p-5 border-b border-border">
        <Skeleton className="h-5 w-36" />
      </div>
      <div className="p-5 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full" />
        ))}
      </div>
    </div>
  </div>
);
