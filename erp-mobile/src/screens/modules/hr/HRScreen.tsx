/**
 * HR Module Main Screen
 * Matches web app HR module with sidebar navigation
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
import {
  LayoutDashboard,
  Users,
  Clock,
  DollarSign,
  CalendarDays,
  Settings,
  UserPlus,
  TrendingUp,
  UserCheck,
  Building,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// HR navigation items - matches web exactly
const hrNavItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    screenName: 'HR',
  },
  {
    id: 'employees',
    label: 'Employees',
    icon: Users,
    screenName: 'HREmployees',
  },
  {
    id: 'attendance',
    label: 'Attendance (Tymer)',
    icon: Clock,
    screenName: 'HRAttendance',
  },
  {
    id: 'payroll',
    label: 'Payroll',
    icon: DollarSign,
    screenName: 'HRPayroll',
  },
  {
    id: 'leave',
    label: 'Leave Management',
    icon: CalendarDays,
    screenName: 'HRLeave',
  },
  {
    id: 'departments',
    label: 'Departments',
    icon: Building,
    screenName: 'HRDepartments',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    screenName: 'HRSettings',
  },
];

// Mock stats data
const hrStats = [
  { label: 'Total Employees', value: '156', icon: Users, color: '#E91E63', change: '+5' },
  { label: 'Present Today', value: '142', icon: UserCheck, color: '#10B981', change: '91%' },
  { label: 'On Leave', value: '8', icon: CalendarDays, color: '#F59E0B', change: '5%' },
  { label: 'New Hires', value: '12', icon: UserPlus, color: '#3B82F6', change: 'This month' },
];

// Mock recent employees
const recentEmployees = [
  { id: 'EMP-001', name: 'John Smith', department: 'Engineering', status: 'Active', joined: '2 days ago' },
  { id: 'EMP-002', name: 'Sarah Johnson', department: 'Marketing', status: 'Active', joined: '1 week ago' },
  { id: 'EMP-003', name: 'Mike Brown', department: 'Sales', status: 'On Leave', joined: '2 weeks ago' },
  { id: 'EMP-004', name: 'Emily Davis', department: 'HR', status: 'Active', joined: '3 weeks ago' },
];

export default function HRScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#10B981';
      case 'On Leave':
        return '#F59E0B';
      case 'Inactive':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <ModuleLayout
      moduleId="hr"
      navItems={hrNavItems}
      activeScreen="HR"
      title="HR Overview"
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {hrStats.map((stat, index) => {
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

        {/* Recent Employees */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Employees</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.employeesCard}>
            {recentEmployees.map((employee, index) => (
              <TouchableOpacity
                key={employee.id}
                style={[
                  styles.employeeRow,
                  index !== recentEmployees.length - 1 && styles.employeeRowBorder,
                ]}
              >
                <View style={styles.employeeAvatar}>
                  <Text style={styles.employeeAvatarText}>
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.employeeInfo}>
                  <Text style={styles.employeeName}>{employee.name}</Text>
                  <Text style={styles.employeeDepartment}>{employee.department}</Text>
                </View>
                <View style={styles.employeeDetails}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(employee.status)}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(employee.status) },
                      ]}
                    >
                      {employee.status}
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
            <TouchableOpacity style={styles.actionButton}>
              <UserPlus size={20} color="#E91E63" />
              <Text style={styles.actionText}>Add Employee</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Clock size={20} color="#E91E63" />
              <Text style={styles.actionText}>Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <DollarSign size={20} color="#E91E63" />
              <Text style={styles.actionText}>Run Payroll</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <TrendingUp size={20} color="#E91E63" />
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
      color: '#E91E63',
      fontWeight: '500',
    },
    employeesCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      overflow: 'hidden',
    },
    employeeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    employeeRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    employeeAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? '#E91E6320' : '#E91E6310',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    employeeAvatarText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#E91E63',
    },
    employeeInfo: {
      flex: 1,
    },
    employeeName: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    employeeDepartment: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    employeeDetails: {
      alignItems: 'flex-end',
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
