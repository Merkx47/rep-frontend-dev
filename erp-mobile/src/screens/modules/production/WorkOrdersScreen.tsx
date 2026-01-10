/**
 * Production Work Orders Screen
 * Full CRUD functionality for managing work orders
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
  Calendar,
  Clock,
  Package,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  Factory,
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

interface WorkOrder {
  id: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  completedQty: number;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Planned' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  startDate: string;
  dueDate: string;
  assignedTo: string;
  notes: string;
}

const initialWorkOrders: WorkOrder[] = [
  {
    id: '1',
    orderNumber: 'WO-001',
    productName: 'Widget Assembly A',
    quantity: 500,
    completedQty: 350,
    priority: 'High',
    status: 'In Progress',
    startDate: '2024-01-15',
    dueDate: '2024-01-25',
    assignedTo: 'Production Team A',
    notes: 'Rush order for client XYZ',
  },
  {
    id: '2',
    orderNumber: 'WO-002',
    productName: 'Component B-12',
    quantity: 1000,
    completedQty: 1000,
    priority: 'Medium',
    status: 'Completed',
    startDate: '2024-01-10',
    dueDate: '2024-01-20',
    assignedTo: 'Production Team B',
    notes: 'Standard production run',
  },
  {
    id: '3',
    orderNumber: 'WO-003',
    productName: 'Custom Part C-45',
    quantity: 200,
    completedQty: 0,
    priority: 'Urgent',
    status: 'Planned',
    startDate: '2024-01-22',
    dueDate: '2024-01-28',
    assignedTo: 'Production Team A',
    notes: 'New product line',
  },
  {
    id: '4',
    orderNumber: 'WO-004',
    productName: 'Assembly Kit D',
    quantity: 150,
    completedQty: 75,
    priority: 'Low',
    status: 'On Hold',
    startDate: '2024-01-12',
    dueDate: '2024-01-30',
    assignedTo: 'Production Team C',
    notes: 'Waiting for materials',
  },
];

const priorities: WorkOrder['priority'][] = ['Low', 'Medium', 'High', 'Urgent'];
const statuses: WorkOrder['status'][] = ['Planned', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];

export default function WorkOrdersScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    priority: 'Medium' as WorkOrder['priority'],
    startDate: '',
    dueDate: '',
    assignedTo: '',
    notes: '',
  });

  const filteredOrders = workOrders.filter((order) => {
    const matchesSearch =
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      productName: '',
      quantity: '',
      priority: 'Medium',
      startDate: '',
      dueDate: '',
      assignedTo: '',
      notes: '',
    });
    setEditMode(false);
    setSelectedOrder(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (order: WorkOrder) => {
    setFormData({
      productName: order.productName,
      quantity: order.quantity.toString(),
      priority: order.priority,
      startDate: order.startDate,
      dueDate: order.dueDate,
      assignedTo: order.assignedTo,
      notes: order.notes,
    });
    setSelectedOrder(order);
    setEditMode(true);
    setMenuVisible(false);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.productName || !formData.quantity || !formData.dueDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (editMode && selectedOrder) {
      setWorkOrders(
        workOrders.map((o) =>
          o.id === selectedOrder.id
            ? {
                ...o,
                ...formData,
                quantity: parseInt(formData.quantity) || 0,
              }
            : o
        )
      );
      Alert.alert('Success', 'Work order updated successfully');
    } else {
      const newOrder: WorkOrder = {
        id: String(workOrders.length + 1),
        orderNumber: `WO-${String(workOrders.length + 1).padStart(3, '0')}`,
        productName: formData.productName,
        quantity: parseInt(formData.quantity) || 0,
        completedQty: 0,
        priority: formData.priority,
        status: 'Planned',
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        dueDate: formData.dueDate,
        assignedTo: formData.assignedTo,
        notes: formData.notes,
      };
      setWorkOrders([newOrder, ...workOrders]);
      Alert.alert('Success', 'Work order created successfully');
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDelete = (order: WorkOrder) => {
    Alert.alert('Delete Work Order', `Are you sure you want to delete ${order.orderNumber}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setWorkOrders(workOrders.filter((o) => o.id !== order.id));
          setMenuVisible(false);
          Alert.alert('Success', 'Work order deleted successfully');
        },
      },
    ]);
  };

  const handleStatusChange = (order: WorkOrder, newStatus: WorkOrder['status']) => {
    setWorkOrders(
      workOrders.map((o) =>
        o.id === order.id ? { ...o, status: newStatus } : o
      )
    );
    setMenuVisible(false);
    Alert.alert('Success', `Work order status updated to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planned':
        return '#6B7280';
      case 'In Progress':
        return '#3B82F6';
      case 'On Hold':
        return '#F59E0B';
      case 'Completed':
        return '#10B981';
      case 'Cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low':
        return '#6B7280';
      case 'Medium':
        return '#3B82F6';
      case 'High':
        return '#F59E0B';
      case 'Urgent':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Planned':
        return Calendar;
      case 'In Progress':
        return Play;
      case 'On Hold':
        return Pause;
      case 'Completed':
        return CheckCircle;
      case 'Cancelled':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const renderOrder = ({ item }: { item: WorkOrder }) => {
    const StatusIcon = getStatusIcon(item.status);
    const progress = (item.completedQty / item.quantity) * 100;

    return (
      <TouchableOpacity style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            <Text style={styles.productName}>{item.productName}</Text>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setSelectedOrder(item);
              setMenuVisible(true);
            }}
          >
            <MoreVertical size={18} color={isDark ? '#64748B' : '#94A3B8'} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressText}>
              {item.completedQty} / {item.quantity} ({progress.toFixed(0)}%)
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Calendar size={14} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text style={styles.detailText}>Due: {item.dueDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Factory size={14} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text style={styles.detailText}>{item.assignedTo}</Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <StatusIcon size={12} color={getStatusColor(item.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(item.priority)}20` }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
              {item.priority}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ModuleLayout
      moduleId="production"
      navItems={productionNavItems}
      activeScreen="ProductionWorkOrders"
      title="Work Orders"
    >
      <View style={styles.container}>
        {/* Search and Add */}
        <View style={styles.toolbar}>
          <View style={styles.searchContainer}>
            <Search size={18} color={isDark ? '#64748B' : '#94A3B8'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search work orders..."
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
          {['All', ...statuses].map((status) => (
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

        {/* Work Orders List */}
        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <ClipboardList size={48} color={isDark ? '#334155' : '#CBD5E1'} />
              <Text style={styles.emptyText}>No work orders found</Text>
            </View>
          }
        />
      </View>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editMode ? 'Edit Work Order' : 'New Work Order'}</Text>
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
                <Text style={styles.formLabel}>Quantity *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.quantity}
                  onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                  placeholder="Enter quantity"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Priority</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.chipContainer}>
                    {priorities.map((priority) => (
                      <TouchableOpacity
                        key={priority}
                        style={[
                          styles.chip,
                          formData.priority === priority && {
                            backgroundColor: getPriorityColor(priority),
                            borderColor: getPriorityColor(priority),
                          },
                        ]}
                        onPress={() => setFormData({ ...formData, priority })}
                      >
                        <Text
                          style={[styles.chipText, formData.priority === priority && { color: '#FFFFFF' }]}
                        >
                          {priority}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Start Date</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.startDate}
                    onChangeText={(text) => setFormData({ ...formData, startDate: text })}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Due Date *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.dueDate}
                    onChangeText={(text) => setFormData({ ...formData, dueDate: text })}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Assigned To</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.assignedTo}
                  onChangeText={(text) => setFormData({ ...formData, assignedTo: text })}
                  placeholder="Team or person"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Notes</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={formData.notes}
                  onChangeText={(text) => setFormData({ ...formData, notes: text })}
                  placeholder="Additional notes..."
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
        <View style={styles.menuOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => selectedOrder && openEditModal(selectedOrder)}
            >
              <Edit size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
              <Text style={styles.menuItemText}>Edit Order</Text>
            </TouchableOpacity>

            {selectedOrder?.status !== 'Completed' && selectedOrder?.status !== 'Cancelled' && (
              <>
                <View style={styles.menuDivider} />
                <Text style={styles.menuLabel}>Update Status</Text>
                {statuses
                  .filter((s) => s !== selectedOrder?.status)
                  .map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={styles.menuItem}
                      onPress={() => selectedOrder && handleStatusChange(selectedOrder, status)}
                    >
                      {React.createElement(getStatusIcon(status), {
                        size: 18,
                        color: getStatusColor(status),
                      })}
                      <Text style={[styles.menuItemText, { color: getStatusColor(status) }]}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </>
            )}

            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => selectedOrder && handleDelete(selectedOrder)}
            >
              <Trash2 size={18} color="#EF4444" />
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Delete Order</Text>
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
    orderCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    orderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    orderNumber: {
      fontSize: 13,
      fontWeight: '600',
      color: '#9C27B0',
      marginBottom: 2,
    },
    productName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    menuButton: {
      padding: 8,
    },
    progressSection: {
      marginBottom: 12,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    progressLabel: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    progressText: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    progressBar: {
      height: 6,
      backgroundColor: isDark ? '#334155' : '#E2E8F0',
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#9C27B0',
      borderRadius: 3,
    },
    orderDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    detailText: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    orderFooter: {
      flexDirection: 'row',
      gap: 8,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    priorityBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    priorityText: {
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
      maxHeight: '70%',
    },
    menuLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#64748B' : '#94A3B8',
      paddingHorizontal: 12,
      paddingVertical: 8,
      textTransform: 'uppercase',
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
