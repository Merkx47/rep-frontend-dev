/**
 * Production Bill of Materials Screen
 * Manage product BOMs and components
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
  FlatList,
  Alert,
} from 'react-native';
import {
  LayoutDashboard,
  ClipboardList,
  Layers,
  CheckSquare,
  Settings,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  X,
  Package,
  ChevronRight,
  Copy,
  Eye,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// Production navigation items
const productionNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'Production' },
  { id: 'work-orders', label: 'Work Orders', icon: ClipboardList, screenName: 'ProductionWorkOrders' },
  { id: 'bom', label: 'Bill of Materials', icon: Layers, screenName: 'ProductionBOM' },
  { id: 'quality', label: 'Quality Control', icon: CheckSquare, screenName: 'ProductionQuality' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'ProductionSettings' },
];

interface Component {
  name: string;
  quantity: number;
  unit: string;
  cost: number;
}

interface BOM {
  id: string;
  bomNumber: string;
  productName: string;
  version: string;
  components: Component[];
  totalCost: number;
  status: 'Draft' | 'Active' | 'Obsolete';
  createdAt: string;
  updatedAt: string;
}

const initialBOMs: BOM[] = [
  {
    id: '1',
    bomNumber: 'BOM-001',
    productName: 'Widget Assembly A',
    version: '1.2',
    components: [
      { name: 'Base Plate', quantity: 1, unit: 'pcs', cost: 15.00 },
      { name: 'Screw M4', quantity: 8, unit: 'pcs', cost: 0.25 },
      { name: 'Connector Cable', quantity: 2, unit: 'pcs', cost: 5.50 },
      { name: 'Housing Cover', quantity: 1, unit: 'pcs', cost: 12.00 },
    ],
    totalCost: 40.00,
    status: 'Active',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    bomNumber: 'BOM-002',
    productName: 'Component B-12',
    version: '2.0',
    components: [
      { name: 'Circuit Board PCB', quantity: 1, unit: 'pcs', cost: 8.50 },
      { name: 'Resistor 10K', quantity: 12, unit: 'pcs', cost: 0.05 },
      { name: 'Capacitor 100uF', quantity: 4, unit: 'pcs', cost: 0.30 },
      { name: 'LED Indicator', quantity: 3, unit: 'pcs', cost: 0.45 },
    ],
    totalCost: 11.95,
    status: 'Active',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12',
  },
  {
    id: '3',
    bomNumber: 'BOM-003',
    productName: 'Custom Part C-45',
    version: '1.0',
    components: [
      { name: 'Aluminum Rod', quantity: 1, unit: 'meter', cost: 12.00 },
      { name: 'Bearing 6201', quantity: 2, unit: 'pcs', cost: 3.50 },
      { name: 'Seal Ring', quantity: 2, unit: 'pcs', cost: 1.25 },
    ],
    totalCost: 21.50,
    status: 'Draft',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18',
  },
  {
    id: '4',
    bomNumber: 'BOM-004',
    productName: 'Assembly Kit D (Old)',
    version: '1.5',
    components: [
      { name: 'Motor DC 12V', quantity: 1, unit: 'pcs', cost: 25.00 },
      { name: 'Gear Set', quantity: 1, unit: 'set', cost: 18.00 },
    ],
    totalCost: 43.00,
    status: 'Obsolete',
    createdAt: '2023-06-15',
    updatedAt: '2024-01-05',
  },
];

const bomStatuses: BOM['status'][] = ['Draft', 'Active', 'Obsolete'];

export default function BOMScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [boms, setBOMs] = useState<BOM[]>(initialBOMs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedBOM, setSelectedBOM] = useState<BOM | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    productName: '',
    version: '1.0',
    componentName: '',
    componentQty: '',
    componentUnit: 'pcs',
    componentCost: '',
  });

  const filteredBOMs = boms.filter((bom) => {
    const matchesSearch =
      bom.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bom.bomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || bom.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      productName: '',
      version: '1.0',
      componentName: '',
      componentQty: '',
      componentUnit: 'pcs',
      componentCost: '',
    });
    setEditMode(false);
    setSelectedBOM(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const handleViewDetails = (bom: BOM) => {
    setSelectedBOM(bom);
    setDetailModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.productName) {
      Alert.alert('Error', 'Please enter a product name');
      return;
    }

    const newBOM: BOM = {
      id: String(boms.length + 1),
      bomNumber: `BOM-${String(boms.length + 1).padStart(3, '0')}`,
      productName: formData.productName,
      version: formData.version,
      components: formData.componentName
        ? [
            {
              name: formData.componentName,
              quantity: parseInt(formData.componentQty) || 1,
              unit: formData.componentUnit,
              cost: parseFloat(formData.componentCost) || 0,
            },
          ]
        : [],
      totalCost: parseFloat(formData.componentCost) || 0,
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setBOMs([newBOM, ...boms]);
    setModalVisible(false);
    resetForm();
    Alert.alert('Success', 'BOM created successfully');
  };

  const handleDelete = (bom: BOM) => {
    Alert.alert('Delete BOM', `Are you sure you want to delete ${bom.bomNumber}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setBOMs(boms.filter((b) => b.id !== bom.id));
          setMenuVisible(false);
          Alert.alert('Success', 'BOM deleted successfully');
        },
      },
    ]);
  };

  const handleDuplicate = (bom: BOM) => {
    const newBOM: BOM = {
      ...bom,
      id: String(boms.length + 1),
      bomNumber: `BOM-${String(boms.length + 1).padStart(3, '0')}`,
      productName: `${bom.productName} (Copy)`,
      version: '1.0',
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setBOMs([newBOM, ...boms]);
    setMenuVisible(false);
    Alert.alert('Success', 'BOM duplicated successfully');
  };

  const handleStatusChange = (bom: BOM, newStatus: BOM['status']) => {
    setBOMs(
      boms.map((b) =>
        b.id === bom.id ? { ...b, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : b
      )
    );
    setMenuVisible(false);
    Alert.alert('Success', `BOM status updated to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return '#6B7280';
      case 'Active':
        return '#10B981';
      case 'Obsolete':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const renderBOM = ({ item }: { item: BOM }) => (
    <TouchableOpacity style={styles.bomCard} onPress={() => handleViewDetails(item)}>
      <View style={styles.bomHeader}>
        <View style={styles.bomIcon}>
          <Layers size={20} color="#9C27B0" />
        </View>
        <View style={styles.bomInfo}>
          <View style={styles.bomTitleRow}>
            <Text style={styles.bomNumber}>{item.bomNumber}</Text>
            <Text style={styles.bomVersion}>v{item.version}</Text>
          </View>
          <Text style={styles.bomProduct}>{item.productName}</Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            setSelectedBOM(item);
            setMenuVisible(true);
          }}
        >
          <MoreVertical size={18} color={isDark ? '#64748B' : '#94A3B8'} />
        </TouchableOpacity>
      </View>

      <View style={styles.bomDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Components</Text>
          <Text style={styles.detailValue}>{item.components.length}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Total Cost</Text>
          <Text style={styles.detailValue}>${item.totalCost.toFixed(2)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Updated</Text>
          <Text style={styles.detailValue}>{item.updatedAt}</Text>
        </View>
      </View>

      <View style={styles.bomFooter}>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
        <ChevronRight size={18} color={isDark ? '#64748B' : '#94A3B8'} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ModuleLayout
      moduleId="production"
      navItems={productionNavItems}
      activeScreen="ProductionBOM"
      title="Bill of Materials"
    >
      <View style={styles.container}>
        {/* Search and Add */}
        <View style={styles.toolbar}>
          <View style={styles.searchContainer}>
            <Search size={18} color={isDark ? '#64748B' : '#94A3B8'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search BOMs..."
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
          {['All', ...bomStatuses].map((status) => (
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

        {/* BOMs List */}
        <FlatList
          data={filteredBOMs}
          renderItem={renderBOM}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Layers size={48} color={isDark ? '#334155' : '#CBD5E1'} />
              <Text style={styles.emptyText}>No BOMs found</Text>
            </View>
          }
        />
      </View>

      {/* Add Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Bill of Materials</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Product Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.productName}
                  onChangeText={(text) => setFormData({ ...formData, productName: text })}
                  placeholder="Enter product name"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Version</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.version}
                  onChangeText={(text) => setFormData({ ...formData, version: text })}
                  placeholder="1.0"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

              <Text style={styles.sectionLabel}>Initial Component (Optional)</Text>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Component Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.componentName}
                  onChangeText={(text) => setFormData({ ...formData, componentName: text })}
                  placeholder="Component name"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Quantity</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.componentQty}
                    onChangeText={(text) => setFormData({ ...formData, componentQty: text })}
                    placeholder="1"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Unit Cost ($)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.componentCost}
                    onChangeText={(text) => setFormData({ ...formData, componentCost: text })}
                    placeholder="0.00"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    keyboardType="numeric"
                  />
                </View>
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
                <Text style={styles.saveButtonText}>Create BOM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Detail Modal */}
      <Modal
        visible={detailModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedBOM?.bomNumber}</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            {selectedBOM && (
              <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.productHeader}>
                  <Text style={styles.productTitle}>{selectedBOM.productName}</Text>
                  <Text style={styles.productVersion}>Version {selectedBOM.version}</Text>
                </View>

                <Text style={styles.componentTitle}>Components ({selectedBOM.components.length})</Text>

                {selectedBOM.components.map((component, index) => (
                  <View key={index} style={styles.componentRow}>
                    <View style={styles.componentInfo}>
                      <Package size={16} color="#9C27B0" />
                      <Text style={styles.componentName}>{component.name}</Text>
                    </View>
                    <View style={styles.componentDetails}>
                      <Text style={styles.componentQty}>
                        {component.quantity} {component.unit}
                      </Text>
                      <Text style={styles.componentCost}>${component.cost.toFixed(2)}</Text>
                    </View>
                  </View>
                ))}

                <View style={styles.totalSection}>
                  <Text style={styles.totalLabel}>Total Material Cost</Text>
                  <Text style={styles.totalValue}>${selectedBOM.totalCost.toFixed(2)}</Text>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDetailModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]}>
                <Edit size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Edit BOM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Action Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.menuOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                selectedBOM && handleViewDetails(selectedBOM);
              }}
            >
              <Eye size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
              <Text style={styles.menuItemText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => selectedBOM && handleDuplicate(selectedBOM)}
            >
              <Copy size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
              <Text style={styles.menuItemText}>Duplicate</Text>
            </TouchableOpacity>

            {selectedBOM?.status !== 'Active' && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => selectedBOM && handleStatusChange(selectedBOM, 'Active')}
              >
                <Layers size={18} color="#10B981" />
                <Text style={[styles.menuItemText, { color: '#10B981' }]}>Set Active</Text>
              </TouchableOpacity>
            )}

            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => selectedBOM && handleDelete(selectedBOM)}
            >
              <Trash2 size={18} color="#EF4444" />
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Delete BOM</Text>
            </TouchableOpacity>
          </View>
        </View>
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
      backgroundColor: '#9C27B0',
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
      backgroundColor: '#9C27B0',
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
    bomCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    bomHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    bomIcon: {
      width: 44,
      height: 44,
      borderRadius: 10,
      backgroundColor: isDark ? '#9C27B020' : '#9C27B010',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    bomInfo: {
      flex: 1,
    },
    bomTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 2,
    },
    bomNumber: {
      fontSize: 13,
      fontWeight: '600',
      color: '#9C27B0',
    },
    bomVersion: {
      fontSize: 11,
      color: isDark ? '#64748B' : '#94A3B8',
      backgroundColor: isDark ? '#334155' : '#F1F5F9',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    bomProduct: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    menuButton: {
      padding: 8,
    },
    bomDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      marginBottom: 12,
    },
    detailItem: {
      alignItems: 'center',
    },
    detailLabel: {
      fontSize: 11,
      color: isDark ? '#64748B' : '#94A3B8',
      marginBottom: 2,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    bomFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
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
      maxHeight: '85%',
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
    detailContainer: {
      padding: 20,
    },
    productHeader: {
      marginBottom: 20,
    },
    productTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 4,
    },
    productVersion: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    componentTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 12,
    },
    componentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    componentInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    componentName: {
      fontSize: 14,
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    componentDetails: {
      alignItems: 'flex-end',
    },
    componentQty: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    componentCost: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    totalSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
      paddingTop: 16,
      borderTopWidth: 2,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    totalLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    totalValue: {
      fontSize: 20,
      fontWeight: '700',
      color: '#9C27B0',
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
      flexDirection: 'row',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
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
      backgroundColor: '#9C27B0',
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
