/**
 * Corporate Cards Limits Screen
 * Manage spending limits and policies
 */

import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, useColorScheme,
  TextInput, Modal, ScrollView, Alert,
} from 'react-native';
import {
  Search, Plus, X, Gauge, CreditCard, Receipt, Settings,
  LayoutDashboard, Edit, Trash2, Users, DollarSign, AlertTriangle,
} from 'lucide-react-native';
import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

const cardsNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'CorporateCards' },
  { id: 'cards', label: 'Cards', icon: CreditCard, screenName: 'CorporateCardsList' },
  { id: 'expenses', label: 'Expenses', icon: Receipt, screenName: 'CorporateCardsExpenses' },
  { id: 'limits', label: 'Limits', icon: Gauge, screenName: 'CorporateCardsLimits' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'CorporateCardsSettings' },
];

interface LimitPolicy {
  id: string;
  name: string;
  type: 'Department' | 'Role' | 'Individual';
  target: string;
  dailyLimit: number;
  monthlyLimit: number;
  transactionLimit: number;
  categories: string[];
  usersAffected: number;
  status: 'Active' | 'Inactive';
}

const initialPolicies: LimitPolicy[] = [
  { id: '1', name: 'Sales Team Policy', type: 'Department', target: 'Sales', dailyLimit: 500, monthlyLimit: 5000, transactionLimit: 250, categories: ['Travel', 'Meals', 'Entertainment'], usersAffected: 12, status: 'Active' },
  { id: '2', name: 'Marketing Budget', type: 'Department', target: 'Marketing', dailyLimit: 1000, monthlyLimit: 8000, transactionLimit: 500, categories: ['Advertising', 'Events', 'Software'], usersAffected: 8, status: 'Active' },
  { id: '3', name: 'Manager Allowance', type: 'Role', target: 'Managers', dailyLimit: 750, monthlyLimit: 6000, transactionLimit: 400, categories: ['All'], usersAffected: 15, status: 'Active' },
  { id: '4', name: 'Executive Policy', type: 'Role', target: 'Executives', dailyLimit: 2000, monthlyLimit: 15000, transactionLimit: 1000, categories: ['All'], usersAffected: 5, status: 'Active' },
  { id: '5', name: 'Intern Limits', type: 'Role', target: 'Interns', dailyLimit: 50, monthlyLimit: 200, transactionLimit: 25, categories: ['Office Supplies'], usersAffected: 10, status: 'Inactive' },
];

const policyTypes = ['All', 'Department', 'Role', 'Individual'];

export default function LimitsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [policies, setPolicies] = useState<LimitPolicy[]>(initialPolicies);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<LimitPolicy | null>(null);
  const [formData, setFormData] = useState({
    name: '', type: 'Department', target: '',
    dailyLimit: '', monthlyLimit: '', transactionLimit: ''
  });

  const moduleColor = '#FFC107';

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || policy.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAddPolicy = () => {
    if (!formData.name || !formData.target || !formData.monthlyLimit) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }
    const newPolicy: LimitPolicy = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type as 'Department' | 'Role' | 'Individual',
      target: formData.target,
      dailyLimit: parseFloat(formData.dailyLimit) || 0,
      monthlyLimit: parseFloat(formData.monthlyLimit),
      transactionLimit: parseFloat(formData.transactionLimit) || 0,
      categories: ['All'],
      usersAffected: 0,
      status: 'Active',
    };
    setPolicies([newPolicy, ...policies]);
    resetForm();
    setIsAddModalVisible(false);
  };

  const handleEditPolicy = () => {
    if (!selectedPolicy || !formData.name || !formData.monthlyLimit) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }
    setPolicies(policies.map(p => p.id === selectedPolicy.id ? {
      ...p,
      name: formData.name,
      type: formData.type as 'Department' | 'Role' | 'Individual',
      target: formData.target,
      dailyLimit: parseFloat(formData.dailyLimit) || 0,
      monthlyLimit: parseFloat(formData.monthlyLimit),
      transactionLimit: parseFloat(formData.transactionLimit) || 0,
    } : p));
    resetForm();
    setIsEditModalVisible(false);
    setSelectedPolicy(null);
  };

  const handleToggleStatus = (policy: LimitPolicy) => {
    setPolicies(policies.map(p => p.id === policy.id
      ? { ...p, status: p.status === 'Active' ? 'Inactive' as const : 'Active' as const }
      : p
    ));
  };

  const handleDelete = (policy: LimitPolicy) => {
    Alert.alert('Delete Policy', `Delete "${policy.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setPolicies(policies.filter(p => p.id !== policy.id));
      }},
    ]);
  };

  const openEditModal = (policy: LimitPolicy) => {
    setSelectedPolicy(policy);
    setFormData({
      name: policy.name,
      type: policy.type,
      target: policy.target,
      dailyLimit: policy.dailyLimit.toString(),
      monthlyLimit: policy.monthlyLimit.toString(),
      transactionLimit: policy.transactionLimit.toString(),
    });
    setIsEditModalVisible(true);
  };

  const resetForm = () => {
    setFormData({ name: '', type: 'Department', target: '', dailyLimit: '', monthlyLimit: '', transactionLimit: '' });
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Department': return Users;
      case 'Role': return Gauge;
      default: return CreditCard;
    }
  };

  const renderPolicy = ({ item }: { item: LimitPolicy }) => {
    const TypeIcon = getTypeIcon(item.type);
    const isActive = item.status === 'Active';

    return (
      <View style={styles.policyCard}>
        <View style={styles.policyHeader}>
          <View style={[styles.typeIcon, { backgroundColor: `${moduleColor}20` }]}>
            <TypeIcon size={20} color={moduleColor} />
          </View>
          <View style={styles.policyInfo}>
            <Text style={styles.policyName}>{item.name}</Text>
            <Text style={styles.policyTarget}>{item.type}: {item.target}</Text>
          </View>
          <TouchableOpacity
            style={[styles.statusToggle, { backgroundColor: isActive ? '#10B98120' : '#64748B20' }]}
            onPress={() => handleToggleStatus(item)}
          >
            <Text style={[styles.statusText, { color: isActive ? '#10B981' : '#64748B' }]}>
              {item.status}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.limitsGrid}>
          <View style={styles.limitItem}>
            <Text style={styles.limitLabel}>Daily</Text>
            <Text style={styles.limitValue}>{formatCurrency(item.dailyLimit)}</Text>
          </View>
          <View style={styles.limitItem}>
            <Text style={styles.limitLabel}>Monthly</Text>
            <Text style={styles.limitValue}>{formatCurrency(item.monthlyLimit)}</Text>
          </View>
          <View style={styles.limitItem}>
            <Text style={styles.limitLabel}>Per Txn</Text>
            <Text style={styles.limitValue}>{formatCurrency(item.transactionLimit)}</Text>
          </View>
        </View>

        <View style={styles.policyFooter}>
          <View style={styles.usersInfo}>
            <Users size={14} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text style={styles.usersText}>{item.usersAffected} users affected</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(item)}>
              <Edit size={16} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item)}>
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderFormModal = (isEdit: boolean) => (
    <Modal visible={isEdit ? isEditModalVisible : isAddModalVisible} animationType="slide" transparent
      onRequestClose={() => isEdit ? setIsEditModalVisible(false) : setIsAddModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{isEdit ? 'Edit Policy' : 'New Limit Policy'}</Text>
            <TouchableOpacity onPress={() => { resetForm(); isEdit ? setIsEditModalVisible(false) : setIsAddModalVisible(false); }}>
              <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            <Text style={styles.inputLabel}>Policy Name *</Text>
            <TextInput style={styles.input} value={formData.name} onChangeText={t => setFormData({...formData, name: t})}
              placeholder="e.g., Sales Team Policy" placeholderTextColor={isDark ? '#64748B' : '#94A3B8'} />

            <Text style={styles.inputLabel}>Type</Text>
            <View style={styles.typeSelector}>
              {['Department', 'Role', 'Individual'].map(type => (
                <TouchableOpacity key={type} style={[styles.typeOption, formData.type === type && { backgroundColor: moduleColor }]}
                  onPress={() => setFormData({...formData, type})}>
                  <Text style={[styles.typeOptionText, formData.type === type && { color: '#000000' }]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Target (Department/Role/User) *</Text>
            <TextInput style={styles.input} value={formData.target} onChangeText={t => setFormData({...formData, target: t})}
              placeholder="e.g., Sales, Managers" placeholderTextColor={isDark ? '#64748B' : '#94A3B8'} />

            <Text style={styles.inputLabel}>Daily Limit</Text>
            <TextInput style={styles.input} value={formData.dailyLimit} onChangeText={t => setFormData({...formData, dailyLimit: t})}
              placeholder="500" keyboardType="numeric" placeholderTextColor={isDark ? '#64748B' : '#94A3B8'} />

            <Text style={styles.inputLabel}>Monthly Limit *</Text>
            <TextInput style={styles.input} value={formData.monthlyLimit} onChangeText={t => setFormData({...formData, monthlyLimit: t})}
              placeholder="5000" keyboardType="numeric" placeholderTextColor={isDark ? '#64748B' : '#94A3B8'} />

            <Text style={styles.inputLabel}>Per Transaction Limit</Text>
            <TextInput style={styles.input} value={formData.transactionLimit} onChangeText={t => setFormData({...formData, transactionLimit: t})}
              placeholder="250" keyboardType="numeric" placeholderTextColor={isDark ? '#64748B' : '#94A3B8'} />
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => { resetForm(); isEdit ? setIsEditModalVisible(false) : setIsAddModalVisible(false); }}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.submitButton, { backgroundColor: moduleColor }]} onPress={isEdit ? handleEditPolicy : handleAddPolicy}>
              <Text style={[styles.submitButtonText, { color: '#000000' }]}>{isEdit ? 'Save Changes' : 'Create Policy'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ModuleLayout moduleId="corporate-cards" navItems={cardsNavItems} activeScreen="CorporateCardsLimits" title="Spending Limits">
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            <TextInput style={styles.searchInput} placeholder="Search policies..." placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={searchQuery} onChangeText={setSearchQuery} />
          </View>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: moduleColor }]} onPress={() => setIsAddModalVisible(true)}>
            <Plus size={20} color="#000000" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {policyTypes.map(type => (
            <TouchableOpacity key={type} style={[styles.filterChip, typeFilter === type && { backgroundColor: moduleColor }]}
              onPress={() => setTypeFilter(type)}>
              <Text style={[styles.filterText, typeFilter === type && { color: '#000000' }]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList data={filteredPolicies} renderItem={renderPolicy} keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />

        {renderFormModal(false)}
        {renderFormModal(true)}
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
  policyCard: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0' },
  policyHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  typeIcon: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  policyInfo: { flex: 1 },
  policyName: { fontSize: 15, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 2 },
  policyTarget: { fontSize: 13, color: isDark ? '#94A3B8' : '#64748B' },
  statusToggle: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600' },
  limitsGrid: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  limitItem: { flex: 1, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderRadius: 8, padding: 12, alignItems: 'center' },
  limitLabel: { fontSize: 11, color: isDark ? '#64748B' : '#94A3B8', marginBottom: 4 },
  limitValue: { fontSize: 14, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
  policyFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  usersInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  usersText: { fontSize: 12, color: isDark ? '#64748B' : '#94A3B8' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: isDark ? '#0F172A' : '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: isDark ? '#334155' : '#E2E8F0' },
  modalTitle: { fontSize: 18, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
  modalBody: { padding: 20 },
  inputLabel: { fontSize: 13, fontWeight: '500', color: isDark ? '#94A3B8' : '#64748B', marginBottom: 6 },
  input: { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderRadius: 10, padding: 12, fontSize: 15, color: isDark ? '#FFFFFF' : '#0F172A', borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0', marginBottom: 16 },
  typeSelector: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeOption: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', backgroundColor: isDark ? '#0F172A' : '#F1F5F9' },
  typeOptionText: { fontSize: 13, fontWeight: '500', color: isDark ? '#94A3B8' : '#64748B' },
  modalFooter: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: isDark ? '#334155' : '#E2E8F0' },
  cancelButton: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', backgroundColor: isDark ? '#0F172A' : '#F1F5F9' },
  cancelButtonText: { fontSize: 15, fontWeight: '600', color: isDark ? '#94A3B8' : '#64748B' },
  submitButton: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  submitButtonText: { fontSize: 15, fontWeight: '600' },
});
