/**
 * Invoice Module Main Screen
 * Matches web app Invoice module with sidebar navigation
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
  FileText,
  RefreshCw,
  Palette,
  Settings,
  Plus,
  Send,
  DollarSign,
  Clock,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// Invoice navigation items - matches web exactly
const invoiceNavItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    screenName: 'Invoice',
  },
  {
    id: 'invoices',
    label: 'Invoices',
    icon: FileText,
    screenName: 'InvoiceList',
  },
  {
    id: 'recurring',
    label: 'Recurring',
    icon: RefreshCw,
    screenName: 'InvoiceRecurring',
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: Palette,
    screenName: 'InvoiceTemplates',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    screenName: 'InvoiceSettings',
  },
];

// Mock stats data
const invoiceStats = [
  { label: 'Total Invoiced', value: '$245,830', icon: DollarSign, color: '#3F51B5', change: '+18.5%' },
  { label: 'Outstanding', value: '$42,150', icon: Clock, color: '#F59E0B', change: '12 invoices' },
  { label: 'Sent This Month', value: '38', icon: Send, color: '#10B981', change: '+12' },
  { label: 'Overdue', value: '$8,200', icon: FileText, color: '#EF4444', change: '3 invoices' },
];

// Mock recent invoices
const recentInvoices = [
  { id: 'INV-001', client: 'Acme Corp', amount: '$12,450', status: 'Paid', date: 'Today' },
  { id: 'INV-002', client: 'TechStart Inc', amount: '$8,320', status: 'Sent', date: 'Yesterday' },
  { id: 'INV-003', client: 'Global Trade', amount: '$24,100', status: 'Draft', date: '2 days ago' },
  { id: 'INV-004', client: 'Local Shop', amount: '$3,500', status: 'Overdue', date: '1 week ago' },
];

export default function InvoiceScreen() {
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
      case 'Paid':
        return '#10B981';
      case 'Sent':
        return '#3B82F6';
      case 'Draft':
        return '#6B7280';
      case 'Overdue':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <ModuleLayout
      moduleId="invoice"
      navItems={invoiceNavItems}
      activeScreen="Invoice"
      title="Invoice Overview"
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {invoiceStats.map((stat, index) => {
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

        {/* Recent Invoices */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Invoices</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.invoicesCard}>
            {recentInvoices.map((invoice, index) => (
              <TouchableOpacity
                key={invoice.id}
                style={[
                  styles.invoiceRow,
                  index !== recentInvoices.length - 1 && styles.invoiceRowBorder,
                ]}
              >
                <View style={styles.invoiceInfo}>
                  <Text style={styles.invoiceId}>{invoice.id}</Text>
                  <Text style={styles.invoiceClient}>{invoice.client}</Text>
                </View>
                <View style={styles.invoiceDetails}>
                  <Text style={styles.invoiceAmount}>{invoice.amount}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(invoice.status)}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(invoice.status) },
                      ]}
                    >
                      {invoice.status}
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
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo('InvoiceList')}
            >
              <Plus size={20} color="#3F51B5" />
              <Text style={styles.actionText}>New Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo('InvoiceRecurring')}
            >
              <RefreshCw size={20} color="#3F51B5" />
              <Text style={styles.actionText}>Recurring</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo('InvoiceTemplates')}
            >
              <Palette size={20} color="#3F51B5" />
              <Text style={styles.actionText}>Templates</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo('InvoiceList')}
            >
              <Send size={20} color="#3F51B5" />
              <Text style={styles.actionText}>Send All</Text>
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
      color: '#3F51B5',
      fontWeight: '500',
    },
    invoicesCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      overflow: 'hidden',
    },
    invoiceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    invoiceRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    invoiceInfo: {
      flex: 1,
    },
    invoiceId: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    invoiceClient: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    invoiceDetails: {
      alignItems: 'flex-end',
    },
    invoiceAmount: {
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
