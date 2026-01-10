/**
 * Bank Module Main Screen
 * Matches web app Bank module with sidebar navigation
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
import { useNavigation } from '@react-navigation/native';
import {
  LayoutDashboard,
  Building2,
  ArrowLeftRight,
  RefreshCw,
  Settings,
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// Bank navigation items - matches web exactly
const bankNavItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    screenName: 'Bank',
  },
  {
    id: 'accounts',
    label: 'Accounts',
    icon: Building2,
    screenName: 'BankAccounts',
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: ArrowLeftRight,
    screenName: 'BankTransactions',
  },
  {
    id: 'reconciliation',
    label: 'Reconciliation',
    icon: RefreshCw,
    screenName: 'BankReconciliation',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    screenName: 'BankSettings',
  },
];

// Mock stats data
const bankStats = [
  { label: 'Total Balance', value: '$1,245,830', icon: Wallet, color: '#00BCD4', change: '+5.2%' },
  { label: 'Deposits', value: '$85,420', icon: TrendingUp, color: '#10B981', change: 'This month' },
  { label: 'Withdrawals', value: '$42,150', icon: TrendingDown, color: '#EF4444', change: 'This month' },
  { label: 'Pending', value: '$12,300', icon: RefreshCw, color: '#F59E0B', change: '8 items' },
];

// Mock bank accounts
const bankAccounts = [
  { id: 'ACC-001', name: 'Operating Account', bank: 'Chase Bank', balance: '$845,230', type: 'Checking' },
  { id: 'ACC-002', name: 'Payroll Account', bank: 'Bank of America', balance: '$256,800', type: 'Checking' },
  { id: 'ACC-003', name: 'Savings Account', bank: 'Wells Fargo', balance: '$143,800', type: 'Savings' },
];

// Mock recent transactions
const recentTransactions = [
  { id: 'TXN-001', description: 'Client Payment - Acme', amount: '+$12,450', type: 'Credit', date: 'Today' },
  { id: 'TXN-002', description: 'Office Rent', amount: '-$5,200', type: 'Debit', date: 'Today' },
  { id: 'TXN-003', description: 'Equipment Purchase', amount: '-$3,850', type: 'Debit', date: 'Yesterday' },
  { id: 'TXN-004', description: 'Consulting Fee', amount: '+$8,500', type: 'Credit', date: '2 days ago' },
];

export default function BankScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const navigateTo = (screen: string) => {
    // @ts-ignore - dynamic navigation
    navigation.navigate(screen);
  };

  return (
    <ModuleLayout
      moduleId="bank"
      navItems={bankNavItems}
      activeScreen="Bank"
      title="Bank Overview"
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {bankStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <View key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                    <Icon size={18} color={stat.color} />
                  </View>
                  <Text style={styles.statChange}>{stat.change}</Text>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Bank Accounts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bank Accounts</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.accountsCard}>
            {bankAccounts.map((account, index) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountRow,
                  index !== bankAccounts.length - 1 && styles.accountRowBorder,
                ]}
              >
                <View style={styles.accountIcon}>
                  <Building2 size={20} color="#00BCD4" />
                </View>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>{account.name}</Text>
                  <Text style={styles.accountBank}>{account.bank}</Text>
                </View>
                <View style={styles.accountDetails}>
                  <Text style={styles.accountBalance}>{account.balance}</Text>
                  <Text style={styles.accountType}>{account.type}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: transaction.amount.startsWith('+') ? '#10B981' : '#EF4444' },
                  ]}
                >
                  {transaction.amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo('BankAccounts')}
            >
              <Plus size={20} color="#00BCD4" />
              <Text style={styles.actionText}>Add Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo('BankTransactions')}
            >
              <ArrowLeftRight size={20} color="#00BCD4" />
              <Text style={styles.actionText}>Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo('BankReconciliation')}
            >
              <RefreshCw size={20} color="#00BCD4" />
              <Text style={styles.actionText}>Reconcile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo('BankTransactions')}
            >
              <TrendingUp size={20} color="#00BCD4" />
              <Text style={styles.actionText}>Reports</Text>
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
      color: isDark ? '#94A3B8' : '#64748B',
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
      color: '#00BCD4',
      fontWeight: '500',
    },
    accountsCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      overflow: 'hidden',
    },
    accountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    accountRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    accountIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: isDark ? '#00BCD420' : '#00BCD410',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    accountInfo: {
      flex: 1,
    },
    accountName: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    accountBank: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    accountDetails: {
      alignItems: 'flex-end',
    },
    accountBalance: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    accountType: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
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
    transactionDescription: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    transactionDate: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    transactionAmount: {
      fontSize: 14,
      fontWeight: '600',
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
