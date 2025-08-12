import { User } from 'firebase/auth';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthStore extends AuthState {
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
  sendEmailVerification: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export interface AuthScreenProps {
  navigation: any;
  route?: any;
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthValidationResult {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
}
