/**
 * HR Employees Screen
 * Full CRUD functionality for employee management
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
  Alert,
  FlatList,
} from 'react-native';
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Phone,
  Mail,
  Briefcase,
  X,
  User,
  Building,
} from 'lucide-react-native';

import ModuleLayout from '@/components/ModuleLayout';

// Employee type
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  manager: string;
  hireDate: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Inactive';
}

// Mock data
const initialEmployees: Employee[] = [
  {
    id: 'EMP-001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    phone: '+1 234 567 8901',
    department: 'Engineering',
    jobTitle: 'Senior Developer',
    manager: 'Sarah Wilson',
    hireDate: '2022-03-15',
    salary: 95000,
    status: 'Active',
  },
  {
    id: 'EMP-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@company.com',
    phone: '+1 234 567 8902',
    department: 'Marketing',
    jobTitle: 'Marketing Manager',
    manager: 'Michael Chen',
    hireDate: '2021-08-20',
    salary: 85000,
    status: 'Active',
  },
  {
    id: 'EMP-003',
    firstName: 'Mike',
    lastName: 'Brown',
    email: 'mike.b@company.com',
    phone: '+1 234 567 8903',
    department: 'Sales',
    jobTitle: 'Sales Representative',
    manager: 'Emily Davis',
    hireDate: '2023-01-10',
    salary: 65000,
    status: 'On Leave',
  },
  {
    id: 'EMP-004',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.d@company.com',
    phone: '+1 234 567 8904',
    department: 'Sales',
    jobTitle: 'Sales Director',
    manager: 'CEO',
    hireDate: '2020-06-05',
    salary: 120000,
    status: 'Active',
  },
  {
    id: 'EMP-005',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.w@company.com',
    phone: '+1 234 567 8905',
    department: 'HR',
    jobTitle: 'HR Specialist',
    manager: 'Lisa Anderson',
    hireDate: '2022-11-18',
    salary: 55000,
    status: 'Active',
  },
];

const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

// HR nav items
const hrNavItems = [
  { id: 'overview', label: 'Overview', screenName: 'HR' },
  { id: 'employees', label: 'Employees', screenName: 'HREmployees' },
  { id: 'attendance', label: 'Attendance', screenName: 'HRAttendance' },
  { id: 'payroll', label: 'Payroll', screenName: 'HRPayroll' },
  { id: 'leave', label: 'Leave', screenName: 'HRLeave' },
];

// Empty form state
const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: 'Engineering',
  jobTitle: '',
  manager: '',
  salary: '',
};

export default function EmployeesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  // State
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Filter employees
  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Add employee
  const handleAddEmployee = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      Alert.alert('Missing Fields', 'Please fill in first name, last name, and email');
      return;
    }

    const newEmployee: Employee = {
      id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      jobTitle: formData.jobTitle,
      manager: formData.manager,
      hireDate: new Date().toISOString().split('T')[0],
      salary: parseInt(formData.salary) || 0,
      status: 'Active',
    };

    setEmployees([newEmployee, ...employees]);
    setFormData(emptyForm);
    setIsAddModalOpen(false);
    Alert.alert('Success', `${formData.firstName} ${formData.lastName} has been added`);
  };

  // Edit employee
  const handleEditEmployee = () => {
    if (!selectedEmployee || !formData.firstName || !formData.lastName || !formData.email) {
      Alert.alert('Missing Fields', 'Please fill in first name, last name, and email');
      return;
    }

    setEmployees(
      employees.map((e) =>
        e.id === selectedEmployee.id
          ? {
              ...e,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              department: formData.department,
              jobTitle: formData.jobTitle,
              manager: formData.manager,
              salary: parseInt(formData.salary) || e.salary,
            }
          : e
      )
    );
    setFormData(emptyForm);
    setSelectedEmployee(null);
    setIsEditModalOpen(false);
    Alert.alert('Success', 'Employee updated successfully');
  };

  // Delete employee
  const handleDeleteEmployee = (employee: Employee) => {
    Alert.alert(
      'Delete Employee',
      `Are you sure you want to remove ${employee.firstName} ${employee.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setEmployees(employees.filter((e) => e.id !== employee.id));
            Alert.alert('Removed', `${employee.firstName} ${employee.lastName} has been removed`);
          },
        },
      ]
    );
  };

  // Open edit modal
  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      jobTitle: employee.jobTitle,
      manager: employee.manager,
      salary: employee.salary.toString(),
    });
    setShowActionMenu(null);
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#10B981';
      case 'On Leave':
        return '#F59E0B';
      case 'Inactive':
        return '#94A3B8';
      default:
        return '#6B7280';
    }
  };

  const renderEmployeeItem = ({ item }: { item: Employee }) => (
    <TouchableOpacity style={styles.employeeCard}>
      <View style={styles.employeeHeader}>
        <View style={styles.employeeAvatar}>
          <Text style={styles.avatarText}>
            {item.firstName[0]}{item.lastName[0]}
          </Text>
        </View>
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.employeeId}>{item.id}</Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowActionMenu(showActionMenu === item.id ? null : item.id)}
        >
          <MoreVertical size={18} color={isDark ? '#94A3B8' : '#64748B'} />
        </TouchableOpacity>
      </View>

      <View style={styles.employeeDetails}>
        <View style={styles.detailRow}>
          <Briefcase size={14} color={isDark ? '#64748B' : '#94A3B8'} />
          <Text style={styles.detailText}>{item.jobTitle}</Text>
        </View>
        <View style={styles.detailRow}>
          <Building size={14} color={isDark ? '#64748B' : '#94A3B8'} />
          <Text style={styles.detailText}>{item.department}</Text>
        </View>
        <View style={styles.detailRow}>
          <Mail size={14} color={isDark ? '#64748B' : '#94A3B8'} />
          <Text style={styles.detailText}>{item.email}</Text>
        </View>
      </View>

      <View style={styles.employeeFooter}>
        <Text style={styles.managerText}>Reports to: {item.manager}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(item.status)}20` },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      {/* Action Menu */}
      {showActionMenu === item.id && (
        <View style={[styles.actionMenu, isDark && styles.actionMenuDark]}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => openEditModal(item)}
          >
            <Edit size={16} color={isDark ? '#FFFFFF' : '#0F172A'} />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              setShowActionMenu(null);
              handleDeleteEmployee(item);
            }}
          >
            <Trash2 size={16} color="#EF4444" />
            <Text style={[styles.actionText, { color: '#EF4444' }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  // Form Modal
  const FormModal = ({
    visible,
    onClose,
    onSubmit,
    title,
  }: {
    visible: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title: string;
  }) => (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.modalContainer, isDark && styles.modalContainerDark]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onSubmit}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formRow}>
            <View style={styles.formHalf}>
              <Text style={styles.formLabel}>First Name *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                placeholder="First name"
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              />
            </View>
            <View style={styles.formHalf}>
              <Text style={styles.formLabel}>Last Name *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                placeholder="Last name"
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Email *</Text>
            <TextInput
              style={styles.formInput}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter email address"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Phone</Text>
            <TextInput
              style={styles.formInput}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter phone number"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Department</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.departmentSelector}>
                {departments.map((dept) => (
                  <TouchableOpacity
                    key={dept}
                    style={[
                      styles.departmentOption,
                      formData.department === dept && styles.departmentOptionActive,
                    ]}
                    onPress={() => setFormData({ ...formData, department: dept })}
                  >
                    <Text
                      style={[
                        styles.departmentOptionText,
                        formData.department === dept && styles.departmentOptionTextActive,
                      ]}
                    >
                      {dept}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Job Title</Text>
            <TextInput
              style={styles.formInput}
              value={formData.jobTitle}
              onChangeText={(text) => setFormData({ ...formData, jobTitle: text })}
              placeholder="Enter job title"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Manager</Text>
            <TextInput
              style={styles.formInput}
              value={formData.manager}
              onChangeText={(text) => setFormData({ ...formData, manager: text })}
              placeholder="Enter manager name"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Salary</Text>
            <TextInput
              style={styles.formInput}
              value={formData.salary}
              onChangeText={(text) => setFormData({ ...formData, salary: text })}
              placeholder="Enter annual salary"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              keyboardType="numeric"
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <ModuleLayout
      moduleId="hr"
      navItems={hrNavItems}
      activeScreen="HREmployees"
      title="Employees"
    >
      <View style={styles.container}>
        {/* Toolbar */}
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
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[
              styles.filterPill,
              filterStatus === 'all' && styles.filterPillActive,
            ]}
            onPress={() => setFilterStatus('all')}
          >
            <Text
              style={[
                styles.filterPillText,
                filterStatus === 'all' && styles.filterPillTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterPill,
              filterStatus === 'Active' && styles.filterPillActive,
            ]}
            onPress={() => setFilterStatus('Active')}
          >
            <Text
              style={[
                styles.filterPillText,
                filterStatus === 'Active' && styles.filterPillTextActive,
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterPill,
              filterStatus === 'On Leave' && styles.filterPillActive,
            ]}
            onPress={() => setFilterStatus('On Leave')}
          >
            <Text
              style={[
                styles.filterPillText,
                filterStatus === 'On Leave' && styles.filterPillTextActive,
              ]}
            >
              On Leave
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Employee List */}
        <FlatList
          data={filteredEmployees}
          renderItem={renderEmployeeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No employees found</Text>
            </View>
          }
        />
      </View>

      {/* Add Modal */}
      <FormModal
        visible={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormData(emptyForm);
        }}
        onSubmit={handleAddEmployee}
        title="Add Employee"
      />

      {/* Edit Modal */}
      <FormModal
        visible={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setFormData(emptyForm);
          setSelectedEmployee(null);
        }}
        onSubmit={handleEditEmployee}
        title="Edit Employee"
      />
    </ModuleLayout>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    toolbar: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
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
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    filterContent: {
      gap: 8,
    },
    filterPill: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
      marginRight: 8,
    },
    filterPillActive: {
      backgroundColor: '#E91E6320',
    },
    filterPillText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    filterPillTextActive: {
      color: '#E91E63',
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    employeeCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    employeeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    employeeAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDark ? '#E91E6320' : '#E91E6310',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#E91E63',
    },
    employeeInfo: {
      flex: 1,
    },
    employeeName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    employeeId: {
      fontSize: 13,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    menuButton: {
      padding: 8,
    },
    employeeDetails: {
      gap: 8,
      marginBottom: 12,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    detailText: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    employeeFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    managerText: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    statusText: {
      fontSize: 11,
      fontWeight: '600',
    },
    actionMenu: {
      position: 'absolute',
      top: 50,
      right: 16,
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      padding: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
      zIndex: 100,
    },
    actionMenuDark: {
      backgroundColor: '#334155',
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    actionText: {
      fontSize: 14,
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 48,
    },
    emptyText: {
      fontSize: 16,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    // Modal styles
    modalContainer: {
      flex: 1,
      backgroundColor: '#F8FAFC',
    },
    modalContainerDark: {
      backgroundColor: '#0F172A',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#1E293B' : '#E2E8F0',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    saveButton: {
      fontSize: 16,
      fontWeight: '600',
      color: '#E91E63',
    },
    modalContent: {
      flex: 1,
      padding: 16,
    },
    formRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    formHalf: {
      flex: 1,
    },
    formGroup: {
      marginBottom: 20,
    },
    formLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 8,
    },
    formInput: {
      height: 48,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 10,
      paddingHorizontal: 14,
      fontSize: 15,
      color: isDark ? '#FFFFFF' : '#0F172A',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    departmentSelector: {
      flexDirection: 'row',
      gap: 8,
    },
    departmentOption: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    departmentOptionActive: {
      borderColor: '#E91E63',
      backgroundColor: '#E91E6320',
    },
    departmentOptionText: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    departmentOptionTextActive: {
      color: '#E91E63',
    },
  });
