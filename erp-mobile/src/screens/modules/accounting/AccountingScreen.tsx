/**
 * Accounting Module Main Screen
 * Matches web app Accounting module with sidebar navigation
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  PieChart,
  Building2,
  Settings,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// Accounting navigation items - matches web exactly
const accountingNavItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    screenName: 'Accounting',
  },
  {
    id: 'general-ledger',
    label: 'General Ledger',
    icon: BookOpen,
    children: [
      { id: 'chart-of-accounts', label: 'Chart of Accounts', screenName: 'AccountingChartOfAccounts' },
      { id: 'journal-entries', label: 'Journal Entries', screenName: 'AccountingJournals' },
    ],
  },
  {
    id: 'reports',
    label: 'Financial Reports',
    icon: PieChart,
    children: [
      { id: 'profit-loss', label: 'Profit & Loss', screenName: 'AccountingProfitLoss' },
      { id: 'balance-sheet', label: 'Balance Sheet', screenName: 'AccountingBalanceSheet' },
    ],
  },
  {
    id: 'bank',
    label: 'Bank Management',
    icon: Building2,
    screenName: 'AccountingBank',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    screenName: 'AccountingSettings',
  },
];

// Mock stats data
const accountingStats = [
  { label: 'Total Revenue', value: '$458,230', icon: TrendingUp, color: '#10B981', change: '+15.2%' },
  { label: 'Total Expenses', value: '$312,450', icon: TrendingDown, color: '#EF4444', change: '+8.4%' },
  { label: 'Net Income', value: '$145,780', icon: DollarSign, color: '#3B82F6', change: '+22.1%' },
  { label: 'Pending Entries', value: '12', icon: Receipt, color: '#F59E0B', change: '-3' },
];

// Mock recent transactions
const recentTransactions = [
  { id: 'JE-001', description: 'Office Supplies', amount: '-$1,250', type: 'Expense', date: 'Today' },
  { id: 'JE-002', description: 'Client Payment - Acme', amount: '+$12,450', type: 'Revenue', date: 'Today' },
  { id: 'JE-003', description: 'Equipment Depreciation', amount: '-$850', type: 'Expense', date: 'Yesterday' },
  { id: 'JE-004', description: 'Consulting Services', amount: '+$5,200', type: 'Revenue', date: '2 days ago' },
];

export default function AccountingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  return (
    <ModuleLayout
      moduleId="accounting"
      navItems={accountingNavItems}
      activeScreen="Accounting"
      title="Accounting Overview"
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {accountingStats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.change.startsWith('+');
            return (
              <View key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                    <Icon size={18} color={stat.color} />
                  </View>
                  <Text
                    style={[
                      styles.statChange,
                      { color: isPositive ? '#10B981' : '#EF4444' },
                    ]}
                  >
                    {stat.change}
                  </Text>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsCard}>
            {recentTransactions.map((transaction, index) => (
              <TouchableOpacity
                key={transaction.id}
                style={[
                  styles.transactionRow,
                  index !== recentTransactions.length - 1 && styles.transactionRowBorder,
                ]}
              >
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionId}>{transaction.id}</Text>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                </View>
                <View style={styles.transactionDetails}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: transaction.amount.startsWith('+') ? '#10B981' : '#EF4444' },
                    ]}
                  >
                    {transaction.amount}
                  </Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <FileText size={20} color="#4CAF50" />
              <Text style={styles.actionText}>New Entry</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <PieChart size={20} color="#4CAF50" />
              <Text style={styles.actionText}>Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <BookOpen size={20} color="#4CAF50" />
              <Text style={styles.actionText}>Accounts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Building2 size={20} color="#4CAF50" />
              <Text style={styles.actionText}>Bank</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ModuleLayout>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 32,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      width: '48%',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    statHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    statIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statChange: {
      fontSize: 12,
      fontWeight: '600',
    },
    statValue: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    viewAllText: {
      fontSize: 14,
      color: '#4CAF50',
      fontWeight: '500',
    },
    transactionsCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      overflow: 'hidden',
    },
    transactionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    transactionRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    transactionInfo: {
      flex: 1,
    },
    transactionId: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    transactionDescription: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    transactionDetails: {
      alignItems: 'flex-end',
    },
    transactionAmount: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 2,
    },
    transactionDate: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    actionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    actionButton: {
      width: '48%',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    actionText: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
  });
