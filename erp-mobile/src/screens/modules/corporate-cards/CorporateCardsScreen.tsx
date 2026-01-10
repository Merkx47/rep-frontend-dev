/**
 * Corporate Cards Module Main Screen
 * Matches web app Corporate Cards module with sidebar navigation
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
  CreditCard,
  Receipt,
  Gauge,
  Settings,
  Plus,
  TrendingUp,
  DollarSign,
  Users,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// Corporate Cards navigation items - matches web exactly
const cardsNavItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    screenName: 'CorporateCards',
  },
  {
    id: 'cards',
    label: 'Cards',
    icon: CreditCard,
    screenName: 'CorporateCardsList',
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: Receipt,
    screenName: 'CorporateCardsExpenses',
  },
  {
    id: 'limits',
    label: 'Limits',
    icon: Gauge,
    screenName: 'CorporateCardsLimits',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    screenName: 'CorporateCardsSettings',
  },
];

// Mock stats data
const cardStats = [
  { label: 'Total Spend', value: '$45,830', icon: DollarSign, color: '#FFC107', change: 'This month' },
  { label: 'Active Cards', value: '24', icon: CreditCard, color: '#3B82F6', change: '+2' },
  { label: 'Cardholders', value: '18', icon: Users, color: '#10B981', change: 'Active' },
  { label: 'Pending Expenses', value: '$3,420', icon: Receipt, color: '#F59E0B', change: '12 items' },
];

// Mock cards
const cards = [
  { id: 'CARD-001', holder: 'John Smith', last4: '4582', limit: '$5,000', spent: '$2,450', status: 'Active' },
  { id: 'CARD-002', holder: 'Sarah Johnson', last4: '7891', limit: '$3,000', spent: '$1,820', status: 'Active' },
  { id: 'CARD-003', holder: 'Mike Brown', last4: '3456', limit: '$2,500', spent: '$2,340', status: 'Near Limit' },
  { id: 'CARD-004', holder: 'Emily Davis', last4: '9012', limit: '$4,000', spent: '$890', status: 'Active' },
];

// Mock recent expenses
const recentExpenses = [
  { id: 'EXP-001', description: 'Office Supplies', amount: '$245', card: '***4582', date: 'Today' },
  { id: 'EXP-002', description: 'Client Dinner', amount: '$180', card: '***7891', date: 'Yesterday' },
  { id: 'EXP-003', description: 'Software License', amount: '$599', card: '***3456', date: '2 days ago' },
  { id: 'EXP-004', description: 'Travel Booking', amount: '$1,250', card: '***4582', date: '3 days ago' },
];

export default function CorporateCardsScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const navigateTo = (screen: string) => {
    // @ts-ignore - dynamic navigation
    navigation.navigate(screen);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#10B981';
      case 'Near Limit':
        return '#F59E0B';
      case 'Blocked':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <ModuleLayout
      moduleId="corporate-cards"
      navItems={cardsNavItems}
      activeScreen="CorporateCards"
      title="Corporate Cards Overview"
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {cardStats.map((stat, index) => {
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

        {/* Cards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Corporate Cards</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsCard}>
            {cards.map((card, index) => (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.cardRow,
                  index !== cards.length - 1 && styles.cardRowBorder,
                ]}
              >
                <View style={styles.cardIcon}>
                  <CreditCard size={20} color="#FFC107" />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardHolder}>{card.holder}</Text>
                  <Text style={styles.cardNumber}>•••• {card.last4}</Text>
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.cardSpent}>{card.spent} / {card.limit}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(card.status)}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(card.status) },
                      ]}
                    >
                      {card.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Expenses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.expensesCard}>
            {recentExpenses.map((expense, index) => (
              <TouchableOpacity
                key={expense.id}
                style={[
                  styles.expenseRow,
                  index !== recentExpenses.length - 1 && styles.expenseRowBorder,
                ]}
              >
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseDescription}>{expense.description}</Text>
                  <Text style={styles.expenseCard}>{expense.card} • {expense.date}</Text>
                </View>
                <Text style={styles.expenseAmount}>{expense.amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo('CorporateCardsList')}>
              <Plus size={20} color="#FFC107" />
              <Text style={styles.actionText}>Issue Card</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo('CorporateCardsLimits')}>
              <Gauge size={20} color="#FFC107" />
              <Text style={styles.actionText}>Set Limits</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo('CorporateCardsExpenses')}>
              <Receipt size={20} color="#FFC107" />
              <Text style={styles.actionText}>Expenses</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo('CorporateCardsList')}>
              <TrendingUp size={20} color="#FFC107" />
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
      color: '#FFC107',
      fontWeight: '500',
    },
    cardsCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      overflow: 'hidden',
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    cardRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    cardIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: isDark ? '#FFC10720' : '#FFC10710',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    cardInfo: {
      flex: 1,
    },
    cardHolder: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    cardNumber: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    cardDetails: {
      alignItems: 'flex-end',
    },
    cardSpent: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 4,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    statusText: {
      fontSize: 11,
      fontWeight: '600',
    },
    expensesCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      overflow: 'hidden',
    },
    expenseRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    expenseRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    expenseInfo: {
      flex: 1,
    },
    expenseDescription: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    expenseCard: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    expenseAmount: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
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
