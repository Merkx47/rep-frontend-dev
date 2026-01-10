/**
 * Corporate Cards Expenses Screen
 * Track and manage card expenses
 */

import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, useColorScheme,
  TextInput, Modal, ScrollView, Alert,
} from 'react-native';
import {
  Search, Plus, X, Receipt, CreditCard, ShoppingBag, Coffee,
  Car, Briefcase, LayoutDashboard, Gauge, Settings, Check, Clock,
} from 'lucide-react-native';
import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

const cardsNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'CorporateCards' },
  { id: 'cards', label: 'Cards', icon: CreditCard, screenName: 'CorporateCardsList' },
  { id: 'expenses', label: 'Expenses', icon: Receipt, screenName: 'CorporateCardsExpenses' },
  { id: 'limits', label: 'Limits', icon: Gauge, screenName: 'CorporateCardsLimits' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'CorporateCardsSettings' },
];

interface Expense {
  id: string;
  cardNumber: string;
  cardHolder: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  receipt: boolean;
}

const initialExpenses: Expense[] = [
  { id: '1', cardNumber: '****4582', cardHolder: 'John Smith', merchant: 'Office Depot', category: 'Office Supplies', amount: 245.80, date: '2024-01-10', status: 'Approved', receipt: true },
  { id: '2', cardNumber: '****7891', cardHolder: 'Sarah Johnson', merchant: 'Delta Airlines', category: 'Travel', amount: 1250.00, date: '2024-01-09', status: 'Pending', receipt: true },
  { id: '3', cardNumber: '****4582', cardHolder: 'John Smith', merchant: 'Starbucks', category: 'Meals', amount: 32.50, date: '2024-01-09', status: 'Approved', receipt: false },
  { id: '4', cardNumber: '****3456', cardHolder: 'Mike Brown', merchant: 'AWS', category: 'Software', amount: 890.00, date: '2024-01-08', status: 'Approved', receipt: true },
  { id: '5', cardNumber: '****9012', cardHolder: 'Emily Davis', merchant: 'Uber', category: 'Transportation', amount: 45.20, date: '2024-01-08', status: 'Pending', receipt: true },
  { id: '6', cardNumber: '****7891', cardHolder: 'Sarah Johnson', merchant: 'LinkedIn Ads', category: 'Marketing', amount: 500.00, date: '2024-01-07', status: 'Rejected', receipt: false },
];

const categories = ['All', 'Office Supplies', 'Travel', 'Meals', 'Software', 'Transportation', 'Marketing'];

export default function ExpensesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({ merchant: '', category: '', amount: '', cardNumber: '' });

  const moduleColor = '#FFC107';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return '#10B981';
      case 'Pending': return '#F59E0B';
      case 'Rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Office Supplies': return ShoppingBag;
      case 'Travel': return Briefcase;
      case 'Meals': return Coffee;
      case 'Transportation': return Car;
      default: return Receipt;
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.cardHolder.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddExpense = () => {
    if (!formData.merchant || !formData.amount) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }
    const newExpense: Expense = {
      id: Date.now().toString(),
      cardNumber: formData.cardNumber || '****4582',
      cardHolder: 'Current User',
      merchant: formData.merchant,
      category: formData.category || 'Office Supplies',
      amount: parseFloat(formData.amount),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      receipt: false,
    };
    setExpenses([newExpense, ...expenses]);
    setFormData({ merchant: '', category: '', amount: '', cardNumber: '' });
    setIsAddModalVisible(false);
  };

  const handleApprove = (expense: Expense) => {
    setExpenses(expenses.map(e => e.id === expense.id ? { ...e, status: 'Approved' as const } : e));
  };

  const handleReject = (expense: Expense) => {
    Alert.alert('Reject Expense', `Reject expense for ${expense.merchant}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: () => {
        setExpenses(expenses.map(e => e.id === expense.id ? { ...e, status: 'Rejected' as const } : e));
      }},
    ]);
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const renderExpense = ({ item }: { item: Expense }) => {
    const CategoryIcon = getCategoryIcon(item.category);
    return (
      <TouchableOpacity style={styles.expenseCard} onPress={() => setSelectedExpense(item)}>
        <View style={styles.expenseHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: `${moduleColor}20` }]}>
            <CategoryIcon size={20} color={moduleColor} />
          </View>
          <View style={styles.expenseInfo}>
            <Text style={styles.merchantName}>{item.merchant}</Text>
            <Text style={styles.cardInfo}>{item.cardHolder} • {item.cardNumber}</Text>
            <Text style={styles.expenseDate}>{item.date}</Text>
          </View>
          <View style={styles.expenseRight}>
            <Text style={styles.expenseAmount}>{formatCurrency(item.amount)}</Text>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
            </View>
          </View>
        </View>
        <View style={styles.expenseFooter}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          {item.receipt && (
            <View style={styles.receiptBadge}>
              <Receipt size={12} color="#10B981" />
              <Text style={styles.receiptText}>Receipt</Text>
            </View>
          )}
          {item.status === 'Pending' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(item)}>
                <Check size={14} color="#10B981" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item)}>
                <X size={14} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ModuleLayout moduleId="corporate-cards" navItems={cardsNavItems} activeScreen="CorporateCardsExpenses" title="Expenses">
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            <TextInput style={styles.searchInput} placeholder="Search expenses..." placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={searchQuery} onChangeText={setSearchQuery} />
          </View>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: moduleColor }]} onPress={() => setIsAddModalVisible(true)}>
            <Plus size={20} color="#000000" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {categories.map(cat => (
            <TouchableOpacity key={cat} style={[styles.filterChip, categoryFilter === cat && { backgroundColor: moduleColor }]}
              onPress={() => setCategoryFilter(cat)}>
              <Text style={[styles.filterText, categoryFilter === cat && { color: '#000000' }]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList data={filteredExpenses} renderItem={renderExpense} keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />

        <Modal visible={isAddModalVisible} animationType="slide" transparent onRequestClose={() => setIsAddModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Log Expense</Text>
                <TouchableOpacity onPress={() => setIsAddModalVisible(false)}><X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} /></TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody}>
                <Text style={styles.inputLabel}>Merchant *</Text>
                <TextInput style={styles.input} value={formData.merchant} onChangeText={t => setFormData({...formData, merchant: t})}
                  placeholder="e.g., Office Depot" placeholderTextColor={isDark ? '#64748B' : '#94A3B8'} />
                <Text style={styles.inputLabel}>Category</Text>
                <TextInput style={styles.input} value={formData.category} onChangeText={t => setFormData({...formData, category: t})}
                  placeholder="e.g., Office Supplies" placeholderTextColor={isDark ? '#64748B' : '#94A3B8'} />
                <Text style={styles.inputLabel}>Amount *</Text>
                <TextInput style={styles.input} value={formData.amount} onChangeText={t => setFormData({...formData, amount: t})}
                  placeholder="0.00" keyboardType="numeric" placeholderTextColor={isDark ? '#64748B' : '#94A3B8'} />
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAddModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.submitButton, { backgroundColor: moduleColor }]} onPress={handleAddExpense}>
                  <Text style={[styles.submitButtonText, { color: '#000000' }]}>Log Expense</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ModuleLayout>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { flexDirection: 'row', padding: 16, gap: 12 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0' },
  searchInput: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, color: isDark ? '#FFFFFF' : '#0F172A', fontSize: 15 },
  addButton: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  filterContainer: { maxHeight: 44, paddingHorizontal: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: isDark ? '#1E293B' : '#F1F5F9', marginRight: 8 },
  filterText: { fontSize: 13, fontWeight: '500', color: isDark ? '#94A3B8' : '#64748B' },
  listContent: { padding: 16, gap: 12 },
  expenseCard: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0' },
  expenseHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  categoryIcon: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  expenseInfo: { flex: 1 },
  merchantName: { fontSize: 15, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 2 },
  cardInfo: { fontSize: 13, color: isDark ? '#94A3B8' : '#64748B', marginBottom: 2 },
  expenseDate: { fontSize: 12, color: isDark ? '#64748B' : '#94A3B8' },
  expenseRight: { alignItems: 'flex-end' },
  expenseAmount: { fontSize: 16, fontWeight: '700', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '600' },
  expenseFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: isDark ? '#0F172A' : '#F1F5F9' },
  categoryText: { fontSize: 11, color: isDark ? '#94A3B8' : '#64748B' },
  receiptBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: '#10B98120' },
  receiptText: { fontSize: 11, color: '#10B981' },
  actionButtons: { flexDirection: 'row', gap: 8, marginLeft: 'auto' },
  approveBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#10B98120', justifyContent: 'center', alignItems: 'center' },
  rejectBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#EF444420', justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: isDark ? '#334155' : '#E2E8F0' },
  modalTitle: { fontSize: 18, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
  modalBody: { padding: 20 },
  inputLabel: { fontSize: 13, fontWeight: '500', color: isDark ? '#94A3B8' : '#64748B', marginBottom: 6 },
  input: { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderRadius: 10, padding: 12, fontSize: 15, color: isDark ? '#FFFFFF' : '#0F172A', borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0', marginBottom: 16 },
  modalFooter: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: isDark ? '#334155' : '#E2E8F0' },
  cancelButton: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', backgroundColor: isDark ? '#0F172A' : '#F1F5F9' },
  cancelButtonText: { fontSize: 15, fontWeight: '600', color: isDark ? '#94A3B8' : '#64748B' },
  submitButton: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  submitButtonText: { fontSize: 15, fontWeight: '600' },
});
