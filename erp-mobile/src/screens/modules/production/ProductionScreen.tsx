/**
 * Production Module Main Screen
 * Matches web app Production module with sidebar navigation
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
  ClipboardList,
  Factory,
  CheckCircle,
  Settings,
  Plus,
  TrendingUp,
  AlertTriangle,
  Package,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// Production navigation items - matches web exactly
const productionNavItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    screenName: 'Production',
  },
  {
    id: 'work-orders',
    label: 'Work Orders',
    icon: ClipboardList,
    screenName: 'ProductionWorkOrders',
  },
  {
    id: 'bom',
    label: 'Bill of Materials',
    icon: Package,
    screenName: 'ProductionBOM',
  },
  {
    id: 'quality',
    label: 'Quality Control',
    icon: CheckCircle,
    screenName: 'ProductionQuality',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    screenName: 'ProductionSettings',
  },
];

// Mock stats data
const productionStats = [
  { label: 'Active Orders', value: '24', icon: ClipboardList, color: '#607D8B', change: '+3' },
  { label: 'In Progress', value: '18', icon: Factory, color: '#3B82F6', change: '75%' },
  { label: 'Completed', value: '156', icon: CheckCircle, color: '#10B981', change: 'This month' },
  { label: 'Quality Issues', value: '2', icon: AlertTriangle, color: '#F59E0B', change: '-1' },
];

// Mock work orders
const recentOrders = [
  { id: 'WO-001', product: 'Widget A', quantity: '500', status: 'In Progress', progress: 65 },
  { id: 'WO-002', product: 'Component B', quantity: '1,200', status: 'Pending', progress: 0 },
  { id: 'WO-003', product: 'Assembly C', quantity: '300', status: 'In Progress', progress: 40 },
  { id: 'WO-004', product: 'Part D', quantity: '800', status: 'Completed', progress: 100 },
];

export default function ProductionScreen() {
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
      case 'In Progress':
        return '#3B82F6';
      case 'Pending':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  return (
    <ModuleLayout
      moduleId="production"
      navItems={productionNavItems}
      activeScreen="Production"
      title="Production Overview"
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {productionStats.map((stat, index) => {
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

        {/* Work Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Work Orders</Text>
            <TouchableOpacity>
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
                  <Text style={styles.orderProduct}>{order.product}</Text>
                  <Text style={styles.orderQuantity}>Qty: {order.quantity}</Text>
                </View>
                <View style={styles.orderDetails}>
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
                  {order.progress > 0 && order.progress < 100 && (
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${order.progress}%`, backgroundColor: getStatusColor(order.status) },
                        ]}
                      />
                    </View>
                  )}
                </View>
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
              onPress={() => navigateTo('ProductionWorkOrders')}
            >
              <Plus size={20} color="#9C27B0" />
              <Text style={styles.actionText}>New Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo('ProductionBOM')}
            >
              <Package size={20} color="#9C27B0" />
              <Text style={styles.actionText}>BOM</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo('ProductionQuality')}
            >
              <CheckCircle size={20} color="#9C27B0" />
              <Text style={styles.actionText}>Quality</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo('ProductionWorkOrders')}
            >
              <TrendingUp size={20} color="#9C27B0" />
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
      color: '#607D8B',
      fontWeight: '500',
    },
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
    orderProduct: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 2,
    },
    orderQuantity: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    orderDetails: {
      alignItems: 'flex-end',
      gap: 6,
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
    progressBar: {
      width: 60,
      height: 4,
      backgroundColor: isDark ? '#334155' : '#E2E8F0',
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
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
