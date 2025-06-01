// src/screens/auth/LoginScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '@/constants';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CineFluent Login</Text>
      <Text style={styles.subtitle}>Login screen coming soon...</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>Go to Register</Text>
      </TouchableOpacity>
    </View>
  );
};

// src/screens/auth/RegisterScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '@/constants';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CineFluent Register</Text>
      <Text style={styles.subtitle}>Register screen coming soon...</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// src/screens/dashboard/DashboardScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants';

export const DashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Your learning progress will appear here</Text>
    </View>
  );
};

// src/screens/vocabulary/VocabularyScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants';

export const VocabularyScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vocabulary</Text>
      <Text style={styles.subtitle}>Vocabulary practice coming soon</Text>
    </View>
  );
};

// src/screens/leaderboard/LeaderboardScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants';

export const LeaderboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <Text style={styles.subtitle}>Compete with other learners</Text>
    </View>
  );
};

// src/screens/profile/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants';

export const ProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Your profile and settings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});