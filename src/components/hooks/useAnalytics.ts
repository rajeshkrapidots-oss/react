import { useQuery } from "@tanstack/react-query";

export interface AnalyticsData {
  heatmap: { day: string; hour: number; value: number }[];
  appUsage: { day: string; chrome: number; vscode: number; figma: number }[];
  userComparison: { user: string; productivity: number }[];
  activityTrend: { day: string; blocks: number }[];
  idleDistribution: { name: string; value: number; color: string }[];
}

const mockData: AnalyticsData = {
  heatmap: Array.from({ length: 7 }).flatMap((_, d) =>
    Array.from({ length: 8 }).map((_, h) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d],
      hour: 9 + h,
      value: Math.floor(Math.random() * 100),
    }))
  ),

  appUsage: [
    { day: "Mon", chrome: 3, vscode: 5, figma: 2 },
    { day: "Tue", chrome: 4, vscode: 6, figma: 1 },
    { day: "Wed", chrome: 2, vscode: 4, figma: 3 },
    { day: "Thu", chrome: 5, vscode: 3, figma: 2 },
    { day: "Fri", chrome: 3, vscode: 7, figma: 1 },
  ],

  userComparison: [
    { user: "Sarah", productivity: 92 },
    { user: "Marcus", productivity: 74 },
    { user: "Priya", productivity: 88 },
    { user: "Alex", productivity: 69 },
  ],

  activityTrend: [
    { day: "Mon", blocks: 32 },
    { day: "Tue", blocks: 45 },
    { day: "Wed", blocks: 38 },
    { day: "Thu", blocks: 51 },
    { day: "Fri", blocks: 48 },
  ],

  idleDistribution: [
    { name: "Work", value: 68, color: "hsl(var(--success))" },
    { name: "Idle", value: 22, color: "hsl(var(--warning))" },
    { name: "Away", value: 10, color: "hsl(var(--muted-foreground))" },
  ],
};

export const useAnalytics = () =>
  useQuery({
    queryKey: ["analytics"],
    queryFn: () =>
      new Promise<AnalyticsData>((resolve) =>
        setTimeout(() => resolve(mockData), 700)
      ),
  });
