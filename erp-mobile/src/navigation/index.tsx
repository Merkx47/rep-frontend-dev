/**
 * Root Navigation
 * Main navigation container and navigator setup
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme, View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
} from './types';
import { useAuth } from '@/hooks/useAuth';
import { colors, darkColors } from '@/config/theme';

// Placeholder screens - will be replaced with actual screens
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import DashboardScreen from '@/screens/dashboard/DashboardScreen';

// Tab icons
import { Home, Grid3X3, Bell, User } from 'lucide-react-native';

// Create navigators
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

/**
 * Auth Navigator
 */
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

/**
 * Placeholder screens for tabs
 */
function ModulesScreen() {
  return <View style={styles.placeholder} />;
}

function NotificationsScreen() {
  return <View style={styles.placeholder} />;
}

function ProfileScreen() {
  return <View style={styles.placeholder} />;
}

/**
 * Main Tab Navigator
 */
function MainNavigator() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? darkColors : colors;

  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: themeColors.primary[500],
        tabBarInactiveTintColor: themeColors.text.secondary,
        tabBarStyle: {
          backgroundColor: themeColors.background.primary,
          borderTopColor: themeColors.border.light,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <MainTab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <MainTab.Screen
        name="ModulesTab"
        component={ModulesScreen}
        options={{
          tabBarLabel: 'Modules',
          tabBarIcon: ({ color, size }) => <Grid3X3 size={size} color={color} />,
        }}
      />
      <MainTab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />
      <MainTab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </MainTab.Navigator>
  );
}

/**
 * Loading Screen
 */
function LoadingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? darkColors : colors;

  return (
    <View
      style={[
        styles.loadingContainer,
        { backgroundColor: themeColors.background.primary },
      ]}
    >
      <ActivityIndicator size="large" color={themeColors.primary[500]} />
    </View>
  );
}

/**
 * Root Navigator
 */
export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? darkColors : colors;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: themeColors.background.primary,
        },
      }}
    >
      {isAuthenticated ? (
        <RootStack.Screen name="Main" component={MainNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}

/**
 * Navigation Container with Provider
 */
export function Navigation() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? darkColors : colors;

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          dark: isDark,
          colors: {
            primary: themeColors.primary[500],
            background: themeColors.background.primary,
            card: themeColors.background.secondary,
            text: themeColors.text.primary,
            border: themeColors.border.default,
            notification: themeColors.error.main,
          },
          fonts: {
            regular: {
              fontFamily: 'System',
              fontWeight: '400',
            },
            medium: {
              fontFamily: 'System',
              fontWeight: '500',
            },
            bold: {
              fontFamily: 'System',
              fontWeight: '700',
            },
            heavy: {
              fontFamily: 'System',
              fontWeight: '900',
            },
          },
        }}
      >
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Navigation;
