// src/screens/dashboard/DashboardScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { useLearning } from '@/hooks/useLearning';
import { StreakWidget } from '@/components/dashboard/StreakWidget';
import { ProgressWidget } from '@/components/dashboard/ProgressWidget';
import { ContinueLearningCard } from '@/components/dashboard/ContinueLearningCard';
import { RecentMoviesCarousel } from '@/components/dashboard/RecentMoviesCarousel';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { COLORS } from '@/constants';

export const DashboardScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { streak, progress, isLoading: gamificationLoading } = useGamification();
  const { continueLearning, isLoading: learningLoading } = useLearning();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Refetch all data
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (gamificationLoading || learningLoading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.userName}>{user?.email.split('@')[0]}!</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <StreakWidget streak={streak} />
          <ProgressWidget progress={progress} />
        </View>

        {/* Continue Learning Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <ContinueLearningCard data={continueLearning} />
        </View>

        {/* Recent Movies */}
        {continueLearning?.recent_movies && continueLearning.recent_movies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Movies</Text>
            <RecentMoviesCarousel movies={continueLearning.recent_movies} />
          </View>
        )}

        {/* Daily Goal */}
        <View style={styles.section}>
          <DailyGoalCard progress={progress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// src/components/dashboard/StreakWidget.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StreakInfo } from '@/types';
import { COLORS } from '@/constants';

interface StreakWidgetProps {
  streak?: StreakInfo;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({ streak }) => {
  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={styles.container}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="flame" size={24} color="white" />
      </View>
      <View style={styles.content}>
        <Text style={styles.number}>{streak?.current_streak || 0}</Text>
        <Text style={styles.label}>Day Streak</Text>
      </View>
      <View style={styles.best}>
        <Text style={styles.bestLabel}>Best: {streak?.longest_streak || 0}</Text>
      </View>
    </LinearGradient>
  );
};

// src/components/dashboard/ProgressWidget.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressStats } from '@/services/api/gamificationApi';
import { COLORS } from '@/constants';

interface ProgressWidgetProps {
  progress?: ProgressStats;
}

export const ProgressWidget: React.FC<ProgressWidgetProps> = ({ progress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="book" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.number}>{progress?.words_mastered || 0}</Text>
        <Text style={styles.label}>Words Learned</Text>
      </View>
      <View style={styles.additional}>
        <Text style={styles.additionalText}>
          {progress?.total_lessons_completed || 0} lessons
        </Text>
      </View>
    </View>
  );
};

// src/components/dashboard/ContinueLearningCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ContinueLearning } from '@/types';
import { COLORS } from '@/constants';

interface ContinueLearningCardProps {
  data?: ContinueLearning;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  data,
}) => {
  if (!data?.has_active_session || !data.recommended_movie) {
    return (
      <View style={styles.emptyCard}>
        <Ionicons name="film-outline" size={48} color={COLORS.textSecondary} />
        <Text style={styles.emptyTitle}>Start Your First Movie</Text>
        <Text style={styles.emptyText}>
          Choose a movie to begin learning with subtitles
        </Text>
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Explore Movies</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const movie = data.recommended_movie;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <ImageBackground
        source={{ uri: 'https://via.placeholder.com/300x180/6366f1/ffffff?text=Movie' }}
        style={styles.cardBackground}
        imageStyle={styles.cardImage}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <Text style={styles.movieTitle}>{movie.movie_title}</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${movie.progress_percentage}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(movie.progress_percentage)}% Complete
              </Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.sceneText}>
                Scene {movie.current_scene} of {movie.total_scenes}
              </Text>
              <View style={styles.playButton}>
                <Ionicons name="play" size={16} color="white" />
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

// src/components/dashboard/RecentMoviesCarousel.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MovieProgress } from '@/types';
import { COLORS } from '@/constants';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

interface RecentMoviesCarouselProps {
  movies: MovieProgress[];
}

export const RecentMoviesCarousel: React.FC<RecentMoviesCarouselProps> = ({
  movies,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {movies.map((movie, index) => (
        <MovieCard key={movie.movie_id} movie={movie} isFirst={index === 0} />
      ))}
    </ScrollView>
  );
};

interface MovieCardProps {
  movie: MovieProgress;
  isFirst: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isFirst }) => {
  return (
    <TouchableOpacity
      style={[styles.movieCard, isFirst && styles.firstCard]}
      activeOpacity={0.8}
    >
      <View style={styles.movieImagePlaceholder}>
        <Text style={styles.movieInitial}>
          {movie.movie_title.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.movieTitle} numberOfLines={2}>
        {movie.movie_title}
      </Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${movie.progress_percentage}%` },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {Math.round(movie.progress_percentage)}% complete
      </Text>
    </TouchableOpacity>
  );
};

// Daily Goal Card Component
const DailyGoalCard: React.FC<{ progress?: ProgressStats }> = ({ progress }) => {
  const weeklyProgress = progress?.weekly_progress || 0;
  const weeklyGoal = progress?.weekly_goal || 150;
  const progressPercentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

  return (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalTitle}>Weekly Goal</Text>
        <Text style={styles.goalTime}>
          {weeklyProgress}min / {weeklyGoal}min
        </Text>
      </View>
      <View style={styles.goalProgress}>
        <View style={styles.goalProgressBar}>
          <View
            style={[styles.goalProgressFill, { width: `${progressPercentage}%` }]}
          />
        </View>
      </View>
      <Text style={styles.goalDescription}>
        {progressPercentage >= 100
          ? '🎉 Goal achieved! Keep up the great work!'
          : `${Math.round(weeklyGoal - weeklyProgress)} minutes left this week`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  logoutButton: {
    padding: 8,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },

  // StreakWidget styles
  iconContainer: {
    marginBottom: 8,
  },
  content: {
    alignItems: 'center',
    marginBottom: 8,
  },
  number: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  label: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  best: {
    alignItems: 'center',
  },
  bestLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },

  // ContinueLearningCard styles
  card: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardBackground: {
    flex: 1,
  },
  cardImage: {
    borderRadius: 12,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: 'white',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sceneText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: '600',
  },

  // RecentMoviesCarousel styles
  movieCard: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  firstCard: {
    marginLeft: 0,
  },
  movieImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  movieInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },

  // Daily Goal Card styles
  goalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  goalTime: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  goalProgress: {
    marginBottom: 12,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});