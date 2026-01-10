/**
 * Corporate Cards List Screen
 * Manage corporate cards
 */

import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, useColorScheme,
  TextInput, Modal, ScrollView, Alert,
} from 'react-native';
import {
  Search, Plus, MoreVertical, X, CreditCard, Receipt, Gauge, Settings,
  LayoutDashboard, Edit, Trash2, Eye, Lock, Unlock,
} from 'lucide-react-native';
import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

const cardsNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'CorporateCards' },
  { id: 'cards', label: 'Cards', icon: CreditCard, screenName: 'CorporateCardsList' },
  { id: 'expenses', label: 'Expenses', icon: Receipt, screenName: 'CorporateCardsExpenses' },
  { id: 'limits', label: 'Limits', icon: Gauge, screenName: 'CorporateCardsLimits' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'CorporateCardsSettings' },
];

interface Card {
  id: string;
  cardNumber: string;
  holderName: string;
  department: string;
  limit: number;
  spent: number;
  status: 'Active' | 'Frozen' | 'Cancelled';
  expiryDate: string;
}

const initialCards: Card[] = [
  { id: '1', cardNumber: '****4582', holderName: 'John Smith', department: 'Sales', limit: 5000, spent: 2450, status: 'Active', expiryDate: '12/25' },
  { id: '2', cardNumber: '****7891', holderName: 'Sarah Johnson', department: 'Marketing', limit: 3000, spent: 1820, status: 'Active', expiryDate: '09/26' },
  { id: '3', cardNumber: '****3456', holderName: 'Mike Brown', department: 'Engineering', limit: 2500, spent: 2340, status: 'Active', expiryDate: '03/25' },
  { id: '4', cardNumber: '****9012', holderName: 'Emily Davis', department: 'HR', limit: 4000, spent: 890, status: 'Active', expiryDate: '07/26' },
  { id: '5', cardNumber: '****5678', holderName: 'Alex Wilson', department: 'Finance', limit: 6000, spent: 0, status: 'Frozen', expiryDate: '11/25' },
];

const statusFilters = ['All', 'Active', 'Frozen', 'Cancelled'];

export default function CardsListScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [cards, setCards] = useState<Card[]>(initialCards);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [formData, setFormData] = useState({ holderName: '', department: '', limit: '' });

  const moduleColor = '#FFC107';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#10B981';
      case 'Frozen': return '#3B82F6';
      case 'Cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.holderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.cardNumber.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || card.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddCard = () => {
    if (!formData.holderName || !formData.limit) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }
    const newCard: Card = {
      id: Date.now().toString(),
      cardNumber: `****${Math.floor(1000 + Math.random() * 9000)}`,
      holderName: formData.holderName,
      department: formData.department || 'General',
      limit: parseFloat(formData.limit),
      spent: 0,
      status: 'Active',
      expiryDate: '12/27',
    };
    setCards([newCard, ...cards]);
    setFormData({ holderName: '', department: '', limit: '' });
    setIsAddModalVisible(false);
  };

  const handleToggleFreeze = () => {
    if (!selectedCard) return;
    const updated = cards.map(c => c.id === selectedCard.id
      ? { ...c, status: c.status === 'Frozen' ? 'Active' as const : 'Frozen' as const }
      : c);
    setCards(updated);
    setIsActionMenuVisible(false);
  };

  const handleDelete = () => {
    if (!selectedCard) return;
    Alert.alert('Cancel Card', `Cancel card ${selectedCard.cardNumber}?`, [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: () => {
        setCards(cards.map(c => c.id === selectedCard.id ? { ...c, status: 'Cancelled' as const } : c));
        setIsActionMenuVisible(false);
      }},
    ]);
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const getSpendPercentage = (spent: number, limit: number) => Math.min((spent / limit) * 100, 100);

  const renderCard = ({ item }: { item: Card }) => (
    <TouchableOpacity style={styles.cardCard} onPress={() => { setSelectedCard(item); setIsActionMenuVisible(true); }}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardIcon, { backgroundColor: `${moduleColor}20` }]}>
          <CreditCard size={24} color={moduleColor} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardNumber}>{item.cardNumber}</Text>
          <Text style={styles.cardHolder}>{item.holderName}</Text>
          <Text style={styles.cardDept}>{item.department}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.spendSection}>
        <View style={styles.spendHeader}>
          <Text style={styles.spendLabel}>Spent: {formatCurrency(item.spent)} / {formatCurrency(item.limit)}</Text>
          <Text style={styles.spendPercent}>{getSpendPercentage(item.spent, item.limit).toFixed(0)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {
            width: `${getSpendPercentage(item.spent, item.limit)}%`,
            backgroundColor: getSpendPercentage(item.spent, item.limit) > 80 ? '#EF4444' : moduleColor
          }]} />
        </View>
      </View>

      <Text style={styles.expiry}>Expires: {item.expiryDate}</Text>
    </TouchableOpacity>
  );

  return (
    <ModuleLayout moduleId="corporate-cards" navItems={cardsNavItems} activeScreen="CorporateCardsList" title="Corporate Cards">
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            <TextInput style={styles.searchInput} placeholder="Search cards..." placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={searchQuery} onChangeText={setSearchQuery} />
          </View>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: moduleColor }]} onPress={() => setIsAddModalVisible(true)}>
            <Plus size={20} color="#000000" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {statusFilters.map(filter => (
            <TouchableOpacity key={filter} style={[styles.filterChip, statusFilter === filter && { backgroundColor: moduleColor }]}
              onPress={() => setStatusFilter(filter)}>
              <Text style={[styles.filterText, statusFilter === filter && { color: '#000000' }]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList data={filteredCards} renderItem={renderCard} keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />

        <Modal visible={isAddModalVisible} animationType="slide" transparent onRequestClose={() => setIsAddModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Issue New Card</Text>
                <TouchableOpacity onPress={() => setIsAddModalVisible(false)}><X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} /></TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody}>
                <Text style={styles.inputLabel}>Cardholder Name *</Text>
                <TextInput style={styles.input} value={formData.holderName} onChangeText={t => setFormData({...formData, holderName: t})}
                  placeholder="Employee name" placeholderTextColor={isDark ? '#64748B' : '#94A3B8'} />
                <Text style={styles.inputLabel}>Department</Text>
                <TextInput style={styles.input} value={formData.department} onChangeText={t => setFormData({...formData, department: t})}
                  placeholder="e.g., Sales" placeholderTextColor={isDark ? '#64748B' : '#94A3B8'} />
                <Text style={styles.inputLabel}>Monthly Limit *</Text>
                <TextInput style={styles.input} value={formData.limit} onChangeText={t => setFormData({...formData, limit: t})}
                  placeholder="5000" keyboardType="numeric" placeholderTextColor={isDark ? '#64748B' : '#94A3B8'} />
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAddModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.submitButton, { backgroundColor: moduleColor }]} onPress={handleAddCard}>
                  <Text style={[styles.submitButtonText, { color: '#000000' }]}>Issue Card</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={isActionMenuVisible} animationType="fade" transparent onRequestClose={() => setIsActionMenuVisible(false)}>
          <TouchableOpacity style={styles.actionMenuOverlay} activeOpacity={1} onPress={() => setIsActionMenuVisible(false)}>
            <View style={styles.actionMenu}>
              <TouchableOpacity style={styles.actionMenuItem} onPress={handleToggleFreeze}>
                {selectedCard?.status === 'Frozen' ? <Unlock size={18} color="#10B981" /> : <Lock size={18} color="#3B82F6" />}
                <Text style={styles.actionMenuText}>{selectedCard?.status === 'Frozen' ? 'Unfreeze' : 'Freeze'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionMenuItem} onPress={handleDelete}>
                <Trash2 size={18} color="#EF4444" />
                <Text style={[styles.actionMenuText, { color: '#EF4444' }]}>Cancel Card</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
  cardCard: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0' },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  cardIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardInfo: { flex: 1 },
  cardNumber: { fontSize: 16, fontWeight: '700', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 2 },
  cardHolder: { fontSize: 14, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 2 },
  cardDept: { fontSize: 12, color: isDark ? '#64748B' : '#94A3B8' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '600' },
  spendSection: { marginBottom: 12 },
  spendHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  spendLabel: { fontSize: 12, color: isDark ? '#94A3B8' : '#64748B' },
  spendPercent: { fontSize: 12, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
  progressBar: { height: 6, backgroundColor: isDark ? '#0F172A' : '#F1F5F9', borderRadius: 3 },
  progressFill: { height: '100%', borderRadius: 3 },
  expiry: { fontSize: 11, color: isDark ? '#64748B' : '#94A3B8' },
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
  actionMenuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  actionMenu: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 16, padding: 8, width: '80%', maxWidth: 300 },
  actionMenuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  actionMenuText: { fontSize: 15, color: isDark ? '#FFFFFF' : '#0F172A' },
});
