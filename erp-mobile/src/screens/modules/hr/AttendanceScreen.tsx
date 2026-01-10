/**
 * HR Attendance Screen
 * Track and manage employee attendance
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
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Coffee,
  LogIn,
  LogOut,
  X,
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

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave';
  workHours: number;
}

const generateAttendanceData = (date: string): AttendanceRecord[] => [
  {
    id: '1',
    employeeId: 'EMP-001',
    employeeName: 'John Doe',
    department: 'Engineering',
    date,
    checkIn: '08:55',
    checkOut: '17:30',
    status: 'Present',
    workHours: 8.5,
  },
  {
    id: '2',
    employeeId: 'EMP-002',
    employeeName: 'Sarah Johnson',
    department: 'Marketing',
    date,
    checkIn: '09:15',
    checkOut: '18:00',
    status: 'Late',
    workHours: 8.75,
  },
  {
    id: '3',
    employeeId: 'EMP-003',
    employeeName: 'Mike Brown',
    department: 'Sales',
    date,
    checkIn: null,
    checkOut: null,
    status: 'Absent',
    workHours: 0,
  },
  {
    id: '4',
    employeeId: 'EMP-004',
    employeeName: 'Emily Davis',
    department: 'HR',
    date,
    checkIn: '09:00',
    checkOut: '13:00',
    status: 'Half Day',
    workHours: 4,
  },
  {
    id: '5',
    employeeId: 'EMP-005',
    employeeName: 'David Wilson',
    department: 'Finance',
    date,
    checkIn: null,
    checkOut: null,
    status: 'On Leave',
    workHours: 0,
  },
  {
    id: '6',
    employeeId: 'EMP-006',
    employeeName: 'Lisa Anderson',
    department: 'Engineering',
    date,
    checkIn: '08:45',
    checkOut: '17:45',
    status: 'Present',
    workHours: 9,
  },
];

// Stats for the day
const attendanceStats = {
  present: 15,
  absent: 3,
  late: 4,
  onLeave: 2,
  total: 24,
};

const statusFilters = ['All', 'Present', 'Absent', 'Late', 'Half Day', 'On Leave'];

export default function AttendanceScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  const dateString = selectedDate.toISOString().split('T')[0];
  const [attendanceData] = useState<AttendanceRecord[]>(generateAttendanceData(dateString));

  const filteredRecords = attendanceData.filter((record) => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleManualEntry = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleSaveManualEntry = () => {
    Alert.alert('Success', 'Attendance record updated successfully');
    setModalVisible(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return '#10B981';
      case 'Absent':
        return '#EF4444';
      case 'Late':
        return '#F59E0B';
      case 'Half Day':
        return '#8B5CF6';
      case 'On Leave':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present':
        return CheckCircle;
      case 'Absent':
        return XCircle;
      case 'Late':
        return AlertCircle;
      case 'Half Day':
        return Coffee;
      case 'On Leave':
        return Calendar;
      default:
        return Clock;
    }
  };

  const renderRecord = ({ item }: { item: AttendanceRecord }) => {
    const StatusIcon = getStatusIcon(item.status);
    return (
      <TouchableOpacity style={styles.recordCard} onPress={() => handleManualEntry(item)}>
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
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <StatusIcon size={14} color={getStatusColor(item.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.recordDetails}>
          <View style={styles.timeBlock}>
            <LogIn size={16} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text style={styles.timeLabel}>Check In</Text>
            <Text style={styles.timeValue}>{item.checkIn || '--:--'}</Text>
          </View>
          <View style={styles.timeBlock}>
            <LogOut size={16} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text style={styles.timeLabel}>Check Out</Text>
            <Text style={styles.timeValue}>{item.checkOut || '--:--'}</Text>
          </View>
          <View style={styles.timeBlock}>
            <Clock size={16} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text style={styles.timeLabel}>Hours</Text>
            <Text style={styles.timeValue}>{item.workHours > 0 ? `${item.workHours}h` : '-'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ModuleLayout moduleId="hr" navItems={hrNavItems} activeScreen="HRAttendance" title="Attendance">
      <View style={styles.container}>
        {/* Date Navigator */}
        <View style={styles.dateNavigator}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigateDate('prev')}>
            <ChevronLeft size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </TouchableOpacity>
          <View style={styles.dateDisplay}>
            <Calendar size={18} color="#E91E63" />
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          </View>
          <TouchableOpacity style={styles.navButton} onPress={() => navigateDate('next')}>
            <ChevronRight size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsContainer}
          contentContainerStyle={styles.statsContent}
        >
          <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
            <Text style={styles.statValue}>{attendanceStats.present}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#EF4444' }]}>
            <Text style={styles.statValue}>{attendanceStats.absent}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
            <Text style={styles.statValue}>{attendanceStats.late}</Text>
            <Text style={styles.statLabel}>Late</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#3B82F6' }]}>
            <Text style={styles.statValue}>{attendanceStats.onLeave}</Text>
            <Text style={styles.statLabel}>On Leave</Text>
          </View>
        </ScrollView>

        {/* Search */}
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

        {/* Attendance List */}
        <FlatList
          data={filteredRecords}
          renderItem={renderRecord}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Calendar size={48} color={isDark ? '#334155' : '#CBD5E1'} />
              <Text style={styles.emptyText}>No attendance records found</Text>
            </View>
          }
        />
      </View>

      {/* Manual Entry Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Attendance</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            {selectedRecord && (
              <View style={styles.modalBody}>
                <View style={styles.employeeHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {selectedRecord.employeeName.split(' ').map((n) => n[0]).join('')}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.modalEmployeeName}>{selectedRecord.employeeName}</Text>
                    <Text style={styles.modalEmployeeId}>{selectedRecord.employeeId}</Text>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Status</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.chipContainer}>
                      {statusFilters.slice(1).map((status) => (
                        <TouchableOpacity
                          key={status}
                          style={[
                            styles.chip,
                            selectedRecord.status === status && {
                              backgroundColor: getStatusColor(status),
                              borderColor: getStatusColor(status),
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              selectedRecord.status === status && { color: '#FFFFFF' },
                            ]}
                          >
                            {status}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel}>Check In</Text>
                    <TextInput
                      style={styles.formInput}
                      value={selectedRecord.checkIn || ''}
                      placeholder="--:--"
                      placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    />
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel}>Check Out</Text>
                    <TextInput
                      style={styles.formInput}
                      value={selectedRecord.checkOut || ''}
                      placeholder="--:--"
                      placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    />
                  </View>
                </View>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveManualEntry}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
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
    dateNavigator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    navButton: {
      padding: 8,
    },
    dateDisplay: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    dateText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    statsContainer: {
      maxHeight: 90,
    },
    statsContent: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    statCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 10,
      padding: 12,
      marginRight: 12,
      minWidth: 80,
      borderLeftWidth: 3,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    statValue: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    statLabel: {
      fontSize: 12,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 10,
      paddingHorizontal: 12,
      marginHorizontal: 16,
      marginBottom: 12,
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
    recordDetails: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    timeBlock: {
      alignItems: 'center',
      gap: 4,
    },
    timeLabel: {
      fontSize: 11,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    timeValue: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
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
    formGroup: {
      marginBottom: 16,
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
    chipContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
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
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: isDark ? '#334155' : '#F1F5F9',
    },
    cancelButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    saveButton: {
      backgroundColor: '#E91E63',
    },
    saveButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });
