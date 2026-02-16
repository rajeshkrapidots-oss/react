import { useState, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { cn } from "../lib/utils";
import { useUserWorkDiary } from "../hooks/useUserWorkDiary";

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "10px",
  fontSize: "12px",
  boxShadow: "0 8px 30px -6px hsl(0 0% 0% / 0.2)",
};

const confidenceColor = (c: number) => {
  if (c >= 90) return "text-success";
  if (c >= 70) return "text-warning";
  return "text-destructive";
};

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success",
  Idle: "bg-warning/10 text-warning",
  Away: "bg-muted text-muted-foreground",
};

const UserWorkDiary = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useUserWorkDiary(id!);

  const [range, setRange] = useState("today");

  if (isLoading || !data) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Work Diary
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-10">
            Detailed activity timeline for {data.user.username}
          </p>
        </div>

        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="h-9 w-[140px] text-sm rounded-lg bg-secondary/50 border-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Activity Timeline Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-sm font-semibold text-card-foreground">
              Activity Timeline
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Session breakdown with confidence scoring
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {data.activity.length} sessions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  App
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Start
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  End
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Confidence
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {data.activity.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-card-foreground">
                    {row.app}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground font-mono text-xs">
                    {row.start}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground font-mono text-xs">
                    {row.end}
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-700",
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
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                        statusStyles[row.status]
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <ChartCard
          title="Daily Activity Trend"
          subtitle="Blocks tracked per day"
          className="lg:col-span-3"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.trend}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="blocks"
                stroke="hsl(var(--primary))"
                fill="url(#trendGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Idle vs Work"
          subtitle="Time distribution"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data.idleDistribution}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.idleDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default UserWorkDiary;
