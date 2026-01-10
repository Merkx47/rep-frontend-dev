/**
 * Forgot Password Screen
 * Request password reset via email
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
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react-native';

import { authService } from '@/services/auth';
import { colors, darkColors, spacing, borderRadius, fontSize } from '@/config/theme';
import { VALIDATION } from '@/constants';
import type { AuthStackParamList } from '@/navigation/types';

type ForgotPasswordNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkColors : colors;

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      await authService.requestPasswordReset(email.trim().toLowerCase());
      setIsSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = createStyles(theme);

  // Success state
  if (isSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <CheckCircle size={64} color={colors.success.main} />
          </View>
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={styles.successMessage}>
            We've sent a password reset link to{'\n'}
            <Text style={styles.emailHighlight}>{email}</Text>
          </Text>
          <Text style={styles.successHint}>
            Didn't receive the email? Check your spam folder or try again.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Back to Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              setIsSuccess(false);
              setEmail('');
            }}
          >
            <Text style={styles.secondaryButtonText}>Try Different Email</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              disabled={isLoading}
            >
              <ArrowLeft size={24} color={theme.text.primary} />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                No worries! Enter your email and we'll send you a link to reset your password.
              </Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputContainer, emailError && styles.inputError]}>
                <Mail size={20} color={theme.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
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
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Back to Login */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
              style={styles.backToLogin}
            >
              <ArrowLeft size={16} color={colors.primary[500]} />
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof colors | typeof darkColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing['2xl'],
      paddingVertical: spacing.xl,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing['4xl'],
    },
    backButton: {
      padding: spacing.sm,
      marginRight: spacing.md,
      marginTop: 2,
    },
    headerText: {
      flex: 1,
    },
    title: {
      fontSize: fontSize['2xl'],
      fontWeight: '700',
      color: theme.text.primary,
      marginBottom: spacing.sm,
    },
    subtitle: {
      fontSize: fontSize.md,
      color: theme.text.secondary,
      lineHeight: 22,
    },
    form: {
      flex: 1,
    },
    inputGroup: {
      marginBottom: spacing.xl,
    },
    label: {
      fontSize: fontSize.sm,
      fontWeight: '500',
      color: theme.text.primary,
      marginBottom: spacing.sm,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background.secondary,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border.default,
      paddingHorizontal: spacing.md,
    },
    inputError: {
      borderColor: colors.error.main,
    },
    inputIcon: {
      marginRight: spacing.sm,
    },
    input: {
      flex: 1,
      height: 48,
      fontSize: fontSize.md,
      color: theme.text.primary,
    },
    errorText: {
      fontSize: fontSize.xs,
      color: colors.error.main,
      marginTop: spacing.xs,
    },
    primaryButton: {
      backgroundColor: colors.primary[500],
      height: 52,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    primaryButtonText: {
      fontSize: fontSize.lg,
      fontWeight: '600',
      color: '#fff',
    },
    secondaryButton: {
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
    },
    secondaryButtonText: {
      fontSize: fontSize.md,
      fontWeight: '500',
      color: colors.primary[500],
    },
    footer: {
      alignItems: 'center',
      paddingVertical: spacing['2xl'],
    },
    backToLogin: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    backToLoginText: {
      fontSize: fontSize.md,
      fontWeight: '500',
      color: colors.primary[500],
    },
    // Success state styles
    successContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing['3xl'],
    },
    successIcon: {
      marginBottom: spacing['2xl'],
    },
    successTitle: {
      fontSize: fontSize['2xl'],
      fontWeight: '700',
      color: theme.text.primary,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    successMessage: {
      fontSize: fontSize.md,
      color: theme.text.secondary,
      textAlign: 'center',
      marginBottom: spacing.lg,
      lineHeight: 22,
    },
    emailHighlight: {
      fontWeight: '600',
      color: theme.text.primary,
    },
    successHint: {
      fontSize: fontSize.sm,
      color: theme.text.disabled,
      textAlign: 'center',
      marginBottom: spacing['3xl'],
    },
  });
