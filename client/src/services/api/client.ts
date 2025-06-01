// src/services/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_VERSION } from '@/constants';
import { AuthService } from '../auth/AuthService';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AuthService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AuthService.logout();
          // Navigate to login screen - will be handled by the app
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();

// src/services/auth/AuthService.ts
import * as SecureStore from 'expo-secure-store';
import { AuthResponse, User, LoginForm, RegisterForm } from '@/types';
import { apiClient } from '../api/client';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export class AuthService {
  static async login(credentials: LoginForm): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      // Store tokens securely
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.access_token);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.refresh_token);
      
      return response;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error('Login failed. Please try again.');
    }
  }

  static async register(userData: RegisterForm): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      
      // Store tokens securely
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.access_token);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.refresh_token);
      
      return response;
    } catch (error: any) {
      if (error.response?.status === 400) {
        const message = error.response.data?.detail || 'Registration failed';
        throw new Error(message);
      }
      throw new Error('Registration failed. Please try again.');
    }
  }

  static async logout(): Promise<void> {
    try {
      // Call logout endpoint (optional, since JWT is stateless)
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      // Clear stored tokens
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    }
  }

  static async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  }

  static async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  }

  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  static async getCurrentUser(): Promise<User> {
    return await apiClient.get<User>('/auth/me');
  }

  static async refreshToken(): Promise<AuthResponse> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiClient.post<AuthResponse>('/auth/refresh', {
        refresh_token: refreshToken,
      });

      // Update stored tokens
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.access_token);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.refresh_token);

      return response;
    } catch (error) {
      // If refresh fails, logout user
      await this.logout();
      throw new Error('Session expired. Please login again.');
    }
  }
}

// src/services/api/gamificationApi.ts
import { apiClient } from './client';
import { StreakInfo } from '@/types';

export interface ProgressStats {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  words_learned: number;
  words_mastered: number;
  total_lessons_completed: number;
  total_study_time_minutes: number;
  movies_started: number;
  movies_completed: number;
  weekly_goal: number;
  weekly_progress: number;
  recent_activity: any[];
}

export const gamificationApi = {
  getStreak: (): Promise<StreakInfo> => 
    apiClient.get('/gamification/streak'),

  getProgress: (): Promise<ProgressStats> => 
    apiClient.get('/gamification/progress'),

  updateStreak: (): Promise<StreakInfo> => 
    apiClient.post('/gamification/streak'),
};

// src/services/api/learningApi.ts
import { apiClient } from './client';
import { ContinueLearning, MovieProgress } from '@/types';

export const learningApi = {
  getContinueLearning: (): Promise<ContinueLearning> => 
    apiClient.get('/learning/continue'),

  getMovieProgress: (movieId: string): Promise<MovieProgress> => 
    apiClient.get(`/learning/movies/${movieId}/progress`),

  startLesson: (movieId: string) => 
    apiClient.post(`/learning/movies/${movieId}/start`),

  completeLesson: (lessonId: string, results: any) => 
    apiClient.post(`/learning/lessons/${lessonId}/complete`, results),
};

// src/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@/services/auth/AuthService';
import { LoginForm, RegisterForm, User } from '@/types';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginForm) => AuthService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterForm) => AuthService.register(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => AuthService.getCurrentUser(),
    enabled: false, // Will be enabled manually after auth check
  });

  const checkAuthQuery = useQuery({
    queryKey: ['auth-check'],
    queryFn: () => AuthService.isAuthenticated(),
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    user: userQuery.data,
    isAuthenticated: checkAuthQuery.data,
    isLoading: checkAuthQuery.isLoading || userQuery.isLoading,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
  };
};

// src/hooks/useGamification.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationApi } from '@/services/api/gamificationApi';

export const useGamification = () => {
  const queryClient = useQueryClient();

  const streakQuery = useQuery({
    queryKey: ['streak'],
    queryFn: gamificationApi.getStreak,
  });

  const progressQuery = useQuery({
    queryKey: ['progress'],
    queryFn: gamificationApi.getProgress,
  });

  const updateStreakMutation = useMutation({
    mutationFn: gamificationApi.updateStreak,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streak'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });

  return {
    streak: streakQuery.data,
    progress: progressQuery.data,
    updateStreak: updateStreakMutation.mutate,
    isLoading: streakQuery.isLoading || progressQuery.isLoading,
    error: streakQuery.error || progressQuery.error,
  };
};

// src/hooks/useLearning.ts
import { useQuery } from '@tanstack/react-query';
import { learningApi } from '@/services/api/learningApi';

export const useLearning = () => {
  const continueLearningQuery = useQuery({
    queryKey: ['continue-learning'],
    queryFn: learningApi.getContinueLearning,
  });

  return {
    continueLearning: continueLearningQuery.data,
    isLoading: continueLearningQuery.isLoading,
    error: continueLearningQuery.error,
  };
};