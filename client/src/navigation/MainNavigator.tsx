import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '@/screens/dashboard/DashboardScreen';
import { LessonScreen } from '@/screens/learning/LessonScreen';
import { VocabularyScreen } from '@/screens/vocabulary/VocabularyScreen';
import { ProgressScreen } from '@/screens/progress/ProgressScreen';
import { CommunityScreen } from '@/screens/community/CommunityScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { COLORS } from '@/constants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Learn Stack - includes dashboard and lesson screens
const LearnStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Lesson" component={LessonScreen} />
    </Stack.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Learn') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="Learn" 
        component={LearnStack}
        options={{ tabBarLabel: 'Learn' }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{ tabBarLabel: 'Progress' }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{ tabBarLabel: 'Community' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};
