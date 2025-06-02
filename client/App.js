import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';

// Main authenticated app content (your previous demo)
const AuthenticatedApp = () => {
  const { user, logout } = useAuth();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎬 CineFluent</Text>
        <Text style={styles.subtitle}>Welcome back, {user?.email || 'User'}!</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>✨ You're Now Logged In!</Text>
        
        <View style={styles.features}>
          <Text style={styles.feature}>🎯 Ready to start learning with movies</Text>
          <Text style={styles.feature}>📚 Access your vocabulary</Text>
          <Text style={styles.feature}>🔥 Track your progress</Text>
          <Text style={styles.feature}>🏆 Earn achievements</Text>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>🚀 Stage 3 Progress</Text>
          <Text style={styles.statusText}>✅ Authentication System: Complete!</Text>
          <Text style={styles.statusText}>🚧 Lesson Flow: Coming Next</Text>
          <Text style={styles.statusText}>🚧 Vocabulary System: Planned</Text>
          <Text style={styles.statusText}>🚧 Quiz System: Planned</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Simple navigation between Login and Register
const AuthFlow = () => {
  const [currentScreen, setCurrentScreen] = React.useState('Login');

  const navigation = {
    navigate: (screen) => setCurrentScreen(screen),
  };

  if (currentScreen === 'Login') {
    return <LoginScreen navigation={navigation} />;
  } else {
    return <RegisterScreen navigation={navigation} />;
  }
};

// Loading component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#6366f1" />
    <Text style={styles.loadingText}>Loading CineFluent...</Text>
  </View>
);

// Main app component with authentication logic
const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <AuthenticatedApp /> : <AuthFlow />;
};

// Root component with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 32,
    textAlign: 'center',
  },
  features: {
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  feature: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
    paddingLeft: 8,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
    maxWidth: 400,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
});
