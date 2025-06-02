import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (token) {
        console.log('Found token, checking with backend...');
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          console.log('User authenticated:', userData);
          setUser(userData);
        } else {
          console.log('Token invalid, clearing storage');
          await SecureStore.deleteItemAsync('access_token');
          await SecureStore.deleteItemAsync('refresh_token');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoginLoading(true);
    setLoginError(null);
    
    try {
      console.log('Attempting login to:', `${API_BASE_URL}/api/v1/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', response.status, data);

      if (response.ok) {
        await SecureStore.setItemAsync('access_token', data.access_token);
        await SecureStore.setItemAsync('refresh_token', data.refresh_token);
        await checkAuthStatus();
        return { success: true };
      } else {
        setLoginError(data.detail || data.error || 'Login failed');
        return { success: false, error: data.detail || data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Network error. Make sure backend is running.');
      return { success: false, error: 'Network error' };
    } finally {
      setIsLoginLoading(false);
    }
  };

  const register = async (email, password, confirmPassword) => {
    setIsRegisterLoading(true);
    setRegisterError(null);
    
    try {
      console.log('Attempting registration to:', `${API_BASE_URL}/api/v1/auth/register`);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();
      console.log('Registration response:', response.status, data);

      if (response.ok) {
        await SecureStore.setItemAsync('access_token', data.access_token);
        await SecureStore.setItemAsync('refresh_token', data.refresh_token);
        await checkAuthStatus();
        return { success: true };
      } else {
        setRegisterError(data.detail || data.error || 'Registration failed');
        return { success: false, error: data.detail || data.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegisterError('Network error. Make sure backend is running.');
      return { success: false, error: 'Network error' };
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (token) {
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      setUser(null);
    }
  };

  const value = {
    user,
    isLoading,
    isLoginLoading,
    isRegisterLoading,
    loginError,
    registerError,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
