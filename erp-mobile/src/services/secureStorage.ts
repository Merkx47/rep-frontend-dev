/**
 * Secure Storage Service
 * Handles encrypted storage for sensitive data using expo-secure-store
 * Uses device keychain (iOS) / EncryptedSharedPreferences (Android)
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { STORAGE_KEYS, type StorageKey } from '@/constants';

// SecureStore options for maximum security
const secureStoreOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

/**
 * Securely store a value
 * @param key - Storage key from STORAGE_KEYS
 * @param value - String value to store
 */
export async function setSecureItem(
  key: StorageKey,
  value: string
): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      // Web fallback - use localStorage (less secure, for dev only)
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value, secureStoreOptions);
  } catch (error) {
    console.error(`Failed to store secure item: ${key}`, error);
    throw new Error(`Failed to store secure item: ${key}`);
  }
}

/**
 * Retrieve a securely stored value
 * @param key - Storage key from STORAGE_KEYS
 * @returns The stored value or null if not found
 */
export async function getSecureItem(
  key: StorageKey
): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key, secureStoreOptions);
  } catch (error) {
    console.error(`Failed to retrieve secure item: ${key}`, error);
    return null;
  }
}

/**
 * Delete a securely stored value
 * @param key - Storage key from STORAGE_KEYS
 */
export async function deleteSecureItem(key: StorageKey): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key, secureStoreOptions);
  } catch (error) {
    console.error(`Failed to delete secure item: ${key}`, error);
    throw new Error(`Failed to delete secure item: ${key}`);
  }
}

/**
 * Store JSON data securely
 * @param key - Storage key from STORAGE_KEYS
 * @param value - Object to store (will be serialized)
 */
export async function setSecureJSON<T>(
  key: StorageKey,
  value: T
): Promise<void> {
  const serialized = JSON.stringify(value);
  await setSecureItem(key, serialized);
}

/**
 * Retrieve and parse JSON data
 * @param key - Storage key from STORAGE_KEYS
 * @returns Parsed object or null if not found
 */
export async function getSecureJSON<T>(
  key: StorageKey
): Promise<T | null> {
  const value = await getSecureItem(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Failed to parse secure JSON: ${key}`, error);
    return null;
  }
}

/**
 * Clear all secure storage (for logout)
 */
export async function clearAllSecureStorage(): Promise<void> {
  const keys = Object.values(STORAGE_KEYS);
  await Promise.all(keys.map((key) => deleteSecureItem(key)));
}

/**
 * Check if a key exists in secure storage
 * @param key - Storage key from STORAGE_KEYS
 */
export async function hasSecureItem(key: StorageKey): Promise<boolean> {
  const value = await getSecureItem(key);
  return value !== null;
}

// Token-specific helpers for convenience
export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return getSecureItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  async setAccessToken(token: string): Promise<void> {
    return setSecureItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return getSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  async setRefreshToken(token: string): Promise<void> {
    return setSecureItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      deleteSecureItem(STORAGE_KEYS.ACCESS_TOKEN),
      deleteSecureItem(STORAGE_KEYS.REFRESH_TOKEN),
    ]);
  },

  async hasTokens(): Promise<boolean> {
    const accessToken = await getSecureItem(STORAGE_KEYS.ACCESS_TOKEN);
    return accessToken !== null;
  },
};

export default {
  setSecureItem,
  getSecureItem,
  deleteSecureItem,
  setSecureJSON,
  getSecureJSON,
  clearAllSecureStorage,
  hasSecureItem,
  tokenStorage,
};
