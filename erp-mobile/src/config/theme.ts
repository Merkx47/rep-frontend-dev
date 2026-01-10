/**
 * Theme Configuration
 * Matches the Qorpy web app design system
 */

export const colors = {
  // Primary - Qorpy Blue
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#4B6BF5', // Main primary
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Neutral / Gray
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic Colors
  success: {
    light: '#D1FAE5',
    main: '#38C793',
    dark: '#059669',
  },
  warning: {
    light: '#FEF3C7',
    main: '#F17B2C',
    dark: '#D97706',
  },
  error: {
    light: '#FEE2E2',
    main: '#DF1C41',
    dark: '#DC2626',
  },
  info: {
    light: '#DBEAFE',
    main: '#3B82F6',
    dark: '#2563EB',
  },

  // Background
  background: {
    primary: '#FFFFFF',
    secondary: '#F7F8F8',
    tertiary: '#EEF0F1',
  },

  // Text
  text: {
    primary: '#2B3036',
    secondary: '#697582',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  // Border
  border: {
    light: '#EEF0F1',
    default: '#E5E7EB',
    dark: '#D1D5DB',
  },

  // Pure colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const darkColors = {
  // Primary remains similar but slightly lighter
  primary: {
    ...colors.primary,
    500: '#6B8AF7',
  },

  // Neutral / Gray - inverted
  gray: {
    50: '#111827',
    100: '#1F2937',
    200: '#374151',
    300: '#4B5563',
    400: '#6B7280',
    500: '#9CA3AF',
    600: '#D1D5DB',
    700: '#E5E7EB',
    800: '#F3F4F6',
    900: '#F9FAFB',
  },

  // Semantic Colors (same as light mode)
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
  info: colors.info,

  // Background
  background: {
    primary: '#191C1F',
    secondary: '#23272B',
    tertiary: '#2D3339',
  },

  // Text
  text: {
    primary: '#F7F8F8',
    secondary: '#9CA3AF',
    disabled: '#6B7280',
    inverse: '#111827',
  },

  // Border
  border: {
    light: '#374151',
    default: '#4B5563',
    dark: '#6B7280',
  },

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 30,
  '5xl': 36,
} as const;

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const theme = {
  colors,
  darkColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  lineHeight,
  shadows,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
export type FontSize = keyof typeof fontSize;
export type FontWeight = keyof typeof fontWeight;
