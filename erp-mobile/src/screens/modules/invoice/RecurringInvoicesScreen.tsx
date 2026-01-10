/**
 * Recurring Invoices Screen
 * Manage recurring invoice schedules
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
  Switch,
} from 'react-native';
import {
  Search,
  Plus,
  MoreVertical,
  X,
  FileText,
  RefreshCw,
  Trash2,
  Edit,
  Play,
  Pause,
  LayoutDashboard,
  Palette,
  Settings,
  Calendar,
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

interface RecurringInvoice {
  id: string;
  name: string;
  client: string;
  amount: number;
  frequency: 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  nextDate: string;
  lastGenerated: string | null;
  isActive: boolean;
  description: string;
  invoicesGenerated: number;
}

const initialRecurringInvoices: RecurringInvoice[] = [
  {
    id: '1',
    name: 'Monthly Retainer',
    client: 'Acme Corporation',
    amount: 5000,
    frequency: 'Monthly',
    nextDate: '2024-02-01',
    lastGenerated: '2024-01-01',
    isActive: true,
    description: 'Monthly consulting retainer fee',
    invoicesGenerated: 12,
  },
  {
    id: '2',
    name: 'Hosting Services',
    client: 'TechStart Inc',
    amount: 299,
    frequency: 'Monthly',
    nextDate: '2024-02-15',
    lastGenerated: '2024-01-15',
    isActive: true,
    description: 'Cloud hosting and maintenance',
    invoicesGenerated: 8,
  },
  {
    id: '3',
    name: 'Quarterly Maintenance',
    client: 'Global Trade Ltd',
    amount: 2500,
    frequency: 'Quarterly',
    nextDate: '2024-04-01',
    lastGenerated: '2024-01-01',
    isActive: true,
    description: 'Quarterly system maintenance and updates',
    invoicesGenerated: 4,
  },
  {
    id: '4',
    name: 'Annual License',
    client: 'Local Shop',
    amount: 1200,
    frequency: 'Yearly',
    nextDate: '2025-01-01',
    lastGenerated: '2024-01-01',
    isActive: false,
    description: 'Annual software license fee',
    invoicesGenerated: 2,
  },
  {
    id: '5',
    name: 'Weekly Support',
    client: 'Startup Hub',
    amount: 500,
    frequency: 'Weekly',
    nextDate: '2024-01-29',
    lastGenerated: '2024-01-22',
    isActive: true,
    description: 'Weekly support hours package',
    invoicesGenerated: 24,
  },
];

const frequencyOptions = ['Weekly', 'Monthly', 'Quarterly', 'Yearly'];
const statusFilters = ['All', 'Active', 'Paused'];

export default function RecurringInvoicesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>(initialRecurringInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<RecurringInvoice | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    amount: '',
    frequency: 'Monthly',
    description: '',
    isActive: true,
  });

  const moduleColor = '#3F51B5';

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Weekly': return '#3B82F6';
      case 'Monthly': return '#10B981';
      case 'Quarterly': return '#F59E0B';
      case 'Yearly': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const filteredInvoices = recurringInvoices.filter(invoice => {
    const matchesSearch =
      invoice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && invoice.isActive) ||
      (statusFilter === 'Paused' && !invoice.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleAddRecurring = () => {
    if (!formData.name || !formData.client || !formData.amount) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    const newRecurring: RecurringInvoice = {
      id: Date.now().toString(),
      name: formData.name,
      client: formData.client,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency as RecurringInvoice['frequency'],
      nextDate: getNextDate(formData.frequency),
      lastGenerated: null,
      isActive: formData.isActive,
      description: formData.description,
      invoicesGenerated: 0,
    };

    setRecurringInvoices([newRecurring, ...recurringInvoices]);
    resetForm();
    setIsAddModalVisible(false);
  };

  const handleUpdateRecurring = () => {
    if (!selectedInvoice || !formData.name || !formData.client) return;

    const updatedInvoices = recurringInvoices.map(inv =>
      inv.id === selectedInvoice.id
        ? {
            ...inv,
            name: formData.name,
            client: formData.client,
            amount: parseFloat(formData.amount) || inv.amount,
            frequency: formData.frequency as RecurringInvoice['frequency'],
            description: formData.description,
            isActive: formData.isActive,
          }
        : inv
    );

    setRecurringInvoices(updatedInvoices);
    resetForm();
    setIsAddModalVisible(false);
    setIsEditing(false);
  };

  const handleDeleteRecurring = () => {
    if (!selectedInvoice) return;

    Alert.alert(
      'Delete Recurring Invoice',
      `Are you sure you want to delete "${selectedInvoice.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setRecurringInvoices(recurringInvoices.filter(i => i.id !== selectedInvoice.id));
            setIsActionMenuVisible(false);
            setSelectedInvoice(null);
          },
        },
      ]
    );
  };

  const handleToggleActive = (invoice: RecurringInvoice) => {
    const updatedInvoices = recurringInvoices.map(inv =>
      inv.id === invoice.id ? { ...inv, isActive: !inv.isActive } : inv
    );
    setRecurringInvoices(updatedInvoices);
    setIsActionMenuVisible(false);
  };

  const handleGenerateNow = () => {
    if (!selectedInvoice) return;

    const updatedInvoices = recurringInvoices.map(inv =>
      inv.id === selectedInvoice.id
        ? {
            ...inv,
            lastGenerated: new Date().toISOString().split('T')[0],
            nextDate: getNextDate(inv.frequency),
            invoicesGenerated: inv.invoicesGenerated + 1,
          }
        : inv
    );
    setRecurringInvoices(updatedInvoices);
    setIsActionMenuVisible(false);
    Alert.alert('Success', `Invoice generated for ${selectedInvoice.client}`);
  };

  const getNextDate = (frequency: string) => {
    const now = new Date();
    switch (frequency) {
      case 'Weekly':
        now.setDate(now.getDate() + 7);
        break;
      case 'Monthly':
        now.setMonth(now.getMonth() + 1);
        break;
      case 'Quarterly':
        now.setMonth(now.getMonth() + 3);
        break;
      case 'Yearly':
        now.setFullYear(now.getFullYear() + 1);
        break;
    }
    return now.toISOString().split('T')[0];
  };

  const resetForm = () => {
    setFormData({
      name: '',
      client: '',
      amount: '',
      frequency: 'Monthly',
      description: '',
      isActive: true,
    });
    setSelectedInvoice(null);
    setIsEditing(false);
  };

  const openEditModal = () => {
    if (!selectedInvoice) return;

    setFormData({
      name: selectedInvoice.name,
      client: selectedInvoice.client,
      amount: String(selectedInvoice.amount),
      frequency: selectedInvoice.frequency,
      description: selectedInvoice.description,
      isActive: selectedInvoice.isActive,
    });
    setIsEditing(true);
    setIsActionMenuVisible(false);
    setIsAddModalVisible(true);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const renderRecurringInvoice = ({ item }: { item: RecurringInvoice }) => (
    <TouchableOpacity
      style={[styles.invoiceCard, !item.isActive && styles.inactiveCard]}
      onPress={() => {
        setSelectedInvoice(item);
        setIsActionMenuVisible(true);
      }}
    >
      <View style={styles.invoiceHeader}>
        <View style={styles.invoiceMain}>
          <View style={styles.nameRow}>
            <Text style={styles.invoiceName}>{item.name}</Text>
            {!item.isActive && (
              <View style={styles.pausedBadge}>
                <Pause size={10} color="#F59E0B" />
                <Text style={styles.pausedText}>Paused</Text>
              </View>
            )}
          </View>
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
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Amount</Text>
          <Text style={styles.amountValue}>{formatCurrency(item.amount)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Frequency</Text>
          <View style={[styles.frequencyBadge, { backgroundColor: `${getFrequencyColor(item.frequency)}20` }]}>
            <Text style={[styles.frequencyText, { color: getFrequencyColor(item.frequency) }]}>
              {item.frequency}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.invoiceFooter}>
        <View style={styles.footerItem}>
          <Calendar size={14} color={isDark ? '#64748B' : '#94A3B8'} />
          <Text style={styles.footerText}>Next: {item.nextDate}</Text>
        </View>
        <Text style={styles.generatedCount}>{item.invoicesGenerated} generated</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ModuleLayout
      moduleId="invoice"
      navItems={invoiceNavItems}
      activeScreen="InvoiceRecurring"
      title="Recurring Invoices"
    >
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search recurring..."
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

        {/* Recurring Invoices List */}
        <FlatList
          data={filteredInvoices}
          renderItem={renderRecurringInvoice}
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
                  {isEditing ? 'Edit Recurring Invoice' : 'New Recurring Invoice'}
                </Text>
                <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                  <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="e.g., Monthly Retainer"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />

                <Text style={styles.inputLabel}>Client *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.client}
                  onChangeText={(text) => setFormData({ ...formData, client: text })}
                  placeholder="Enter client name"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />

                <Text style={styles.inputLabel}>Amount *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.amount}
                  onChangeText={(text) => setFormData({ ...formData, amount: text })}
                  placeholder="0.00"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="numeric"
                />

                <Text style={styles.inputLabel}>Frequency</Text>
                <View style={styles.frequencyOptions}>
                  {frequencyOptions.map(freq => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.frequencyOption,
                        formData.frequency === freq && { backgroundColor: moduleColor, borderColor: moduleColor },
                      ]}
                      onPress={() => setFormData({ ...formData, frequency: freq })}
                    >
                      <Text
                        style={[
                          styles.frequencyOptionText,
                          formData.frequency === freq && { color: '#FFFFFF' },
                        ]}
                      >
                        {freq}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Description of the recurring service"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  multiline
                  numberOfLines={3}
                />

                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Active</Text>
                  <Switch
                    value={formData.isActive}
                    onValueChange={(value) => setFormData({ ...formData, isActive: value })}
                    trackColor={{ false: '#767577', true: `${moduleColor}50` }}
                    thumbColor={formData.isActive ? moduleColor : '#f4f3f4'}
                  />
                </View>
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
                  onPress={isEditing ? handleUpdateRecurring : handleAddRecurring}
                >
                  <Text style={styles.submitButtonText}>
                    {isEditing ? 'Update' : 'Create'}
                  </Text>
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
              <TouchableOpacity style={styles.actionMenuItem} onPress={openEditModal}>
                <Edit size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
                <Text style={styles.actionMenuText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionMenuItem}
                onPress={() => selectedInvoice && handleToggleActive(selectedInvoice)}
              >
                {selectedInvoice?.isActive ? (
                  <>
                    <Pause size={18} color="#F59E0B" />
                    <Text style={[styles.actionMenuText, { color: '#F59E0B' }]}>Pause</Text>
                  </>
                ) : (
                  <>
                    <Play size={18} color="#10B981" />
                    <Text style={[styles.actionMenuText, { color: '#10B981' }]}>Resume</Text>
                  </>
                )}
              </TouchableOpacity>

              {selectedInvoice?.isActive && (
                <TouchableOpacity style={styles.actionMenuItem} onPress={handleGenerateNow}>
                  <RefreshCw size={18} color="#3B82F6" />
                  <Text style={[styles.actionMenuText, { color: '#3B82F6' }]}>Generate Now</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.actionMenuItem} onPress={handleDeleteRecurring}>
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
    inactiveCard: {
      opacity: 0.7,
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
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 2,
    },
    invoiceName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    pausedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: '#FEF3C7',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    pausedText: {
      fontSize: 10,
      fontWeight: '600',
      color: '#F59E0B',
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
    detailItem: {},
    detailLabel: {
      fontSize: 11,
      color: isDark ? '#64748B' : '#94A3B8',
      marginBottom: 4,
    },
    amountValue: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    frequencyBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    frequencyText: {
      fontSize: 12,
      fontWeight: '600',
    },
    invoiceFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    footerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    footerText: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    generatedCount: {
      fontSize: 12,
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
    frequencyOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    frequencyOption: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    },
    frequencyOptionText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    switchLabel: {
      fontSize: 15,
      color: isDark ? '#FFFFFF' : '#0F172A',
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
