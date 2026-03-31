'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, userApi } from '@/lib/api/endpoints';
import { decodeToken, isTokenExpired } from '@/lib/auth/jwt';
import { tokenStorage } from '@/lib/auth/token';
import { LoginInput, SignupInput } from '@/lib/validations/auth';
import { UserProfile } from '@/types/app';

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (values: LoginInput) => Promise<UserProfile | null>;
  signup: (values: SignupInput) => Promise<UserProfile | null>;
  logout: () => void;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = () => {
    tokenStorage.clear();
    setUser(null);
  };

  const refreshProfile = async () => {
    const token = tokenStorage.get();
    if (!token || isTokenExpired(token)) {
      clearSession();
      return null;
    }

    try {
      const response = await userApi.profile();
      setUser(response.data as UserProfile);
      return response.data as UserProfile;
    } catch {
      clearSession();
      return null;
    }
  };

  const login = async (values: LoginInput) => {
    const response = await authApi.login(values);
    tokenStorage.set(response.data.token);
    return refreshProfile();
  };

  const signup = async (values: SignupInput) => {
    const response = await authApi.register(values);
    tokenStorage.set(response.data.token);
    return refreshProfile();
  };

  const logout = () => {
    clearSession();
  };

  useEffect(() => {
    const bootstrap = async () => {
      const token = tokenStorage.get();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const decoded = decodeToken(token);
      if (!decoded || isTokenExpired(token)) {
        clearSession();
        setIsLoading(false);
        return;
      }

      await refreshProfile();
      setIsLoading(false);
    };

    bootstrap();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      refreshProfile
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
