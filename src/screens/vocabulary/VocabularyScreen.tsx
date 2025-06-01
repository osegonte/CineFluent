// src/screens/vocabulary/VocabularyScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

export const VocabularyScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vocabulary</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="search" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>347</Text>
            <Text style={styles.statLabel}>Words Learned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Ready to Review</Text>
          </View>
        </View>

        {/* Practice Buttons */}
        <View style={styles.practiceSection}>
          <Text style={styles.sectionTitle}>Practice</Text>
          
          <TouchableOpacity style={styles.practiceCard}>
            <View style={styles.practiceIcon}>
              <Ionicons name="flash" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.practiceContent}>
              <Text style={styles.practiceTitle}>Quick Review</Text>
              <Text style={styles.practiceSubtitle}>5 minutes • 12 words</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.practiceCard}>
            <View style={styles.practiceIcon}>
              <Ionicons name="book" size={24} color={COLORS.secondary} />
            </View>
            <View style={styles.practiceContent}>
              <Text style={styles.practiceTitle}>Learn New Words</Text>
              <Text style={styles.practiceSubtitle}>From recent lessons</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.practiceCard}>
            <View style={styles.practiceIcon}>
              <Ionicons name="trophy" size={24} color={COLORS.warning} />
            </View>
            <View style={styles.practiceContent}>
              <Text style={styles.practiceTitle}>Challenge Mode</Text>
              <Text style={styles.practiceSubtitle}>Test your mastery</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Recent Words */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Words</Text>
          {['Sheriff', 'Lugar', 'Interstellar', 'Inception'].map((word, index) => (
            <TouchableOpacity key={word} style={styles.wordCard}>
              <Text style={styles.wordText}>{word}</Text>
              <View style={styles.wordMeta}>
                <Text style={styles.wordLevel}>Intermediate</Text>
                <Text style={styles.wordProgress}>85%</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// src/screens/leaderboard/LeaderboardScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

type LeaderboardTab = 'global' | 'friends';

export const LeaderboardScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('global');

  const leaderboardData = [
    { rank: 1, name: 'Alex Chen', streak: 45, words: 1250, isCurrentUser: false },
    { rank: 2, name: 'Maria Rodriguez', streak: 42, words: 1180, isCurrentUser: false },
    { rank: 3, name: 'You', streak: 23, words: 347, isCurrentUser: true },
    { rank: 4, name: 'John Smith', streak: 38, words: 890, isCurrentUser: false },
    { rank: 5, name: 'Emma Thompson', streak: 35, words: 825, isCurrentUser: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="information-circle-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'global' && styles.activeTab]}
          onPress={() => setActiveTab('global')}
        >
          <Text style={[styles.tabText, activeTab === 'global' && styles.activeTabText]}>
            Global
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            Friends
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Current User Highlight */}
        <View style={styles.currentUserCard}>
          <View style={styles.currentUserRank}>
            <Text style={styles.currentUserRankNumber}>3</Text>
          </View>
          <View style={styles.currentUserInfo}>
            <Text style={styles.currentUserName}>Your Rank</Text>
            <Text style={styles.currentUserStats}>23 day streak • 347 words</Text>
          </View>
          <Ionicons name="star" size={24} color={COLORS.warning} />
        </View>

        {/* Leaderboard List */}
        <View style={styles.leaderboardSection}>
          <Text style={styles.sectionTitle}>Top Learners</Text>
          {leaderboardData.map((user) => (
            <View
              key={user.rank}
              style={[
                styles.leaderboardItem,
                user.isCurrentUser && styles.currentUserItem,
              ]}
            >
              <View style={styles.rankContainer}>
                <Text style={styles.rankNumber}>{user.rank}</Text>
                {user.rank <= 3 && (
                  <Ionicons
                    name="trophy"
                    size={16}
                    color={user.rank === 1 ? '#FFD700' : user.rank === 2 ? '#C0C0C0' : '#CD7F32'}
                  />
                )}
              </View>
              <View style={styles.userInfo}>
                <Text style={[styles.userName, user.isCurrentUser && styles.currentUserNameText]}>
                  {user.name}
                </Text>
                <Text style={styles.userStats}>
                  {user.streak} day streak • {user.words} words
                </Text>
              </View>
              {user.isCurrentUser && (
                <View style={styles.currentUserBadge}>
                  <Text style={styles.currentUserBadgeText}>You</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// src/screens/profile/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { COLORS } from '@/constants';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.email.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.membershipBadge}>
            <Text style={styles.membershipText}>
              {user?.is_premium ? 'Premium Member' : 'Free Member'}
            </Text>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsOverview}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.current_streak || 0}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.words_learned || 0}</Text>
            <Text style={styles.statLabel}>Words Learned</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.movies_completed || 0}</Text>
            <Text style={styles.statLabel}>Movies Completed</Text>
          </View>
        </View>

        {/* Learning Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="trending-up" size={24} color={COLORS.primary} />
            <Text style={styles.menuItemText}>Study Statistics</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="calendar" size={24} color={COLORS.secondary} />
            <Text style={styles.menuItemText}>Learning Calendar</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="school" size={24} color={COLORS.success} />
            <Text style={styles.menuItemText}>Achievements</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.menuItem}>
            <Ionicons name="notifications" size={24} color={COLORS.warning} />
            <Text style={styles.menuItemText}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
            />
          </View>
          
          <View style={styles.menuItem}>
            <Ionicons name="moon" size={24} color={COLORS.text} />
            <Text style={styles.menuItemText}>Dark Mode</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
            />
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="language" size={24} color={COLORS.secondary} />
            <Text style={styles.menuItemText}>Language Preferences</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle" size={24} color={COLORS.primary} />
            <Text style={styles.menuItemText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {!user?.is_premium && (
            <TouchableOpacity style={styles.premiumItem}>
              <Ionicons name="star" size={24} color={COLORS.warning} />
              <Text style={styles.premiumText}>Upgrade to Premium</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person" size={24} color={COLORS.text} />
            <Text style={styles.menuItemText}>Account Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.success} />
            <Text style={styles.menuItemText}>Privacy & Security</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
            <Ionicons name="log-out" size={24} color={COLORS.error} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Vocabulary Screen Styles
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  practiceSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  practiceIcon: {
    marginRight: 16,
  },
  practiceContent: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  practiceSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  recentSection: {
    marginBottom: 32,
  },
  wordCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  wordText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  wordMeta: {
    alignItems: 'flex-end',
  },
  wordLevel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  wordProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Leaderboard Screen Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: 'white',
  },
  currentUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 24,
  },
  currentUserRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  currentUserRankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  currentUserInfo: {
    flex: 1,
  },
  currentUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  currentUserStats: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  leaderboardSection: {
    marginBottom: 32,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  currentUserNameText: {
    color: COLORS.primary,
  },
  userStats: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  currentUserBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  currentUserBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },

  // Profile Screen Styles
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userEmail: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
  membershipBadge: {
    backgroundColor: user?.is_premium ? COLORS.warning : COLORS.textSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  membershipText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  statsOverview: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  section: {
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 16,
  },
  premiumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  premiumText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 16,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.error,
    marginLeft: 16,
  },
});