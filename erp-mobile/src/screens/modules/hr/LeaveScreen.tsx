/**
 * HR Leave Management Screen
 * Manage employee leave requests
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
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarDays,
  Palmtree,
  HeartPulse,
  Baby,
  GraduationCap,
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

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: 'Annual' | 'Sick' | 'Maternity' | 'Study' | 'Unpaid';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
}

const leaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: 'EMP-001',
    employeeName: 'John Doe',
    department: 'Engineering',
    leaveType: 'Annual',
    startDate: '2024-02-05',
    endDate: '2024-02-09',
    days: 5,
    reason: 'Family vacation',
    status: 'Pending',
    appliedOn: '2024-01-15',
  },
  {
    id: '2',
    employeeId: 'EMP-002',
    employeeName: 'Sarah Johnson',
    department: 'Marketing',
    leaveType: 'Sick',
    startDate: '2024-01-20',
    endDate: '2024-01-21',
    days: 2,
    reason: 'Medical appointment',
    status: 'Approved',
    appliedOn: '2024-01-18',
  },
  {
    id: '3',
    employeeId: 'EMP-004',
    employeeName: 'Emily Davis',
    department: 'HR',
    leaveType: 'Study',
    startDate: '2024-02-15',
    endDate: '2024-02-16',
    days: 2,
    reason: 'Professional certification exam',
    status: 'Pending',
    appliedOn: '2024-01-17',
  },
  {
    id: '4',
    employeeId: 'EMP-003',
    employeeName: 'Mike Brown',
    department: 'Sales',
    leaveType: 'Annual',
    startDate: '2024-01-10',
    endDate: '2024-01-12',
    days: 3,
    reason: 'Personal matters',
    status: 'Rejected',
    appliedOn: '2024-01-05',
  },
  {
    id: '5',
    employeeId: 'EMP-006',
    employeeName: 'Lisa Anderson',
    department: 'Engineering',
    leaveType: 'Maternity',
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    days: 90,
    reason: 'Maternity leave',
    status: 'Approved',
    appliedOn: '2024-01-10',
  },
];

// Leave balance summary
const leaveBalance = {
  annual: { used: 8, total: 21 },
  sick: { used: 3, total: 10 },
  maternity: { used: 0, total: 90 },
  study: { used: 2, total: 5 },
};

const leaveTypes: LeaveRequest['leaveType'][] = ['Annual', 'Sick', 'Maternity', 'Study', 'Unpaid'];
const statusFilters = ['All', 'Pending', 'Approved', 'Rejected'];

export default function LeaveScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [requests, setRequests] = useState<LeaveRequest[]>(leaveRequests);

  // Form state
  const [formData, setFormData] = useState({
    leaveType: 'Annual' as LeaveRequest['leaveType'],
    startDate: '',
    endDate: '',
    reason: '',
  });

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;

  const resetForm = () => {
    setFormData({
      leaveType: 'Annual',
      startDate: '',
      endDate: '',
      reason: '',
    });
  };

  const handleApprove = (request: LeaveRequest) => {
    setRequests(
      requests.map((r) =>
        r.id === request.id ? { ...r, status: 'Approved' } : r
      )
    );
    setDetailModalVisible(false);
    Alert.alert('Success', 'Leave request approved');
  };

  const handleReject = (request: LeaveRequest) => {
    Alert.alert('Reject Leave', 'Are you sure you want to reject this leave request?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () => {
          setRequests(
            requests.map((r) =>
              r.id === request.id ? { ...r, status: 'Rejected' } : r
            )
          );
          setDetailModalVisible(false);
          Alert.alert('Success', 'Leave request rejected');
        },
      },
    ]);
  };

  const handleSubmit = () => {
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newRequest: LeaveRequest = {
      id: String(requests.length + 1),
      employeeId: 'EMP-001',
      employeeName: 'Current User',
      department: 'Engineering',
      ...formData,
      days: 5, // Would calculate from dates
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };

    setRequests([newRequest, ...requests]);
    setModalVisible(false);
    resetForm();
    Alert.alert('Success', 'Leave request submitted successfully');
  };

  const getLeaveTypeIcon = (type: string) => {
    switch (type) {
      case 'Annual':
        return Palmtree;
      case 'Sick':
        return HeartPulse;
      case 'Maternity':
        return Baby;
      case 'Study':
        return GraduationCap;
      default:
        return CalendarDays;
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'Annual':
        return '#10B981';
      case 'Sick':
        return '#EF4444';
      case 'Maternity':
        return '#EC4899';
      case 'Study':
        return '#8B5CF6';
      case 'Unpaid':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return '#10B981';
      case 'Rejected':
        return '#EF4444';
      case 'Pending':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return CheckCircle;
      case 'Rejected':
        return XCircle;
      case 'Pending':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const renderRequest = ({ item }: { item: LeaveRequest }) => {
    const StatusIcon = getStatusIcon(item.status);
    const TypeIcon = getLeaveTypeIcon(item.leaveType);

    return (
      <TouchableOpacity
        style={styles.requestCard}
        onPress={() => {
          setSelectedRequest(item);
          setDetailModalVisible(true);
        }}
      >
        <View style={styles.requestHeader}>
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
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <StatusIcon size={14} color={getStatusColor(item.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.leaveDetails}>
          <View style={[styles.leaveTypeBadge, { backgroundColor: `${getLeaveTypeColor(item.leaveType)}15` }]}>
            <TypeIcon size={14} color={getLeaveTypeColor(item.leaveType)} />
            <Text style={[styles.leaveTypeText, { color: getLeaveTypeColor(item.leaveType) }]}>
              {item.leaveType} Leave
            </Text>
          </View>
          <View style={styles.dateRange}>
            <Calendar size={14} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text style={styles.dateText}>
              {item.startDate} - {item.endDate} ({item.days} days)
            </Text>
          </View>
        </View>

        <Text style={styles.reason} numberOfLines={2}>{item.reason}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ModuleLayout moduleId="hr" navItems={hrNavItems} activeScreen="HRLeave" title="Leave Management">
      <View style={styles.container}>
        {/* Leave Balance Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.balanceContainer}
          contentContainerStyle={styles.balanceContent}
        >
          <View style={[styles.balanceCard, { borderLeftColor: '#10B981' }]}>
            <Text style={styles.balanceLabel}>Annual</Text>
            <Text style={styles.balanceValue}>
              {leaveBalance.annual.total - leaveBalance.annual.used}
              <Text style={styles.balanceTotal}>/{leaveBalance.annual.total}</Text>
            </Text>
          </View>
          <View style={[styles.balanceCard, { borderLeftColor: '#EF4444' }]}>
            <Text style={styles.balanceLabel}>Sick</Text>
            <Text style={styles.balanceValue}>
              {leaveBalance.sick.total - leaveBalance.sick.used}
              <Text style={styles.balanceTotal}>/{leaveBalance.sick.total}</Text>
            </Text>
          </View>
          <View style={[styles.balanceCard, { borderLeftColor: '#8B5CF6' }]}>
            <Text style={styles.balanceLabel}>Study</Text>
            <Text style={styles.balanceValue}>
              {leaveBalance.study.total - leaveBalance.study.used}
              <Text style={styles.balanceTotal}>/{leaveBalance.study.total}</Text>
            </Text>
          </View>
        </ScrollView>

        {/* Pending Alert */}
        {pendingCount > 0 && (
          <View style={styles.pendingAlert}>
            <AlertCircle size={18} color="#F59E0B" />
            <Text style={styles.pendingText}>{pendingCount} leave requests pending approval</Text>
          </View>
        )}

        {/* Search and Add */}
        <View style={styles.toolbar}>
          <View style={styles.searchContainer}>
            <Search size={18} color={isDark ? '#64748B' : '#94A3B8'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search requests..."
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Plus size={18} color="#FFFFFF" />
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

        {/* Requests List */}
        <FlatList
          data={filteredRequests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Calendar size={48} color={isDark ? '#334155' : '#CBD5E1'} />
              <Text style={styles.emptyText}>No leave requests found</Text>
            </View>
          }
        />
      </View>

      {/* New Request Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Leave</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Leave Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.chipContainer}>
                    {leaveTypes.map((type) => {
                      const TypeIcon = getLeaveTypeIcon(type);
                      return (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.chip,
                            formData.leaveType === type && {
                              backgroundColor: getLeaveTypeColor(type),
                              borderColor: getLeaveTypeColor(type),
                            },
                          ]}
                          onPress={() => setFormData({ ...formData, leaveType: type })}
                        >
                          <TypeIcon
                            size={14}
                            color={formData.leaveType === type ? '#FFFFFF' : getLeaveTypeColor(type)}
                          />
                          <Text
                            style={[
                              styles.chipText,
                              formData.leaveType === type && { color: '#FFFFFF' },
                            ]}
                          >
                            {type}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Start Date *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.startDate}
                    onChangeText={(text) => setFormData({ ...formData, startDate: text })}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>End Date *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.endDate}
                    onChangeText={(text) => setFormData({ ...formData, endDate: text })}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Reason *</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={formData.reason}
                  onChangeText={(text) => setFormData({ ...formData, reason: text })}
                  placeholder="Explain your reason for leave..."
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Detail Modal */}
      <Modal
        visible={detailModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Leave Request Details</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            {selectedRequest && (
              <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.employeeHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {selectedRequest.employeeName.split(' ').map((n) => n[0]).join('')}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.detailEmployeeName}>{selectedRequest.employeeName}</Text>
                    <Text style={styles.detailEmployeeId}>
                      {selectedRequest.employeeId} • {selectedRequest.department}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Leave Type</Text>
                  <View
                    style={[
                      styles.leaveTypeBadge,
                      { backgroundColor: `${getLeaveTypeColor(selectedRequest.leaveType)}15` },
                    ]}
                  >
                    <Text style={{ color: getLeaveTypeColor(selectedRequest.leaveType), fontWeight: '600' }}>
                      {selectedRequest.leaveType}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>
                    {selectedRequest.startDate} - {selectedRequest.endDate}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Days</Text>
                  <Text style={styles.detailValue}>{selectedRequest.days} days</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(selectedRequest.status)}20` },
                    ]}
                  >
                    <Text style={{ color: getStatusColor(selectedRequest.status), fontWeight: '600' }}>
                      {selectedRequest.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.reasonSection}>
                  <Text style={styles.detailLabel}>Reason</Text>
                  <Text style={styles.reasonText}>{selectedRequest.reason}</Text>
                </View>
              </ScrollView>
            )}

            {selectedRequest?.status === 'Pending' && (
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.rejectButton]}
                  onPress={() => selectedRequest && handleReject(selectedRequest)}
                >
                  <XCircle size={18} color="#FFFFFF" />
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.approveButton]}
                  onPress={() => selectedRequest && handleApprove(selectedRequest)}
                >
                  <CheckCircle size={18} color="#FFFFFF" />
                  <Text style={styles.approveButtonText}>Approve</Text>
                </TouchableOpacity>
              </View>
            )}
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
    balanceContainer: {
      maxHeight: 90,
    },
    balanceContent: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    balanceCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 10,
      padding: 12,
      marginRight: 12,
      minWidth: 100,
      borderLeftWidth: 3,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    balanceLabel: {
      fontSize: 12,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 4,
    },
    balanceValue: {
      fontSize: 22,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    balanceTotal: {
      fontSize: 14,
      fontWeight: '400',
      color: isDark ? '#64748B' : '#94A3B8',
    },
    pendingAlert: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F59E0B15',
      marginHorizontal: 16,
      marginBottom: 12,
      padding: 12,
      borderRadius: 10,
      gap: 8,
    },
    pendingText: {
      fontSize: 13,
      color: '#F59E0B',
      fontWeight: '500',
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
    addButton: {
      width: 44,
      height: 44,
      backgroundColor: '#E91E63',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
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
    requestCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    requestHeader: {
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
    leaveDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 8,
    },
    leaveTypeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      gap: 4,
    },
    leaveTypeText: {
      fontSize: 12,
      fontWeight: '600',
    },
    dateRange: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    dateText: {
      fontSize: 12,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    reason: {
      fontSize: 13,
      color: isDark ? '#CBD5E1' : '#475569',
      lineHeight: 18,
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
    formContainer: {
      padding: 20,
    },
    formGroup: {
      marginBottom: 20,
    },
    formRow: {
      flexDirection: 'row',
      gap: 12,
    },
    formLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 8,
    },
    formInput: {
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      borderRadius: 10,
      padding: 14,
      fontSize: 15,
      color: isDark ? '#FFFFFF' : '#0F172A',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    chipContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      gap: 6,
    },
    chipText: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
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
    submitButton: {
      backgroundColor: '#E91E63',
    },
    submitButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    rejectButton: {
      backgroundColor: '#EF4444',
    },
    rejectButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    approveButton: {
      backgroundColor: '#10B981',
    },
    approveButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    detailContainer: {
      padding: 20,
    },
    employeeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 20,
    },
    detailEmployeeName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    detailEmployeeId: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    detailLabel: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    reasonSection: {
      marginTop: 16,
    },
    reasonText: {
      fontSize: 14,
      color: isDark ? '#CBD5E1' : '#475569',
      marginTop: 8,
      lineHeight: 20,
    },
  });
