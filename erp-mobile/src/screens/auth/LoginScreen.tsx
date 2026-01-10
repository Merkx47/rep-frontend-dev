/**
 * Login Screen
 * Replica of web auth page - User authentication with email/password and social login
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { Sun, Moon } from 'lucide-react-native';

import { useAuth } from '@/hooks/useAuth';
import { colors, darkColors, spacing, borderRadius } from '@/config/theme';
import { VALIDATION } from '@/constants';
import type { AuthStackParamList } from '@/navigation/types';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

// Social Icons as SVG components
const AppleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="#FFFFFF">
    <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </Svg>
);

const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </Svg>
);

const FacebookIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="#FFFFFF">
    <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </Svg>
);

const LinkedInIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="#FFFFFF">
    <Path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </Svg>
);

const XIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="#FFFFFF">
    <Path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </Svg>
);

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isLoading, error, clearError } = useAuth();
  const systemColorScheme = useColorScheme();

  // Local dark mode state - defaults to system preference
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const theme = isDarkMode ? darkColors : colors;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    clearError();

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
      setEmailError('Invalid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login({ email: email.trim().toLowerCase(), password });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      Alert.alert('Login Failed', message);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Social Login', `${provider} login coming soon!`);
  };

  const styles = createStyles(theme, isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      {/* Dark Mode Toggle - Fixed Position */}
      <TouchableOpacity
        style={styles.themeToggle}
        onPress={toggleDarkMode}
        activeOpacity={0.7}
      >
        {isDarkMode ? (
          <Sun size={20} color={theme.text.secondary} />
        ) : (
          <Moon size={20} color={theme.text.secondary} />
        )}
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Sign in</Text>
            <Text style={styles.subtitle}>to access Qorpy ERP</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, emailError && styles.inputError]}
                placeholder="Email address or mobile number"
                placeholderTextColor={theme.text.disabled}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                editable={!isLoading}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, passwordError && styles.inputError]}
                placeholder="Password"
                placeholderTextColor={theme.text.disabled}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                editable={!isLoading}
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            {/* API Error */}
            {error ? (
              <View style={styles.apiError}>
                <Text style={styles.apiErrorText}>{error}</Text>
              </View>
            ) : null}

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Next</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Social Login */}
          <View style={styles.socialSection}>
            <Text style={styles.socialLabel}>Sign in using</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                onPress={() => handleSocialLogin('Apple')}
              >
                <AppleIcon />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton, isDarkMode && styles.googleButtonDark]}
                onPress={() => handleSocialLogin('Google')}
              >
                <GoogleIcon />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialButton, styles.facebookButton]}
                onPress={() => handleSocialLogin('Facebook')}
              >
                <FacebookIcon />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialButton, styles.linkedinButton]}
                onPress={() => handleSocialLogin('LinkedIn')}
              >
                <LinkedInIcon />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialButton, styles.xButton]}
                onPress={() => handleSocialLogin('X')}
              >
                <XIcon />
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have a Qorpy account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              disabled={isLoading}
            >
              <Text style={styles.registerLink}>Sign up now</Text>
            </TouchableOpacity>
          </View>

          {/* Copyright */}
          <Text style={styles.copyright}>
            © 2026, Qorpy Technologies Ltd. All Rights Reserved.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof colors | typeof darkColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    },
    themeToggle: {
      position: 'absolute',
      top: 60,
      right: 16,
      zIndex: 50,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#334155' : '#F3F4F6',
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing['2xl'],
      paddingVertical: spacing['3xl'],
      justifyContent: 'center',
    },
    header: {
      marginBottom: spacing['2xl'],
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 2,
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    form: {
      marginBottom: spacing['3xl'],
    },
    inputGroup: {
      marginBottom: spacing.lg,
    },
    input: {
      height: 52,
      backgroundColor: isDark ? '#334155' : '#FFFFFF',
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: isDark ? '#475569' : '#D1D5DB',
      paddingHorizontal: spacing.lg,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#111827',
    },
    inputError: {
      borderColor: colors.error.main,
    },
    errorText: {
      fontSize: 12,
      color: colors.error.main,
      marginTop: spacing.xs,
    },
    apiError: {
      backgroundColor: colors.error.light,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginBottom: spacing.lg,
    },
    apiErrorText: {
      fontSize: 14,
      color: colors.error.dark,
      textAlign: 'center',
    },
    loginButton: {
      backgroundColor: '#2563EB',
      height: 52,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginButtonDisabled: {
      opacity: 0.7,
    },
    loginButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#FFFFFF',
    },
    socialSection: {
      marginBottom: spacing['3xl'],
    },
    socialLabel: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: spacing.lg,
    },
    socialButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    socialButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    appleButton: {
      backgroundColor: '#000000',
    },
    googleButton: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#D1D5DB',
    },
    googleButtonDark: {
      backgroundColor: '#334155',
      borderColor: '#475569',
    },
    facebookButton: {
      backgroundColor: '#1877F2',
    },
    linkedinButton: {
      backgroundColor: '#0A66C2',
    },
    xButton: {
      backgroundColor: '#000000',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: spacing['4xl'],
    },
    footerText: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    registerLink: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#60A5FA' : '#2563EB',
    },
    copyright: {
      fontSize: 12,
      color: isDark ? '#6B7280' : '#9CA3AF',
      textAlign: 'center',
    },
  });
