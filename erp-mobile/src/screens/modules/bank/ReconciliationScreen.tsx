/**
 * Bank Reconciliation Screen
 * Reconcile bank statements with transactions
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
  Building2,
  ArrowLeftRight,
  RefreshCw,
  Settings,
  LayoutDashboard,
  Check,
  X,
  CheckCircle,
  Circle,
  AlertCircle,
  Calendar,
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

interface ReconciliationItem {
  id: string;
  date: string;
  description: string;
  reference: string;
  bookAmount: number;
  bankAmount: number | null;
  type: 'Credit' | 'Debit';
  status: 'Matched' | 'Unmatched' | 'Discrepancy';
  isSelected: boolean;
}

interface ReconciliationSession {
  id: string;
  account: string;
  startDate: string;
  endDate: string;
  openingBalance: number;
  closingBalance: number;
  status: 'In Progress' | 'Completed';
  matchedCount: number;
  unmatchedCount: number;
  discrepancyCount: number;
}

const initialItems: ReconciliationItem[] = [
  {
    id: '1',
    date: '2024-01-22',
    description: 'Client Payment - Acme Corporation',
    reference: 'PAY-001',
    bookAmount: 12450.00,
    bankAmount: 12450.00,
    type: 'Credit',
    status: 'Matched',
    isSelected: false,
  },
  {
    id: '2',
    date: '2024-01-22',
    description: 'Office Rent - January',
    reference: 'EXP-042',
    bookAmount: -5200.00,
    bankAmount: -5200.00,
    type: 'Debit',
    status: 'Matched',
    isSelected: false,
  },
  {
    id: '3',
    date: '2024-01-21',
    description: 'Equipment Purchase',
    reference: 'PO-123',
    bookAmount: -3850.00,
    bankAmount: null,
    type: 'Debit',
    status: 'Unmatched',
    isSelected: false,
  },
  {
    id: '4',
    date: '2024-01-20',
    description: 'Consulting Fee - TechStart',
    reference: 'INV-089',
    bookAmount: 8500.00,
    bankAmount: 8500.00,
    type: 'Credit',
    status: 'Matched',
    isSelected: false,
  },
  {
    id: '5',
    date: '2024-01-19',
    description: 'Bank Service Charges',
    reference: 'BANK-001',
    bookAmount: -25.00,
    bankAmount: -35.00,
    type: 'Debit',
    status: 'Discrepancy',
    isSelected: false,
  },
  {
    id: '6',
    date: '2024-01-19',
    description: 'Interest Earned',
    reference: 'INT-001',
    bookAmount: 325.50,
    bankAmount: null,
    type: 'Credit',
    status: 'Unmatched',
    isSelected: false,
  },
  {
    id: '7',
    date: '2024-01-18',
    description: 'Software Subscription',
    reference: 'SUB-045',
    bookAmount: -299.00,
    bankAmount: -299.00,
    type: 'Debit',
    status: 'Matched',
    isSelected: false,
  },
];

const sessions: ReconciliationSession[] = [
  {
    id: '1',
    account: 'Operating Account',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    openingBalance: 800000.00,
    closingBalance: 845230.50,
    status: 'In Progress',
    matchedCount: 4,
    unmatchedCount: 2,
    discrepancyCount: 1,
  },
  {
    id: '2',
    account: 'Payroll Account',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    openingBalance: 250000.00,
    closingBalance: 256800.00,
    status: 'Completed',
    matchedCount: 15,
    unmatchedCount: 0,
    discrepancyCount: 0,
  },
];

const statusFilters = ['All', 'Matched', 'Unmatched', 'Discrepancy'];

export default function ReconciliationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [items, setItems] = useState<ReconciliationItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeSession, setActiveSession] = useState<ReconciliationSession | null>(sessions[0]);
  const [isSessionModalVisible, setIsSessionModalVisible] = useState(false);
  const [isResolveModalVisible, setIsResolveModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReconciliationItem | null>(null);

  const moduleColor = '#00BCD4';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Matched': return '#10B981';
      case 'Unmatched': return '#F59E0B';
      case 'Discrepancy': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Matched': return CheckCircle;
      case 'Unmatched': return Circle;
      case 'Discrepancy': return AlertCircle;
      default: return Circle;
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleSelect = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, isSelected: !item.isSelected } : item
    ));
  };

  const handleMarkAsMatched = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, status: 'Matched', bankAmount: item.bookAmount } : item
    ));
    Alert.alert('Success', 'Item marked as matched');
  };

  const handleResolveDiscrepancy = () => {
    if (!selectedItem) return;

    setItems(items.map(item =>
      item.id === selectedItem.id
        ? { ...item, status: 'Matched', bankAmount: item.bookAmount }
        : item
    ));
    setIsResolveModalVisible(false);
    setSelectedItem(null);
    Alert.alert('Success', 'Discrepancy resolved');
  };

  const handleReconcileSelected = () => {
    const selectedItems = items.filter(i => i.isSelected);
    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please select items to reconcile');
      return;
    }

    setItems(items.map(item =>
      item.isSelected ? { ...item, status: 'Matched', isSelected: false } : item
    ));
    Alert.alert('Success', `${selectedItems.length} items reconciled`);
  };

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    return `${isNegative ? '-' : ''}$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const matchedCount = items.filter(i => i.status === 'Matched').length;
  const unmatchedCount = items.filter(i => i.status === 'Unmatched').length;
  const discrepancyCount = items.filter(i => i.status === 'Discrepancy').length;

  const renderItem = ({ item }: { item: ReconciliationItem }) => {
    const StatusIcon = getStatusIcon(item.status);
    return (
      <TouchableOpacity
        style={[
          styles.itemCard,
          item.isSelected && styles.selectedCard,
        ]}
        onPress={() => handleToggleSelect(item.id)}
        onLongPress={() => {
          setSelectedItem(item);
          if (item.status === 'Discrepancy') {
            setIsResolveModalVisible(true);
          } else if (item.status === 'Unmatched') {
            handleMarkAsMatched(item.id);
          }
        }}
      >
        <View style={styles.itemHeader}>
          <View style={styles.selectBox}>
            {item.isSelected ? (
              <View style={[styles.checkbox, { backgroundColor: moduleColor }]}>
                <Check size={14} color="#FFFFFF" />
              </View>
            ) : (
              <View style={styles.checkbox} />
            )}
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemDescription} numberOfLines={1}>
              {item.description}
            </Text>
            <Text style={styles.itemMeta}>{item.reference} • {item.date}</Text>
          </View>
          <StatusIcon size={20} color={getStatusColor(item.status)} />
        </View>

        <View style={styles.amountsRow}>
          <View style={styles.amountCol}>
            <Text style={styles.amountLabel}>Book</Text>
            <Text style={[styles.amountValue, { color: item.bookAmount >= 0 ? '#10B981' : '#EF4444' }]}>
              {formatCurrency(item.bookAmount)}
            </Text>
          </View>
          <View style={styles.amountCol}>
            <Text style={styles.amountLabel}>Bank</Text>
            {item.bankAmount !== null ? (
              <Text style={[styles.amountValue, { color: item.bankAmount >= 0 ? '#10B981' : '#EF4444' }]}>
                {formatCurrency(item.bankAmount)}
              </Text>
            ) : (
              <Text style={styles.noMatch}>--</Text>
            )}
          </View>
          {item.status === 'Discrepancy' && item.bankAmount !== null && (
            <View style={styles.amountCol}>
              <Text style={styles.amountLabel}>Diff</Text>
              <Text style={[styles.amountValue, { color: '#EF4444' }]}>
                {formatCurrency(item.bookAmount - item.bankAmount)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.itemFooter}>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
          {item.status === 'Unmatched' && (
            <TouchableOpacity
              style={styles.matchButton}
              onPress={() => handleMarkAsMatched(item.id)}
            >
              <Text style={styles.matchButtonText}>Mark Matched</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ModuleLayout
      moduleId="bank"
      navItems={bankNavItems}
      activeScreen="BankReconciliation"
      title="Reconciliation"
    >
      <View style={styles.container}>
        {/* Session Header */}
        {activeSession && (
          <TouchableOpacity
            style={styles.sessionHeader}
            onPress={() => setIsSessionModalVisible(true)}
          >
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionAccount}>{activeSession.account}</Text>
              <View style={styles.sessionDates}>
                <Calendar size={12} color={isDark ? '#64748B' : '#94A3B8'} />
                <Text style={styles.sessionDateText}>
                  {activeSession.startDate} - {activeSession.endDate}
                </Text>
              </View>
            </View>
            <View style={[styles.sessionStatus, { backgroundColor: activeSession.status === 'Completed' ? '#D1FAE5' : '#FEF3C7' }]}>
              <Text style={[styles.sessionStatusText, { color: activeSession.status === 'Completed' ? '#10B981' : '#F59E0B' }]}>
                {activeSession.status}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Summary Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statItem, { backgroundColor: '#D1FAE520' }]}>
            <Text style={[styles.statValue, { color: '#10B981' }]}>{matchedCount}</Text>
            <Text style={styles.statLabel}>Matched</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: '#FEF3C720' }]}>
            <Text style={[styles.statValue, { color: '#F59E0B' }]}>{unmatchedCount}</Text>
            <Text style={styles.statLabel}>Unmatched</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: '#FEE2E220' }]}>
            <Text style={[styles.statValue, { color: '#EF4444' }]}>{discrepancyCount}</Text>
            <Text style={styles.statLabel}>Discrepancy</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search items..."
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
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

        {/* Items List */}
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Reconcile Button */}
        {items.some(i => i.isSelected) && (
          <View style={styles.bottomBar}>
            <Text style={styles.selectedCount}>
              {items.filter(i => i.isSelected).length} selected
            </Text>
            <TouchableOpacity
              style={[styles.reconcileButton, { backgroundColor: moduleColor }]}
              onPress={handleReconcileSelected}
            >
              <CheckCircle size={18} color="#FFFFFF" />
              <Text style={styles.reconcileButtonText}>Reconcile Selected</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Session Selection Modal */}
        <Modal
          visible={isSessionModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsSessionModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Account</Text>
                <TouchableOpacity onPress={() => setIsSessionModalVisible(false)}>
                  <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {sessions.map(session => (
                  <TouchableOpacity
                    key={session.id}
                    style={[
                      styles.sessionOption,
                      activeSession?.id === session.id && styles.activeSessionOption,
                    ]}
                    onPress={() => {
                      setActiveSession(session);
                      setIsSessionModalVisible(false);
                    }}
                  >
                    <View style={styles.sessionOptionInfo}>
                      <Text style={styles.sessionOptionName}>{session.account}</Text>
                      <Text style={styles.sessionOptionDates}>
                        {session.startDate} - {session.endDate}
                      </Text>
                    </View>
                    <View style={[styles.sessionOptionStatus, { backgroundColor: session.status === 'Completed' ? '#D1FAE5' : '#FEF3C7' }]}>
                      <Text style={[styles.sessionOptionStatusText, { color: session.status === 'Completed' ? '#10B981' : '#F59E0B' }]}>
                        {session.status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Resolve Discrepancy Modal */}
        <Modal
          visible={isResolveModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsResolveModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Resolve Discrepancy</Text>
                <TouchableOpacity onPress={() => setIsResolveModalVisible(false)}>
                  <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              {selectedItem && (
                <View style={styles.modalBody}>
                  <Text style={styles.resolveDescription}>{selectedItem.description}</Text>

                  <View style={styles.discrepancyDetails}>
                    <View style={styles.discrepancyRow}>
                      <Text style={styles.discrepancyLabel}>Book Amount</Text>
                      <Text style={styles.discrepancyValue}>{formatCurrency(selectedItem.bookAmount)}</Text>
                    </View>
                    <View style={styles.discrepancyRow}>
                      <Text style={styles.discrepancyLabel}>Bank Amount</Text>
                      <Text style={styles.discrepancyValue}>{formatCurrency(selectedItem.bankAmount || 0)}</Text>
                    </View>
                    <View style={[styles.discrepancyRow, styles.diffRow]}>
                      <Text style={styles.discrepancyLabel}>Difference</Text>
                      <Text style={[styles.discrepancyValue, { color: '#EF4444' }]}>
                        {formatCurrency(selectedItem.bookAmount - (selectedItem.bankAmount || 0))}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.resolveNote}>
                    Choose how to resolve this discrepancy:
                  </Text>

                  <TouchableOpacity
                    style={styles.resolveOption}
                    onPress={handleResolveDiscrepancy}
                  >
                    <Text style={styles.resolveOptionText}>Use Book Amount</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.resolveOption}
                    onPress={() => {
                      setItems(items.map(item =>
                        item.id === selectedItem.id
                          ? { ...item, status: 'Matched', bookAmount: item.bankAmount || 0 }
                          : item
                      ));
                      setIsResolveModalVisible(false);
                      Alert.alert('Success', 'Discrepancy resolved using bank amount');
                    }}
                  >
                    <Text style={styles.resolveOptionText}>Use Bank Amount</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsResolveModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    sessionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    sessionInfo: {},
    sessionAccount: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 4,
    },
    sessionDates: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    sessionDateText: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    sessionStatus: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    sessionStatusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    statsRow: {
      flexDirection: 'row',
      padding: 16,
      gap: 12,
    },
    statItem: {
      flex: 1,
      padding: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: '700',
    },
    statLabel: {
      fontSize: 11,
      color: isDark ? '#94A3B8' : '#64748B',
      marginTop: 2,
    },
    searchContainer: {
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    searchBar: {
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
      gap: 10,
      paddingBottom: 100,
    },
    itemCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    selectedCard: {
      borderColor: '#00BCD4',
      borderWidth: 2,
    },
    itemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    selectBox: {
      marginRight: 12,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: isDark ? '#475569' : '#CBD5E1',
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemInfo: {
      flex: 1,
    },
    itemDescription: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    itemMeta: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    amountsRow: {
      flexDirection: 'row',
      gap: 20,
      marginBottom: 12,
    },
    amountCol: {},
    amountLabel: {
      fontSize: 11,
      color: isDark ? '#64748B' : '#94A3B8',
      marginBottom: 2,
    },
    amountValue: {
      fontSize: 15,
      fontWeight: '600',
    },
    noMatch: {
      fontSize: 15,
      color: isDark ? '#475569' : '#CBD5E1',
    },
    itemFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
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
    matchButton: {
      backgroundColor: '#00BCD420',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    matchButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#00BCD4',
    },
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    selectedCount: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    reconcileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 10,
    },
    reconcileButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
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
      maxHeight: '80%',
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
    sessionOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      marginBottom: 12,
    },
    activeSessionOption: {
      borderColor: '#00BCD4',
      borderWidth: 2,
    },
    sessionOptionInfo: {},
    sessionOptionName: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 4,
    },
    sessionOptionDates: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    sessionOptionStatus: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    sessionOptionStatusText: {
      fontSize: 11,
      fontWeight: '600',
    },
    resolveDescription: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 16,
    },
    discrepancyDetails: {
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    discrepancyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    diffRow: {
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
      marginTop: 8,
    },
    discrepancyLabel: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    discrepancyValue: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    resolveNote: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 12,
    },
    resolveOption: {
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      padding: 16,
      borderRadius: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    resolveOptionText: {
      fontSize: 15,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#0F172A',
      textAlign: 'center',
    },
    modalFooter: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    cancelButton: {
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
  });
