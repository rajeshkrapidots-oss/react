import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

import { useDevices } from "../hooks/useDevices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "../lib/utils";

const PAGE_SIZE = 8;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const statusStyles: Record<string, string> = {
  Online: "bg-success/10 text-success",
  Idle: "bg-warning/10 text-warning",
  Offline: "bg-muted text-muted-foreground",
};

const DevicesPage = () => {
  const { data, isLoading } = useDevices();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.devices;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.user.toLowerCase().includes(q)
      );
    }

    if (filter !== "all") {
      list = list.filter((d) => d.status === filter);
    }

    return list;
  }, [data, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Devices
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage all registered devices
          </p>
        </div>
        {data && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {data.total} total devices
          </span>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by device or user…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-9 bg-secondary/50 border-transparent focus:border-border focus:bg-background rounded-lg text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />

          <Select value={filter} onValueChange={(v) => setFilter(v)}>
            <SelectTrigger className="h-9 w-[150px] text-sm rounded-lg bg-secondary/50 border-transparent">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Idle">Idle</SelectItem>
              <SelectItem value="Offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header row */}
        <div className="hidden sm:grid sm:grid-cols-[1.5fr_1fr_1fr_120px_120px_100px] items-center gap-2 px-5 py-3 border-b border-border bg-muted/30">
          {["Device Name", "User", "OS", "Last Active", "Status", "Action"].map(
            (h) => (
              <span
                key={h}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {h}
              </span>
            )
          )}
        </div>

        {isLoading ? (
          <div className="space-y-0">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0"
              >
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          paginated.map((device) => (
            <div
              key={device.id}
              className="group flex flex-col gap-2 sm:grid sm:grid-cols-[1.5fr_1fr_1fr_120px_120px_100px] sm:items-center px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <span className="text-sm font-medium text-card-foreground truncate">
                {device.name}
              </span>

              <span className="text-sm text-muted-foreground truncate">
                {device.user}
              </span>

              <span className="text-sm text-muted-foreground truncate">
                {device.os}
              </span>

              <span className="text-xs text-muted-foreground tabular-nums">
                {formatDate(device.lastActive)}
              </span>

              <div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                    statusStyles[device.status]
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      device.status === "Online"
                        ? "bg-success"
                        : device.status === "Idle"
                        ? "bg-warning"
                        : "bg-muted-foreground"
                    )}
                  />
                  {device.status}
                </span>
              </div>

              <div className="sm:text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}

        {/* Pagination (YOUR EXACT BLOCK) */}
        {!isLoading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
            <span className="text-xs text-muted-foreground">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length}
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <Button
                    key={p}
                    variant={p === safePage ? "default" : "ghost"}
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-lg text-xs",
                      p === safePage && "pointer-events-none"
                    )}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                )
              )}

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
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

export default DevicesPage;
