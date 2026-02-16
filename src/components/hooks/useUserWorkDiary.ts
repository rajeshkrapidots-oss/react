import { useQuery } from "@tanstack/react-query";

/* ──────────────────────────────────────────────── */
/* Types */
/* ──────────────────────────────────────────────── */

export interface WorkDiaryActivity {
  id: string;
  app: string;
  start: string;
  end: string;
  confidence: number;
  status: "Active" | "Idle" | "Away";
}

export interface WorkDiaryTrend {
  day: string;
  blocks: number;
}

export interface IdleDistribution {
  name: string;
  value: number;
  color: string;
}

export interface UserSummary {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

export interface UserWorkDiaryResponse {
  user: UserSummary;
  activity: WorkDiaryActivity[];
  trend: WorkDiaryTrend[];
  idleDistribution: IdleDistribution[];
}

/* ──────────────────────────────────────────────── */
/* Mock Data Generator */
/* ──────────────────────────────────────────────── */

const mockGetUserWorkDiary = async (
  userId: string
): Promise<UserWorkDiaryResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: userId,
          username: "sarah.chen",
          email: "sarah@company.com",
          avatar: "SC",
        },

        activity: [
          {
            id: "1",
            app: "VS Code",
            start: "09:00",
            end: "10:15",
            confidence: 94,
            status: "Active",
          },
          {
            id: "2",
            app: "Chrome",
            start: "10:15",
            end: "10:40",
            confidence: 68,
            status: "Idle",
          },
          {
            id: "3",
            app: "Figma",
            start: "10:45",
            end: "12:30",
            confidence: 88,
            status: "Active",
          },
          {
            id: "4",
            app: "Slack",
            start: "01:00",
            end: "01:30",
            confidence: 72,
            status: "Away",
          },
        ],

        trend: [
          { day: "Mon", blocks: 22 },
          { day: "Tue", blocks: 28 },
          { day: "Wed", blocks: 19 },
          { day: "Thu", blocks: 30 },
          { day: "Fri", blocks: 26 },
          { day: "Sat", blocks: 12 },
          { day: "Sun", blocks: 8 },
        ],

        idleDistribution: [
          { name: "Active", value: 68, color: "hsl(142, 71%, 45%)" },
          { name: "Idle", value: 22, color: "hsl(38, 92%, 50%)" },
          { name: "Away", value: 10, color: "hsl(220, 9%, 46%)" },
        ],
      });
    }, 700);
  });
};

/* ──────────────────────────────────────────────── */
/* Hook */
/* ──────────────────────────────────────────────── */

export const useUserWorkDiary = (userId: string) => {
  return useQuery({
    queryKey: ["user-work-diary", userId],
    queryFn: () => mockGetUserWorkDiary(userId),
    enabled: !!userId,
  });
};
