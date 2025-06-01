export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';
export const API_VERSION = process.env.EXPO_PUBLIC_API_VERSION || 'v1';

export const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
} as const;

export const ROUTES = {
  AUTH: {
    LOGIN: 'Login',
    REGISTER: 'Register',
  },
  MAIN: {
    DASHBOARD: 'Dashboard',
    LESSON: 'Lesson',
    VOCABULARY: 'Vocabulary',
    LEADERBOARD: 'Leaderboard',
    PROFILE: 'Profile',
  },
} as const;
