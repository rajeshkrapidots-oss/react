import { useQuery } from '@tanstack/react-query';

// Mock data — replace with real API call: api.get('/dashboard/stats')
const mockDashboardData = () =>
  new Promise<DashboardData>((resolve) =>
    setTimeout(() => resolve(dashboardData), 800)
  );

export interface StatItem {
  label: string;
  value: string;
  change: string;
  up: boolean;
  iconName: 'Users' | 'UserCheck' | 'Blocks' | 'Target';
  accentColor: string;
}

export interface ActivityTrend {
  day: string;
  blocks: number;
  sessions: number;
}

export interface AppUsage {
  app: string;
  minutes: number;
}

export interface IdleActive {
  name: string;
  value: number;
  color: string;
}

export interface InputActivity {
  hour: string;
  keyboard: number;
  mouse: number;
}

export interface RecentActivity {
  id: string;
  user: string;
  avatar: string;
  app: string;
  start: string;
  end: string;
  confidence: number;
  status: 'Active' | 'Idle' | 'Away';
}

export interface DashboardData {
  stats: StatItem[];
  activityTrend: ActivityTrend[];
  appUsage: AppUsage[];
  idleActive: IdleActive[];
  inputActivity: InputActivity[];
  recentActivity: RecentActivity[];
}

const dashboardData: DashboardData = {
  stats: [
    { label: 'Total Users', value: '2,847', change: '+12.5%', up: true, iconName: 'Users', accentColor: 'hsl(221, 83%, 53%)' },
    { label: 'Active Today', value: '1,423', change: '+8.1%', up: true, iconName: 'UserCheck', accentColor: 'hsl(142, 71%, 45%)' },
    { label: 'Activity Blocks', value: '18,392', change: '+23.4%', up: true, iconName: 'Blocks', accentColor: 'hsl(262, 83%, 58%)' },
    { label: 'Productivity', value: '87.2%', change: '-1.3%', up: false, iconName: 'Target', accentColor: 'hsl(38, 92%, 50%)' },
  ],
  activityTrend: [
    { day: 'Mon', blocks: 320, sessions: 48 },
    { day: 'Tue', blocks: 480, sessions: 62 },
    { day: 'Wed', blocks: 410, sessions: 55 },
    { day: 'Thu', blocks: 560, sessions: 71 },
    { day: 'Fri', blocks: 490, sessions: 64 },
    { day: 'Sat', blocks: 180, sessions: 22 },
    { day: 'Sun', blocks: 120, sessions: 15 },
  ],
  appUsage: [
    { app: 'VS Code', minutes: 245 },
    { app: 'Chrome', minutes: 198 },
    { app: 'Slack', minutes: 142 },
    { app: 'Figma', minutes: 98 },
    { app: 'Terminal', minutes: 87 },
    { app: 'Notion', minutes: 65 },
  ],
  idleActive: [
    { name: 'Active', value: 72, color: 'hsl(142, 71%, 45%)' },
    { name: 'Idle', value: 18, color: 'hsl(38, 92%, 50%)' },
    { name: 'Away', value: 10, color: 'hsl(var(--muted-foreground))' },
  ],
  inputActivity: [
    { hour: '9AM', keyboard: 420, mouse: 280 },
    { hour: '10AM', keyboard: 580, mouse: 390 },
    { hour: '11AM', keyboard: 610, mouse: 420 },
    { hour: '12PM', keyboard: 290, mouse: 180 },
    { hour: '1PM', keyboard: 380, mouse: 260 },
    { hour: '2PM', keyboard: 540, mouse: 370 },
    { hour: '3PM', keyboard: 620, mouse: 440 },
    { hour: '4PM', keyboard: 510, mouse: 350 },
    { hour: '5PM', keyboard: 380, mouse: 240 },
  ],
  recentActivity: [
    { id: '1', user: 'Sarah Chen', avatar: 'SC', app: 'VS Code', start: '09:15 AM', end: '10:42 AM', confidence: 94, status: 'Active' },
    { id: '2', user: 'Marcus Johnson', avatar: 'MJ', app: 'Chrome', start: '09:30 AM', end: '11:15 AM', confidence: 87, status: 'Active' },
    { id: '3', user: 'Aiko Tanaka', avatar: 'AT', app: 'Figma', start: '10:00 AM', end: '10:45 AM', confidence: 76, status: 'Idle' },
    { id: '4', user: 'James Wilson', avatar: 'JW', app: 'Slack', start: '08:45 AM', end: '09:30 AM', confidence: 91, status: 'Active' },
    { id: '5', user: 'Priya Sharma', avatar: 'PS', app: 'Terminal', start: '10:20 AM', end: '11:00 AM', confidence: 98, status: 'Active' },
    { id: '6', user: 'Liam O\'Brien', avatar: 'LO', app: 'Notion', start: '09:50 AM', end: '10:15 AM', confidence: 62, status: 'Away' },
    { id: '7', user: 'Emily Davis', avatar: 'ED', app: 'VS Code', start: '11:00 AM', end: '12:30 PM', confidence: 89, status: 'Active' },
  ],
};

export const useDashboardStats = () =>
  useQuery({
    queryKey: ['dashboardStats'],
    queryFn: mockDashboardData,
  });
