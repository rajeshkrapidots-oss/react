import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Download,
  Image as ImageIcon,
  Calendar as CalendarIcon,
} from "lucide-react";

import { useActivityBlocks } from "../hooks/useActivityBlocks";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "../lib/utils";

const PAGE_SIZE = 8;

const confidenceColor = (c: number) => {
  if (c >= 90) return "text-success";
  if (c >= 70) return "text-warning";
  return "text-destructive";
};

const ActivityBlocksPage = () => {
  const { data, isLoading } = useActivityBlocks();

  const [search, setSearch] = useState("");
  const [appFilter, setAppFilter] = useState("all");
  const [idleFilter, setIdleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [rangeType, setRangeType] =
    useState<"all" | "week" | "month" | "custom">("all");

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.blocks;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.user.toLowerCase().includes(q) ||
          b.device.toLowerCase().includes(q)
      );
    }

    if (appFilter !== "all") {
      list = list.filter((b) => b.app === appFilter);
    }

    if (idleFilter === "idle") {
      list = list.filter((b) => b.idle > 0);
    }

    if (idleFilter === "active") {
      list = list.filter((b) => b.idle === 0);
    }

    // ✅ Enterprise Date Filtering (use createdAt)
    if (rangeType !== "all") {
      const now = new Date();

      if (rangeType === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);

        list = list.filter(
          (b) => new Date(b.start) >= weekAgo
        );
      }

      if (rangeType === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);

        list = list.filter(
          (b) => new Date(b.start) >= monthAgo
        );
      }

      if (
        rangeType === "custom" &&
        dateRange?.from &&
        dateRange?.to
      ) {
        const from = new Date(dateRange.from);
        const to = new Date(dateRange.to);
        to.setHours(23, 59, 59, 999);

        list = list.filter((b) => {
          const date = new Date(b.start);
          return date >= from && date <= to;
        });
      }
    }

    return list;
  }, [data, search, appFilter, idleFilter, rangeType, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const exportCSV = () => {
    if (!filtered.length) return;

    const headers = [
      "User",
      "Device",
      "App",
      "Start",
      "End",
      "Confidence",
      "Keys",
      "Mouse",
      "Idle",
    ];

    const rows = filtered.map((r) => [
      r.user,
      r.device,
      r.app,
      r.start,
      r.end,
      r.confidence,
      r.keys,
      r.mouse,
      r.idle,
    ]);

    const csv =
      headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "activity-blocks.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Activity Blocks
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor user activity blocks and sessions
          </p>
        </div>

        <Button
          onClick={exportCSV}
          variant="outline"
          className="h-9 gap-2 rounded-lg text-sm"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user or device…"
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

          {/* App Filter */}
          <Select
            value={appFilter}
            onValueChange={(v) => {
              setAppFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[150px] text-sm rounded-lg bg-secondary/50 border-transparent">
              <SelectValue placeholder="App" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Apps</SelectItem>
              {data?.apps.map((app: string) => (
                <SelectItem key={app} value={app}>
                  {app}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Idle Filter */}
          <Select
            value={idleFilter}
            onValueChange={(v) => {
              setIdleFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[140px] text-sm rounded-lg bg-secondary/50 border-transparent">
              <SelectValue placeholder="Idle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="idle">Idle Only</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Range Type */}
          <Select
            value={rangeType}
            onValueChange={(v: any) => {
              setRangeType(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[140px] text-sm rounded-lg bg-secondary/50 border-transparent">
              <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {/* Custom Range Calendar */}
          {rangeType === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 rounded-lg bg-secondary/50 border-transparent text-sm"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                        {format(dateRange.to, "MMM dd, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd, yyyy")
                    )
                  ) : (
                    "Select Date Range"
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range);
                    setPage(1);
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* TABLE + MODALS BELOW UNCHANGED (your structure preserved) */}


      {/* Table Container */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header Row (IDENTICAL STYLE AS USERS) */}
        <div className="hidden lg:grid lg:grid-cols-[1.2fr_1fr_1fr_120px_120px_120px_60px_60px_60px_80px_90px] items-center gap-2 px-5 py-3 border-b border-border bg-muted/30">
          {[
            "User",
            "Device",
            "App",
            "Start",
            "End",
            "Confidence",
            "Keys",
            "Mouse",
            "Idle",
            "Shot",
            "Action",
          ].map((h) => (
            <span
              key={h}
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Body */}
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
          paginated.map((row) => (
            <div
              key={row.id}
              className="group flex flex-col gap-2 lg:grid lg:grid-cols-[1.2fr_1fr_1fr_120px_120px_120px_60px_60px_60px_80px_90px] lg:items-center px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <span className="text-sm font-medium text-card-foreground truncate">
                {row.user}
              </span>

              <span className="text-sm text-muted-foreground truncate">
                {row.device}
              </span>

              <span className="text-sm text-muted-foreground truncate">
                {row.app}
              </span>

              <span className="text-xs text-muted-foreground font-mono">
                {row.start}
              </span>

              <span className="text-xs text-muted-foreground font-mono">
                {row.end}
              </span>

              {/* Confidence Bar (same visual style as dashboard) */}
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      row.confidence >= 90
                        ? "bg-success"
                        : row.confidence >= 70
                        ? "bg-warning"
                        : "bg-destructive"
                    )}
                    style={{ width: `${row.confidence}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold tabular-nums",
                    confidenceColor(row.confidence)
                  )}
                >
                  {row.confidence}%
                </span>
              </div>

              <span className="text-xs tabular-nums">{row.keys}</span>
              <span className="text-xs tabular-nums">{row.mouse}</span>
              <span className="text-xs tabular-nums">{row.idle}s</span>

              <button
                onClick={() => setPreview(row.screenshot)}
                className="h-8 w-12 rounded-md overflow-hidden border border-border hover:opacity-80"
              >
                {row.screenshot ? (
                  <img
                    src={row.screenshot}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </button>

              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => setPreview(row.screenshot)}
                >
                  <Eye className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteId(row.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}

        {/* Pagination (IDENTICAL STRUCTURE AS USERS) */}
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

      {/* Screenshot Dialog */}
      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Screenshot Preview</DialogTitle>
          </DialogHeader>
          {preview && (
            <img
              src={preview}
              className="w-full rounded-lg border border-border"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this activity block?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActivityBlocksPage;
