import { useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated] = useState(false);
  const [isLoading] = useState(false);
  const [user] = useState(null);

  return {
    login: () => {},
    register: () => {},
    logout: () => {},
    user,
    isAuthenticated,
    isLoading,
    isLoginLoading: false,
    isRegisterLoading: false,
    loginError: null,
    registerError: null,
  };
};
