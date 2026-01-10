/**
 * Invoices List Screen
 * Full CRUD functionality for managing invoices
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Search,
  Plus,
  MoreVertical,
  X,
  FileText,
  Send,
  Download,
  Trash2,
  Edit,
  Eye,
  LayoutDashboard,
  RefreshCw,
  Palette,
  Settings,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// Invoice navigation items
const invoiceNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'Invoice' },
  { id: 'invoices', label: 'Invoices', icon: FileText, screenName: 'InvoiceList' },
  { id: 'recurring', label: 'Recurring', icon: RefreshCw, screenName: 'InvoiceRecurring' },
  { id: 'templates', label: 'Templates', icon: Palette, screenName: 'InvoiceTemplates' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'InvoiceSettings' },
];

interface InvoiceItem {
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  clientEmail: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  notes: string;
}

const initialInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    client: 'Acme Corporation',
    clientEmail: 'billing@acme.com',
    date: '2024-01-15',
    dueDate: '2024-02-15',
    items: [
      { name: 'Web Development Services', quantity: 40, rate: 150, amount: 6000 },
      { name: 'UI/UX Design', quantity: 20, rate: 120, amount: 2400 },
    ],
    subtotal: 8400,
    tax: 1260,
    total: 9660,
    status: 'Paid',
    notes: 'Payment received via bank transfer',
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    client: 'TechStart Inc',
    clientEmail: 'accounts@techstart.io',
    date: '2024-01-18',
    dueDate: '2024-02-18',
    items: [
      { name: 'Mobile App Development', quantity: 80, rate: 175, amount: 14000 },
    ],
    subtotal: 14000,
    tax: 2100,
    total: 16100,
    status: 'Sent',
    notes: '',
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    client: 'Global Trade Ltd',
    clientEmail: 'finance@globaltrade.com',
    date: '2024-01-20',
    dueDate: '2024-02-20',
    items: [
      { name: 'Consulting Services', quantity: 16, rate: 200, amount: 3200 },
      { name: 'Training Session', quantity: 8, rate: 180, amount: 1440 },
    ],
    subtotal: 4640,
    tax: 696,
    total: 5336,
    status: 'Draft',
    notes: 'Pending client approval',
  },
  {
    id: '4',
    invoiceNumber: 'INV-004',
    client: 'Local Shop',
    clientEmail: 'owner@localshop.com',
    date: '2024-01-01',
    dueDate: '2024-01-15',
    items: [
      { name: 'POS System Setup', quantity: 1, rate: 2500, amount: 2500 },
    ],
    subtotal: 2500,
    tax: 375,
    total: 2875,
    status: 'Overdue',
    notes: 'Follow up required',
  },
  {
    id: '5',
    invoiceNumber: 'INV-005',
    client: 'Startup Hub',
    clientEmail: 'billing@startuphub.co',
    date: '2024-01-22',
    dueDate: '2024-02-22',
    items: [
      { name: 'Cloud Infrastructure Setup', quantity: 1, rate: 5000, amount: 5000 },
      { name: 'Monthly Maintenance', quantity: 3, rate: 500, amount: 1500 },
    ],
    subtotal: 6500,
    tax: 975,
    total: 7475,
    status: 'Sent',
    notes: '',
  },
];

const statusFilters = ['All', 'Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'];

export default function InvoicesListScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    client: '',
    clientEmail: '',
    dueDate: '',
    itemName: '',
    itemQuantity: '',
    itemRate: '',
    notes: '',
  });

  const moduleColor = '#3F51B5';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return '#10B981';
      case 'Sent': return '#3B82F6';
      case 'Draft': return '#6B7280';
      case 'Overdue': return '#EF4444';
      case 'Cancelled': return '#9CA3AF';
      default: return '#6B7280';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddInvoice = () => {
    if (!formData.client || !formData.itemName) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    const quantity = parseFloat(formData.itemQuantity) || 1;
    const rate = parseFloat(formData.itemRate) || 0;
    const amount = quantity * rate;
    const tax = amount * 0.15;

    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      client: formData.client,
      clientEmail: formData.clientEmail,
      date: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ name: formData.itemName, quantity, rate, amount }],
      subtotal: amount,
      tax,
      total: amount + tax,
      status: 'Draft',
      notes: formData.notes,
    };

    setInvoices([newInvoice, ...invoices]);
    resetForm();
    setIsAddModalVisible(false);
  };

  const handleUpdateInvoice = () => {
    if (!selectedInvoice || !formData.client) return;

    const quantity = parseFloat(formData.itemQuantity) || selectedInvoice.items[0]?.quantity || 1;
    const rate = parseFloat(formData.itemRate) || selectedInvoice.items[0]?.rate || 0;
    const amount = quantity * rate;
    const tax = amount * 0.15;

    const updatedInvoices = invoices.map(inv =>
      inv.id === selectedInvoice.id
        ? {
            ...inv,
            client: formData.client,
            clientEmail: formData.clientEmail,
            dueDate: formData.dueDate || inv.dueDate,
            items: [{ name: formData.itemName || inv.items[0]?.name || '', quantity, rate, amount }],
            subtotal: amount,
            tax,
            total: amount + tax,
            notes: formData.notes,
          }
        : inv
    );

    setInvoices(updatedInvoices);
    resetForm();
    setIsAddModalVisible(false);
    setIsEditing(false);
  };

  const handleDeleteInvoice = () => {
    if (!selectedInvoice) return;

    Alert.alert(
      'Delete Invoice',
      `Are you sure you want to delete ${selectedInvoice.invoiceNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setInvoices(invoices.filter(i => i.id !== selectedInvoice.id));
            setIsActionMenuVisible(false);
            setSelectedInvoice(null);
          },
        },
      ]
    );
  };

  const handleSendInvoice = () => {
    if (!selectedInvoice) return;

    const updatedInvoices = invoices.map(inv =>
      inv.id === selectedInvoice.id ? { ...inv, status: 'Sent' as const } : inv
    );
    setInvoices(updatedInvoices);
    setIsActionMenuVisible(false);
    Alert.alert('Success', `Invoice ${selectedInvoice.invoiceNumber} has been sent`);
  };

  const handleMarkAsPaid = () => {
    if (!selectedInvoice) return;

    const updatedInvoices = invoices.map(inv =>
      inv.id === selectedInvoice.id ? { ...inv, status: 'Paid' as const } : inv
    );
    setInvoices(updatedInvoices);
    setIsActionMenuVisible(false);
    Alert.alert('Success', `Invoice ${selectedInvoice.invoiceNumber} marked as paid`);
  };

  const resetForm = () => {
    setFormData({
      client: '',
      clientEmail: '',
      dueDate: '',
      itemName: '',
      itemQuantity: '',
      itemRate: '',
      notes: '',
    });
    setSelectedInvoice(null);
    setIsEditing(false);
  };

  const openEditModal = () => {
    if (!selectedInvoice) return;

    setFormData({
      client: selectedInvoice.client,
      clientEmail: selectedInvoice.clientEmail,
      dueDate: selectedInvoice.dueDate,
      itemName: selectedInvoice.items[0]?.name || '',
      itemQuantity: String(selectedInvoice.items[0]?.quantity || ''),
      itemRate: String(selectedInvoice.items[0]?.rate || ''),
      notes: selectedInvoice.notes,
    });
    setIsEditing(true);
    setIsActionMenuVisible(false);
    setIsAddModalVisible(true);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const renderInvoice = ({ item }: { item: Invoice }) => (
    <TouchableOpacity
      style={styles.invoiceCard}
      onPress={() => {
        setSelectedInvoice(item);
        setIsViewModalVisible(true);
      }}
    >
      <View style={styles.invoiceHeader}>
        <View style={styles.invoiceMain}>
          <Text style={styles.invoiceNumber}>{item.invoiceNumber}</Text>
          <Text style={styles.clientName}>{item.client}</Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            setSelectedInvoice(item);
            setIsActionMenuVisible(true);
          }}
        >
          <MoreVertical size={18} color={isDark ? '#94A3B8' : '#64748B'} />
        </TouchableOpacity>
      </View>

      <View style={styles.invoiceDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Due</Text>
          <Text style={styles.detailValue}>{item.dueDate}</Text>
        </View>
      </View>

      <View style={styles.invoiceFooter}>
        <Text style={styles.totalAmount}>{formatCurrency(item.total)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ModuleLayout
      moduleId="invoice"
      navItems={invoiceNavItems}
      activeScreen="InvoiceList"
      title="Invoices"
    >
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search invoices..."
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: moduleColor }]}
            onPress={() => {
              resetForm();
              setIsAddModalVisible(true);
            }}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Status Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {statusFilters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                statusFilter === filter && { backgroundColor: moduleColor },
              ]}
              onPress={() => setStatusFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  statusFilter === filter && { color: '#FFFFFF' },
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Invoices List */}
        <FlatList
          data={filteredInvoices}
          renderItem={renderInvoice}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Add/Edit Modal */}
        <Modal
          visible={isAddModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsAddModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isEditing ? 'Edit Invoice' : 'New Invoice'}
                </Text>
                <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                  <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.inputLabel}>Client Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.client}
                  onChangeText={(text) => setFormData({ ...formData, client: text })}
                  placeholder="Enter client name"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />

                <Text style={styles.inputLabel}>Client Email</Text>
                <TextInput
                  style={styles.input}
                  value={formData.clientEmail}
                  onChangeText={(text) => setFormData({ ...formData, clientEmail: text })}
                  placeholder="client@email.com"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="email-address"
                />

                <Text style={styles.inputLabel}>Due Date</Text>
                <TextInput
                  style={styles.input}
                  value={formData.dueDate}
                  onChangeText={(text) => setFormData({ ...formData, dueDate: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />

                <Text style={styles.sectionLabel}>Line Item</Text>

                <Text style={styles.inputLabel}>Description *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.itemName}
                  onChangeText={(text) => setFormData({ ...formData, itemName: text })}
                  placeholder="Service or product description"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />

                <View style={styles.row}>
                  <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>Quantity</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.itemQuantity}
                      onChangeText={(text) => setFormData({ ...formData, itemQuantity: text })}
                      placeholder="1"
                      placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>Rate ($)</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.itemRate}
                      onChangeText={(text) => setFormData({ ...formData, itemRate: text })}
                      placeholder="0.00"
                      placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.notes}
                  onChangeText={(text) => setFormData({ ...formData, notes: text })}
                  placeholder="Additional notes"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  multiline
                  numberOfLines={3}
                />
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsAddModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: moduleColor }]}
                  onPress={isEditing ? handleUpdateInvoice : handleAddInvoice}
                >
                  <Text style={styles.submitButtonText}>
                    {isEditing ? 'Update' : 'Create Invoice'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* View Invoice Modal */}
        <Modal
          visible={isViewModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsViewModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedInvoice?.invoiceNumber}</Text>
                <TouchableOpacity onPress={() => setIsViewModalVisible(false)}>
                  <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              {selectedInvoice && (
                <ScrollView style={styles.modalBody}>
                  <View style={styles.viewSection}>
                    <Text style={styles.viewLabel}>Client</Text>
                    <Text style={styles.viewValue}>{selectedInvoice.client}</Text>
                    <Text style={styles.viewSubValue}>{selectedInvoice.clientEmail}</Text>
                  </View>

                  <View style={styles.viewRow}>
                    <View style={styles.viewHalf}>
                      <Text style={styles.viewLabel}>Invoice Date</Text>
                      <Text style={styles.viewValue}>{selectedInvoice.date}</Text>
                    </View>
                    <View style={styles.viewHalf}>
                      <Text style={styles.viewLabel}>Due Date</Text>
                      <Text style={styles.viewValue}>{selectedInvoice.dueDate}</Text>
                    </View>
                  </View>

                  <View style={styles.viewSection}>
                    <Text style={styles.viewLabel}>Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(selectedInvoice.status)}20`, alignSelf: 'flex-start' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(selectedInvoice.status) }]}>
                        {selectedInvoice.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.sectionLabel}>Items</Text>
                  {selectedInvoice.items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemDetails}>
                          {item.quantity} x {formatCurrency(item.rate)}
                        </Text>
                      </View>
                      <Text style={styles.itemAmount}>{formatCurrency(item.amount)}</Text>
                    </View>
                  ))}

                  <View style={styles.totalSection}>
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Subtotal</Text>
                      <Text style={styles.totalValue}>{formatCurrency(selectedInvoice.subtotal)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Tax (15%)</Text>
                      <Text style={styles.totalValue}>{formatCurrency(selectedInvoice.tax)}</Text>
                    </View>
                    <View style={[styles.totalRow, styles.grandTotal]}>
                      <Text style={styles.grandTotalLabel}>Total</Text>
                      <Text style={styles.grandTotalValue}>{formatCurrency(selectedInvoice.total)}</Text>
                    </View>
                  </View>

                  {selectedInvoice.notes && (
                    <View style={styles.viewSection}>
                      <Text style={styles.viewLabel}>Notes</Text>
                      <Text style={styles.viewValue}>{selectedInvoice.notes}</Text>
                    </View>
                  )}
                </ScrollView>
              )}

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsViewModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Action Menu Modal */}
        <Modal
          visible={isActionMenuVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsActionMenuVisible(false)}
        >
          <TouchableOpacity
            style={styles.actionMenuOverlay}
            activeOpacity={1}
            onPress={() => setIsActionMenuVisible(false)}
          >
            <View style={styles.actionMenu}>
              <TouchableOpacity
                style={styles.actionMenuItem}
                onPress={() => {
                  setIsActionMenuVisible(false);
                  setIsViewModalVisible(true);
                }}
              >
                <Eye size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
                <Text style={styles.actionMenuText}>View Details</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionMenuItem} onPress={openEditModal}>
                <Edit size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
                <Text style={styles.actionMenuText}>Edit Invoice</Text>
              </TouchableOpacity>

              {selectedInvoice?.status === 'Draft' && (
                <TouchableOpacity style={styles.actionMenuItem} onPress={handleSendInvoice}>
                  <Send size={18} color="#3B82F6" />
                  <Text style={[styles.actionMenuText, { color: '#3B82F6' }]}>Send Invoice</Text>
                </TouchableOpacity>
              )}

              {(selectedInvoice?.status === 'Sent' || selectedInvoice?.status === 'Overdue') && (
                <TouchableOpacity style={styles.actionMenuItem} onPress={handleMarkAsPaid}>
                  <FileText size={18} color="#10B981" />
                  <Text style={[styles.actionMenuText, { color: '#10B981' }]}>Mark as Paid</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.actionMenuItem}>
                <Download size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
                <Text style={styles.actionMenuText}>Download PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionMenuItem} onPress={handleDeleteInvoice}>
                <Trash2 size={18} color="#EF4444" />
                <Text style={[styles.actionMenuText, { color: '#EF4444' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </ModuleLayout>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    searchContainer: {
      flexDirection: 'row',
      padding: 16,
      gap: 12,
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    searchInput: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 8,
      color: isDark ? '#FFFFFF' : '#0F172A',
      fontSize: 15,
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterContainer: {
      maxHeight: 44,
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
    filterText: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    listContent: {
      padding: 16,
      gap: 12,
    },
    invoiceCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    invoiceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    invoiceMain: {
      flex: 1,
    },
    invoiceNumber: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    clientName: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    menuButton: {
      padding: 4,
    },
    invoiceDetails: {
      flexDirection: 'row',
      gap: 24,
      marginBottom: 12,
    },
    detailRow: {},
    detailLabel: {
      fontSize: 11,
      color: isDark ? '#64748B' : '#94A3B8',
      marginBottom: 2,
    },
    detailValue: {
      fontSize: 13,
      color: isDark ? '#FFFFFF' : '#0F172A',
      fontWeight: '500',
    },
    invoiceFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    totalAmount: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
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
    modalBody: {
      padding: 20,
    },
    inputLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 6,
    },
    input: {
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      borderRadius: 10,
      padding: 12,
      fontSize: 15,
      color: isDark ? '#FFFFFF' : '#0F172A',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      marginBottom: 16,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    sectionLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginTop: 8,
      marginBottom: 12,
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    halfInput: {
      flex: 1,
    },
    modalFooter: {
      flexDirection: 'row',
      padding: 20,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: isDark ? '#0F172A' : '#F1F5F9',
    },
    cancelButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    submitButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    submitButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    viewSection: {
      marginBottom: 16,
    },
    viewLabel: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
      marginBottom: 4,
    },
    viewValue: {
      fontSize: 15,
      color: isDark ? '#FFFFFF' : '#0F172A',
      fontWeight: '500',
    },
    viewSubValue: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
      marginTop: 2,
    },
    viewRow: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    viewHalf: {
      flex: 1,
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    itemInfo: {
      flex: 1,
    },
    itemName: {
      fontSize: 14,
      color: isDark ? '#FFFFFF' : '#0F172A',
      fontWeight: '500',
    },
    itemDetails: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
      marginTop: 2,
    },
    itemAmount: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    totalSection: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    totalLabel: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    totalValue: {
      fontSize: 14,
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    grandTotal: {
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    grandTotalLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    grandTotalValue: {
      fontSize: 18,
      fontWeight: '700',
      color: '#3F51B5',
    },
    actionMenuOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionMenu: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 16,
      padding: 8,
      width: '80%',
      maxWidth: 300,
    },
    actionMenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      gap: 12,
    },
    actionMenuText: {
      fontSize: 15,
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
  });
