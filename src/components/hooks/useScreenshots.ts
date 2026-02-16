import { useQuery } from "@tanstack/react-query";

export interface ScreenshotRecord {
  id: string;
  image: string;
  user: string;
  app: string;
  timestamp: string;
  confidence: number;
}

export interface ScreenshotsResponse {
  screenshots: ScreenshotRecord[];
  users: string[];
}

const mockScreenshots: ScreenshotRecord[] = [
  {
    id: "1",
    image: "https://picsum.photos/600/800?1",
    user: "sarah.chen",
    app: "VS Code",
    timestamp: "2026-02-13T09:12:00Z",
    confidence: 94,
  },
  {
    id: "2",
    image: "https://picsum.photos/600/700?2",
    user: "marcus.j",
    app: "Chrome",
    timestamp: "2026-02-13T10:05:00Z",
    confidence: 76,
  },
  {
    id: "3",
    image: "https://picsum.photos/600/900?3",
    user: "priya.sharma",
    app: "Figma",
    timestamp: "2026-02-12T14:22:00Z",
    confidence: 88,
  },
  {
    id: "4",
    image: "https://picsum.photos/600/750?4",
    user: "alex.petrov",
    app: "Slack",
    timestamp: "2026-02-12T11:10:00Z",
    confidence: 69,
  },
];

const mockGetScreenshots = (): Promise<ScreenshotsResponse> =>
  new Promise((resolve) =>
    setTimeout(() => {
      const users = Array.from(new Set(mockScreenshots.map((s) => s.user)));
      resolve({ screenshots: mockScreenshots, users });
    }, 700)
  );

export const useScreenshots = () =>
  useQuery({
    queryKey: ["screenshots"],
    queryFn: mockGetScreenshots,
  });
