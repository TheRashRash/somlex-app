import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { authService } from './services';
import { AuthState, SignInCredentials, SignUpCredentials } from './types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user: User | null) => {
      setAuthState((prev) => ({
        ...prev,
        user,
        loading: false,
      }));
    });

    return unsubscribe;
  }, []);

  const signIn = async (credentials: SignInCredentials) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.signIn(credentials.email, credentials.password);
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Sign in failed',
      }));
      throw error;
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.signUp(credentials.email, credentials.password);
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Sign up failed',
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.signOut();
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Sign out failed',
      }));
      throw error;
    }
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    clearError,
  };
};
