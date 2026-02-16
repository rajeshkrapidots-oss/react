import { useQuery } from '@tanstack/react-query';

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  isStaff: boolean;
  lastLogin: string;
  avatar: string;
}

export interface UsersResponse {
  users: UserRecord[];
  total: number;
}

const mockUsers: UserRecord[] = [
  { id: '1', username: 'sarah.chen', email: 'sarah@company.com', isActive: true, isStaff: true, lastLogin: '2026-02-13T09:15:00Z', avatar: 'SC' },
  { id: '2', username: 'marcus.j', email: 'marcus@company.com', isActive: true, isStaff: false, lastLogin: '2026-02-13T08:42:00Z', avatar: 'MJ' },
  { id: '3', username: 'aiko.tanaka', email: 'aiko@company.com', isActive: false, isStaff: false, lastLogin: '2026-02-10T14:30:00Z', avatar: 'AT' },
  { id: '4', username: 'james.wilson', email: 'james@company.com', isActive: true, isStaff: true, lastLogin: '2026-02-13T07:55:00Z', avatar: 'JW' },
  { id: '5', username: 'priya.sharma', email: 'priya@company.com', isActive: true, isStaff: false, lastLogin: '2026-02-12T16:20:00Z', avatar: 'PS' },
  { id: '6', username: 'liam.obrien', email: 'liam@company.com', isActive: false, isStaff: false, lastLogin: '2026-02-08T11:00:00Z', avatar: 'LO' },
  { id: '7', username: 'emily.davis', email: 'emily@company.com', isActive: true, isStaff: true, lastLogin: '2026-02-13T10:05:00Z', avatar: 'ED' },
  { id: '8', username: 'omar.khan', email: 'omar@company.com', isActive: true, isStaff: false, lastLogin: '2026-02-13T06:30:00Z', avatar: 'OK' },
  { id: '9', username: 'nina.reyes', email: 'nina@company.com', isActive: true, isStaff: false, lastLogin: '2026-02-12T09:45:00Z', avatar: 'NR' },
  { id: '10', username: 'david.lee', email: 'david@company.com', isActive: false, isStaff: true, lastLogin: '2026-02-05T13:10:00Z', avatar: 'DL' },
  { id: '11', username: 'sofia.garcia', email: 'sofia@company.com', isActive: true, isStaff: false, lastLogin: '2026-02-13T08:00:00Z', avatar: 'SG' },
  { id: '12', username: 'alex.petrov', email: 'alex@company.com', isActive: true, isStaff: false, lastLogin: '2026-02-11T15:30:00Z', avatar: 'AP' },
  { id: '13', username: 'maria.santos', email: 'maria@company.com', isActive: false, isStaff: false, lastLogin: '2026-02-01T10:00:00Z', avatar: 'MS' },
  { id: '14', username: 'ben.taylor', email: 'ben@company.com', isActive: true, isStaff: true, lastLogin: '2026-02-13T09:50:00Z', avatar: 'BT' },
  { id: '15', username: 'yuki.sato', email: 'yuki@company.com', isActive: true, isStaff: false, lastLogin: '2026-02-12T14:15:00Z', avatar: 'YS' },
  { id: '16', username: 'rachel.moore', email: 'rachel@company.com', isActive: false, isStaff: false, lastLogin: '2026-01-28T09:00:00Z', avatar: 'RM' },
];

const mockGetUsers = (): Promise<UsersResponse> =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ users: mockUsers, total: mockUsers.length }), 700)
  );

export const useUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: mockGetUsers,
  });
