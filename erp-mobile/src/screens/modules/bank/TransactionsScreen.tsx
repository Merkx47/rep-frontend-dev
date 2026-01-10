/**
 * Bank Transactions Screen
 * View and manage bank transactions
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
  Building2,
  ArrowLeftRight,
  RefreshCw,
  Settings,
  LayoutDashboard,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// Bank navigation items
const bankNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'Bank' },
  { id: 'accounts', label: 'Accounts', icon: Building2, screenName: 'BankAccounts' },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, screenName: 'BankTransactions' },
  { id: 'reconciliation', label: 'Reconciliation', icon: RefreshCw, screenName: 'BankReconciliation' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'BankSettings' },
];

interface Transaction {
  id: string;
  date: string;
  description: string;
  reference: string;
  account: string;
  type: 'Credit' | 'Debit';
  category: string;
  amount: number;
  balance: number;
  status: 'Cleared' | 'Pending' | 'Reconciled';
}

const initialTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-22',
    description: 'Client Payment - Acme Corporation',
    reference: 'PAY-001',
    account: 'Operating Account',
    type: 'Credit',
    category: 'Sales Revenue',
    amount: 12450.00,
    balance: 857680.50,
    status: 'Cleared',
  },
  {
    id: '2',
    date: '2024-01-22',
    description: 'Office Rent - January',
    reference: 'EXP-042',
    account: 'Operating Account',
    type: 'Debit',
    category: 'Rent Expense',
    amount: 5200.00,
    balance: 845230.50,
    status: 'Cleared',
  },
  {
    id: '3',
    date: '2024-01-21',
    description: 'Equipment Purchase - Laptop',
    reference: 'PO-123',
    account: 'Operating Account',
    type: 'Debit',
    category: 'Equipment',
    amount: 3850.00,
    balance: 850430.50,
    status: 'Reconciled',
  },
  {
    id: '4',
    date: '2024-01-20',
    description: 'Consulting Fee - TechStart',
    reference: 'INV-089',
    account: 'Operating Account',
    type: 'Credit',
    category: 'Service Revenue',
    amount: 8500.00,
    balance: 854280.50,
    status: 'Reconciled',
  },
  {
    id: '5',
    date: '2024-01-20',
    description: 'Payroll Transfer',
    reference: 'PAY-102',
    account: 'Payroll Account',
    type: 'Debit',
    category: 'Payroll',
    amount: 45000.00,
    balance: 211800.00,
    status: 'Cleared',
  },
  {
    id: '6',
    date: '2024-01-19',
    description: 'Utility Bill Payment',
    reference: 'UTIL-001',
    account: 'Operating Account',
    type: 'Debit',
    category: 'Utilities',
    amount: 850.00,
    balance: 845780.50,
    status: 'Pending',
  },
  {
    id: '7',
    date: '2024-01-19',
    description: 'Interest Earned',
    reference: 'INT-001',
    account: 'Savings Reserve',
    type: 'Credit',
    category: 'Interest Income',
    amount: 325.50,
    balance: 144125.50,
    status: 'Cleared',
  },
  {
    id: '8',
    date: '2024-01-18',
    description: 'Software Subscription',
    reference: 'SUB-045',
    account: 'Operating Account',
    type: 'Debit',
    category: 'Software',
    amount: 299.00,
    balance: 846630.50,
    status: 'Cleared',
  },
];

const typeFilters = ['All', 'Credit', 'Debit'];
const statusFilters = ['All', 'Cleared', 'Pending', 'Reconciled'];
const categories = ['Sales Revenue', 'Service Revenue', 'Rent Expense', 'Utilities', 'Payroll', 'Equipment', 'Software', 'Other'];

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    description: '',
    reference: '',
    account: 'Operating Account',
    type: 'Debit',
    category: 'Other',
    amount: '',
  });

  const moduleColor = '#00BCD4';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Cleared': return '#3B82F6';
      case 'Pending': return '#F59E0B';
      case 'Reconciled': return '#10B981';
      default: return '#6B7280';
    }
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch =
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || txn.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || txn.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddTransaction = () => {
    if (!formData.description || !formData.amount) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description: formData.description,
      reference: formData.reference || `TXN-${Date.now().toString().slice(-6)}`,
      account: formData.account,
      type: formData.type as Transaction['type'],
      category: formData.category,
      amount,
      balance: 0, // Would be calculated based on account
      status: 'Pending',
    };

    setTransactions([newTransaction, ...transactions]);
    resetForm();
    setIsAddModalVisible(false);
  };

  const handleUpdateTransaction = () => {
    if (!selectedTransaction || !formData.description) return;

    const updatedTransactions = transactions.map(txn =>
      txn.id === selectedTransaction.id
        ? {
            ...txn,
            description: formData.description,
            reference: formData.reference,
            category: formData.category,
          }
        : txn
    );

    setTransactions(updatedTransactions);
    resetForm();
    setIsAddModalVisible(false);
    setIsEditing(false);
  };

  const handleDeleteTransaction = () => {
    if (!selectedTransaction) return;

    if (selectedTransaction.status === 'Reconciled') {
      Alert.alert('Error', 'Cannot delete reconciled transactions');
      return;
    }

    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTransactions(transactions.filter(t => t.id !== selectedTransaction.id));
            setIsActionMenuVisible(false);
            setSelectedTransaction(null);
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      description: '',
      reference: '',
      account: 'Operating Account',
      type: 'Debit',
      category: 'Other',
      amount: '',
    });
    setSelectedTransaction(null);
    setIsEditing(false);
  };

  const openEditModal = () => {
    if (!selectedTransaction) return;

    setFormData({
      description: selectedTransaction.description,
      reference: selectedTransaction.reference,
      account: selectedTransaction.account,
      type: selectedTransaction.type,
      category: selectedTransaction.category,
      amount: String(selectedTransaction.amount),
    });
    setIsEditing(true);
    setIsActionMenuVisible(false);
    setIsAddModalVisible(true);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={styles.transactionCard}
      onPress={() => {
        setSelectedTransaction(item);
        setIsActionMenuVisible(true);
      }}
    >
      <View style={styles.transactionHeader}>
        <View style={[styles.typeIcon, { backgroundColor: item.type === 'Credit' ? '#D1FAE5' : '#FEE2E2' }]}>
          {item.type === 'Credit' ? (
            <ArrowDownLeft size={18} color="#10B981" />
          ) : (
            <ArrowUpRight size={18} color="#EF4444" />
          )}
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.transactionMeta}>
            {item.reference} • {item.account}
          </Text>
        </View>
        <View style={styles.transactionAmountSection}>
          <Text style={[styles.transactionAmount, { color: item.type === 'Credit' ? '#10B981' : '#EF4444' }]}>
            {item.type === 'Credit' ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
      </View>

      <View style={styles.transactionFooter}>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
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
      moduleId="bank"
      navItems={bankNavItems}
      activeScreen="BankTransactions"
      title="Transactions"
    >
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
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

        {/* Type Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {typeFilters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                typeFilter === filter && { backgroundColor: moduleColor },
              ]}
              onPress={() => setTypeFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  typeFilter === filter && { color: '#FFFFFF' },
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.filterDivider} />
          {statusFilters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                statusFilter === filter && { backgroundColor: `${moduleColor}80` },
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

        {/* Transactions List */}
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
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
                  {isEditing ? 'Edit Transaction' : 'Add Transaction'}
                </Text>
                <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                  <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.inputLabel}>Description *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Transaction description"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />

                <Text style={styles.inputLabel}>Reference</Text>
                <TextInput
                  style={styles.input}
                  value={formData.reference}
                  onChangeText={(text) => setFormData({ ...formData, reference: text })}
                  placeholder="e.g., INV-001"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />

                <Text style={styles.inputLabel}>Type</Text>
                <View style={styles.typeOptions}>
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      formData.type === 'Debit' && { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
                    ]}
                    onPress={() => setFormData({ ...formData, type: 'Debit' })}
                  >
                    <ArrowUpRight size={16} color={formData.type === 'Debit' ? '#EF4444' : isDark ? '#94A3B8' : '#64748B'} />
                    <Text style={[styles.typeOptionText, formData.type === 'Debit' && { color: '#EF4444' }]}>
                      Debit (Expense)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      formData.type === 'Credit' && { backgroundColor: '#D1FAE5', borderColor: '#10B981' },
                    ]}
                    onPress={() => setFormData({ ...formData, type: 'Credit' })}
                  >
                    <ArrowDownLeft size={16} color={formData.type === 'Credit' ? '#10B981' : isDark ? '#94A3B8' : '#64748B'} />
                    <Text style={[styles.typeOptionText, formData.type === 'Credit' && { color: '#10B981' }]}>
                      Credit (Income)
                    </Text>
                  </TouchableOpacity>
                </View>

                {!isEditing && (
                  <>
                    <Text style={styles.inputLabel}>Amount *</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.amount}
                      onChangeText={(text) => setFormData({ ...formData, amount: text })}
                      placeholder="0.00"
                      placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                      keyboardType="numeric"
                    />
                  </>
                )}

                <Text style={styles.inputLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                  {categories.map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryOption,
                        formData.category === cat && { backgroundColor: moduleColor, borderColor: moduleColor },
                      ]}
                      onPress={() => setFormData({ ...formData, category: cat })}
                    >
                      <Text
                        style={[
                          styles.categoryOptionText,
                          formData.category === cat && { color: '#FFFFFF' },
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
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
                  onPress={isEditing ? handleUpdateTransaction : handleAddTransaction}
                >
                  <Text style={styles.submitButtonText}>
                    {isEditing ? 'Update' : 'Add Transaction'}
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
              {selectedTransaction && (
                <View style={styles.actionMenuHeader}>
                  <Text style={styles.actionMenuTitle}>{selectedTransaction.description}</Text>
                  <Text style={[styles.actionMenuAmount, { color: selectedTransaction.type === 'Credit' ? '#10B981' : '#EF4444' }]}>
                    {selectedTransaction.type === 'Credit' ? '+' : '-'}{formatCurrency(selectedTransaction.amount)}
                  </Text>
                </View>
              )}

              <TouchableOpacity style={styles.actionMenuItem} onPress={openEditModal}>
                <Edit size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
                <Text style={styles.actionMenuText}>Edit</Text>
              </TouchableOpacity>

              {selectedTransaction?.status !== 'Reconciled' && (
                <TouchableOpacity style={styles.actionMenuItem} onPress={handleDeleteTransaction}>
                  <Trash2 size={18} color="#EF4444" />
                  <Text style={[styles.actionMenuText, { color: '#EF4444' }]}>Delete</Text>
                </TouchableOpacity>
              )}
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
      alignItems: 'center',
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
    filterDivider: {
      width: 1,
      height: 20,
      backgroundColor: isDark ? '#334155' : '#E2E8F0',
      marginHorizontal: 4,
    },
    listContent: {
      padding: 16,
      gap: 10,
    },
    transactionCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    transactionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    typeIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionDescription: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    transactionMeta: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    transactionAmountSection: {
      alignItems: 'flex-end',
    },
    transactionAmount: {
      fontSize: 15,
      fontWeight: '700',
    },
    transactionDate: {
      fontSize: 11,
      color: isDark ? '#64748B' : '#94A3B8',
      marginTop: 2,
    },
    transactionFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    categoryTag: {
      backgroundColor: isDark ? '#0F172A' : '#F1F5F9',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    categoryText: {
      fontSize: 11,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 11,
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
    typeOptions: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 16,
    },
    typeOption: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    },
    typeOptionText: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    categoryScroll: {
      marginBottom: 16,
    },
    categoryOption: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      marginRight: 8,
    },
    categoryOptionText: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
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
    actionMenuHeader: {
      padding: 14,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    actionMenuTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 4,
    },
    actionMenuAmount: {
      fontSize: 16,
      fontWeight: '700',
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
