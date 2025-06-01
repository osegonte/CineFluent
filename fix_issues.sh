#!/bin/bash
# Fix CineFluent Dependencies and Missing Files

echo "🔧 Fixing CineFluent issues..."

# 1. Create missing directory
mkdir -p src/screens/progress

# 2. Create the ProgressScreen that was missing
cat > src/screens/progress/ProgressScreen.tsx << 'EOF'
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

export const ProgressScreen: React.FC = () => {
  const weeklyActivity = [
    [1, 0, 1, 1, 1, 0, 0],
    [1, 1, 0, 1, 0, 1, 1],
    [0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0],
    [0, 1, 0, 1, 1, 1, 1],
  ];

  const achievements = [
    { id: 1, title: "First Movie", description: "Complete your first movie", earned: true },
    { id: 2, title: "Week Warrior", description: "7-day learning streak", earned: true },
    { id: 3, title: "Vocabulary Master", description: "Learn 100 words", earned: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your learning journey</Text>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color={COLORS.error} />
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="book" size={24} color={COLORS.primary} />
            <Text style={styles.statNumber}>347</Text>
            <Text style={styles.statLabel}>Words Learned</Text>
          </View>
        </View>

        {/* Weekly Goal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Goal</Text>
          <View style={styles.goalCard}>
            <Text style={styles.goalText}>3/5</Text>
            <Text style={styles.goalSubtext}>2 more lessons to reach your goal</Text>
            <View style={styles.goalProgress}>
              <View style={[styles.goalFill, { width: '60%' }]} />
            </View>
          </View>
        </View>

        {/* Learning Activity Calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Learning Activity</Text>
          <View style={styles.calendar}>
            <View style={styles.weekDays}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <Text key={index} style={styles.weekDay}>{day}</Text>
              ))}
            </View>
            {weeklyActivity.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {week.map((active, dayIndex) => (
                  <View
                    key={dayIndex}
                    style={[
                      styles.activityDay,
                      { backgroundColor: active ? COLORS.success : COLORS.border }
                    ]}
                  />
                ))}
              </View>
            ))}
            <View style={styles.activityLegend}>
              <Text style={styles.legendText}>Less</Text>
              <View style={styles.legendDots}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.border }]} />
                <View style={[styles.legendDot, { backgroundColor: '#86efac' }]} />
                <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
                <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
              </View>
              <Text style={styles.legendText}>More</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Achievements</Text>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Ionicons 
                  name={achievement.earned ? "checkmark-circle" : "ellipse-outline"} 
                  size={24} 
                  color={achievement.earned ? COLORS.success : COLORS.textSecondary} 
                />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
              {achievement.earned && (
                <View style={styles.earnedBadge}>
                  <Text style={styles.earnedText}>Earned</Text>
                </View>
              )}
            </View>
          ))}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  goalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  goalSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  goalProgress: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
  },
  goalFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  calendar: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekDay: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 32,
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  activityDay: {
    width: 32,
    height: 32,
    borderRadius: 4,
  },
  activityLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  legendDots: {
    flexDirection: 'row',
    gap: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  achievementDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  earnedBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  earnedText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
});
EOF

# 3. Fix package.json with compatible versions for Expo 49
cat > package.json << 'EOF'
{
  "name": "cinefluent-client",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "start:dev": "expo start --dev-client",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build": "expo build",
    "build:web": "expo export:web",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@expo/vector-icons": "^13.0.0",
    "@react-navigation/bottom-tabs": "^6.5.20",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/stack": "^6.3.29",
    "@tanstack/react-query": "^4.29.0",
    "expo": "~49.0.15",
    "expo-linear-gradient": "~12.3.0",
    "expo-secure-store": "~12.3.1",
    "expo-status-bar": "~1.6.0",
    "react": "18.2.0",
    "react-native": "0.72.6",
    "react-native-gesture-handler": "~2.12.0",
    "react-native-reanimated": "~3.3.0",
    "react-native-safe-area-context": "4.6.3",
    "react-native-screens": "~3.22.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.14",
    "@types/react-native": "~0.72.2",
    "babel-plugin-module-resolver": "^5.0.0",
    "typescript": "^5.1.3"
  },
  "private": true
}
EOF

# 4. Create missing lesson directory
mkdir -p src/screens/lesson

# 5. Clean npm and reinstall with legacy peer deps
echo "🧹 Cleaning npm cache and node_modules..."
rm -rf node_modules package-lock.json
npm cache clean --force

echo "📦 Installing dependencies with --legacy-peer-deps..."
npm install --legacy-peer-deps

echo "✅ Dependencies fixed!"
echo ""
echo "📱 Next steps:"
echo "1. npm start"
echo "2. Press 'w' for web or scan QR code"
echo "3. Test the 'Continue' button on dashboard"
echo ""
echo "🎯 If you still get errors, run:"
echo "   npx expo install --fix"