/**
 * Sales Quotations Screen
 * Full CRUD functionality for managing quotations
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
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Send,
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

interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Quotation {
  id: string;
  customer: string;
  customerEmail: string;
  items: QuotationItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Declined' | 'Expired';
  validUntil: string;
  createdAt: string;
  notes: string;
}

const initialQuotations: Quotation[] = [
  {
    id: 'QUO-001',
    customer: 'Acme Corporation',
    customerEmail: 'procurement@acme.com',
    items: [
      { description: 'Enterprise Software License', quantity: 10, unitPrice: 1200 },
      { description: 'Implementation Service', quantity: 1, unitPrice: 5000 },
    ],
    subtotal: 17000,
    tax: 1275,
    total: 18275,
    status: 'Sent',
    validUntil: '2024-02-15',
    createdAt: '2024-01-15',
    notes: 'Includes 1 year support',
  },
  {
    id: 'QUO-002',
    customer: 'TechStart Inc',
    customerEmail: 'finance@techstart.com',
    items: [
      { description: 'Cloud Hosting Package', quantity: 1, unitPrice: 2400 },
      { description: 'Security Add-on', quantity: 1, unitPrice: 600 },
    ],
    subtotal: 3000,
    tax: 225,
    total: 3225,
    status: 'Accepted',
    validUntil: '2024-02-20',
    createdAt: '2024-01-12',
    notes: 'Monthly billing',
  },
  {
    id: 'QUO-003',
    customer: 'Global Enterprises',
    customerEmail: 'orders@globalent.com',
    items: [
      { description: 'Custom Development', quantity: 40, unitPrice: 150 },
    ],
    subtotal: 6000,
    tax: 450,
    total: 6450,
    status: 'Draft',
    validUntil: '2024-02-28',
    createdAt: '2024-01-18',
    notes: 'Hourly rate project',
  },
  {
    id: 'QUO-004',
    customer: 'Local Shop Ltd',
    customerEmail: 'owner@localshop.com',
    items: [
      { description: 'POS System', quantity: 2, unitPrice: 800 },
      { description: 'Training', quantity: 4, unitPrice: 100 },
    ],
    subtotal: 2000,
    tax: 150,
    total: 2150,
    status: 'Declined',
    validUntil: '2024-01-30',
    createdAt: '2024-01-05',
    notes: 'Competitor offered lower price',
  },
];

const quotationStatuses: Quotation['status'][] = ['Draft', 'Sent', 'Viewed', 'Accepted', 'Declined', 'Expired'];

export default function QuotationsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    customer: '',
    customerEmail: '',
    itemDescription: '',
    itemQuantity: '',
    itemUnitPrice: '',
    notes: '',
    validDays: '30',
  });

  const filteredQuotations = quotations.filter((quote) => {
    const matchesSearch =
      quote.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      customer: '',
      customerEmail: '',
      itemDescription: '',
      itemQuantity: '',
      itemUnitPrice: '',
      notes: '',
      validDays: '30',
    });
    setEditMode(false);
    setSelectedQuotation(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (quote: Quotation) => {
    setFormData({
      customer: quote.customer,
      customerEmail: quote.customerEmail,
      itemDescription: quote.items[0]?.description || '',
      itemQuantity: quote.items[0]?.quantity.toString() || '',
      itemUnitPrice: quote.items[0]?.unitPrice.toString() || '',
      notes: quote.notes,
      validDays: '30',
    });
    setSelectedQuotation(quote);
    setEditMode(true);
    setMenuVisible(false);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.customer || !formData.customerEmail || !formData.itemDescription) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const quantity = parseInt(formData.itemQuantity) || 1;
    const unitPrice = parseFloat(formData.itemUnitPrice) || 0;
    const subtotal = quantity * unitPrice;
    const tax = subtotal * 0.075;
    const total = subtotal + tax;

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + parseInt(formData.validDays));

    if (editMode && selectedQuotation) {
      setQuotations(
        quotations.map((q) =>
          q.id === selectedQuotation.id
            ? {
                ...q,
                customer: formData.customer,
                customerEmail: formData.customerEmail,
                items: [{ description: formData.itemDescription, quantity, unitPrice }],
                subtotal,
                tax,
                total,
                notes: formData.notes,
              }
            : q
        )
      );
      Alert.alert('Success', 'Quotation updated successfully');
    } else {
      const newQuotation: Quotation = {
        id: `QUO-${String(quotations.length + 1).padStart(3, '0')}`,
        customer: formData.customer,
        customerEmail: formData.customerEmail,
        items: [{ description: formData.itemDescription, quantity, unitPrice }],
        subtotal,
        tax,
        total,
        status: 'Draft',
        validUntil: validUntil.toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
        notes: formData.notes,
      };
      setQuotations([newQuotation, ...quotations]);
      Alert.alert('Success', 'Quotation created successfully');
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDelete = (quote: Quotation) => {
    Alert.alert('Delete Quotation', `Are you sure you want to delete ${quote.id}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setQuotations(quotations.filter((q) => q.id !== quote.id));
          setMenuVisible(false);
          Alert.alert('Success', 'Quotation deleted successfully');
        },
      },
    ]);
  };

  const handleSendQuotation = (quote: Quotation) => {
    setQuotations(
      quotations.map((q) =>
        q.id === quote.id ? { ...q, status: 'Sent' } : q
      )
    );
    setMenuVisible(false);
    Alert.alert('Success', `Quotation ${quote.id} sent to ${quote.customerEmail}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return '#6B7280';
      case 'Sent':
        return '#3B82F6';
      case 'Viewed':
        return '#8B5CF6';
      case 'Accepted':
        return '#10B981';
      case 'Declined':
        return '#EF4444';
      case 'Expired':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Draft':
        return FileText;
      case 'Sent':
        return Send;
      case 'Viewed':
        return Clock;
      case 'Accepted':
        return CheckCircle;
      case 'Declined':
        return XCircle;
      case 'Expired':
        return Clock;
      default:
        return FileText;
    }
  };

  const renderQuotation = ({ item }: { item: Quotation }) => {
    const StatusIcon = getStatusIcon(item.status);
    return (
      <TouchableOpacity style={styles.quoteCard}>
        <View style={styles.quoteHeader}>
          <View>
            <Text style={styles.quoteId}>{item.id}</Text>
            <Text style={styles.quoteCustomer}>{item.customer}</Text>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setSelectedQuotation(item);
              setMenuVisible(true);
            }}
          >
            <MoreVertical size={18} color={isDark ? '#64748B' : '#94A3B8'} />
          </TouchableOpacity>
        </View>

        <View style={styles.quoteItems}>
          {item.items.map((lineItem, index) => (
            <Text key={index} style={styles.itemText} numberOfLines={1}>
              {lineItem.quantity}x {lineItem.description}
            </Text>
          ))}
        </View>

        <View style={styles.quoteTotals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${item.subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (7.5%)</Text>
            <Text style={styles.totalValue}>${item.tax.toLocaleString()}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>${item.total.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.quoteFooter}>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <StatusIcon size={12} color={getStatusColor(item.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
          </View>
          <View style={styles.dateInfo}>
            <Calendar size={12} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text style={styles.dateText}>Valid until {item.validUntil}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ModuleLayout moduleId="sales" navItems={salesNavItems} activeScreen="SalesQuotations" title="Quotations">
      <View style={styles.container}>
        {/* Search and Add */}
        <View style={styles.toolbar}>
          <View style={styles.searchContainer}>
            <Search size={18} color={isDark ? '#64748B' : '#94A3B8'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search quotations..."
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
          {['All', ...quotationStatuses].map((status) => (
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

        {/* Quotations List */}
        <FlatList
          data={filteredQuotations}
          renderItem={renderQuotation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FileText size={48} color={isDark ? '#334155' : '#CBD5E1'} />
              <Text style={styles.emptyText}>No quotations found</Text>
            </View>
          }
        />
      </View>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editMode ? 'Edit Quotation' : 'Create Quotation'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Customer Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.customer}
                  onChangeText={(text) => setFormData({ ...formData, customer: text })}
                  placeholder="Enter customer name"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Customer Email *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.customerEmail}
                  onChangeText={(text) => setFormData({ ...formData, customerEmail: text })}
                  placeholder="Enter customer email"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Text style={styles.sectionLabel}>Line Item</Text>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.itemDescription}
                  onChangeText={(text) => setFormData({ ...formData, itemDescription: text })}
                  placeholder="Item description"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Quantity</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.itemQuantity}
                    onChangeText={(text) => setFormData({ ...formData, itemQuantity: text })}
                    placeholder="1"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Unit Price ($)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.itemUnitPrice}
                    onChangeText={(text) => setFormData({ ...formData, itemUnitPrice: text })}
                    placeholder="0.00"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Valid for (days)</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.validDays}
                  onChangeText={(text) => setFormData({ ...formData, validDays: text })}
                  placeholder="30"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Notes</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={formData.notes}
                  onChangeText={(text) => setFormData({ ...formData, notes: text })}
                  placeholder="Additional notes..."
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  multiline
                  numberOfLines={3}
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
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{editMode ? 'Update' : 'Create'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Action Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            {selectedQuotation?.status === 'Draft' && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => selectedQuotation && handleSendQuotation(selectedQuotation)}
              >
                <Send size={18} color="#2196F3" />
                <Text style={[styles.menuItemText, { color: '#2196F3' }]}>Send Quotation</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => selectedQuotation && openEditModal(selectedQuotation)}
            >
              <Edit size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
              <Text style={styles.menuItemText}>Edit Quotation</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => selectedQuotation && handleDelete(selectedQuotation)}
            >
              <Trash2 size={18} color="#EF4444" />
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Delete Quotation</Text>
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
    quoteCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    quoteHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    quoteId: {
      fontSize: 14,
      fontWeight: '600',
      color: '#2196F3',
      marginBottom: 2,
    },
    quoteCustomer: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    menuButton: {
      padding: 8,
    },
    quoteItems: {
      paddingVertical: 12,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      marginBottom: 12,
    },
    itemText: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 4,
    },
    quoteTotals: {
      marginBottom: 12,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    totalLabel: {
      fontSize: 13,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    totalValue: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    grandTotal: {
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    grandTotalLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    grandTotalValue: {
      fontSize: 15,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    quoteFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    dateInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    dateText: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
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
    sectionLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 12,
      marginTop: 8,
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
    textArea: {
      minHeight: 80,
      textAlignVertical: 'top',
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
