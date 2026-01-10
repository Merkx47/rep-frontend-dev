/**
 * Register Screen
 * Matches web app signup form - clean, minimal design
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
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Sun, Moon, Check } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

import { useAuth } from '@/hooks/useAuth';
import { VALIDATION } from '@/constants';
import type { AuthStackParamList } from '@/navigation/types';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

// Social icons as SVG (same as login)
const AppleIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill={color}>
    <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
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
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="#1877F2">
    <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </Svg>
);

const LinkedInIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="#0A66C2">
    <Path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </Svg>
);

const XIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill={color}>
    <Path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </Svg>
);

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading, clearError } = useAuth();
  const systemColorScheme = useColorScheme();

  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    clearError();

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      newErrors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
    }

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        acceptTerms,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      Alert.alert('Registration Failed', message);
    }
  };

  const styles = createStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Theme Toggle */}
          <View style={styles.themeToggleContainer}>
            <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
              {isDarkMode ? (
                <Sun size={20} color="#9CA3AF" />
              ) : (
                <Moon size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create account</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name Row */}
            <View style={styles.nameRow}>
              <View style={styles.halfWidth}>
                <TextInput
                  style={[styles.input, errors.firstName && styles.inputError]}
                  placeholder="First name"
                  placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (errors.firstName) setErrors({ ...errors, firstName: '' });
                  }}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.halfWidth}>
                <TextInput
                  style={[styles.input, errors.lastName && styles.inputError]}
                  placeholder="Last name"
                  placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    if (errors.lastName) setErrors({ ...errors, lastName: '' });
                  }}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Email */}
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
            />

            {/* Password */}
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Password"
              placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              secureTextEntry
              autoCapitalize="none"
              editable={!isLoading}
            />

            {/* Terms Checkbox */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => {
                setAcceptTerms(!acceptTerms);
                if (errors.terms) setErrors({ ...errors, terms: '' });
              }}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && <Check size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Icons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <AppleIcon color={isDarkMode ? '#FFFFFF' : '#000000'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <GoogleIcon />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <FacebookIcon />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <LinkedInIcon />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <XIcon color={isDarkMode ? '#FFFFFF' : '#000000'} />
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
                <Text style={styles.loginLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Copyright */}
          <Text style={styles.copyright}>
            Copyright 2024-2025 Qorpy. All Rights Reserved.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingVertical: 20,
    },
    themeToggleContainer: {
      alignItems: 'flex-end',
      marginBottom: 24,
    },
    themeToggle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    form: {
      flex: 1,
    },
    nameRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    halfWidth: {
      flex: 1,
    },
    input: {
      height: 52,
      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#0F172A',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      marginBottom: 16,
    },
    inputError: {
      borderColor: '#EF4444',
    },
    termsRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: isDark ? '#475569' : '#CBD5E1',
      marginRight: 10,
      marginTop: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: '#3B82F6',
      borderColor: '#3B82F6',
    },
    termsText: {
      flex: 1,
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
      lineHeight: 20,
    },
    termsLink: {
      color: '#3B82F6',
      fontWeight: '500',
    },
    errorText: {
      fontSize: 12,
      color: '#EF4444',
      marginBottom: 12,
      marginLeft: 30,
    },
    registerButton: {
      height: 52,
      backgroundColor: '#0F172A',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
    },
    registerButtonDisabled: {
      opacity: 0.7,
    },
    registerButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: isDark ? '#334155' : '#E2E8F0',
    },
    dividerText: {
      paddingHorizontal: 16,
      fontSize: 14,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 12,
      marginBottom: 24,
    },
    socialButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    loginLink: {
      fontSize: 14,
      fontWeight: '600',
      color: '#3B82F6',
    },
    copyright: {
      textAlign: 'center',
      fontSize: 12,
      color: isDark ? '#475569' : '#94A3B8',
      marginTop: 24,
    },
  });
