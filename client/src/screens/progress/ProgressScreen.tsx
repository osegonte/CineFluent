import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { styles } from './ProgressScreen.styles';

export const ProgressScreen: React.FC = () => {
  const weeklyGoal = { current: 3, target: 5 };
  const achievements = [
    { id: 1, title: "First Movie", description: "Complete your first movie", earned: true },
    { id: 2, title: "Week Warrior", description: "7-day learning streak", earned: true },
    { id: 3, title: "Vocabulary Master", description: "Learn 100 words", earned: false },
  ];

  // Activity calendar data (simplified)
  const activityDays = Array.from({ length: 35 }, (_, i) => ({
    day: i + 1,
    active: Math.random() > 0.3,
    intensity: Math.floor(Math.random() * 4) + 1
  }));

  const getActivityColor = (intensity: number) => {
    const colors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
    return colors[intensity];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your learning journey</Text>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
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
            <View style={styles.goalHeader}>
              <Text style={styles.goalText}>{weeklyGoal.current}/{weeklyGoal.target}</Text>
              <Text style={styles.goalSubtext}>2 more lessons to reach your goal</Text>
            </View>
            <View style={styles.goalProgress}>
              <View style={[
                styles.goalProgressFill, 
                { width: `${(weeklyGoal.current / weeklyGoal.target) * 100}%` }
              ]} />
            </View>
          </View>
        </View>

        {/* Learning Activity Calendar */}
        <View style={styles.section}>
          <View style={styles.activityHeader}>
            <Ionicons name="calendar" size={20} color={COLORS.text} />
            <Text style={styles.sectionTitle}>Learning Activity</Text>
          </View>
          <View style={styles.calendar}>
            <View style={styles.weekdays}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <Text key={index} style={styles.weekdayText}>{day}</Text>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {activityDays.map((day, index) => (
                <View 
                  key={index}
                  style={[
                    styles.calendarDay,
                    { backgroundColor: day.active ? getActivityColor(day.intensity) : '#ebedf0' }
                  ]}
                />
              ))}
            </View>
            <View style={styles.activityLegend}>
              <Text style={styles.legendText}>Less</Text>
              <View style={styles.legendDots}>
                {[1, 2, 3, 4].map(level => (
                  <View 
                    key={level}
                    style={[styles.legendDot, { backgroundColor: getActivityColor(level) }]}
                  />
                ))}
              </View>
              <Text style={styles.legendText}>More</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.achievementHeader}>
            <Ionicons name="trophy" size={20} color={COLORS.warning} />
            <Text style={styles.sectionTitle}>Achievements</Text>
          </View>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={[
                styles.achievementIcon,
                { backgroundColor: achievement.earned ? COLORS.success : COLORS.border }
              ]}>
                <Ionicons 
                  name={achievement.earned ? "checkmark" : "star-outline"} 
                  size={20} 
                  color={achievement.earned ? "white" : COLORS.textSecondary} 
                />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={[
                  styles.achievementTitle,
                  { opacity: achievement.earned ? 1 : 0.6 }
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  { opacity: achievement.earned ? 1 : 0.6 }
                ]}>
                  {achievement.description}
                </Text>
              </View>
              {achievement.earned && (
                <Text style={styles.earnedBadge}>Earned</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
