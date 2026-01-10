/**
 * Authentication Service
 * Handles user authentication, token management, and session security
 */

import { tokenStorage, setSecureJSON, getSecureJSON, clearAllSecureStorage } from './secureStorage';
import { STORAGE_KEYS, AUTH_CONFIG } from '@/constants';
import type { User, AuthTokens, LoginCredentials, RegisterData } from '@/types/auth';

// Token payload structure (decoded JWT)
interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

/**
 * Decode JWT token without verification (verification happens server-side)
 */
function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired or about to expire
 */
function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;

  const expiryTime = payload.exp * 1000; // Convert to milliseconds
  const now = Date.now();

  // Consider token expired if within buffer time of expiry
  return now >= expiryTime - AUTH_CONFIG.TOKEN_EXPIRY_BUFFER;
}

/**
 * Auth Service Class
 * Singleton pattern for consistent auth state management
 */
class AuthService {
  private refreshPromise: Promise<AuthTokens | null> | null = null;

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    // Development mode: Accept any valid email/password for testing (same as web)
    if (__DEV__ || !process.env.EXPO_PUBLIC_API_URL) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock successful login - matches web mock data
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        firstName: credentials.email.split('@')[0] || 'Demo',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        profileImage: undefined,
        phone: undefined,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        appAccess: [
          { appId: 'hr', appName: 'HR', role: 'Admin' },
          { appId: 'sales', appName: 'Sales', role: 'Manager' },
          { appId: 'accounting', appName: 'Accounting', role: 'Viewer' },
          { appId: 'inventory', appName: 'Inventory', role: 'Admin' },
        ],
      };

      const mockTokens: AuthTokens = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresIn: 3600,
        tokenType: 'Bearer',
      };

      await this.storeTokens(mockTokens);
      await this.storeUser(mockUser);

      return { user: mockUser, tokens: mockTokens };
    }

    // Production: Call actual API
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    const { user, tokens } = data;

    // Store tokens securely
    await this.storeTokens(tokens);
    await this.storeUser(user);

    return { user, tokens };
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const result = await response.json();
    const { user, tokens } = result;

    await this.storeTokens(tokens);
    await this.storeUser(user);

    return { user, tokens };
  }

  /**
   * Logout and clear all stored data
   */
  async logout(): Promise<void> {
    try {
      const accessToken = await tokenStorage.getAccessToken();
      if (accessToken) {
        // Notify server of logout (best effort)
        await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }).catch(() => {
          // Ignore errors - logout should succeed locally regardless
        });
      }
    } finally {
      await clearAllSecureStorage();
    }
  }

  /**
   * Get current access token, refreshing if necessary
   */
  async getValidAccessToken(): Promise<string | null> {
    const accessToken = await tokenStorage.getAccessToken();

    if (!accessToken) {
      return null;
    }

    // If token is still valid, return it
    if (!isTokenExpired(accessToken)) {
      return accessToken;
    }

    // Token expired, try to refresh
    return this.refreshAccessToken();
  }

  /**
   * Refresh access token using refresh token
   * Uses mutex pattern to prevent concurrent refresh requests
   */
  private async refreshAccessToken(): Promise<string | null> {
    // If already refreshing, wait for that promise
    if (this.refreshPromise) {
      const tokens = await this.refreshPromise;
      return tokens?.accessToken || null;
    }

    this.refreshPromise = this.performTokenRefresh();

    try {
      const tokens = await this.refreshPromise;
      return tokens?.accessToken || null;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<AuthTokens | null> {
    const refreshToken = await tokenStorage.getRefreshToken();

    if (!refreshToken) {
      await this.logout();
      return null;
    }

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        // Refresh failed - logout user
        await this.logout();
        return null;
      }

      const tokens: AuthTokens = await response.json();
      await this.storeTokens(tokens);

      return tokens;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await this.logout();
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getValidAccessToken();
    return token !== null;
  }

  /**
   * Get stored user data
   */
  async getUser(): Promise<User | null> {
    return getSecureJSON<User>(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Store tokens securely
   */
  private async storeTokens(tokens: AuthTokens): Promise<void> {
    await Promise.all([
      tokenStorage.setAccessToken(tokens.accessToken),
      tokenStorage.setRefreshToken(tokens.refreshToken),
    ]);
  }

  /**
   * Store user data securely
   */
  private async storeUser(user: User): Promise<void> {
    await setSecureJSON(STORAGE_KEYS.USER_DATA, user);
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset request failed');
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
