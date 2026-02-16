import { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, ChevronLeft, ChevronRight, Users as UsersIcon } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '../lib/utils';

const PAGE_SIZE = 8;

type FilterType = 'all' | 'active' | 'inactive' | 'staff' | 'non-staff';

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3_600_000);
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/* ── Skeleton ─────────────────────────── */
const TableSkeleton = () => (
  <div className="space-y-0">
    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0">
        <Skeleton className="h-9 w-9 rounded-full shrink-0" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-40 hidden sm:block" />
        <Skeleton className="h-5 w-14 rounded-full ml-auto" />
        <Skeleton className="h-5 w-12 rounded-full hidden md:block" />
        <Skeleton className="h-4 w-16 hidden lg:block" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    ))}
  </div>
);

/* ── Empty State ──────────────────────── */
const EmptyState = ({ hasFilters }: { hasFilters: boolean }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
      <UsersIcon className="h-6 w-6 text-muted-foreground" />
    </div>
    <h3 className="text-sm font-semibold text-foreground">
      {hasFilters ? 'No users match your filters' : 'No users found'}
    </h3>
    <p className="mt-1 text-xs text-muted-foreground max-w-xs">
      {hasFilters
        ? 'Try adjusting your search query or filters to find what you\'re looking for.'
        : 'Users will appear here once they are added to the system.'}
    </p>
  </div>
);

/* ── Main Page ────────────────────────── */
const UsersPage = () => {
  const { data, isLoading } = useUsers();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();


  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.users;

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    // filter
    switch (filter) {
      case 'active':
        list = list.filter((u) => u.isActive);
        break;
      case 'inactive':
        list = list.filter((u) => !u.isActive);
        break;
      case 'staff':
        list = list.filter((u) => u.isStaff);
        break;
      case 'non-staff':
        list = list.filter((u) => !u.isStaff);
        break;
    }

    return list;
  }, [data, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Reset page when filters change
  const handleSearch = (val: string) => { setSearch(val); setPage(1); };
  const handleFilter = (val: FilterType) => { setFilter(val); setPage(1); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor all users in your organization
          </p>
        </div>
        {data && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {data.total} total users
          </span>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 h-9 bg-secondary/50 border-transparent focus:border-border focus:bg-background rounded-lg text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <Select value={filter} onValueChange={(v) => handleFilter(v as FilterType)}>
            <SelectTrigger className="h-9 w-[150px] text-sm rounded-lg bg-secondary/50 border-transparent">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="non-staff">Non-Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header row */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_90px_80px_100px_110px] items-center gap-2 px-5 py-3 border-b border-border bg-muted/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Staff</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Login</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Action</span>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : paginated.length === 0 ? (
          <EmptyState hasFilters={search !== '' || filter !== 'all'} />
        ) : (
          <div>
            {paginated.map((user) => (
              <div
                key={user.id}
                className="group flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_1fr_90px_80px_100px_110px] sm:items-center px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                {/* User */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {user.avatar}
                  </div>
                  <span className="text-sm font-medium text-card-foreground truncate">{user.username}</span>
                </div>

                {/* Email */}
                <span className="text-sm text-muted-foreground truncate">{user.email}</span>

                {/* Active badge */}
                <div>
                  <span className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                    user.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                  )}>
                    <span className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      user.isActive ? 'bg-success' : 'bg-muted-foreground'
                    )} />
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Staff badge */}
                <div>
                  {user.isStaff ? (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Staff
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>

                {/* Last login */}
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatDate(user.lastLogin)}
                </span>

                {/* Action */}
                <div className="sm:text-right">
               <Button
  variant="ghost"
  size="sm"
  className="h-8 gap-1.5 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 rounded-lg"
  onClick={() => navigate(`/users/${user.id}/work-diary`)}
>

                    <BookOpen className="h-3.5 w-3.5" />
                    Work Diary
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
            <span className="text-xs text-muted-foreground">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === safePage ? 'default' : 'ghost'}
                  size="icon"
                  className={cn(
                    'h-8 w-8 rounded-lg text-xs',
                    p === safePage && 'pointer-events-none'
                  )}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
