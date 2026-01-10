/**
 * Accounting Reports Screen
 * View and generate financial reports
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Receipt,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Building2,
  Settings,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  DollarSign,
  Scale,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  X,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// Accounting navigation items
const accountingNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'Accounting' },
  { id: 'chart-of-accounts', label: 'Chart of Accounts', icon: BookOpen, screenName: 'AccountingChartOfAccounts' },
  { id: 'journals', label: 'Journal Entries', icon: FileText, screenName: 'AccountingJournals' },
  { id: 'ledger', label: 'General Ledger', icon: Receipt, screenName: 'AccountingLedger' },
  { id: 'budgets', label: 'Budgets', icon: PiggyBank, screenName: 'AccountingBudgets' },
  { id: 'reports', label: 'Reports', icon: TrendingUp, screenName: 'AccountingReports' },
  { id: 'payables', label: 'Accounts Payable', icon: CreditCard, screenName: 'AccountingPayables' },
  { id: 'receivables', label: 'Accounts Receivable', icon: Building2, screenName: 'AccountingReceivables' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'AccountingSettings' },
];

interface Report {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'Financial' | 'Management' | 'Tax';
  lastGenerated?: string;
}

const availableReports: Report[] = [
  {
    id: 'balance-sheet',
    name: 'Balance Sheet',
    description: 'Assets, liabilities, and equity at a point in time',
    icon: Scale,
    category: 'Financial',
    lastGenerated: '2024-01-15',
  },
  {
    id: 'income-statement',
    name: 'Income Statement',
    description: 'Revenue and expenses over a period',
    icon: TrendingUp,
    category: 'Financial',
    lastGenerated: '2024-01-15',
  },
  {
    id: 'cash-flow',
    name: 'Cash Flow Statement',
    description: 'Cash inflows and outflows',
    icon: DollarSign,
    category: 'Financial',
    lastGenerated: '2024-01-14',
  },
  {
    id: 'trial-balance',
    name: 'Trial Balance',
    description: 'All account balances at a point in time',
    icon: FileSpreadsheet,
    category: 'Financial',
    lastGenerated: '2024-01-15',
  },
  {
    id: 'general-ledger',
    name: 'General Ledger Report',
    description: 'Detailed transaction history by account',
    icon: Receipt,
    category: 'Financial',
  },
  {
    id: 'ar-aging',
    name: 'A/R Aging Report',
    description: 'Outstanding receivables by age',
    icon: Wallet,
    category: 'Management',
    lastGenerated: '2024-01-12',
  },
  {
    id: 'ap-aging',
    name: 'A/P Aging Report',
    description: 'Outstanding payables by age',
    icon: CreditCard,
    category: 'Management',
  },
  {
    id: 'budget-variance',
    name: 'Budget vs Actual',
    description: 'Compare budget to actual spending',
    icon: BarChart3,
    category: 'Management',
  },
  {
    id: 'expense-breakdown',
    name: 'Expense Breakdown',
    description: 'Expenses by category',
    icon: PieChart,
    category: 'Management',
    lastGenerated: '2024-01-10',
  },
  {
    id: 'tax-summary',
    name: 'Tax Summary',
    description: 'Tax liabilities and payments',
    icon: FileText,
    category: 'Tax',
  },
];

// Mock financial summary data
const financialSummary = {
  revenue: 320000,
  revenueChange: 12.5,
  expenses: 220000,
  expenseChange: 8.2,
  netIncome: 100000,
  netIncomeChange: 18.3,
  cashBalance: 125000,
  cashChange: -5.4,
};

const reportCategories = ['All', 'Financial', 'Management', 'Tax'];

export default function ReportsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year'>('month');

  const filteredReports = availableReports.filter(
    (report) => categoryFilter === 'All' || report.category === categoryFilter
  );

  const handleGenerateReport = (report: Report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleDownload = (format: 'pdf' | 'excel' | 'csv') => {
    setModalVisible(false);
    Alert.alert(
      'Generating Report',
      `${selectedReport?.name} is being generated as ${format.toUpperCase()}. You will be notified when it's ready.`
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Financial':
        return '#4CAF50';
      case 'Management':
        return '#2196F3';
      case 'Tax':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  return (
    <ModuleLayout
      moduleId="accounting"
      navItems={accountingNavItems}
      activeScreen="AccountingReports"
      title="Financial Reports"
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Financial Summary */}
        <View style={styles.summarySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Financial Summary</Text>
            <View style={styles.dateRangeTabs}>
              {(['month', 'quarter', 'year'] as const).map((range) => (
                <TouchableOpacity
                  key={range}
                  style={[styles.dateTab, dateRange === range && styles.dateTabActive]}
                  onPress={() => setDateRange(range)}
                >
                  <Text style={[styles.dateTabText, dateRange === range && styles.dateTabTextActive]}>
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryLabel}>Revenue</Text>
                <View style={[styles.changeIndicator, { backgroundColor: '#10B98120' }]}>
                  <ArrowUpRight size={12} color="#10B981" />
                  <Text style={[styles.changeText, { color: '#10B981' }]}>
                    {financialSummary.revenueChange}%
                  </Text>
                </View>
              </View>
              <Text style={styles.summaryValue}>${(financialSummary.revenue / 1000).toFixed(0)}K</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryLabel}>Expenses</Text>
                <View style={[styles.changeIndicator, { backgroundColor: '#EF444420' }]}>
                  <ArrowUpRight size={12} color="#EF4444" />
                  <Text style={[styles.changeText, { color: '#EF4444' }]}>
                    {financialSummary.expenseChange}%
                  </Text>
                </View>
              </View>
              <Text style={styles.summaryValue}>${(financialSummary.expenses / 1000).toFixed(0)}K</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryLabel}>Net Income</Text>
                <View style={[styles.changeIndicator, { backgroundColor: '#10B98120' }]}>
                  <ArrowUpRight size={12} color="#10B981" />
                  <Text style={[styles.changeText, { color: '#10B981' }]}>
                    {financialSummary.netIncomeChange}%
                  </Text>
                </View>
              </View>
              <Text style={[styles.summaryValue, { color: '#10B981' }]}>
                ${(financialSummary.netIncome / 1000).toFixed(0)}K
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryLabel}>Cash Balance</Text>
                <View style={[styles.changeIndicator, { backgroundColor: '#EF444420' }]}>
                  <ArrowDownRight size={12} color="#EF4444" />
                  <Text style={[styles.changeText, { color: '#EF4444' }]}>
                    {Math.abs(financialSummary.cashChange)}%
                  </Text>
                </View>
              </View>
              <Text style={styles.summaryValue}>${(financialSummary.cashBalance / 1000).toFixed(0)}K</Text>
            </View>
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {reportCategories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.filterChip, categoryFilter === category && styles.filterChipActive]}
              onPress={() => setCategoryFilter(category)}
            >
              <Text style={[styles.filterText, categoryFilter === category && styles.filterTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Available Reports */}
        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>Available Reports</Text>
          <View style={styles.reportsList}>
            {filteredReports.map((report) => {
              const Icon = report.icon;
              return (
                <TouchableOpacity
                  key={report.id}
                  style={styles.reportCard}
                  onPress={() => handleGenerateReport(report)}
                >
                  <View style={[styles.reportIcon, { backgroundColor: `${getCategoryColor(report.category)}15` }]}>
                    <Icon size={22} color={getCategoryColor(report.category)} />
                  </View>
                  <View style={styles.reportInfo}>
                    <Text style={styles.reportName}>{report.name}</Text>
                    <Text style={styles.reportDescription}>{report.description}</Text>
                    {report.lastGenerated && (
                      <View style={styles.lastGenerated}>
                        <Calendar size={12} color={isDark ? '#64748B' : '#94A3B8'} />
                        <Text style={styles.lastGeneratedText}>Last: {report.lastGenerated}</Text>
                      </View>
                    )}
                  </View>
                  <ChevronRight size={20} color={isDark ? '#64748B' : '#94A3B8'} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Report Options Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedReport?.name}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalDescription}>{selectedReport?.description}</Text>

              <Text style={styles.optionLabel}>Select Date Range</Text>
              <View style={styles.dateOptions}>
                {['This Month', 'Last Month', 'This Quarter', 'This Year', 'Custom'].map((option) => (
                  <TouchableOpacity key={option} style={styles.dateOption}>
                    <Text style={styles.dateOptionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.optionLabel}>Export Format</Text>
              <View style={styles.formatOptions}>
                <TouchableOpacity style={styles.formatButton} onPress={() => handleDownload('pdf')}>
                  <FileText size={24} color="#EF4444" />
                  <Text style={styles.formatText}>PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.formatButton} onPress={() => handleDownload('excel')}>
                  <FileSpreadsheet size={24} color="#10B981" />
                  <Text style={styles.formatText}>Excel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.formatButton} onPress={() => handleDownload('csv')}>
                  <Receipt size={24} color="#3B82F6" />
                  <Text style={styles.formatText}>CSV</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.generateButton]}
                onPress={() => handleDownload('pdf')}
              >
                <Download size={18} color="#FFFFFF" />
                <Text style={styles.generateButtonText}>Generate Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    summarySection: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    dateRangeTabs: {
      flexDirection: 'row',
      backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
      borderRadius: 8,
      padding: 2,
    },
    dateTab: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    dateTabActive: {
      backgroundColor: isDark ? '#334155' : '#FFFFFF',
    },
    dateTabText: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    dateTabTextActive: {
      color: isDark ? '#FFFFFF' : '#0F172A',
      fontWeight: '600',
    },
    summaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    summaryCard: {
      width: '48%',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    summaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    changeIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      gap: 2,
    },
    changeText: {
      fontSize: 11,
      fontWeight: '600',
    },
    summaryValue: {
      fontSize: 22,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    filterContainer: {
      marginBottom: 16,
    },
    filterContent: {
      gap: 8,
    },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
      marginRight: 8,
    },
    filterChipActive: {
      backgroundColor: '#4CAF50',
    },
    filterText: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    filterTextActive: {
      color: '#FFFFFF',
    },
    reportsSection: {
      marginBottom: 24,
    },
    reportsList: {
      marginTop: 12,
      gap: 12,
    },
    reportCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    reportIcon: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    reportInfo: {
      flex: 1,
    },
    reportName: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    reportDescription: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 4,
    },
    lastGenerated: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    lastGeneratedText: {
      fontSize: 11,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    modalBody: {
      padding: 20,
    },
    modalDescription: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 20,
    },
    optionLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 12,
    },
    dateOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 20,
    },
    dateOption: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDark ? '#0F172A' : '#F1F5F9',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    dateOptionText: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    formatOptions: {
      flexDirection: 'row',
      gap: 12,
    },
    formatButton: {
      flex: 1,
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      gap: 8,
    },
    formatText: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    modalActions: {
      flexDirection: 'row',
      padding: 20,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    modalButton: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    cancelButton: {
      backgroundColor: isDark ? '#334155' : '#F1F5F9',
    },
    cancelButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    generateButton: {
      backgroundColor: '#4CAF50',
    },
    generateButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });
