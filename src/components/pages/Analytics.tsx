import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ChartCard } from "@/components/dashboard/ChartCard";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useAnalytics } from "../hooks/useAnalytics";

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "10px",
  fontSize: "12px",
  boxShadow: "0 8px 30px -6px hsl(0 0% 0% / 0.2)",
};

const AnalyticsPage = () => {
  const { data, isLoading } = useAnalytics();

  const [range, setRange] = useState("7");
  const [user, setUser] = useState("all");
  const [app, setApp] = useState("all");

  if (isLoading || !data) return <DashboardSkeleton />;

  /* Filters (structure ready for backend) */
  const filteredTrend = useMemo(() => data.activityTrend, [range]);
  const filteredUsage = useMemo(() => data.appUsage, [range, app]);
  const filteredUsers = useMemo(() => data.userComparison, [user]);
  const filteredHeatmap = useMemo(() => data.heatmap, [range]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Deep productivity & behavioral intelligence
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="h-9 w-[130px] text-sm bg-secondary/50 border-transparent rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="14">Last 14 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={user} onValueChange={setUser}>
            <SelectTrigger className="h-9 w-[140px] text-sm bg-secondary/50 border-transparent rounded-lg">
              <SelectValue placeholder="User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {data.userComparison.map((u) => (
                <SelectItem key={u.user} value={u.user}>
                  {u.user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={app} onValueChange={setApp}>
            <SelectTrigger className="h-9 w-[140px] text-sm bg-secondary/50 border-transparent rounded-lg">
              <SelectValue placeholder="App" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Apps</SelectItem>
              <SelectItem value="chrome">Chrome</SelectItem>
              <SelectItem value="vscode">VS Code</SelectItem>
              <SelectItem value="figma">Figma</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {/* Productivity Heatmap (FIXED) */}
        <ChartCard
          title="Productivity Heatmap"
          subtitle="Hourly productivity intensity"
          className="lg:col-span-4"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={filteredHeatmap}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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

              {/* Real stacked hourly bars */}
              <Bar dataKey="morning" stackId="a" fill="hsl(var(--primary))" />
              <Bar dataKey="afternoon" stackId="a" fill="hsl(var(--success))" />
              <Bar dataKey="evening" stackId="a" fill="hsl(var(--warning))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* App Usage */}
        <ChartCard
          title="App Usage"
          subtitle="Stacked breakdown by day"
          className="lg:col-span-3"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={filteredUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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

              <Bar dataKey="chrome" stackId="a" fill="hsl(var(--primary))" />
              <Bar dataKey="vscode" stackId="a" fill="hsl(var(--success))" />
              <Bar dataKey="figma" stackId="a" fill="hsl(var(--warning))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* User Comparison */}
        <ChartCard
          title="User Comparison"
          subtitle="Productivity score"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={filteredUsers}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="user"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="productivity"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Daily Activity Trend */}
        <ChartCard
          title="Daily Activity Trend"
          subtitle="Blocks tracked per day"
          className="lg:col-span-3"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={filteredTrend}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
      </div>

      {/* Row 3 */}
      <ChartCard
        title="Idle vs Work Distribution"
        subtitle="Time allocation overview"
      >
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data.idleDistribution}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={105}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {data.idleDistribution.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value: number) => [`${value}%`, ""]}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default AnalyticsPage;
