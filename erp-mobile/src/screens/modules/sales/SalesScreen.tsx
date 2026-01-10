/**
 * Sales Module Main Screen
 * Matches web app Sales module with sidebar navigation
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
  Users,
  FileText,
  ShoppingCart,
  UserPlus,
  Package,
  Briefcase,
  Building2,
  Settings,
  TrendingUp,
  DollarSign,
  Target,
  Clock,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// Sales navigation items - matches web exactly
const salesNavItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    screenName: 'Sales',
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: Users,
    screenName: 'SalesCustomers',
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: UserPlus,
    screenName: 'SalesLeads',
  },
  {
    id: 'quotations',
    label: 'Quotations',
    icon: FileText,
    screenName: 'SalesQuotations',
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingCart,
    screenName: 'SalesOrders',
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    children: [
      { id: 'product-list', label: 'Product List', screenName: 'SalesProducts' },
      { id: 'product-categories', label: 'Categories', screenName: 'SalesProductCategories' },
      { id: 'inventory', label: 'Inventory', screenName: 'SalesInventory' },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    icon: Briefcase,
    children: [
      { id: 'service-list', label: 'Service List', screenName: 'SalesServices' },
      { id: 'service-categories', label: 'Categories', screenName: 'SalesServiceCategories' },
      { id: 'delivery', label: 'Delivery', screenName: 'SalesDelivery' },
    ],
  },
  {
    id: 'bank',
    label: 'Bank Management',
    icon: Building2,
    screenName: 'SalesBank',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    screenName: 'SalesSettings',
  },
];

// Mock stats data
const salesStats = [
  { label: 'Total Revenue', value: '$125,430', icon: DollarSign, color: '#10B981', change: '+12.5%' },
  { label: 'New Leads', value: '48', icon: UserPlus, color: '#3B82F6', change: '+8.2%' },
  { label: 'Active Deals', value: '23', icon: Target, color: '#8B5CF6', change: '+5.1%' },
  { label: 'Avg. Deal Time', value: '14 days', icon: Clock, color: '#F59E0B', change: '-2.3%' },
];

// Mock recent orders
const recentOrders = [
  { id: 'ORD-001', customer: 'Acme Corp', amount: '$12,450', status: 'Completed', date: 'Today' },
  { id: 'ORD-002', customer: 'TechStart Inc', amount: '$8,320', status: 'Processing', date: 'Yesterday' },
  { id: 'ORD-003', customer: 'Global Trade', amount: '$24,100', status: 'Pending', date: '2 days ago' },
  { id: 'ORD-004', customer: 'Local Shop', amount: '$3,500', status: 'Completed', date: '3 days ago' },
];

export default function SalesScreen() {
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
      case 'Completed':
        return '#10B981';
      case 'Processing':
        return '#3B82F6';
      case 'Pending':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  return (
    <ModuleLayout
      moduleId="sales"
      navItems={salesNavItems}
      activeScreen="Sales"
      title="Sales Overview"
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {salesStats.map((stat, index) => {
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

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => navigateTo('SalesOrders')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ordersCard}>
            {recentOrders.map((order, index) => (
              <TouchableOpacity
                key={order.id}
                style={[
                  styles.orderRow,
                  index !== recentOrders.length - 1 && styles.orderRowBorder,
                ]}
              >
                <View style={styles.orderInfo}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderCustomer}>{order.customer}</Text>
                </View>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderAmount}>{order.amount}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(order.status)}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(order.status) },
                      ]}
                    >
                      {order.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo('SalesOrders')}>
              <ShoppingCart size={20} color="#2196F3" />
              <Text style={styles.actionText}>New Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo('SalesCustomers')}>
              <Users size={20} color="#2196F3" />
              <Text style={styles.actionText}>Add Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo('SalesQuotations')}>
              <FileText size={20} color="#2196F3" />
              <Text style={styles.actionText}>Create Quote</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo('SalesLeads')}>
              <TrendingUp size={20} color="#2196F3" />
              <Text style={styles.actionText}>View Leads</Text>
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
    // Stats Grid
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
    // Sections
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
      color: '#2196F3',
      fontWeight: '500',
    },
    // Orders
    ordersCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      overflow: 'hidden',
    },
    orderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    orderRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    orderInfo: {
      flex: 1,
    },
    orderId: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    orderCustomer: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    orderDetails: {
      alignItems: 'flex-end',
    },
    orderAmount: {
      fontSize: 14,
      fontWeight: '600',
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
    // Quick Actions
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
