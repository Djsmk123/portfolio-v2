"use client";

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthService, AuthState, AuthUser, AuthSession, AuthError } from './auth-client';
import { clearAdminUser, setAdminUserFromSession, isTokenExpired } from './localstorage'
import type { Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  isTokenValid: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true
  });

  // Auto-refresh token function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const authService = AuthService.getInstance();
    return await authService.refreshToken();
  }, []);

  // Check if token is valid
  const isTokenValid = useCallback((): boolean => {
    return !isTokenExpired();
  }, []);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!authState.session || !authState.user) return;

    const checkAndRefreshToken = async () => {
      if (isTokenExpired()) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          // Token refresh failed, sign out user
          const authService = AuthService.getInstance();
          await authService.signOut();
        }
      }
    };

    // Check token validity every 5 minutes
    const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    // Also check immediately
    checkAndRefreshToken();

    return () => clearInterval(interval);
  }, [authState.session, authState.user, refreshToken]);

  useEffect(() => {
    const authService = AuthService.getInstance();
    
    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe((state) => {
      setAuthState(state);
      
      // Update localStorage for admin functionality
      if (state.session && state.user) {
        const sessionData = {
          access_token: state.session.access_token,
          refresh_token: state.session.refresh_token,
          expires_in: state.session.expires_in,
          expires_at: state.session.expires_at,
          token_type: state.session.token_type,
          user: {
            id: state.user.id,
            email: state.user.email
          }
        };
        setAdminUserFromSession(sessionData as Session);
      } else {
        clearAdminUser();
      }
    });

    return unsubscribe;
  }, []);

  // Handle page visibility change to refresh token when user comes back
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && authState.user && authState.session) {
        // User came back to the page, check if token needs refresh
        const authService = AuthService.getInstance();
        authService.refreshToken();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [authState.user, authState.session]);

  const signIn = async (email: string, password: string) => {
    const authService = AuthService.getInstance();
    const { error } = await authService.signIn(email, password);
    return { error };
  };

  const signOut = async () => {
    const authService = AuthService.getInstance();
    await authService.signOut();
  };

  const value = {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    signIn,
    signOut,
    refreshToken,
    isTokenValid,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
