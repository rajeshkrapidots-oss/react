import { useQuery } from "@tanstack/react-query";

export interface DeviceRecord {
  id: string;
  name: string;
  user: string;
  os: string;
  lastActive: string;
  status: "Online" | "Offline" | "Idle";
}

export interface DevicesResponse {
  devices: DeviceRecord[];
  total: number;
}

const mockDevices: DeviceRecord[] = [
  {
    id: "1",
    name: "MacBook Pro 14”",
    user: "sarah.chen",
    os: "macOS Sonoma",
    lastActive: "2026-02-13T10:12:00Z",
    status: "Online",
  },
  {
    id: "2",
    name: "Office-PC-01",
    user: "marcus.j",
    os: "Windows 11",
    lastActive: "2026-02-13T09:42:00Z",
    status: "Idle",
  },
  {
    id: "3",
    name: "Ubuntu-Dev",
    user: "alex.petrov",
    os: "Ubuntu 22.04",
    lastActive: "2026-02-12T18:20:00Z",
    status: "Offline",
  },
  {
    id: "4",
    name: "Mac Studio",
    user: "emily.davis",
    os: "macOS Sonoma",
    lastActive: "2026-02-13T08:55:00Z",
    status: "Online",
  },
];

const mockGetDevices = (): Promise<DevicesResponse> =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ devices: mockDevices, total: mockDevices.length }), 700)
  );

export const useDevices = () =>
  useQuery({
    queryKey: ["devices"],
    queryFn: mockGetDevices,
  });
