import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '@/core/firebase';
import { userService } from '@/core/database';
import { AuthStore } from '../types';

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isEmailVerified: false,

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Create or update user document in Firestore
      const existingUser = await userService.get(result.user.uid);
      if (!existingUser) {
        await userService.create(result.user.uid, {
          email: result.user.email!,
          settings: {
            language: 'en',
            notifications: true,
            darkMode: false,
          },
        });
      }
      
      set({ 
        user: result.user, 
        loading: false,
        isAuthenticated: true,
        isEmailVerified: result.user.emailVerified,
      });
    } catch (error: any) {
      set({ 
        error: getAuthErrorMessage(error.code), 
        loading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await userService.create(result.user.uid, {
        email: result.user.email!,
        settings: {
          language: 'en',
          notifications: true,
          darkMode: false,
        },
      });

      // Send email verification
      await sendEmailVerification(result.user);
      
      set({ 
        user: result.user, 
        loading: false,
        isAuthenticated: true,
        isEmailVerified: false,
      });
    } catch (error: any) {
      set({ 
        error: getAuthErrorMessage(error.code), 
        loading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  // Sign out
  logout: async () => {
    set({ loading: true, error: null });
    try {
      await signOut(auth);
      set({ 
        user: null, 
        loading: false,
        isAuthenticated: false,
        isEmailVerified: false,
      });
    } catch (error: any) {
      set({ 
        error: getAuthErrorMessage(error.code), 
        loading: false,
      });
      throw error;
    }
  },

  // Set user (for auth state listener)
  setUser: (user: User | null) => {
    set({ 
      user,
      isAuthenticated: !!user,
      isEmailVerified: user?.emailVerified || false,
      loading: false,
    });
  },

  // Clear error message
  clearError: () => set({ error: null }),

  // Send email verification
  sendEmailVerification: async () => {
    const { user } = get();
    if (!user) throw new Error('No user found');
    
    set({ loading: true, error: null });
    try {
      await sendEmailVerification(user);
      set({ loading: false });
    } catch (error: any) {
      set({ 
        error: getAuthErrorMessage(error.code), 
        loading: false,
      });
      throw error;
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    set({ loading: true, error: null });
    try {
      await sendPasswordResetEmail(auth, email);
      set({ loading: false });
    } catch (error: any) {
      set({ 
        error: getAuthErrorMessage(error.code), 
        loading: false,
      });
      throw error;
    }
  },
}));

// Initialize auth state listener
export const initializeAuthListener = () => {
  return onAuthStateChanged(auth, (user) => {
    useAuthStore.getState().setUser(user);
  });
};

// Helper function to convert Firebase error codes to user-friendly messages
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Ma jiro qof ku diiwaan gashan emailkaas - No user found with this email';
    case 'auth/wrong-password':
      return 'Furaha sirta ah wuu qaldan yahay - Incorrect password';
    case 'auth/email-already-in-use':
      return 'Emailkan horay baa loo isticmaalay - This email is already registered';
    case 'auth/weak-password':
      return 'Furaha sirta ahi wuu daciif yahay - Password should be at least 6 characters';
    case 'auth/invalid-email':
      return 'Emailka wuu qaldan yahay - Invalid email format';
    case 'auth/too-many-requests':
      return 'Codsiyo badan ayaa la soo diray - Too many attempts, please try later';
    case 'auth/network-request-failed':
      return 'Khalkhal shabakad - Network error, check your connection';
    case 'auth/user-disabled':
      return 'Akoonkan waa la xiray - This account has been disabled';
    case 'auth/invalid-credential':
      return 'Macluumaadka galitaanka qaldan - Invalid credentials';
    default:
      return 'Qalad ayaa dhacay - An error occurred, please try again';
  }
}
