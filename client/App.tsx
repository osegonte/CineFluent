import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator } from 'react-native';

// Import auth components
import { AuthProvider, useAuth } from './src/components/auth/AuthContext';
import { LoginScreen } from './src/components/auth/LoginScreen';
import { RegisterScreen } from './src/components/auth/RegisterScreen';

// Import main app navigation
import { MainNavigator } from './src/navigation/MainNavigator';

const Stack = createStackNavigator();

// Auth Stack - for login/register screens
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Loading screen component
const LoadingScreen = () => {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#f8fafc'
    }}>
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={{ 
        marginTop: 16, 
        fontSize: 16, 
        color: '#6b7280'
      }}>
        Loading...
      </Text>
    </View>
  );
};

// Main app component that switches between auth and main app
const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('App state:', { isAuthenticated, isLoading });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

// Root app component
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
