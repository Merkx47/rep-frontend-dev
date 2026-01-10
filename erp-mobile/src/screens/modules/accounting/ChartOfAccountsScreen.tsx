/**
 * Chart of Accounts Screen
 * Full CRUD functionality for managing accounts
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
  ChevronRight,
  Wallet,
  Building,
  ShoppingBag,
  Landmark,
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

interface Account {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  subType: string;
  balance: number;
  isActive: boolean;
  description: string;
}

const initialAccounts: Account[] = [
  {
    id: '1',
    code: '1000',
    name: 'Cash',
    type: 'Asset',
    subType: 'Current Asset',
    balance: 125000,
    isActive: true,
    description: 'Cash on hand and in bank',
  },
  {
    id: '2',
    code: '1100',
    name: 'Accounts Receivable',
    type: 'Asset',
    subType: 'Current Asset',
    balance: 85000,
    isActive: true,
    description: 'Money owed by customers',
  },
  {
    id: '3',
    code: '1500',
    name: 'Fixed Assets',
    type: 'Asset',
    subType: 'Fixed Asset',
    balance: 250000,
    isActive: true,
    description: 'Property, plant and equipment',
  },
  {
    id: '4',
    code: '2000',
    name: 'Accounts Payable',
    type: 'Liability',
    subType: 'Current Liability',
    balance: 45000,
    isActive: true,
    description: 'Money owed to suppliers',
  },
  {
    id: '5',
    code: '3000',
    name: 'Retained Earnings',
    type: 'Equity',
    subType: 'Equity',
    balance: 180000,
    isActive: true,
    description: 'Accumulated profits',
  },
  {
    id: '6',
    code: '4000',
    name: 'Sales Revenue',
    type: 'Revenue',
    subType: 'Operating Revenue',
    balance: 320000,
    isActive: true,
    description: 'Income from sales',
  },
  {
    id: '7',
    code: '5000',
    name: 'Cost of Goods Sold',
    type: 'Expense',
    subType: 'Direct Expense',
    balance: 145000,
    isActive: true,
    description: 'Direct costs of sales',
  },
  {
    id: '8',
    code: '6000',
    name: 'Operating Expenses',
    type: 'Expense',
    subType: 'Operating Expense',
    balance: 75000,
    isActive: true,
    description: 'General operating costs',
  },
];

const accountTypes: Account['type'][] = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

export default function ChartOfAccountsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'Asset' as Account['type'],
    subType: '',
    description: '',
  });

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.code.includes(searchQuery);
    const matchesType = typeFilter === 'All' || account.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      type: 'Asset',
      subType: '',
      description: '',
    });
    setEditMode(false);
    setSelectedAccount(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (account: Account) => {
    setFormData({
      code: account.code,
      name: account.name,
      type: account.type,
      subType: account.subType,
      description: account.description,
    });
    setSelectedAccount(account);
    setEditMode(true);
    setMenuVisible(false);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.code || !formData.name) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (editMode && selectedAccount) {
      setAccounts(
        accounts.map((a) =>
          a.id === selectedAccount.id
            ? { ...a, ...formData }
            : a
        )
      );
      Alert.alert('Success', 'Account updated successfully');
    } else {
      const newAccount: Account = {
        id: String(accounts.length + 1),
        ...formData,
        balance: 0,
        isActive: true,
      };
      setAccounts([...accounts, newAccount]);
      Alert.alert('Success', 'Account created successfully');
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDelete = (account: Account) => {
    if (account.balance !== 0) {
      Alert.alert('Error', 'Cannot delete an account with a non-zero balance');
      return;
    }

    Alert.alert('Delete Account', `Are you sure you want to delete ${account.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setAccounts(accounts.filter((a) => a.id !== account.id));
          setMenuVisible(false);
          Alert.alert('Success', 'Account deleted successfully');
        },
      },
    ]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Asset':
        return '#10B981';
      case 'Liability':
        return '#EF4444';
      case 'Equity':
        return '#8B5CF6';
      case 'Revenue':
        return '#3B82F6';
      case 'Expense':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Asset':
        return Wallet;
      case 'Liability':
        return CreditCard;
      case 'Equity':
        return Building;
      case 'Revenue':
        return TrendingUp;
      case 'Expense':
        return ShoppingBag;
      default:
        return Landmark;
    }
  };

  const renderAccount = ({ item }: { item: Account }) => {
    const TypeIcon = getTypeIcon(item.type);
    return (
      <TouchableOpacity style={styles.accountCard}>
        <View style={styles.accountHeader}>
          <View style={[styles.accountIcon, { backgroundColor: `${getTypeColor(item.type)}15` }]}>
            <TypeIcon size={20} color={getTypeColor(item.type)} />
          </View>
          <View style={styles.accountInfo}>
            <View style={styles.accountTitleRow}>
              <Text style={styles.accountCode}>{item.code}</Text>
              <Text style={styles.accountName}>{item.name}</Text>
            </View>
            <Text style={styles.accountSubType}>{item.subType}</Text>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setSelectedAccount(item);
              setMenuVisible(true);
            }}
          >
            <MoreVertical size={18} color={isDark ? '#64748B' : '#94A3B8'} />
          </TouchableOpacity>
        </View>

        <View style={styles.accountFooter}>
          <View style={[styles.typeBadge, { backgroundColor: `${getTypeColor(item.type)}20` }]}>
            <Text style={[styles.typeText, { color: getTypeColor(item.type) }]}>{item.type}</Text>
          </View>
          <Text style={[styles.balance, item.balance < 0 && styles.negativeBalance]}>
            ${Math.abs(item.balance).toLocaleString()}
            {item.type === 'Liability' || item.type === 'Revenue' || item.type === 'Equity' ? ' CR' : ' DR'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Group accounts by type for summary
  const accountSummary = accountTypes.map((type) => {
    const typeAccounts = accounts.filter((a) => a.type === type);
    const total = typeAccounts.reduce((sum, a) => sum + a.balance, 0);
    return { type, count: typeAccounts.length, total };
  });

  return (
    <ModuleLayout
      moduleId="accounting"
      navItems={accountingNavItems}
      activeScreen="AccountingChartOfAccounts"
      title="Chart of Accounts"
    >
      <View style={styles.container}>
        {/* Summary Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.summaryContainer}
          contentContainerStyle={styles.summaryContent}
        >
          {accountSummary.map((summary) => (
            <View key={summary.type} style={styles.summaryCard}>
              <Text style={[styles.summaryType, { color: getTypeColor(summary.type) }]}>
                {summary.type}
              </Text>
              <Text style={styles.summaryTotal}>${summary.total.toLocaleString()}</Text>
              <Text style={styles.summaryCount}>{summary.count} accounts</Text>
            </View>
          ))}
        </ScrollView>

        {/* Search and Add */}
        <View style={styles.toolbar}>
          <View style={styles.searchContainer}>
            <Search size={18} color={isDark ? '#64748B' : '#94A3B8'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search accounts..."
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
            <Plus size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Type Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {['All', ...accountTypes].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.filterChip, typeFilter === type && styles.filterChipActive]}
              onPress={() => setTypeFilter(type)}
            >
              <Text style={[styles.filterText, typeFilter === type && styles.filterTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Accounts List */}
        <FlatList
          data={filteredAccounts}
          renderItem={renderAccount}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <BookOpen size={48} color={isDark ? '#334155' : '#CBD5E1'} />
              <Text style={styles.emptyText}>No accounts found</Text>
            </View>
          }
        />
      </View>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editMode ? 'Edit Account' : 'Add New Account'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Account Code *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.code}
                  onChangeText={(text) => setFormData({ ...formData, code: text })}
                  placeholder="e.g., 1000"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Account Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Enter account name"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Account Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.chipContainer}>
                    {accountTypes.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.chip,
                          formData.type === type && {
                            backgroundColor: getTypeColor(type),
                            borderColor: getTypeColor(type),
                          },
                        ]}
                        onPress={() => setFormData({ ...formData, type })}
                      >
                        <Text
                          style={[styles.chipText, formData.type === type && { color: '#FFFFFF' }]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Sub Type</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.subType}
                  onChangeText={(text) => setFormData({ ...formData, subType: text })}
                  placeholder="e.g., Current Asset"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Account description..."
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
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => selectedAccount && openEditModal(selectedAccount)}
            >
              <Edit size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
              <Text style={styles.menuItemText}>Edit Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <ChevronRight size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
              <Text style={styles.menuItemText}>View Transactions</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => selectedAccount && handleDelete(selectedAccount)}
            >
              <Trash2 size={18} color="#EF4444" />
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Delete Account</Text>
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
    summaryContainer: {
      maxHeight: 100,
    },
    summaryContent: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    summaryCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginRight: 12,
      minWidth: 120,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    summaryType: {
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 4,
    },
    summaryTotal: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    summaryCount: {
      fontSize: 11,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    toolbar: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingBottom: 12,
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
    listContent: {
      padding: 16,
      paddingTop: 8,
    },
    accountCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
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
    accountTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 2,
    },
    accountCode: {
      fontSize: 13,
      fontWeight: '600',
      color: '#4CAF50',
    },
    accountName: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    accountSubType: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    menuButton: {
      padding: 8,
    },
    accountFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
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
    balance: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    negativeBalance: {
      color: '#EF4444',
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
    textArea: {
      minHeight: 80,
      textAlignVertical: 'top',
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
    chipText: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
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
