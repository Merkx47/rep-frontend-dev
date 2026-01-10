/**
 * Authentication Types
 * Type definitions for authentication-related data structures
 */

import type { UserRole } from '@/constants';

// User object returned from API
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  profileImage?: string;
  phone?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  appAccess: AppAccess[];
}

// App access permissions for user
export interface AppAccess {
  appId: string;
  appName: string;
  role: string;
  permissions?: string[];
}

// Authentication tokens
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  tokenType?: string;
}

// Login request payload
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Registration request payload
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
  acceptTerms: boolean;
}

// Password reset request
export interface PasswordResetRequest {
  email: string;
}

// Password reset confirmation
export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Auth state for context/store
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth context actions
export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

// Combined auth context type
export type AuthContextType = AuthState & AuthActions;

// Biometric auth types
export type BiometricType = 'fingerprint' | 'facial' | 'iris' | 'none';

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometricType?: BiometricType;
}
