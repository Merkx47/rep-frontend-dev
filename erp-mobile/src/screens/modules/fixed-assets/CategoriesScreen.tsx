/**
 * Asset Categories Screen
 * Manage asset categories and depreciation methods
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
  Package,
  Layers,
  TrendingDown,
  Settings,
  LayoutDashboard,
  Edit,
  Trash2,
  Laptop,
  Building,
  Car,
  Sofa,
  Cog,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

const fixedAssetsNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'FixedAssets' },
  { id: 'register', label: 'Asset Register', icon: Package, screenName: 'FixedAssetsList' },
  { id: 'categories', label: 'Categories', icon: Layers, screenName: 'FixedAssetsCategories' },
  { id: 'depreciation', label: 'Depreciation', icon: TrendingDown, screenName: 'FixedAssetsDepreciation' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'FixedAssetsSettings' },
];

interface Category {
  id: string;
  name: string;
  code: string;
  depreciationMethod: 'Straight Line' | 'Declining Balance' | 'Units of Production';
  depreciationRate: number;
  usefulLife: number;
  assetCount: number;
  totalValue: number;
  icon: string;
}

const initialCategories: Category[] = [
  { id: '1', name: 'IT Equipment', code: 'IT', depreciationMethod: 'Straight Line', depreciationRate: 20, usefulLife: 5, assetCount: 45, totalValue: 230000, icon: 'laptop' },
  { id: '2', name: 'Real Estate', code: 'RE', depreciationMethod: 'Straight Line', depreciationRate: 2.5, usefulLife: 40, assetCount: 3, totalValue: 1800000, icon: 'building' },
  { id: '3', name: 'Vehicles', code: 'VH', depreciationMethod: 'Declining Balance', depreciationRate: 25, usefulLife: 4, assetCount: 8, totalValue: 280000, icon: 'car' },
  { id: '4', name: 'Furniture', code: 'FN', depreciationMethod: 'Straight Line', depreciationRate: 10, usefulLife: 10, assetCount: 120, totalValue: 85000, icon: 'sofa' },
  { id: '5', name: 'Machinery', code: 'MC', depreciationMethod: 'Units of Production', depreciationRate: 15, usefulLife: 7, assetCount: 12, totalValue: 450000, icon: 'cog' },
];

const depreciationMethods = ['Straight Line', 'Declining Balance', 'Units of Production'];

export default function CategoriesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    depreciationMethod: 'Straight Line',
    depreciationRate: '',
    usefulLife: '',
  });

  const moduleColor = '#009688';

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'laptop': return Laptop;
      case 'building': return Building;
      case 'car': return Car;
      case 'sofa': return Sofa;
      case 'cog': return Cog;
      default: return Package;
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = () => {
    if (!formData.name || !formData.code) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.name,
      code: formData.code.toUpperCase(),
      depreciationMethod: formData.depreciationMethod as Category['depreciationMethod'],
      depreciationRate: parseFloat(formData.depreciationRate) || 10,
      usefulLife: parseInt(formData.usefulLife) || 5,
      assetCount: 0,
      totalValue: 0,
      icon: 'package',
    };

    setCategories([newCategory, ...categories]);
    resetForm();
    setIsAddModalVisible(false);
  };

  const handleUpdateCategory = () => {
    if (!selectedCategory || !formData.name) return;

    const updated = categories.map(cat =>
      cat.id === selectedCategory.id
        ? {
            ...cat,
            name: formData.name,
            code: formData.code.toUpperCase(),
            depreciationMethod: formData.depreciationMethod as Category['depreciationMethod'],
            depreciationRate: parseFloat(formData.depreciationRate) || cat.depreciationRate,
            usefulLife: parseInt(formData.usefulLife) || cat.usefulLife,
          }
        : cat
    );

    setCategories(updated);
    resetForm();
    setIsAddModalVisible(false);
    setIsEditing(false);
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) return;

    if (selectedCategory.assetCount > 0) {
      Alert.alert('Error', 'Cannot delete category with existing assets');
      return;
    }

    Alert.alert('Delete Category', `Delete "${selectedCategory.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setCategories(categories.filter(c => c.id !== selectedCategory.id));
          setIsActionMenuVisible(false);
        },
      },
    ]);
  };

  const openEditModal = () => {
    if (!selectedCategory) return;
    setFormData({
      name: selectedCategory.name,
      code: selectedCategory.code,
      depreciationMethod: selectedCategory.depreciationMethod,
      depreciationRate: String(selectedCategory.depreciationRate),
      usefulLife: String(selectedCategory.usefulLife),
    });
    setIsEditing(true);
    setIsActionMenuVisible(false);
    setIsAddModalVisible(true);
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', depreciationMethod: 'Straight Line', depreciationRate: '', usefulLife: '' });
    setSelectedCategory(null);
    setIsEditing(false);
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const renderCategory = ({ item }: { item: Category }) => {
    const IconComponent = getIconComponent(item.icon);
    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => {
          setSelectedCategory(item);
          setIsActionMenuVisible(true);
        }}
      >
        <View style={styles.categoryHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: `${moduleColor}15` }]}>
            <IconComponent size={24} color={moduleColor} />
          </View>
          <View style={styles.categoryInfo}>
            <View style={styles.categoryNameRow}>
              <Text style={styles.categoryName}>{item.name}</Text>
              <View style={styles.codeBadge}>
                <Text style={styles.codeText}>{item.code}</Text>
              </View>
            </View>
            <Text style={styles.categoryMethod}>{item.depreciationMethod}</Text>
          </View>
          <MoreVertical size={18} color={isDark ? '#94A3B8' : '#64748B'} />
        </View>

        <View style={styles.categoryDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Assets</Text>
            <Text style={styles.detailValue}>{item.assetCount}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total Value</Text>
            <Text style={styles.detailValue}>{formatCurrency(item.totalValue)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Rate</Text>
            <Text style={styles.detailValue}>{item.depreciationRate}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Life</Text>
            <Text style={styles.detailValue}>{item.usefulLife}y</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ModuleLayout
      moduleId="fixed-assets"
      navItems={fixedAssetsNavItems}
      activeScreen="FixedAssetsCategories"
      title="Asset Categories"
    >
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search categories..."
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: moduleColor }]}
            onPress={() => { resetForm(); setIsAddModalVisible(true); }}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredCategories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <Modal visible={isAddModalVisible} animationType="slide" transparent onRequestClose={() => setIsAddModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{isEditing ? 'Edit Category' : 'Add Category'}</Text>
                <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                  <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.inputLabel}>Category Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="e.g., IT Equipment"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />

                <Text style={styles.inputLabel}>Code *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.code}
                  onChangeText={(text) => setFormData({ ...formData, code: text })}
                  placeholder="e.g., IT"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  maxLength={4}
                  autoCapitalize="characters"
                />

                <Text style={styles.inputLabel}>Depreciation Method</Text>
                <View style={styles.methodOptions}>
                  {depreciationMethods.map(method => (
                    <TouchableOpacity
                      key={method}
                      style={[styles.methodOption, formData.depreciationMethod === method && { backgroundColor: moduleColor, borderColor: moduleColor }]}
                      onPress={() => setFormData({ ...formData, depreciationMethod: method })}
                    >
                      <Text style={[styles.methodOptionText, formData.depreciationMethod === method && { color: '#FFFFFF' }]}>
                        {method}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.row}>
                  <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>Rate (%)</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.depreciationRate}
                      onChangeText={(text) => setFormData({ ...formData, depreciationRate: text })}
                      placeholder="10"
                      placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>Useful Life (years)</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.usefulLife}
                      onChangeText={(text) => setFormData({ ...formData, usefulLife: text })}
                      placeholder="5"
                      placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAddModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: moduleColor }]}
                  onPress={isEditing ? handleUpdateCategory : handleAddCategory}
                >
                  <Text style={styles.submitButtonText}>{isEditing ? 'Update' : 'Add'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={isActionMenuVisible} animationType="fade" transparent onRequestClose={() => setIsActionMenuVisible(false)}>
          <TouchableOpacity style={styles.actionMenuOverlay} activeOpacity={1} onPress={() => setIsActionMenuVisible(false)}>
            <View style={styles.actionMenu}>
              <TouchableOpacity style={styles.actionMenuItem} onPress={openEditModal}>
                <Edit size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
                <Text style={styles.actionMenuText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionMenuItem} onPress={handleDeleteCategory}>
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
    container: { flex: 1 },
    searchContainer: { flexDirection: 'row', padding: 16, gap: 12 },
    searchBar: {
      flex: 1, flexDirection: 'row', alignItems: 'center',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 10, paddingHorizontal: 12,
      borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    searchInput: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, color: isDark ? '#FFFFFF' : '#0F172A', fontSize: 15 },
    addButton: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: 16, gap: 12 },
    categoryCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 12, padding: 16,
      borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    categoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    categoryIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    categoryInfo: { flex: 1 },
    categoryNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    categoryName: { fontSize: 16, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
    codeBadge: { backgroundColor: isDark ? '#0F172A' : '#F1F5F9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    codeText: { fontSize: 11, fontWeight: '600', color: isDark ? '#94A3B8' : '#64748B' },
    categoryMethod: { fontSize: 13, color: isDark ? '#94A3B8' : '#64748B' },
    categoryDetails: { flexDirection: 'row', justifyContent: 'space-between' },
    detailItem: { alignItems: 'center' },
    detailLabel: { fontSize: 11, color: isDark ? '#64748B' : '#94A3B8', marginBottom: 4 },
    detailValue: { fontSize: 14, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%' },
    modalHeader: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20,
      borderBottomWidth: 1, borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    modalTitle: { fontSize: 18, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
    modalBody: { padding: 20 },
    inputLabel: { fontSize: 13, fontWeight: '500', color: isDark ? '#94A3B8' : '#64748B', marginBottom: 6 },
    input: {
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderRadius: 10, padding: 12, fontSize: 15,
      color: isDark ? '#FFFFFF' : '#0F172A', borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0', marginBottom: 16,
    },
    methodOptions: { flexDirection: 'column', gap: 8, marginBottom: 16 },
    methodOption: {
      padding: 12, borderRadius: 8, borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0',
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    },
    methodOptionText: { fontSize: 14, color: isDark ? '#94A3B8' : '#64748B', textAlign: 'center' },
    row: { flexDirection: 'row', gap: 12 },
    halfInput: { flex: 1 },
    modalFooter: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: isDark ? '#334155' : '#E2E8F0' },
    cancelButton: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', backgroundColor: isDark ? '#0F172A' : '#F1F5F9' },
    cancelButtonText: { fontSize: 15, fontWeight: '600', color: isDark ? '#94A3B8' : '#64748B' },
    submitButton: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
    submitButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
    actionMenuOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
    actionMenu: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 16, padding: 8, width: '80%', maxWidth: 300 },
    actionMenuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
    actionMenuText: { fontSize: 15, color: isDark ? '#FFFFFF' : '#0F172A' },
  });
