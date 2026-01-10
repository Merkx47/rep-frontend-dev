/**
 * Asset Register Screen
 * Full CRUD functionality for managing fixed assets
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
  Eye,
  Laptop,
  Building,
  Car,
  Sofa,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

const fixedAssetsNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'FixedAssets' },
  { id: 'register', label: 'Asset Register', icon: Package, screenName: 'FixedAssetsList' },
  { id: 'categories', label: 'Categories', icon: Layers, screenName: 'FixedAssetsCategories' },
  { id: 'depreciation', label: 'Depreciation', icon: TrendingDown, screenName: 'FixedAssetsDepreciation' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'FixedAssetsSettings' },
];

interface Asset {
  id: string;
  assetNumber: string;
  name: string;
  category: string;
  purchaseDate: string;
  purchaseCost: number;
  currentValue: number;
  depreciation: number;
  location: string;
  status: 'Active' | 'Disposed' | 'Under Maintenance';
  usefulLife: number; // years
}

const initialAssets: Asset[] = [
  {
    id: '1',
    assetNumber: 'AST-001',
    name: 'Dell Server Rack',
    category: 'IT Equipment',
    purchaseDate: '2023-01-15',
    purchaseCost: 45000,
    currentValue: 38000,
    depreciation: 750,
    location: 'Server Room',
    status: 'Active',
    usefulLife: 5,
  },
  {
    id: '2',
    assetNumber: 'AST-002',
    name: 'Office Building',
    category: 'Real Estate',
    purchaseDate: '2020-06-01',
    purchaseCost: 1200000,
    currentValue: 1110000,
    depreciation: 2500,
    location: 'Main Office',
    status: 'Active',
    usefulLife: 30,
  },
  {
    id: '3',
    assetNumber: 'AST-003',
    name: 'MacBook Pro Fleet (10 units)',
    category: 'IT Equipment',
    purchaseDate: '2023-06-15',
    purchaseCost: 85000,
    currentValue: 72000,
    depreciation: 1420,
    location: 'Various',
    status: 'Active',
    usefulLife: 3,
  },
  {
    id: '4',
    assetNumber: 'AST-004',
    name: 'Office Furniture Set',
    category: 'Furniture',
    purchaseDate: '2022-03-20',
    purchaseCost: 32000,
    currentValue: 26000,
    depreciation: 267,
    location: 'Main Office',
    status: 'Active',
    usefulLife: 10,
  },
  {
    id: '5',
    assetNumber: 'AST-005',
    name: 'Company Vehicle - Toyota Camry',
    category: 'Vehicles',
    purchaseDate: '2022-01-10',
    purchaseCost: 35000,
    currentValue: 28000,
    depreciation: 583,
    location: 'Parking',
    status: 'Active',
    usefulLife: 5,
  },
];

const categoryFilters = ['All', 'IT Equipment', 'Real Estate', 'Furniture', 'Vehicles'];
const categories = ['IT Equipment', 'Real Estate', 'Furniture', 'Vehicles', 'Machinery'];

export default function AssetRegisterScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'IT Equipment',
    purchaseCost: '',
    location: '',
    usefulLife: '',
  });

  const moduleColor = '#009688';

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'IT Equipment': return Laptop;
      case 'Real Estate': return Building;
      case 'Vehicles': return Car;
      case 'Furniture': return Sofa;
      default: return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#10B981';
      case 'Disposed': return '#EF4444';
      case 'Under Maintenance': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || asset.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalValue = filteredAssets.reduce((sum, a) => sum + a.currentValue, 0);

  const handleAddAsset = () => {
    if (!formData.name || !formData.purchaseCost) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    const cost = parseFloat(formData.purchaseCost);
    const life = parseInt(formData.usefulLife) || 5;
    const newAsset: Asset = {
      id: Date.now().toString(),
      assetNumber: `AST-${String(assets.length + 1).padStart(3, '0')}`,
      name: formData.name,
      category: formData.category,
      purchaseDate: new Date().toISOString().split('T')[0],
      purchaseCost: cost,
      currentValue: cost,
      depreciation: cost / (life * 12),
      location: formData.location,
      status: 'Active',
      usefulLife: life,
    };

    setAssets([newAsset, ...assets]);
    resetForm();
    setIsAddModalVisible(false);
  };

  const handleDeleteAsset = () => {
    if (!selectedAsset) return;

    Alert.alert(
      'Delete Asset',
      `Are you sure you want to delete "${selectedAsset.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAssets(assets.filter(a => a.id !== selectedAsset.id));
            setIsActionMenuVisible(false);
            setSelectedAsset(null);
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'IT Equipment',
      purchaseCost: '',
      location: '',
      usefulLife: '',
    });
    setSelectedAsset(null);
    setIsEditing(false);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
  };

  const renderAsset = ({ item }: { item: Asset }) => {
    const CategoryIcon = getCategoryIcon(item.category);
    return (
      <TouchableOpacity
        style={styles.assetCard}
        onPress={() => {
          setSelectedAsset(item);
          setIsViewModalVisible(true);
        }}
      >
        <View style={styles.assetHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: `${moduleColor}15` }]}>
            <CategoryIcon size={22} color={moduleColor} />
          </View>
          <View style={styles.assetInfo}>
            <Text style={styles.assetNumber}>{item.assetNumber}</Text>
            <Text style={styles.assetName}>{item.name}</Text>
            <Text style={styles.assetCategory}>{item.category}</Text>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setSelectedAsset(item);
              setIsActionMenuVisible(true);
            }}
          >
            <MoreVertical size={18} color={isDark ? '#94A3B8' : '#64748B'} />
          </TouchableOpacity>
        </View>

        <View style={styles.assetDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Current Value</Text>
            <Text style={styles.detailValue}>{formatCurrency(item.currentValue)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Monthly Dep.</Text>
            <Text style={[styles.detailValue, { color: '#F59E0B' }]}>-{formatCurrency(item.depreciation)}</Text>
          </View>
        </View>

        <View style={styles.assetFooter}>
          <Text style={styles.locationText}>{item.location}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ModuleLayout
      moduleId="fixed-assets"
      navItems={fixedAssetsNavItems}
      activeScreen="FixedAssetsList"
      title="Asset Register"
    >
      <View style={styles.container}>
        <View style={styles.totalHeader}>
          <Text style={styles.totalLabel}>Total Asset Value</Text>
          <Text style={styles.totalValue}>{formatCurrency(totalValue)}</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search assets..."
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {categoryFilters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                categoryFilter === filter && { backgroundColor: moduleColor },
              ]}
              onPress={() => setCategoryFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  categoryFilter === filter && { color: '#FFFFFF' },
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={filteredAssets}
          renderItem={renderAsset}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Add Modal */}
        <Modal
          visible={isAddModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsAddModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Asset</Text>
                <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                  <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.inputLabel}>Asset Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="e.g., Dell Server Rack"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />

                <Text style={styles.inputLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryOption,
                        formData.category === cat && { backgroundColor: moduleColor, borderColor: moduleColor },
                      ]}
                      onPress={() => setFormData({ ...formData, category: cat })}
                    >
                      <Text style={[styles.categoryOptionText, formData.category === cat && { color: '#FFFFFF' }]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.inputLabel}>Purchase Cost *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.purchaseCost}
                  onChangeText={(text) => setFormData({ ...formData, purchaseCost: text })}
                  placeholder="0.00"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="numeric"
                />

                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={formData.location}
                  onChangeText={(text) => setFormData({ ...formData, location: text })}
                  placeholder="e.g., Main Office"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />

                <Text style={styles.inputLabel}>Useful Life (years)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.usefulLife}
                  onChangeText={(text) => setFormData({ ...formData, usefulLife: text })}
                  placeholder="5"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="numeric"
                />
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAddModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.submitButton, { backgroundColor: moduleColor }]} onPress={handleAddAsset}>
                  <Text style={styles.submitButtonText}>Add Asset</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* View Modal */}
        <Modal
          visible={isViewModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsViewModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedAsset?.assetNumber}</Text>
                <TouchableOpacity onPress={() => setIsViewModalVisible(false)}>
                  <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              {selectedAsset && (
                <ScrollView style={styles.modalBody}>
                  <Text style={styles.viewAssetName}>{selectedAsset.name}</Text>

                  <View style={styles.viewDetailsGrid}>
                    <View style={styles.viewDetailItem}>
                      <Text style={styles.viewDetailLabel}>Category</Text>
                      <Text style={styles.viewDetailValue}>{selectedAsset.category}</Text>
                    </View>
                    <View style={styles.viewDetailItem}>
                      <Text style={styles.viewDetailLabel}>Status</Text>
                      <Text style={[styles.viewDetailValue, { color: getStatusColor(selectedAsset.status) }]}>
                        {selectedAsset.status}
                      </Text>
                    </View>
                    <View style={styles.viewDetailItem}>
                      <Text style={styles.viewDetailLabel}>Purchase Date</Text>
                      <Text style={styles.viewDetailValue}>{selectedAsset.purchaseDate}</Text>
                    </View>
                    <View style={styles.viewDetailItem}>
                      <Text style={styles.viewDetailLabel}>Location</Text>
                      <Text style={styles.viewDetailValue}>{selectedAsset.location}</Text>
                    </View>
                  </View>

                  <View style={styles.financialCard}>
                    <View style={styles.financialRow}>
                      <Text style={styles.financialLabel}>Purchase Cost</Text>
                      <Text style={styles.financialValue}>{formatCurrency(selectedAsset.purchaseCost)}</Text>
                    </View>
                    <View style={styles.financialRow}>
                      <Text style={styles.financialLabel}>Current Value</Text>
                      <Text style={[styles.financialValue, { color: '#10B981' }]}>{formatCurrency(selectedAsset.currentValue)}</Text>
                    </View>
                    <View style={styles.financialRow}>
                      <Text style={styles.financialLabel}>Monthly Depreciation</Text>
                      <Text style={[styles.financialValue, { color: '#F59E0B' }]}>-{formatCurrency(selectedAsset.depreciation)}</Text>
                    </View>
                    <View style={styles.financialRow}>
                      <Text style={styles.financialLabel}>Useful Life</Text>
                      <Text style={styles.financialValue}>{selectedAsset.usefulLife} years</Text>
                    </View>
                  </View>
                </ScrollView>
              )}

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsViewModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Action Menu */}
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
              <TouchableOpacity style={styles.actionMenuItem} onPress={handleDeleteAsset}>
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
    totalHeader: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      padding: 20,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    totalLabel: { fontSize: 14, color: isDark ? '#94A3B8' : '#64748B', marginBottom: 4 },
    totalValue: { fontSize: 28, fontWeight: '700', color: '#009688' },
    searchContainer: { flexDirection: 'row', padding: 16, gap: 12 },
    searchBar: {
      flex: 1, flexDirection: 'row', alignItems: 'center',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 10, paddingHorizontal: 12,
      borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    searchInput: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, color: isDark ? '#FFFFFF' : '#0F172A', fontSize: 15 },
    addButton: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    filterContainer: { maxHeight: 44 },
    filterContent: { paddingHorizontal: 16, gap: 8 },
    filterChip: {
      paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
      backgroundColor: isDark ? '#1E293B' : '#F1F5F9', marginRight: 8,
    },
    filterText: { fontSize: 13, fontWeight: '500', color: isDark ? '#94A3B8' : '#64748B' },
    listContent: { padding: 16, gap: 12 },
    assetCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 12, padding: 16,
      borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    assetHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    categoryIcon: { width: 48, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    assetInfo: { flex: 1 },
    assetNumber: { fontSize: 12, color: isDark ? '#64748B' : '#94A3B8', marginBottom: 2 },
    assetName: { fontSize: 16, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 2 },
    assetCategory: { fontSize: 13, color: isDark ? '#94A3B8' : '#64748B' },
    menuButton: { padding: 4 },
    assetDetails: { flexDirection: 'row', gap: 24, marginBottom: 12 },
    detailItem: {},
    detailLabel: { fontSize: 11, color: isDark ? '#64748B' : '#94A3B8', marginBottom: 2 },
    detailValue: { fontSize: 16, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
    assetFooter: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingTop: 12, borderTopWidth: 1, borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    locationText: { fontSize: 13, color: isDark ? '#94A3B8' : '#64748B' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 11, fontWeight: '600' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
    modalHeader: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20,
      borderBottomWidth: 1, borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    modalTitle: { fontSize: 18, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
    modalBody: { padding: 20 },
    inputLabel: { fontSize: 13, fontWeight: '500', color: isDark ? '#94A3B8' : '#64748B', marginBottom: 6, marginTop: 8 },
    input: {
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderRadius: 10, padding: 12, fontSize: 15,
      color: isDark ? '#FFFFFF' : '#0F172A', borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0', marginBottom: 8,
    },
    categoryOption: {
      paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, marginRight: 8, marginBottom: 16,
      borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0', backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    },
    categoryOptionText: { fontSize: 13, fontWeight: '500', color: isDark ? '#94A3B8' : '#64748B' },
    modalFooter: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: isDark ? '#334155' : '#E2E8F0' },
    cancelButton: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', backgroundColor: isDark ? '#0F172A' : '#F1F5F9' },
    cancelButtonText: { fontSize: 15, fontWeight: '600', color: isDark ? '#94A3B8' : '#64748B' },
    submitButton: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
    submitButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
    viewAssetName: { fontSize: 20, fontWeight: '700', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 16 },
    viewDetailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 16 },
    viewDetailItem: { width: '45%' },
    viewDetailLabel: { fontSize: 12, color: isDark ? '#64748B' : '#94A3B8', marginBottom: 4 },
    viewDetailValue: { fontSize: 14, fontWeight: '500', color: isDark ? '#FFFFFF' : '#0F172A' },
    financialCard: { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderRadius: 12, padding: 16 },
    financialRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    financialLabel: { fontSize: 14, color: isDark ? '#94A3B8' : '#64748B' },
    financialValue: { fontSize: 14, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
    actionMenuOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
    actionMenu: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 16, padding: 8, width: '80%', maxWidth: 300 },
    actionMenuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
    actionMenuText: { fontSize: 15, color: isDark ? '#FFFFFF' : '#0F172A' },
  });
