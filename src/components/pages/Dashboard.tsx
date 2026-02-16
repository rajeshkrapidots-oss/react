import {
  Users,
  UserCheck,
  Blocks,
  Target,
} from 'lucide-react';
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
} from 'recharts';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { cn } from '../lib/utils';

const iconMap = { Users, UserCheck, Blocks, Target } as const;

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '10px',
  fontSize: '12px',
  boxShadow: '0 8px 30px -6px hsl(0 0% 0% / 0.2)',
};

const statusStyles: Record<string, string> = {
  Active: 'bg-success/10 text-success',
  Idle: 'bg-warning/10 text-warning',
  Away: 'bg-muted text-muted-foreground',
};

const confidenceColor = (c: number) => {
  if (c >= 90) return 'text-success';
  if (c >= 70) return 'text-warning';
  return 'text-destructive';
};

const Dashboard = () => {
  const { data, isLoading } = useDashboardStats();

  if (isLoading || !data) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time workforce analytics overview</p>
        </div>
        <span className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat, i) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            up={stat.up}
            icon={iconMap[stat.iconName]}
            index={i}
            accentColor={stat.accentColor}
          />
        ))}
      </div>

      {/* Row 1: Line + Bar */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {/* Activity Trend — Line Chart */}
        <ChartCard title="Activity Trend" subtitle="Blocks & sessions this week" className="lg:col-span-4">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.activityTrend}>
              <defs>
                <linearGradient id="lineGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="blocks"
                stroke="hsl(221, 83%, 53%)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: 'hsl(221, 83%, 53%)' }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="hsl(142, 71%, 45%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: 'hsl(142, 71%, 45%)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* App Usage — Bar Chart */}
        <ChartCard title="App Usage" subtitle="Top apps by minutes" className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.appUsage} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis
                type="category"
                dataKey="app"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
                width={65}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]}>
                {data.appUsage.map((_, i) => (
                  <Cell
                    key={i}
                    fill={`hsl(221, 83%, ${53 + i * 6}%)`}
                    style={{ filter: 'saturate(1.1)' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Pie + Area */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Idle vs Active — Pie Chart */}
        <ChartCard title="Time Distribution" subtitle="Active vs Idle vs Away" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data.idleActive}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.idleActive.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => [`${value}%`, '']}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Keyboard & Mouse — Area Chart */}
        <ChartCard title="Input Activity" subtitle="Keyboard & mouse events per hour" className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.inputActivity}>
              <defs>
                <linearGradient id="gradKeyboard" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradMouse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="keyboard"
                stroke="hsl(221, 83%, 53%)"
                fill="url(#gradKeyboard)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="mouse"
                stroke="hsl(262, 83%, 58%)"
                fill="url(#gradMouse)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-sm font-semibold text-card-foreground">Recent Activity</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Latest tracked sessions across your team</p>
          </div>
          <span className="text-xs text-muted-foreground">{data.recentActivity.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">App</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">End</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confidence</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentActivity.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {row.avatar}
                      </div>
                      <span className="font-medium text-card-foreground whitespace-nowrap">{row.user}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{row.app}</td>
                  <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{row.start}</td>
                  <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{row.end}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-700',
                            row.confidence >= 90 ? 'bg-success' : row.confidence >= 70 ? 'bg-warning' : 'bg-destructive'
                          )}
                          style={{ width: `${row.confidence}%` }}
                        />
                      </div>
                      <span className={cn('text-xs font-semibold tabular-nums', confidenceColor(row.confidence))}>
                        {row.confidence}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                      statusStyles[row.status]
                    )}>
                      <span className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        row.status === 'Active' ? 'bg-success' : row.status === 'Idle' ? 'bg-warning' : 'bg-muted-foreground'
                      )} />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
