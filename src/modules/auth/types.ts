import { User } from 'firebase/auth';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}
