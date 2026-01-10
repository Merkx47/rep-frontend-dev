/**
 * Dashboard Screen
 * Main home screen showing overview and quick access to modules
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Users,
  ShoppingCart,
  Calculator,
  Package,
  Building2,
  CreditCard,
  FileText,
  Settings,
  TrendingUp,
  TrendingDown,
  DollarSign,
  UserCheck,
  Bell,
} from 'lucide-react-native';

import { useAuth } from '@/hooks/useAuth';
import { colors, darkColors, spacing, borderRadius, fontSize, shadows } from '@/config/theme';
import { CURRENCY } from '@/constants';

// Module configuration
const modules = [
  { id: 'hr', name: 'HR', icon: Users, color: '#E91E63' },
  { id: 'sales', name: 'Sales', icon: ShoppingCart, color: '#2196F3' },
  { id: 'accounting', name: 'Accounting', icon: Calculator, color: '#4CAF50' },
  { id: 'inventory', name: 'Inventory', icon: Package, color: '#FF9800' },
  { id: 'bank', name: 'Bank', icon: Building2, color: '#9C27B0' },
  { id: 'cards', name: 'Cards', icon: CreditCard, color: '#00BCD4' },
  { id: 'invoice', name: 'Invoice', icon: FileText, color: '#795548' },
  { id: 'settings', name: 'Settings', icon: Settings, color: '#607D8B' },
];

// Mock stats data
const stats = [
  {
    id: 'revenue',
    label: 'Revenue',
    value: '₦12.5M',
    change: '+12.5%',
    isPositive: true,
    icon: DollarSign,
  },
  {
    id: 'orders',
    label: 'Orders',
    value: '1,234',
    change: '+8.2%',
    isPositive: true,
    icon: ShoppingCart,
  },
  {
    id: 'employees',
    label: 'Employees',
    value: '156',
    change: '+3',
    isPositive: true,
    icon: UserCheck,
  },
  {
    id: 'expenses',
    label: 'Expenses',
    value: '₦4.2M',
    change: '-5.1%',
    isPositive: false,
    icon: TrendingDown,
  },
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkColors : colors;

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const styles = createStyles(theme, isDark);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{greeting()},</Text>
          <Text style={styles.userName}>
            {user?.firstName || 'User'} {user?.lastName?.charAt(0) || ''}.
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color={theme.text.primary} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary[500]}
          />
        }
      >
        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <View style={styles.statHeader}>
                <stat.icon size={20} color={theme.text.secondary} />
                <View
                  style={[
                    styles.statChange,
                    stat.isPositive ? styles.statChangePositive : styles.statChangeNegative,
                  ]}
                >
                  {stat.isPositive ? (
                    <TrendingUp size={12} color={colors.success.dark} />
                  ) : (
                    <TrendingDown size={12} color={colors.error.dark} />
                  )}
                  <Text
                    style={[
                      styles.statChangeText,
                      stat.isPositive ? styles.statChangeTextPositive : styles.statChangeTextNegative,
                    ]}
                  >
                    {stat.change}
                  </Text>
                </View>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Access Modules */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.modulesGrid}>
          {modules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleCard}
              activeOpacity={0.7}
            >
              <View style={[styles.moduleIcon, { backgroundColor: `${module.color}15` }]}>
                <module.icon size={24} color={module.color} />
              </View>
              <Text style={styles.moduleName}>{module.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {[
            { id: 1, title: 'New order #1234', time: '2 min ago', type: 'order' },
            { id: 2, title: 'Payment received', time: '15 min ago', type: 'payment' },
            { id: 3, title: 'Employee check-in', time: '1 hour ago', type: 'attendance' },
            { id: 4, title: 'Invoice #5678 sent', time: '2 hours ago', type: 'invoice' },
          ].map((activity) => (
            <TouchableOpacity key={activity.id} style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof colors | typeof darkColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border.light,
    },
    headerLeft: {
      flex: 1,
    },
    greeting: {
      fontSize: fontSize.sm,
      color: theme.text.secondary,
    },
    userName: {
      fontSize: fontSize.xl,
      fontWeight: '700',
      color: theme.text.primary,
    },
    notificationButton: {
      position: 'relative',
      padding: spacing.sm,
    },
    notificationBadge: {
      position: 'absolute',
      top: 4,
      right: 4,
      backgroundColor: colors.error.main,
      width: 18,
      height: 18,
      borderRadius: 9,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#fff',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing['3xl'],
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: '600',
      color: theme.text.primary,
      marginTop: spacing.xl,
      marginBottom: spacing.md,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    statCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: theme.background.secondary,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      ...shadows.sm,
    },
    statHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    statChange: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
      gap: 2,
    },
    statChangePositive: {
      backgroundColor: colors.success.light,
    },
    statChangeNegative: {
      backgroundColor: colors.error.light,
    },
    statChangeText: {
      fontSize: fontSize.xs,
      fontWeight: '600',
    },
    statChangeTextPositive: {
      color: colors.success.dark,
    },
    statChangeTextNegative: {
      color: colors.error.dark,
    },
    statValue: {
      fontSize: fontSize['2xl'],
      fontWeight: '700',
      color: theme.text.primary,
    },
    statLabel: {
      fontSize: fontSize.sm,
      color: theme.text.secondary,
      marginTop: spacing.xs,
    },
    modulesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    moduleCard: {
      width: '22%',
      aspectRatio: 1,
      backgroundColor: theme.background.secondary,
      borderRadius: borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.sm,
      ...shadows.sm,
    },
    moduleIcon: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    moduleName: {
      fontSize: fontSize.xs,
      fontWeight: '500',
      color: theme.text.primary,
      textAlign: 'center',
    },
    activityList: {
      backgroundColor: theme.background.secondary,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      ...shadows.sm,
    },
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border.light,
    },
    activityDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary[500],
      marginRight: spacing.md,
    },
    activityContent: {
      flex: 1,
    },
    activityTitle: {
      fontSize: fontSize.md,
      fontWeight: '500',
      color: theme.text.primary,
    },
    activityTime: {
      fontSize: fontSize.xs,
      color: theme.text.secondary,
      marginTop: 2,
    },
  });
