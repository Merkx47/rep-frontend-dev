/**
 * Bank Accounts Screen
 * Full CRUD functionality for managing bank accounts
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
  Eye,
  TrendingUp,
  TrendingDown,
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

interface BankAccount {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  accountType: 'Checking' | 'Savings' | 'Credit' | 'Investment';
  balance: number;
  currency: string;
  isActive: boolean;
  lastReconciled: string | null;
  openingBalance: number;
  openingDate: string;
}

const initialAccounts: BankAccount[] = [
  {
    id: '1',
    accountName: 'Operating Account',
    bankName: 'Chase Bank',
    accountNumber: '****4521',
    accountType: 'Checking',
    balance: 845230.50,
    currency: 'USD',
    isActive: true,
    lastReconciled: '2024-01-15',
    openingBalance: 500000,
    openingDate: '2023-01-01',
  },
  {
    id: '2',
    accountName: 'Payroll Account',
    bankName: 'Bank of America',
    accountNumber: '****7823',
    accountType: 'Checking',
    balance: 256800.00,
    currency: 'USD',
    isActive: true,
    lastReconciled: '2024-01-10',
    openingBalance: 100000,
    openingDate: '2023-01-01',
  },
  {
    id: '3',
    accountName: 'Savings Reserve',
    bankName: 'Wells Fargo',
    accountNumber: '****3456',
    accountType: 'Savings',
    balance: 143800.00,
    currency: 'USD',
    isActive: true,
    lastReconciled: '2024-01-20',
    openingBalance: 50000,
    openingDate: '2023-06-15',
  },
  {
    id: '4',
    accountName: 'Business Credit Line',
    bankName: 'CitiBank',
    accountNumber: '****9012',
    accountType: 'Credit',
    balance: -25000.00,
    currency: 'USD',
    isActive: true,
    lastReconciled: null,
    openingBalance: 0,
    openingDate: '2023-09-01',
  },
  {
    id: '5',
    accountName: 'Investment Portfolio',
    bankName: 'Fidelity',
    accountNumber: '****5678',
    accountType: 'Investment',
    balance: 350000.00,
    currency: 'USD',
    isActive: false,
    lastReconciled: '2023-12-31',
    openingBalance: 250000,
    openingDate: '2022-01-01',
  },
];

const accountTypeFilters = ['All', 'Checking', 'Savings', 'Credit', 'Investment'];
const accountTypes = ['Checking', 'Savings', 'Credit', 'Investment'];

export default function BankAccountsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [accounts, setAccounts] = useState<BankAccount[]>(initialAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    accountName: '',
    bankName: '',
    accountNumber: '',
    accountType: 'Checking',
    openingBalance: '',
    currency: 'USD',
  });

  const moduleColor = '#00BCD4';

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Checking': return '#3B82F6';
      case 'Savings': return '#10B981';
      case 'Credit': return '#EF4444';
      case 'Investment': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch =
      account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.bankName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || account.accountType === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalBalance = filteredAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleAddAccount = () => {
    if (!formData.accountName || !formData.bankName) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    const newAccount: BankAccount = {
      id: Date.now().toString(),
      accountName: formData.accountName,
      bankName: formData.bankName,
      accountNumber: `****${Math.floor(1000 + Math.random() * 9000)}`,
      accountType: formData.accountType as BankAccount['accountType'],
      balance: parseFloat(formData.openingBalance) || 0,
      currency: formData.currency,
      isActive: true,
      lastReconciled: null,
      openingBalance: parseFloat(formData.openingBalance) || 0,
      openingDate: new Date().toISOString().split('T')[0],
    };

    setAccounts([newAccount, ...accounts]);
    resetForm();
    setIsAddModalVisible(false);
  };

  const handleUpdateAccount = () => {
    if (!selectedAccount || !formData.accountName) return;

    const updatedAccounts = accounts.map(acc =>
      acc.id === selectedAccount.id
        ? {
            ...acc,
            accountName: formData.accountName,
            bankName: formData.bankName,
            accountType: formData.accountType as BankAccount['accountType'],
            currency: formData.currency,
          }
        : acc
    );

    setAccounts(updatedAccounts);
    resetForm();
    setIsAddModalVisible(false);
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    if (!selectedAccount) return;

    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete "${selectedAccount.accountName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAccounts(accounts.filter(a => a.id !== selectedAccount.id));
            setIsActionMenuVisible(false);
            setSelectedAccount(null);
          },
        },
      ]
    );
  };

  const handleToggleActive = () => {
    if (!selectedAccount) return;

    const updatedAccounts = accounts.map(acc =>
      acc.id === selectedAccount.id ? { ...acc, isActive: !acc.isActive } : acc
    );
    setAccounts(updatedAccounts);
    setIsActionMenuVisible(false);
  };

  const resetForm = () => {
    setFormData({
      accountName: '',
      bankName: '',
      accountNumber: '',
      accountType: 'Checking',
      openingBalance: '',
      currency: 'USD',
    });
    setSelectedAccount(null);
    setIsEditing(false);
  };

  const openEditModal = () => {
    if (!selectedAccount) return;

    setFormData({
      accountName: selectedAccount.accountName,
      bankName: selectedAccount.bankName,
      accountNumber: selectedAccount.accountNumber,
      accountType: selectedAccount.accountType,
      openingBalance: String(selectedAccount.openingBalance),
      currency: selectedAccount.currency,
    });
    setIsEditing(true);
    setIsActionMenuVisible(false);
    setIsAddModalVisible(true);
  };

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    return `${isNegative ? '-' : ''}$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const renderAccount = ({ item }: { item: BankAccount }) => (
    <TouchableOpacity
      style={[styles.accountCard, !item.isActive && styles.inactiveCard]}
      onPress={() => {
        setSelectedAccount(item);
        setIsViewModalVisible(true);
      }}
    >
      <View style={styles.accountHeader}>
        <View style={[styles.accountIcon, { backgroundColor: `${getTypeColor(item.accountType)}20` }]}>
          <Building2 size={20} color={getTypeColor(item.accountType)} />
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{item.accountName}</Text>
          <Text style={styles.bankName}>{item.bankName} {item.accountNumber}</Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            setSelectedAccount(item);
            setIsActionMenuVisible(true);
          }}
        >
          <MoreVertical size={18} color={isDark ? '#94A3B8' : '#64748B'} />
        </TouchableOpacity>
      </View>

      <View style={styles.accountDetails}>
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={[styles.balanceValue, { color: item.balance >= 0 ? '#10B981' : '#EF4444' }]}>
            {formatCurrency(item.balance)}
          </Text>
        </View>
        <View style={styles.typeSection}>
          <View style={[styles.typeBadge, { backgroundColor: `${getTypeColor(item.accountType)}20` }]}>
            <Text style={[styles.typeText, { color: getTypeColor(item.accountType) }]}>
              {item.accountType}
            </Text>
          </View>
          {!item.isActive && (
            <Text style={styles.inactiveText}>Inactive</Text>
          )}
        </View>
      </View>

      {item.lastReconciled && (
        <View style={styles.reconciledRow}>
          <RefreshCw size={12} color={isDark ? '#64748B' : '#94A3B8'} />
          <Text style={styles.reconciledText}>Last reconciled: {item.lastReconciled}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ModuleLayout
      moduleId="bank"
      navItems={bankNavItems}
      activeScreen="BankAccounts"
      title="Bank Accounts"
    >
      <View style={styles.container}>
        {/* Total Balance Header */}
        <View style={styles.totalHeader}>
          <Text style={styles.totalLabel}>Total Balance</Text>
          <Text style={[styles.totalValue, { color: totalBalance >= 0 ? '#10B981' : '#EF4444' }]}>
            {formatCurrency(totalBalance)}
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search accounts..."
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
          {accountTypeFilters.map(filter => (
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
        </ScrollView>

        {/* Accounts List */}
        <FlatList
          data={filteredAccounts}
          renderItem={renderAccount}
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
                  {isEditing ? 'Edit Account' : 'Add Bank Account'}
                </Text>
                <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                  <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.inputLabel}>Account Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.accountName}
                  onChangeText={(text) => setFormData({ ...formData, accountName: text })}
                  placeholder="e.g., Operating Account"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />

                <Text style={styles.inputLabel}>Bank Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.bankName}
                  onChangeText={(text) => setFormData({ ...formData, bankName: text })}
                  placeholder="e.g., Chase Bank"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />

                <Text style={styles.inputLabel}>Account Type</Text>
                <View style={styles.typeOptions}>
                  {accountTypes.map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption,
                        formData.accountType === type && { backgroundColor: moduleColor, borderColor: moduleColor },
                      ]}
                      onPress={() => setFormData({ ...formData, accountType: type })}
                    >
                      <Text
                        style={[
                          styles.typeOptionText,
                          formData.accountType === type && { color: '#FFFFFF' },
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {!isEditing && (
                  <>
                    <Text style={styles.inputLabel}>Opening Balance</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.openingBalance}
                      onChangeText={(text) => setFormData({ ...formData, openingBalance: text })}
                      placeholder="0.00"
                      placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                      keyboardType="numeric"
                    />
                  </>
                )}

                <Text style={styles.inputLabel}>Currency</Text>
                <TextInput
                  style={styles.input}
                  value={formData.currency}
                  onChangeText={(text) => setFormData({ ...formData, currency: text })}
                  placeholder="USD"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
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
                  onPress={isEditing ? handleUpdateAccount : handleAddAccount}
                >
                  <Text style={styles.submitButtonText}>
                    {isEditing ? 'Update' : 'Add Account'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* View Account Modal */}
        <Modal
          visible={isViewModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsViewModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedAccount?.accountName}</Text>
                <TouchableOpacity onPress={() => setIsViewModalVisible(false)}>
                  <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              {selectedAccount && (
                <ScrollView style={styles.modalBody}>
                  <View style={styles.viewSection}>
                    <View style={[styles.largeIcon, { backgroundColor: `${getTypeColor(selectedAccount.accountType)}20` }]}>
                      <Building2 size={32} color={getTypeColor(selectedAccount.accountType)} />
                    </View>
                  </View>

                  <View style={styles.balanceCard}>
                    <Text style={styles.balanceCardLabel}>Current Balance</Text>
                    <Text style={[styles.balanceCardValue, { color: selectedAccount.balance >= 0 ? '#10B981' : '#EF4444' }]}>
                      {formatCurrency(selectedAccount.balance)}
                    </Text>
                  </View>

                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Bank</Text>
                      <Text style={styles.detailValue}>{selectedAccount.bankName}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Account No.</Text>
                      <Text style={styles.detailValue}>{selectedAccount.accountNumber}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Type</Text>
                      <Text style={styles.detailValue}>{selectedAccount.accountType}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Currency</Text>
                      <Text style={styles.detailValue}>{selectedAccount.currency}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Opening Balance</Text>
                      <Text style={styles.detailValue}>{formatCurrency(selectedAccount.openingBalance)}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Opened</Text>
                      <Text style={styles.detailValue}>{selectedAccount.openingDate}</Text>
                    </View>
                  </View>

                  {selectedAccount.lastReconciled && (
                    <View style={styles.reconciledCard}>
                      <RefreshCw size={16} color="#10B981" />
                      <Text style={styles.reconciledCardText}>
                        Last reconciled on {selectedAccount.lastReconciled}
                      </Text>
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
                <Text style={styles.actionMenuText}>Edit Account</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionMenuItem} onPress={handleToggleActive}>
                {selectedAccount?.isActive ? (
                  <>
                    <TrendingDown size={18} color="#F59E0B" />
                    <Text style={[styles.actionMenuText, { color: '#F59E0B' }]}>Deactivate</Text>
                  </>
                ) : (
                  <>
                    <TrendingUp size={18} color="#10B981" />
                    <Text style={[styles.actionMenuText, { color: '#10B981' }]}>Activate</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionMenuItem} onPress={handleDeleteAccount}>
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
    totalHeader: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      padding: 20,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    totalLabel: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 4,
    },
    totalValue: {
      fontSize: 32,
      fontWeight: '700',
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
    accountCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    inactiveCard: {
      opacity: 0.6,
    },
    accountHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    accountIcon: {
      width: 44,
      height: 44,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    accountInfo: {
      flex: 1,
    },
    accountName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    bankName: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    menuButton: {
      padding: 4,
    },
    accountDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    balanceSection: {},
    balanceLabel: {
      fontSize: 11,
      color: isDark ? '#64748B' : '#94A3B8',
      marginBottom: 2,
    },
    balanceValue: {
      fontSize: 20,
      fontWeight: '700',
    },
    typeSection: {
      alignItems: 'flex-end',
      gap: 4,
    },
    typeBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    typeText: {
      fontSize: 12,
      fontWeight: '600',
    },
    inactiveText: {
      fontSize: 11,
      color: '#F59E0B',
      fontWeight: '500',
    },
    reconciledRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    reconciledText: {
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
    typeOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    typeOption: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    },
    typeOptionText: {
      fontSize: 14,
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
    viewSection: {
      alignItems: 'center',
      marginBottom: 20,
    },
    largeIcon: {
      width: 72,
      height: 72,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    balanceCard: {
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
      marginBottom: 20,
    },
    balanceCardLabel: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 4,
    },
    balanceCardValue: {
      fontSize: 28,
      fontWeight: '700',
    },
    detailsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    detailItem: {
      width: '45%',
      marginBottom: 8,
    },
    detailLabel: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
      marginBottom: 2,
    },
    detailValue: {
      fontSize: 14,
      color: isDark ? '#FFFFFF' : '#0F172A',
      fontWeight: '500',
    },
    reconciledCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#D1FAE5',
      padding: 12,
      borderRadius: 10,
      marginTop: 16,
    },
    reconciledCardText: {
      fontSize: 13,
      color: '#10B981',
      fontWeight: '500',
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
