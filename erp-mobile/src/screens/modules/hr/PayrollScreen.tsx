/**
 * HR Payroll Screen
 * Manage employee payroll and salary processing
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  Settings,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock as ClockIcon,
  AlertCircle,
  X,
  ChevronRight,
  Wallet,
  CreditCard,
  TrendingUp,
  Send,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// HR navigation items
const hrNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'HR' },
  { id: 'employees', label: 'Employees', icon: Users, screenName: 'HREmployees' },
  { id: 'attendance', label: 'Attendance', icon: Calendar, screenName: 'HRAttendance' },
  { id: 'leave', label: 'Leave Management', icon: Clock, screenName: 'HRLeave' },
  { id: 'payroll', label: 'Payroll', icon: DollarSign, screenName: 'HRPayroll' },
  { id: 'recruitment', label: 'Recruitment', icon: Briefcase, screenName: 'HRRecruitment' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'HRSettings' },
];

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'Pending' | 'Processing' | 'Paid';
  paymentDate: string;
}

const payrollData: PayrollRecord[] = [
  {
    id: '1',
    employeeId: 'EMP-001',
    employeeName: 'John Doe',
    department: 'Engineering',
    baseSalary: 8500,
    allowances: 1200,
    deductions: 850,
    netSalary: 8850,
    status: 'Paid',
    paymentDate: '2024-01-25',
  },
  {
    id: '2',
    employeeId: 'EMP-002',
    employeeName: 'Sarah Johnson',
    department: 'Marketing',
    baseSalary: 6500,
    allowances: 800,
    deductions: 650,
    netSalary: 6650,
    status: 'Paid',
    paymentDate: '2024-01-25',
  },
  {
    id: '3',
    employeeId: 'EMP-003',
    employeeName: 'Mike Brown',
    department: 'Sales',
    baseSalary: 7000,
    allowances: 1500,
    deductions: 700,
    netSalary: 7800,
    status: 'Processing',
    paymentDate: '2024-01-25',
  },
  {
    id: '4',
    employeeId: 'EMP-004',
    employeeName: 'Emily Davis',
    department: 'HR',
    baseSalary: 5500,
    allowances: 600,
    deductions: 550,
    netSalary: 5550,
    status: 'Pending',
    paymentDate: '2024-01-25',
  },
  {
    id: '5',
    employeeId: 'EMP-005',
    employeeName: 'David Wilson',
    department: 'Finance',
    baseSalary: 7500,
    allowances: 900,
    deductions: 750,
    netSalary: 7650,
    status: 'Pending',
    paymentDate: '2024-01-25',
  },
];

// Payroll period stats
const payrollStats = {
  totalPayroll: 245680,
  totalEmployees: 24,
  pending: 8,
  processed: 16,
  period: 'January 2024',
};

const statusFilters = ['All', 'Pending', 'Processing', 'Paid'];

export default function PayrollScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredRecords = payrollData.filter((record) => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (record: PayrollRecord) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleProcessPayroll = () => {
    Alert.alert(
      'Process Payroll',
      `Process payroll for ${payrollStats.pending} pending employees?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Process',
          onPress: () => Alert.alert('Success', 'Payroll processing initiated'),
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return '#10B981';
      case 'Processing':
        return '#F59E0B';
      case 'Pending':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return CheckCircle;
      case 'Processing':
        return ClockIcon;
      case 'Pending':
        return AlertCircle;
      default:
        return ClockIcon;
    }
  };

  const renderRecord = ({ item }: { item: PayrollRecord }) => {
    const StatusIcon = getStatusIcon(item.status);
    return (
      <TouchableOpacity style={styles.recordCard} onPress={() => handleViewDetails(item)}>
        <View style={styles.recordHeader}>
          <View style={styles.employeeInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.employeeName.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
            <View>
              <Text style={styles.employeeName}>{item.employeeName}</Text>
              <Text style={styles.employeeId}>{item.employeeId} • {item.department}</Text>
            </View>
          </View>
          <ChevronRight size={20} color={isDark ? '#64748B' : '#94A3B8'} />
        </View>

        <View style={styles.salaryBreakdown}>
          <View style={styles.salaryItem}>
            <Text style={styles.salaryLabel}>Base</Text>
            <Text style={styles.salaryValue}>${item.baseSalary.toLocaleString()}</Text>
          </View>
          <View style={styles.salaryItem}>
            <Text style={styles.salaryLabel}>Allowances</Text>
            <Text style={[styles.salaryValue, { color: '#10B981' }]}>+${item.allowances.toLocaleString()}</Text>
          </View>
          <View style={styles.salaryItem}>
            <Text style={styles.salaryLabel}>Deductions</Text>
            <Text style={[styles.salaryValue, { color: '#EF4444' }]}>-${item.deductions.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.recordFooter}>
          <View style={styles.netSalary}>
            <Text style={styles.netLabel}>Net Salary</Text>
            <Text style={styles.netValue}>${item.netSalary.toLocaleString()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <StatusIcon size={14} color={getStatusColor(item.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ModuleLayout moduleId="hr" navItems={hrNavItems} activeScreen="HRPayroll" title="Payroll">
      <View style={styles.container}>
        {/* Period Header */}
        <View style={styles.periodHeader}>
          <View>
            <Text style={styles.periodLabel}>Payroll Period</Text>
            <Text style={styles.periodValue}>{payrollStats.period}</Text>
          </View>
          <TouchableOpacity style={styles.processButton} onPress={handleProcessPayroll}>
            <Send size={16} color="#FFFFFF" />
            <Text style={styles.processButtonText}>Process</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#E91E6315' }]}>
              <Wallet size={20} color="#E91E63" />
            </View>
            <Text style={styles.statValue}>${(payrollStats.totalPayroll / 1000).toFixed(0)}K</Text>
            <Text style={styles.statLabel}>Total Payroll</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#3B82F615' }]}>
              <Users size={20} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>{payrollStats.totalEmployees}</Text>
            <Text style={styles.statLabel}>Employees</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#F59E0B15' }]}>
              <ClockIcon size={20} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>{payrollStats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#10B98115' }]}>
              <CheckCircle size={20} color="#10B981" />
            </View>
            <Text style={styles.statValue}>{payrollStats.processed}</Text>
            <Text style={styles.statLabel}>Processed</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.toolbar}>
          <View style={styles.searchContainer}>
            <Search size={18} color={isDark ? '#64748B' : '#94A3B8'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search employees..."
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.downloadButton}>
            <Download size={18} color="#E91E63" />
          </TouchableOpacity>
        </View>

        {/* Status Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {statusFilters.map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.filterChip, statusFilter === status && styles.filterChipActive]}
              onPress={() => setStatusFilter(status)}
            >
              <Text style={[styles.filterText, statusFilter === status && styles.filterTextActive]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Payroll List */}
        <FlatList
          data={filteredRecords}
          renderItem={renderRecord}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <DollarSign size={48} color={isDark ? '#334155' : '#CBD5E1'} />
              <Text style={styles.emptyText}>No payroll records found</Text>
            </View>
          }
        />
      </View>

      {/* Details Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payroll Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            {selectedRecord && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.employeeHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {selectedRecord.employeeName.split(' ').map((n) => n[0]).join('')}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.modalEmployeeName}>{selectedRecord.employeeName}</Text>
                    <Text style={styles.modalEmployeeId}>
                      {selectedRecord.employeeId} • {selectedRecord.department}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Earnings</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Base Salary</Text>
                    <Text style={styles.detailValue}>${selectedRecord.baseSalary.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Housing Allowance</Text>
                    <Text style={styles.detailValue}>${(selectedRecord.allowances * 0.5).toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Transport Allowance</Text>
                    <Text style={styles.detailValue}>${(selectedRecord.allowances * 0.3).toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Other Allowances</Text>
                    <Text style={styles.detailValue}>${(selectedRecord.allowances * 0.2).toLocaleString()}</Text>
                  </View>
                  <View style={[styles.detailRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total Earnings</Text>
                    <Text style={[styles.totalValue, { color: '#10B981' }]}>
                      ${(selectedRecord.baseSalary + selectedRecord.allowances).toLocaleString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Deductions</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tax</Text>
                    <Text style={styles.detailValue}>${(selectedRecord.deductions * 0.6).toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Pension</Text>
                    <Text style={styles.detailValue}>${(selectedRecord.deductions * 0.3).toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Other Deductions</Text>
                    <Text style={styles.detailValue}>${(selectedRecord.deductions * 0.1).toLocaleString()}</Text>
                  </View>
                  <View style={[styles.detailRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total Deductions</Text>
                    <Text style={[styles.totalValue, { color: '#EF4444' }]}>
                      -${selectedRecord.deductions.toLocaleString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.netSalarySection}>
                  <Text style={styles.netSalaryLabel}>Net Salary</Text>
                  <Text style={styles.netSalaryValue}>${selectedRecord.netSalary.toLocaleString()}</Text>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.payButton]}>
                <CreditCard size={18} color="#FFFFFF" />
                <Text style={styles.payButtonText}>Process Payment</Text>
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
    periodHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    periodLabel: {
      fontSize: 12,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 2,
    },
    periodValue: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    processButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E91E63',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
      gap: 6,
    },
    processButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 16,
      gap: 12,
    },
    statCard: {
      width: '47%',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    statValue: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    statLabel: {
      fontSize: 12,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    toolbar: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingBottom: 12,
      gap: 12,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      gap: 8,
    },
    searchInput: {
      flex: 1,
      height: 44,
      fontSize: 14,
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    downloadButton: {
      width: 44,
      height: 44,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    filterContainer: {
      maxHeight: 44,
      marginBottom: 8,
    },
    filterContent: {
      paddingHorizontal: 16,
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
      backgroundColor: '#E91E63',
    },
    filterText: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    filterTextActive: {
      color: '#FFFFFF',
    },
    listContent: {
      padding: 16,
      paddingTop: 8,
    },
    recordCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    recordHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    employeeInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDark ? '#E91E6320' : '#E91E6310',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#E91E63',
    },
    employeeName: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    employeeId: {
      fontSize: 12,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    salaryBreakdown: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      marginBottom: 12,
    },
    salaryItem: {
      alignItems: 'center',
    },
    salaryLabel: {
      fontSize: 11,
      color: isDark ? '#64748B' : '#94A3B8',
      marginBottom: 2,
    },
    salaryValue: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    recordFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    netSalary: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    netLabel: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    netValue: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
    },
    emptyText: {
      fontSize: 15,
      color: isDark ? '#64748B' : '#94A3B8',
      marginTop: 12,
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
      maxHeight: '85%',
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
    employeeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 20,
    },
    modalEmployeeName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    modalEmployeeId: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    detailSection: {
      marginBottom: 20,
    },
    detailSectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 12,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    detailLabel: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    detailValue: {
      fontSize: 14,
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    totalRow: {
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
      marginTop: 8,
      paddingTop: 12,
    },
    totalLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    totalValue: {
      fontSize: 14,
      fontWeight: '600',
    },
    netSalarySection: {
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    netSalaryLabel: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 4,
    },
    netSalaryValue: {
      fontSize: 28,
      fontWeight: '700',
      color: '#E91E63',
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
    payButton: {
      backgroundColor: '#E91E63',
    },
    payButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });
