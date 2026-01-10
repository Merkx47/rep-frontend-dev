/**
 * NRS E-Invoice Module Main Screen
 * Matches web app NRS E-Invoice module with sidebar navigation
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
  FileCheck,
  Shield,
  Settings,
  Plus,
  Send,
  CheckCircle,
  AlertTriangle,
  Clock,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// NRS E-Invoice navigation items - matches web exactly
const nrsNavItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    screenName: 'NRSEInvoice',
  },
  {
    id: 'invoices',
    label: 'E-Invoices',
    icon: FileCheck,
    screenName: 'NRSEInvoiceList',
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: Shield,
    screenName: 'NRSEInvoiceCompliance',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    screenName: 'NRSEInvoiceSettings',
  },
];

// Mock stats data
const nrsStats = [
  { label: 'Total Submitted', value: '1,248', icon: Send, color: '#F44336', change: 'This year' },
  { label: 'Approved', value: '1,186', icon: CheckCircle, color: '#10B981', change: '95%' },
  { label: 'Pending', value: '42', icon: Clock, color: '#F59E0B', change: 'Awaiting' },
  { label: 'Rejected', value: '20', icon: AlertTriangle, color: '#EF4444', change: 'Need review' },
];

// Mock recent e-invoices
const recentInvoices = [
  { id: 'NRS-001', customer: 'Acme Corp', amount: 'N125,450', status: 'Approved', date: 'Today' },
  { id: 'NRS-002', customer: 'TechStart Inc', amount: 'N83,200', status: 'Pending', date: 'Today' },
  { id: 'NRS-003', customer: 'Global Trade', amount: 'N241,000', status: 'Approved', date: 'Yesterday' },
  { id: 'NRS-004', customer: 'Local Shop', amount: 'N35,000', status: 'Rejected', date: '2 days ago' },
];

// Compliance status
const complianceStatus = {
  lastSubmission: '2 hours ago',
  apiStatus: 'Connected',
  certificateExpiry: '89 days',
  complianceRate: '95%',
};

export default function NRSEInvoiceScreen() {
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
      case 'Approved':
        return '#10B981';
      case 'Pending':
        return '#F59E0B';
      case 'Rejected':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <ModuleLayout
      moduleId="nrs-einvoice"
      navItems={nrsNavItems}
      activeScreen="NRSEInvoice"
      title="NRS E-Invoice Overview"
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {nrsStats.map((stat, index) => {
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

        {/* Compliance Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compliance Status</Text>
          <View style={styles.complianceCard}>
            <View style={styles.complianceRow}>
              <Text style={styles.complianceLabel}>API Status</Text>
              <View style={styles.complianceValueContainer}>
                <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                <Text style={[styles.complianceValue, { color: '#10B981' }]}>
                  {complianceStatus.apiStatus}
                </Text>
              </View>
            </View>
            <View style={styles.complianceRow}>
              <Text style={styles.complianceLabel}>Last Submission</Text>
              <Text style={styles.complianceValue}>{complianceStatus.lastSubmission}</Text>
            </View>
            <View style={styles.complianceRow}>
              <Text style={styles.complianceLabel}>Certificate Expiry</Text>
              <Text style={styles.complianceValue}>{complianceStatus.certificateExpiry}</Text>
            </View>
            <View style={[styles.complianceRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.complianceLabel}>Compliance Rate</Text>
              <Text style={[styles.complianceValue, { color: '#10B981' }]}>
                {complianceStatus.complianceRate}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent E-Invoices */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent E-Invoices</Text>
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
                  <Text style={styles.invoiceCustomer}>{invoice.customer}</Text>
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
            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo('NRSEInvoiceList')}>
              <Plus size={20} color="#F44336" />
              <Text style={styles.actionText}>New E-Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo('NRSEInvoiceList')}>
              <Send size={20} color="#F44336" />
              <Text style={styles.actionText}>Submit All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo('NRSEInvoiceCompliance')}>
              <Shield size={20} color="#F44336" />
              <Text style={styles.actionText}>Compliance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo('NRSEInvoiceList')}>
              <FileCheck size={20} color="#F44336" />
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
      marginBottom: 12,
    },
    viewAllText: {
      fontSize: 14,
      color: '#F44336',
      fontWeight: '500',
    },
    complianceCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      padding: 4,
    },
    complianceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    complianceLabel: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    complianceValueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    complianceValue: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
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
    invoiceCustomer: {
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
