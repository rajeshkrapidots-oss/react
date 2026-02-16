import { useQuery } from "@tanstack/react-query";

export interface ActivityBlock {
  id: string;
  user: string;
  device: string;
  app: string;
  start: string;
  end: string;
  confidence: number;
  keys: number;
  mouse: number;
  idle: number;
  screenshot?: string;
}

export interface ActivityBlocksResponse {
  blocks: ActivityBlock[];
  apps: string[];
}

/* ───────── MOCK DATA ───────── */

const mockBlocks: ActivityBlock[] = [
  {
    id: "1",
    user: "sarah.chen",
    device: "MacBook Pro",
    app: "VS Code",
    start: "09:00",
    end: "09:45",
    confidence: 94,
    keys: 1240,
    mouse: 540,
    idle: 0,
    screenshot: "https://picsum.photos/400/250?1",
  },
  {
    id: "2",
    user: "marcus.j",
    device: "Windows 11",
    app: "Chrome",
    start: "10:00",
    end: "10:20",
    confidence: 76,
    keys: 320,
    mouse: 210,
    idle: 120,
    screenshot: "https://picsum.photos/400/250?2",
  },
  {
    id: "3",
    user: "priya.sharma",
    device: "MacBook Air",
    app: "Figma",
    start: "11:00",
    end: "12:00",
    confidence: 88,
    keys: 820,
    mouse: 610,
    idle: 30,
    screenshot: "https://picsum.photos/400/250?3",
  },
  {
    id: "4",
    user: "james.wilson",
    device: "Ubuntu",
    app: "Slack",
    start: "12:15",
    end: "12:45",
    confidence: 65,
    keys: 120,
    mouse: 80,
    idle: 200,
    screenshot: "https://picsum.photos/400/250?4",
  },
  {
    id: "5",
    user: "omar.khan",
    device: "Windows 10",
    app: "Excel",
    start: "14:00",
    end: "15:00",
    confidence: 92,
    keys: 1040,
    mouse: 430,
    idle: 0,
    screenshot: "https://picsum.photos/400/250?5",
  },
  {
    id: "6",
    user: "emily.davis",
    device: "Mac Studio",
    app: "Photoshop",
    start: "15:10",
    end: "16:00",
    confidence: 84,
    keys: 670,
    mouse: 720,
    idle: 40,
    screenshot: "https://picsum.photos/400/250?6",
  },
  {
    id: "7",
    user: "alex.petrov",
    device: "MacBook Pro",
    app: "VS Code",
    start: "16:00",
    end: "17:00",
    confidence: 97,
    keys: 1800,
    mouse: 950,
    idle: 0,
    screenshot: "https://picsum.photos/400/250?7",
  },
  {
    id: "8",
    user: "sofia.garcia",
    device: "Windows 11",
    app: "Chrome",
    start: "09:30",
    end: "10:30",
    confidence: 73,
    keys: 450,
    mouse: 330,
    idle: 90,
    screenshot: "https://picsum.photos/400/250?8",
  },
];

/* ───────── MOCK API ───────── */

const mockGetActivityBlocks = (): Promise<ActivityBlocksResponse> =>
  new Promise((resolve) =>
    setTimeout(() => {
      const apps = Array.from(new Set(mockBlocks.map((b) => b.app)));
      resolve({ blocks: mockBlocks, apps });
    }, 700)
  );

/* ───────── HOOK ───────── */

export const useActivityBlocks = () =>
  useQuery({
    queryKey: ["activity-blocks"],
    queryFn: mockGetActivityBlocks,
  });
