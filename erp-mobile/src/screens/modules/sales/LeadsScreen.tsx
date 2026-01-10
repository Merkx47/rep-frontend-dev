/**
 * Sales Leads Screen
 * Full CRUD functionality for managing sales leads
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
  Pressable,
  Alert,
  FlatList,
} from 'react-native';
import {
  LayoutDashboard,
  Users,
  FileText,
  ShoppingCart,
  UserPlus,
  Package,
  Briefcase,
  Building2,
  Settings,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  X,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  Target,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// Sales navigation items
const salesNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'Sales' },
  { id: 'customers', label: 'Customers', icon: Users, screenName: 'SalesCustomers' },
  { id: 'leads', label: 'Leads', icon: UserPlus, screenName: 'SalesLeads' },
  { id: 'quotations', label: 'Quotations', icon: FileText, screenName: 'SalesQuotations' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, screenName: 'SalesOrders' },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    children: [
      { id: 'product-list', label: 'Product List', screenName: 'SalesProducts' },
      { id: 'product-categories', label: 'Categories', screenName: 'SalesProductCategories' },
      { id: 'inventory', label: 'Inventory', screenName: 'SalesInventory' },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    icon: Briefcase,
    children: [
      { id: 'service-list', label: 'Service List', screenName: 'SalesServices' },
      { id: 'service-categories', label: 'Categories', screenName: 'SalesServiceCategories' },
      { id: 'delivery', label: 'Delivery', screenName: 'SalesDelivery' },
    ],
  },
  { id: 'bank', label: 'Bank Management', icon: Building2, screenName: 'SalesBank' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'SalesSettings' },
];

interface Lead {
  id: string;
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';
  value: number;
  assignedTo: string;
  lastContact: string;
  createdAt: string;
}

const initialLeads: Lead[] = [
  {
    id: 'LEAD-001',
    contactName: 'Michael Chen',
    companyName: 'Tech Innovations Ltd',
    email: 'michael@techinnovations.com',
    phone: '+234 801 234 5678',
    source: 'Website',
    status: 'Qualified',
    value: 45000,
    assignedTo: 'John Doe',
    lastContact: '2 hours ago',
    createdAt: '2024-01-15',
  },
  {
    id: 'LEAD-002',
    contactName: 'Sarah Williams',
    companyName: 'StartUp Hub',
    email: 'sarah@startuphub.com',
    phone: '+234 802 345 6789',
    source: 'Referral',
    status: 'New',
    value: 25000,
    assignedTo: 'Jane Smith',
    lastContact: '1 day ago',
    createdAt: '2024-01-14',
  },
  {
    id: 'LEAD-003',
    contactName: 'David Brown',
    companyName: 'Global Enterprises',
    email: 'david@globalent.com',
    phone: '+234 803 456 7890',
    source: 'Trade Show',
    status: 'Proposal',
    value: 120000,
    assignedTo: 'John Doe',
    lastContact: '3 days ago',
    createdAt: '2024-01-10',
  },
  {
    id: 'LEAD-004',
    contactName: 'Emily Davis',
    companyName: 'Local Retail Co',
    email: 'emily@localretail.com',
    phone: '+234 804 567 8901',
    source: 'Cold Call',
    status: 'Contacted',
    value: 15000,
    assignedTo: 'Mike Johnson',
    lastContact: 'Yesterday',
    createdAt: '2024-01-12',
  },
];

const leadSources = ['Website', 'Referral', 'Trade Show', 'Cold Call', 'Social Media', 'Email Campaign'];
const leadStatuses: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

export default function LeadsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    contactName: '',
    companyName: '',
    email: '',
    phone: '',
    source: 'Website',
    status: 'New' as Lead['status'],
    value: '',
    assignedTo: '',
  });

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      contactName: '',
      companyName: '',
      email: '',
      phone: '',
      source: 'Website',
      status: 'New',
      value: '',
      assignedTo: '',
    });
    setEditMode(false);
    setSelectedLead(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (lead: Lead) => {
    setFormData({
      contactName: lead.contactName,
      companyName: lead.companyName,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      status: lead.status,
      value: lead.value.toString(),
      assignedTo: lead.assignedTo,
    });
    setSelectedLead(lead);
    setEditMode(true);
    setMenuVisible(false);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.contactName || !formData.companyName || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (editMode && selectedLead) {
      setLeads(
        leads.map((l) =>
          l.id === selectedLead.id
            ? {
                ...l,
                ...formData,
                value: parseFloat(formData.value) || 0,
              }
            : l
        )
      );
      Alert.alert('Success', 'Lead updated successfully');
    } else {
      const newLead: Lead = {
        id: `LEAD-${String(leads.length + 1).padStart(3, '0')}`,
        ...formData,
        value: parseFloat(formData.value) || 0,
        lastContact: 'Just now',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setLeads([newLead, ...leads]);
      Alert.alert('Success', 'Lead added successfully');
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDelete = (lead: Lead) => {
    Alert.alert('Delete Lead', `Are you sure you want to delete ${lead.contactName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setLeads(leads.filter((l) => l.id !== lead.id));
          setMenuVisible(false);
          Alert.alert('Success', 'Lead deleted successfully');
        },
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return '#3B82F6';
      case 'Contacted':
        return '#8B5CF6';
      case 'Qualified':
        return '#F59E0B';
      case 'Proposal':
        return '#06B6D4';
      case 'Won':
        return '#10B981';
      case 'Lost':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const renderLead = ({ item }: { item: Lead }) => (
    <TouchableOpacity style={styles.leadCard}>
      <View style={styles.leadHeader}>
        <View style={styles.leadAvatar}>
          <Text style={styles.avatarText}>
            {item.contactName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </Text>
        </View>
        <View style={styles.leadInfo}>
          <Text style={styles.leadName}>{item.contactName}</Text>
          <Text style={styles.leadCompany}>{item.companyName}</Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            setSelectedLead(item);
            setMenuVisible(true);
          }}
        >
          <MoreVertical size={18} color={isDark ? '#64748B' : '#94A3B8'} />
        </TouchableOpacity>
      </View>

      <View style={styles.leadDetails}>
        <View style={styles.detailRow}>
          <Mail size={14} color={isDark ? '#64748B' : '#94A3B8'} />
          <Text style={styles.detailText}>{item.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Phone size={14} color={isDark ? '#64748B' : '#94A3B8'} />
          <Text style={styles.detailText}>{item.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <DollarSign size={14} color={isDark ? '#64748B' : '#94A3B8'} />
          <Text style={styles.detailText}>${item.value.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.leadFooter}>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
        <View style={styles.sourceBadge}>
          <Text style={styles.sourceText}>{item.source}</Text>
        </View>
        <Text style={styles.lastContact}>{item.lastContact}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ModuleLayout moduleId="sales" navItems={salesNavItems} activeScreen="SalesLeads" title="Leads">
      <View style={styles.container}>
        {/* Search and Add */}
        <View style={styles.toolbar}>
          <View style={styles.searchContainer}>
            <Search size={18} color={isDark ? '#64748B' : '#94A3B8'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search leads..."
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
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
          {['All', ...leadStatuses].map((status) => (
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

        {/* Leads List */}
        <FlatList
          data={filteredLeads}
          renderItem={renderLead}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Target size={48} color={isDark ? '#334155' : '#CBD5E1'} />
              <Text style={styles.emptyText}>No leads found</Text>
            </View>
          }
        />
      </View>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editMode ? 'Edit Lead' : 'Add New Lead'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Contact Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.contactName}
                  onChangeText={(text) => setFormData({ ...formData, contactName: text })}
                  placeholder="Enter contact name"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

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
                <Text style={styles.formLabel}>Email *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  placeholder="Enter email"
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
                  placeholder="Enter phone"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Estimated Value ($)</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.value}
                  onChangeText={(text) => setFormData({ ...formData, value: text })}
                  placeholder="Enter estimated value"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Assigned To</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.assignedTo}
                  onChangeText={(text) => setFormData({ ...formData, assignedTo: text })}
                  placeholder="Enter assignee name"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Source</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.chipContainer}>
                    {leadSources.map((source) => (
                      <TouchableOpacity
                        key={source}
                        style={[styles.chip, formData.source === source && styles.chipActive]}
                        onPress={() => setFormData({ ...formData, source })}
                      >
                        <Text style={[styles.chipText, formData.source === source && styles.chipTextActive]}>
                          {source}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Status</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.chipContainer}>
                    {leadStatuses.map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.chip,
                          formData.status === status && {
                            backgroundColor: getStatusColor(status),
                            borderColor: getStatusColor(status),
                          },
                        ]}
                        onPress={() => setFormData({ ...formData, status })}
                      >
                        <Text
                          style={[styles.chipText, formData.status === status && { color: '#FFFFFF' }]}
                        >
                          {status}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{editMode ? 'Update' : 'Add'} Lead</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Action Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => selectedLead && openEditModal(selectedLead)}
            >
              <Edit size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
              <Text style={styles.menuItemText}>Edit Lead</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => selectedLead && handleDelete(selectedLead)}
            >
              <Trash2 size={18} color="#EF4444" />
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Delete Lead</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
      padding: 16,
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
      backgroundColor: '#2196F3',
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
      backgroundColor: '#2196F3',
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
    leadCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    leadHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    leadAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDark ? '#2196F320' : '#2196F310',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#2196F3',
    },
    leadInfo: {
      flex: 1,
    },
    leadName: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    leadCompany: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    menuButton: {
      padding: 8,
    },
    leadDetails: {
      gap: 8,
      marginBottom: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
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
    leadFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    sourceBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: isDark ? '#334155' : '#F1F5F9',
    },
    sourceText: {
      fontSize: 12,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    lastContact: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
      marginLeft: 'auto',
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
      maxHeight: '90%',
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
    chipActive: {
      backgroundColor: '#2196F3',
      borderColor: '#2196F3',
    },
    chipText: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    chipTextActive: {
      color: '#FFFFFF',
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
      backgroundColor: '#2196F3',
    },
    saveButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    menuOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    menuContainer: {
      width: '100%',
      maxWidth: 300,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 8,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 8,
    },
    menuItemText: {
      fontSize: 15,
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    menuDivider: {
      height: 1,
      backgroundColor: isDark ? '#334155' : '#E2E8F0',
      marginVertical: 8,
    },
  });
