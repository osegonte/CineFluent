import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('access_token');
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = await this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.makeRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, confirm_password: string) {
    return this.makeRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, confirm_password }),
    });
  }

  async getCurrentUser() {
    return this.makeRequest('/api/v1/auth/me');
  }

  async logout() {
    return this.makeRequest('/api/v1/auth/logout', { method: 'POST' });
  }

  // Learning endpoints
  async getContinueLearning() {
    return this.makeRequest('/api/v1/learning/continue');
  }

  async getLesson(lessonId: string) {
    return this.makeRequest(`/api/v1/lessons/${lessonId}`);
  }

  async getQuiz(lessonId: string) {
    return this.makeRequest(`/api/v1/quiz/${lessonId}`);
  }

  async submitQuiz(lessonId: string, answers: any) {
    return this.makeRequest(`/api/v1/quiz/${lessonId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  // Gamification endpoints
  async getStreak() {
    return this.makeRequest('/api/v1/gamification/streak');
  }

  async getProgress() {
    return this.makeRequest('/api/v1/gamification/progress');
  }

  // Movies endpoints
  async getMovies() {
    return this.makeRequest('/api/v1/movies');
  }
}

export const apiService = new ApiService();
