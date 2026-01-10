/**
 * Environment Configuration
 * Centralized environment variable management with type safety
 */

import Constants from 'expo-constants';

interface EnvironmentConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  enableAnalytics: boolean;
  enableCrashReporting: boolean;
  enableBiometrics: boolean;
  appVersion: string;
  buildNumber: string;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
}

const getEnvironment = (): 'development' | 'staging' | 'production' => {
  const env = process.env.EXPO_PUBLIC_ENV || 'development';
  if (env === 'production' || env === 'staging') {
    return env;
  }
  return 'development';
};

const environment = getEnvironment();

export const env: EnvironmentConfig = {
  // API Configuration
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',

  // Environment
  environment,
  isDevelopment: environment === 'development',
  isStaging: environment === 'staging',
  isProduction: environment === 'production',

  // Features
  enableAnalytics: environment === 'production',
  enableCrashReporting: environment !== 'development',
  enableBiometrics: true,

  // App Info
  appVersion: Constants.expoConfig?.version || '1.0.0',
  buildNumber: Constants.expoConfig?.ios?.buildNumber ||
               Constants.expoConfig?.android?.versionCode?.toString() || '1',
};

// Validate required environment variables in production
if (env.isProduction) {
  const requiredVars = ['EXPO_PUBLIC_API_URL'];
  const missing = requiredVars.filter(
    (varName) => !process.env[varName]
  );

  if (missing.length > 0) {
    console.warn(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

export default env;
