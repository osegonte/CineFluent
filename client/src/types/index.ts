// API Response Types
export interface User {
  id: string;
  email: string;
  is_premium: boolean;
  created_at: string;
  words_learned: number;
  current_streak: number;
  longest_streak: number;
  total_study_time: number;
  movies_completed: number;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface StreakInfo {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active: string | null;
}

export interface MovieProgress {
  movie_id: string;
  movie_title: string;
  total_scenes: number;
  completed_scenes: number;
  progress_percentage: number;
  current_scene: number;
  estimated_time_remaining_minutes: number;
  difficulty_level: string;
}

export interface ContinueLearning {
  has_active_session: boolean;
  recommended_movie: MovieProgress | null;
  recent_movies: MovieProgress[];
  new_movie_suggestions: any[];
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirm_password: string;
}
