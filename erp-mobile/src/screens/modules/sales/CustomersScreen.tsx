/**
 * Sales Customers Screen
 * Full CRUD functionality for customer management
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
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Phone,
  Mail,
  Building,
  X,
} from 'lucide-react-native';

import ModuleLayout from '@/components/ModuleLayout';

// Customer type
interface Customer {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  type: 'Business' | 'Individual';
  status: 'Active' | 'Inactive';
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

// Mock data
const initialCustomers: Customer[] = [
  {
    id: 'CUS-001',
    companyName: 'Acme Corporation',
    contactName: 'John Smith',
    email: 'john@acme.com',
    phone: '+1 234 567 8901',
    address: '123 Business Ave, New York, NY',
    type: 'Business',
    status: 'Active',
    totalOrders: 45,
    totalSpent: 125000,
    createdAt: '2024-01-15',
  },
  {
    id: 'CUS-002',
    companyName: 'TechStart Inc',
    contactName: 'Sarah Johnson',
    email: 'sarah@techstart.com',
    phone: '+1 234 567 8902',
    address: '456 Innovation Blvd, San Francisco, CA',
    type: 'Business',
    status: 'Active',
    totalOrders: 28,
    totalSpent: 89000,
    createdAt: '2024-02-20',
  },
  {
    id: 'CUS-003',
    companyName: 'Global Trade LLC',
    contactName: 'Mike Brown',
    email: 'mike@globaltrade.com',
    phone: '+1 234 567 8903',
    address: '789 Commerce St, Chicago, IL',
    type: 'Business',
    status: 'Inactive',
    totalOrders: 12,
    totalSpent: 45000,
    createdAt: '2024-03-10',
  },
  {
    id: 'CUS-004',
    companyName: 'Emily Davis',
    contactName: 'Emily Davis',
    email: 'emily@email.com',
    phone: '+1 234 567 8904',
    address: '321 Main St, Austin, TX',
    type: 'Individual',
    status: 'Active',
    totalOrders: 8,
    totalSpent: 12000,
    createdAt: '2024-04-05',
  },
];

// Sales nav items
const salesNavItems = [
  { id: 'overview', label: 'Overview', screenName: 'Sales' },
  { id: 'customers', label: 'Customers', screenName: 'SalesCustomers' },
  { id: 'leads', label: 'Leads', screenName: 'SalesLeads' },
  { id: 'quotations', label: 'Quotations', screenName: 'SalesQuotations' },
  { id: 'orders', label: 'Orders', screenName: 'SalesOrders' },
];

// Empty form state
const emptyForm = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  address: '',
  type: 'Business' as const,
};

export default function CustomersScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  // State
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Add customer
  const handleAddCustomer = () => {
    if (!formData.companyName || !formData.email) {
      Alert.alert('Missing Fields', 'Please fill in company name and email');
      return;
    }

    const newCustomer: Customer = {
      id: `CUS-${String(customers.length + 1).padStart(3, '0')}`,
      ...formData,
      status: 'Active',
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCustomers([newCustomer, ...customers]);
    setFormData(emptyForm);
    setIsAddModalOpen(false);
    Alert.alert('Success', `${formData.companyName} has been added`);
  };

  // Edit customer
  const handleEditCustomer = () => {
    if (!selectedCustomer || !formData.companyName || !formData.email) {
      Alert.alert('Missing Fields', 'Please fill in company name and email');
      return;
    }

    setCustomers(
      customers.map((c) =>
        c.id === selectedCustomer.id
          ? { ...c, ...formData }
          : c
      )
    );
    setFormData(emptyForm);
    setSelectedCustomer(null);
    setIsEditModalOpen(false);
    Alert.alert('Success', 'Customer updated successfully');
  };

  // Delete customer
  const handleDeleteCustomer = (customer: Customer) => {
    Alert.alert(
      'Delete Customer',
      `Are you sure you want to delete ${customer.companyName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCustomers(customers.filter((c) => c.id !== customer.id));
            Alert.alert('Deleted', `${customer.companyName} has been removed`);
          },
        },
      ]
    );
  };

  // Toggle status
  const handleToggleStatus = (customer: Customer) => {
    setCustomers(
      customers.map((c) =>
        c.id === customer.id
          ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' }
          : c
      )
    );
    setShowActionMenu(null);
  };

  // Open edit modal
  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      companyName: customer.companyName,
      contactName: customer.contactName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      type: customer.type,
    });
    setShowActionMenu(null);
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? '#10B981' : '#94A3B8';
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity style={styles.customerCard}>
      <View style={styles.customerHeader}>
        <View style={styles.customerAvatar}>
          <Building size={20} color="#2196F3" />
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.companyName}>{item.companyName}</Text>
          <Text style={styles.customerId}>{item.id}</Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowActionMenu(showActionMenu === item.id ? null : item.id)}
        >
          <MoreVertical size={18} color={isDark ? '#94A3B8' : '#64748B'} />
        </TouchableOpacity>
      </View>

      <View style={styles.customerDetails}>
        <View style={styles.detailRow}>
          <Mail size={14} color={isDark ? '#64748B' : '#94A3B8'} />
          <Text style={styles.detailText}>{item.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Phone size={14} color={isDark ? '#64748B' : '#94A3B8'} />
          <Text style={styles.detailText}>{item.phone}</Text>
        </View>
      </View>

      <View style={styles.customerFooter}>
        <View style={styles.statsRow}>
          <Text style={styles.statLabel}>{item.totalOrders} orders</Text>
          <Text style={styles.statValue}>{formatCurrency(item.totalSpent)}</Text>
        </View>
        <View style={styles.badges}>
          <View style={[styles.typeBadge, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
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
            onPress={() => handleToggleStatus(item)}
          >
            <Text style={styles.actionText}>
              {item.status === 'Active' ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              setShowActionMenu(null);
              handleDeleteCustomer(item);
            }}
          >
            <Trash2 size={16} color="#EF4444" />
            <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  // Form Modal Component
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
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Company Name *</Text>
            <TextInput
              style={styles.formInput}
              value={formData.companyName}
              onChangeText={(text) => setFormData({ ...formData, companyName: text })}
              placeholder="Enter company name"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Contact Name</Text>
            <TextInput
              style={styles.formInput}
              value={formData.contactName}
              onChangeText={(text) => setFormData({ ...formData, contactName: text })}
              placeholder="Enter contact name"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            />
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
            <Text style={styles.formLabel}>Address</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Enter address"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Type</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  formData.type === 'Business' && styles.typeOptionActive,
                ]}
                onPress={() => setFormData({ ...formData, type: 'Business' })}
              >
                <Text
                  style={[
                    styles.typeOptionText,
                    formData.type === 'Business' && styles.typeOptionTextActive,
                  ]}
                >
                  Business
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  formData.type === 'Individual' && styles.typeOptionActive,
                ]}
                onPress={() => setFormData({ ...formData, type: 'Individual' })}
              >
                <Text
                  style={[
                    styles.typeOptionText,
                    formData.type === 'Individual' && styles.typeOptionTextActive,
                  ]}
                >
                  Individual
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <ModuleLayout
      moduleId="sales"
      navItems={salesNavItems}
      activeScreen="SalesCustomers"
      title="Customers"
    >
      <View style={styles.container}>
        {/* Toolbar */}
        <View style={styles.toolbar}>
          <View style={styles.searchContainer}>
            <Search size={18} color={isDark ? '#64748B' : '#94A3B8'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search customers..."
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
          {(['all', 'Active', 'Inactive'] as const).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterPill,
                filterStatus === status && styles.filterPillActive,
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filterStatus === status && styles.filterPillTextActive,
                ]}
              >
                {status === 'all' ? 'All' : status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Customer List */}
        <FlatList
          data={filteredCustomers}
          renderItem={renderCustomerItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No customers found</Text>
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
        onSubmit={handleAddCustomer}
        title="Add Customer"
      />

      {/* Edit Modal */}
      <FormModal
        visible={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setFormData(emptyForm);
          setSelectedCustomer(null);
        }}
        onSubmit={handleEditCustomer}
        title="Edit Customer"
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
      backgroundColor: '#2196F3',
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
      backgroundColor: '#2196F620',
    },
    filterPillText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    filterPillTextActive: {
      color: '#2196F3',
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    customerCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    customerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    customerAvatar: {
      width: 44,
      height: 44,
      borderRadius: 10,
      backgroundColor: isDark ? '#2196F320' : '#2196F310',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    customerInfo: {
      flex: 1,
    },
    companyName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    customerId: {
      fontSize: 13,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    menuButton: {
      padding: 8,
    },
    customerDetails: {
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
    customerFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statsRow: {
      flexDirection: 'row',
      gap: 16,
    },
    statLabel: {
      fontSize: 13,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    statValue: {
      fontSize: 13,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    badges: {
      flexDirection: 'row',
      gap: 8,
    },
    typeBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    typeText: {
      fontSize: 11,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
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
      color: '#2196F3',
    },
    modalContent: {
      flex: 1,
      padding: 16,
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
    textArea: {
      height: 100,
      textAlignVertical: 'top',
      paddingTop: 12,
    },
    typeSelector: {
      flexDirection: 'row',
      gap: 12,
    },
    typeOption: {
      flex: 1,
      height: 48,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    typeOptionActive: {
      borderColor: '#2196F3',
      backgroundColor: '#2196F320',
    },
    typeOptionText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    typeOptionTextActive: {
      color: '#2196F3',
    },
  });
