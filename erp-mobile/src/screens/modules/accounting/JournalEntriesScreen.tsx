/**
 * Journal Entries Screen
 * Full CRUD functionality for managing journal entries
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
  BookOpen,
  FileText,
  Receipt,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Building2,
  Settings,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  X,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// Accounting navigation items
const accountingNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'Accounting' },
  { id: 'chart-of-accounts', label: 'Chart of Accounts', icon: BookOpen, screenName: 'AccountingChartOfAccounts' },
  { id: 'journals', label: 'Journal Entries', icon: FileText, screenName: 'AccountingJournals' },
  { id: 'ledger', label: 'General Ledger', icon: Receipt, screenName: 'AccountingLedger' },
  { id: 'budgets', label: 'Budgets', icon: PiggyBank, screenName: 'AccountingBudgets' },
  { id: 'reports', label: 'Reports', icon: TrendingUp, screenName: 'AccountingReports' },
  { id: 'payables', label: 'Accounts Payable', icon: CreditCard, screenName: 'AccountingPayables' },
  { id: 'receivables', label: 'Accounts Receivable', icon: Building2, screenName: 'AccountingReceivables' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'AccountingSettings' },
];

interface JournalLine {
  account: string;
  accountCode: string;
  debit: number;
  credit: number;
}

interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  reference: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  status: 'Draft' | 'Posted' | 'Voided';
  createdBy: string;
  createdAt: string;
}

const initialEntries: JournalEntry[] = [
  {
    id: '1',
    entryNumber: 'JE-001',
    date: '2024-01-15',
    description: 'Monthly rent payment',
    reference: 'CHK-1234',
    lines: [
      { account: 'Rent Expense', accountCode: '6100', debit: 5000, credit: 0 },
      { account: 'Cash', accountCode: '1000', debit: 0, credit: 5000 },
    ],
    totalDebit: 5000,
    totalCredit: 5000,
    status: 'Posted',
    createdBy: 'John Doe',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    entryNumber: 'JE-002',
    date: '2024-01-16',
    description: 'Sale to customer ABC Corp',
    reference: 'INV-2024-001',
    lines: [
      { account: 'Accounts Receivable', accountCode: '1100', debit: 12500, credit: 0 },
      { account: 'Sales Revenue', accountCode: '4000', debit: 0, credit: 12500 },
    ],
    totalDebit: 12500,
    totalCredit: 12500,
    status: 'Posted',
    createdBy: 'Jane Smith',
    createdAt: '2024-01-16',
  },
  {
    id: '3',
    entryNumber: 'JE-003',
    date: '2024-01-17',
    description: 'Inventory purchase',
    reference: 'PO-789',
    lines: [
      { account: 'Inventory', accountCode: '1200', debit: 8000, credit: 0 },
      { account: 'Accounts Payable', accountCode: '2000', debit: 0, credit: 8000 },
    ],
    totalDebit: 8000,
    totalCredit: 8000,
    status: 'Draft',
    createdBy: 'Mike Johnson',
    createdAt: '2024-01-17',
  },
  {
    id: '4',
    entryNumber: 'JE-004',
    date: '2024-01-10',
    description: 'Equipment depreciation - January',
    reference: 'DEP-01',
    lines: [
      { account: 'Depreciation Expense', accountCode: '6200', debit: 2500, credit: 0 },
      { account: 'Accumulated Depreciation', accountCode: '1550', debit: 0, credit: 2500 },
    ],
    totalDebit: 2500,
    totalCredit: 2500,
    status: 'Posted',
    createdBy: 'Sarah Williams',
    createdAt: '2024-01-10',
  },
];

const journalStatuses: JournalEntry['status'][] = ['Draft', 'Posted', 'Voided'];

export default function JournalEntriesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    debitAccount: '',
    debitCode: '',
    creditAccount: '',
    creditCode: '',
    amount: '',
  });

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.entryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      debitAccount: '',
      debitCode: '',
      creditAccount: '',
      creditCode: '',
      amount: '',
    });
    setEditMode(false);
    setSelectedEntry(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (entry: JournalEntry) => {
    setFormData({
      date: entry.date,
      description: entry.description,
      reference: entry.reference,
      debitAccount: entry.lines[0]?.account || '',
      debitCode: entry.lines[0]?.accountCode || '',
      creditAccount: entry.lines[1]?.account || '',
      creditCode: entry.lines[1]?.accountCode || '',
      amount: entry.totalDebit.toString(),
    });
    setSelectedEntry(entry);
    setEditMode(true);
    setMenuVisible(false);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.description || !formData.amount || !formData.debitAccount || !formData.creditAccount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (editMode && selectedEntry) {
      setEntries(
        entries.map((e) =>
          e.id === selectedEntry.id
            ? {
                ...e,
                date: formData.date,
                description: formData.description,
                reference: formData.reference,
                lines: [
                  { account: formData.debitAccount, accountCode: formData.debitCode, debit: amount, credit: 0 },
                  { account: formData.creditAccount, accountCode: formData.creditCode, debit: 0, credit: amount },
                ],
                totalDebit: amount,
                totalCredit: amount,
              }
            : e
        )
      );
      Alert.alert('Success', 'Journal entry updated successfully');
    } else {
      const newEntry: JournalEntry = {
        id: String(entries.length + 1),
        entryNumber: `JE-${String(entries.length + 1).padStart(3, '0')}`,
        date: formData.date,
        description: formData.description,
        reference: formData.reference,
        lines: [
          { account: formData.debitAccount, accountCode: formData.debitCode, debit: amount, credit: 0 },
          { account: formData.creditAccount, accountCode: formData.creditCode, debit: 0, credit: amount },
        ],
        totalDebit: amount,
        totalCredit: amount,
        status: 'Draft',
        createdBy: 'Current User',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setEntries([newEntry, ...entries]);
      Alert.alert('Success', 'Journal entry created successfully');
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDelete = (entry: JournalEntry) => {
    if (entry.status === 'Posted') {
      Alert.alert('Error', 'Cannot delete a posted journal entry. Please void it instead.');
      return;
    }

    Alert.alert('Delete Entry', `Are you sure you want to delete ${entry.entryNumber}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setEntries(entries.filter((e) => e.id !== entry.id));
          setMenuVisible(false);
          Alert.alert('Success', 'Journal entry deleted successfully');
        },
      },
    ]);
  };

  const handlePost = (entry: JournalEntry) => {
    setEntries(
      entries.map((e) =>
        e.id === entry.id ? { ...e, status: 'Posted' } : e
      )
    );
    setMenuVisible(false);
    Alert.alert('Success', `Journal entry ${entry.entryNumber} has been posted`);
  };

  const handleVoid = (entry: JournalEntry) => {
    Alert.alert('Void Entry', `Are you sure you want to void ${entry.entryNumber}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Void',
        style: 'destructive',
        onPress: () => {
          setEntries(
            entries.map((e) =>
              e.id === entry.id ? { ...e, status: 'Voided' } : e
            )
          );
          setMenuVisible(false);
          Alert.alert('Success', 'Journal entry voided successfully');
        },
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return '#F59E0B';
      case 'Posted':
        return '#10B981';
      case 'Voided':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Draft':
        return Clock;
      case 'Posted':
        return CheckCircle;
      case 'Voided':
        return XCircle;
      default:
        return Clock;
    }
  };

  const renderEntry = ({ item }: { item: JournalEntry }) => {
    const StatusIcon = getStatusIcon(item.status);
    return (
      <TouchableOpacity style={styles.entryCard}>
        <View style={styles.entryHeader}>
          <View>
            <Text style={styles.entryNumber}>{item.entryNumber}</Text>
            <Text style={styles.entryDescription}>{item.description}</Text>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setSelectedEntry(item);
              setMenuVisible(true);
            }}
          >
            <MoreVertical size={18} color={isDark ? '#64748B' : '#94A3B8'} />
          </TouchableOpacity>
        </View>

        <View style={styles.entryLines}>
          {item.lines.map((line, index) => (
            <View key={index} style={styles.lineRow}>
              <View style={styles.lineInfo}>
                {line.debit > 0 ? (
                  <ArrowUpRight size={14} color="#10B981" />
                ) : (
                  <ArrowDownLeft size={14} color="#EF4444" />
                )}
                <Text style={styles.lineAccount}>
                  {line.accountCode} - {line.account}
                </Text>
              </View>
              <View style={styles.lineAmounts}>
                <Text style={[styles.lineAmount, line.debit > 0 && styles.debitAmount]}>
                  {line.debit > 0 ? `$${line.debit.toLocaleString()}` : '-'}
                </Text>
                <Text style={[styles.lineAmount, line.credit > 0 && styles.creditAmount]}>
                  {line.credit > 0 ? `$${line.credit.toLocaleString()}` : '-'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.entryFooter}>
          <View style={styles.entryMeta}>
            <Calendar size={12} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text style={styles.metaText}>{item.date}</Text>
            {item.reference && (
              <>
                <Text style={styles.metaSeparator}>|</Text>
                <Text style={styles.metaText}>{item.reference}</Text>
              </>
            )}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <StatusIcon size={12} color={getStatusColor(item.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ModuleLayout
      moduleId="accounting"
      navItems={accountingNavItems}
      activeScreen="AccountingJournals"
      title="Journal Entries"
    >
      <View style={styles.container}>
        {/* Search and Add */}
        <View style={styles.toolbar}>
          <View style={styles.searchContainer}>
            <Search size={18} color={isDark ? '#64748B' : '#94A3B8'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search entries..."
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
          {['All', ...journalStatuses].map((status) => (
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

        {/* Column Headers */}
        <View style={styles.columnHeaders}>
          <Text style={styles.columnHeaderText}>Account</Text>
          <View style={styles.amountHeaders}>
            <Text style={styles.columnHeaderText}>Debit</Text>
            <Text style={styles.columnHeaderText}>Credit</Text>
          </View>
        </View>

        {/* Entries List */}
        <FlatList
          data={filteredEntries}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FileText size={48} color={isDark ? '#334155' : '#CBD5E1'} />
              <Text style={styles.emptyText}>No journal entries found</Text>
            </View>
          }
        />
      </View>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editMode ? 'Edit Entry' : 'New Journal Entry'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Date *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.date}
                  onChangeText={(text) => setFormData({ ...formData, date: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Enter description"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Reference</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.reference}
                  onChangeText={(text) => setFormData({ ...formData, reference: text })}
                  placeholder="Invoice, check number, etc."
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

              <Text style={styles.sectionLabel}>Debit Account</Text>
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Code</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.debitCode}
                    onChangeText={(text) => setFormData({ ...formData, debitCode: text })}
                    placeholder="1000"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 2 }]}>
                  <Text style={styles.formLabel}>Account Name *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.debitAccount}
                    onChangeText={(text) => setFormData({ ...formData, debitAccount: text })}
                    placeholder="Account name"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  />
                </View>
              </View>

              <Text style={styles.sectionLabel}>Credit Account</Text>
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Code</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.creditCode}
                    onChangeText={(text) => setFormData({ ...formData, creditCode: text })}
                    placeholder="2000"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 2 }]}>
                  <Text style={styles.formLabel}>Account Name *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.creditAccount}
                    onChangeText={(text) => setFormData({ ...formData, creditAccount: text })}
                    placeholder="Account name"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Amount ($) *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.amount}
                  onChangeText={(text) => setFormData({ ...formData, amount: text })}
                  placeholder="0.00"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="numeric"
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
            {selectedEntry?.status === 'Draft' && (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => selectedEntry && openEditModal(selectedEntry)}
                >
                  <Edit size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
                  <Text style={styles.menuItemText}>Edit Entry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => selectedEntry && handlePost(selectedEntry)}
                >
                  <CheckCircle size={18} color="#10B981" />
                  <Text style={[styles.menuItemText, { color: '#10B981' }]}>Post Entry</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => selectedEntry && handleDelete(selectedEntry)}
                >
                  <Trash2 size={18} color="#EF4444" />
                  <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Delete Entry</Text>
                </TouchableOpacity>
              </>
            )}
            {selectedEntry?.status === 'Posted' && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => selectedEntry && handleVoid(selectedEntry)}
              >
                <XCircle size={18} color="#EF4444" />
                <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Void Entry</Text>
              </TouchableOpacity>
            )}
            {selectedEntry?.status === 'Voided' && (
              <View style={styles.menuItem}>
                <Text style={[styles.menuItemText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
                  This entry has been voided
                </Text>
              </View>
            )}
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
      backgroundColor: '#4CAF50',
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
      backgroundColor: '#4CAF50',
    },
    filterText: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    filterTextActive: {
      color: '#FFFFFF',
    },
    columnHeaders: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    columnHeaderText: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#64748B' : '#94A3B8',
      textTransform: 'uppercase',
    },
    amountHeaders: {
      flexDirection: 'row',
      gap: 24,
    },
    listContent: {
      padding: 16,
      paddingTop: 8,
    },
    entryCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    entryNumber: {
      fontSize: 14,
      fontWeight: '600',
      color: '#4CAF50',
      marginBottom: 2,
    },
    entryDescription: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    menuButton: {
      padding: 8,
    },
    entryLines: {
      marginBottom: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    lineRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 6,
    },
    lineInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
    },
    lineAccount: {
      fontSize: 13,
      color: isDark ? '#CBD5E1' : '#475569',
    },
    lineAmounts: {
      flexDirection: 'row',
      gap: 24,
    },
    lineAmount: {
      fontSize: 13,
      color: isDark ? '#64748B' : '#94A3B8',
      width: 70,
      textAlign: 'right',
    },
    debitAmount: {
      color: '#10B981',
      fontWeight: '600',
    },
    creditAmount: {
      color: '#EF4444',
      fontWeight: '600',
    },
    entryFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    entryMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    metaText: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    metaSeparator: {
      color: isDark ? '#334155' : '#E2E8F0',
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
      backgroundColor: '#4CAF50',
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
