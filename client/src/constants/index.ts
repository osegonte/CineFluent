// client/src/constants/index.ts - Updated with more colors
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
  
  // Activity levels for progress calendar
  activity: {
    none: '#ebedf0',
    low: '#c6e48b',
    medium: '#7bc96f',
    high: '#239a3b',
    veryHigh: '#196127',
  }
} as const;

export const ROUTES = {
  AUTH: {
    LOGIN: 'Login',
    REGISTER: 'Register',
  },
  MAIN: {
    LEARN: 'Learn',
    LESSON: 'Lesson',
    PROGRESS: 'Progress',
    COMMUNITY: 'Community',
    PROFILE: 'Profile',
  },
} as const;

// Quiz difficulty levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

// Language codes
export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  IT: 'it',
} as const;