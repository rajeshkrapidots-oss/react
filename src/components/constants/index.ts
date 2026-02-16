export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const AUTH_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export const ROUTES = {
  DASHBOARD: '/',
  LOGIN: '/login',
  USERS: '/users',
  ACTIVITY_BLOCKS: '/activity-blocks',
  DEVICES: '/devices',
  SCREENSHOTS: '/screenshots',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;
