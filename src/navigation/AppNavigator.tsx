// Replace src/navigation/AppNavigator.tsx with this:
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainNavigator } from './MainNavigator';
import { useAuth } from '@/hooks/useAuth';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  );
};