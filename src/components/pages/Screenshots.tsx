import { useState, useMemo } from "react";
import { Filter, Calendar as CalendarIcon } from "lucide-react";

import { useScreenshots } from "../hooks/useScreenshots";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "../lib/utils";

const confidenceStyle = (c: number) => {
  if (c >= 90) return "bg-success/10 text-success";
  if (c >= 70) return "bg-warning/10 text-warning";
  return "bg-destructive/10 text-destructive";
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const ScreenshotsPage = () => {
  const { data, isLoading } = useScreenshots();

  const [userFilter, setUserFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [preview, setPreview] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.screenshots;

    if (userFilter !== "all") {
      list = list.filter((s) => s.user === userFilter);
    }

    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      list = list.filter((s) => s.timestamp.startsWith(dateStr));
    }

    return list;
  }, [data, userFilter, selectedDate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Screenshots
          </h1>
          <p className="text-sm text-muted-foreground">
            Review captured screenshots across your team
          </p>
        </div>
        {data && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {data.screenshots.length} total captures
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />

          {/* User Filter */}
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="h-9 w-[160px] text-sm rounded-lg bg-secondary/50 border-transparent">
              <SelectValue placeholder="User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {data?.users.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Calendar Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-9 rounded-lg bg-secondary/50 border-transparent text-sm font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? selectedDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Pick date"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Grid Container */}
      <div className="rounded-xl border border-border bg-card p-5">
        {isLoading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg mb-4" />
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((shot) => (
              <div
                key={shot.id}
                className="break-inside-avoid rounded-lg border border-border overflow-hidden bg-background hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setPreview(shot.image)}
              >
                <img
                  src={shot.image}
                  className="w-full object-cover"
                  alt=""
                />

                <div className="p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-card-foreground">
                      {shot.user}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium rounded-full px-2 py-0.5",
                        confidenceStyle(shot.confidence)
                      )}
                    >
                      {shot.confidence}%
                    </span>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {shot.app}
                  </span>

                  <div className="text-xs text-muted-foreground tabular-nums">
                    {formatDate(shot.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-5xl">
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
    </div>
  );
};

export default ScreenshotsPage;
