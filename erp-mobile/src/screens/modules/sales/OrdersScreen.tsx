/**
 * Sales Orders Screen
 * Full CRUD functionality for managing orders
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
  Users,
  FileText,
  ShoppingCart,
  UserPlus,
  Package,
  Briefcase,
  Building2,
  Settings,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  X,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// Sales navigation items
const salesNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'Sales' },
  { id: 'customers', label: 'Customers', icon: Users, screenName: 'SalesCustomers' },
  { id: 'leads', label: 'Leads', icon: UserPlus, screenName: 'SalesLeads' },
  { id: 'quotations', label: 'Quotations', icon: FileText, screenName: 'SalesQuotations' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, screenName: 'SalesOrders' },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    children: [
      { id: 'product-list', label: 'Product List', screenName: 'SalesProducts' },
      { id: 'product-categories', label: 'Categories', screenName: 'SalesProductCategories' },
      { id: 'inventory', label: 'Inventory', screenName: 'SalesInventory' },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    icon: Briefcase,
    children: [
      { id: 'service-list', label: 'Service List', screenName: 'SalesServices' },
      { id: 'service-categories', label: 'Categories', screenName: 'SalesServiceCategories' },
      { id: 'delivery', label: 'Delivery', screenName: 'SalesDelivery' },
    ],
  },
  { id: 'bank', label: 'Bank Management', icon: Building2, screenName: 'SalesBank' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'SalesSettings' },
];

interface OrderItem {
  product: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial';
  orderDate: string;
  deliveryDate: string;
}

const initialOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'Acme Corporation',
    customerEmail: 'orders@acme.com',
    shippingAddress: '123 Business Park, Lagos',
    items: [
      { product: 'Enterprise License', quantity: 5, unitPrice: 1200 },
      { product: 'Support Package', quantity: 1, unitPrice: 500 },
    ],
    subtotal: 6500,
    shipping: 0,
    tax: 487.5,
    total: 6987.5,
    status: 'Delivered',
    paymentStatus: 'Paid',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-18',
  },
  {
    id: 'ORD-002',
    customer: 'TechStart Inc',
    customerEmail: 'purchasing@techstart.com',
    shippingAddress: '45 Tech Avenue, Abuja',
    items: [
      { product: 'Cloud Hosting', quantity: 12, unitPrice: 200 },
    ],
    subtotal: 2400,
    shipping: 0,
    tax: 180,
    total: 2580,
    status: 'Processing',
    paymentStatus: 'Paid',
    orderDate: '2024-01-17',
    deliveryDate: '2024-01-25',
  },
  {
    id: 'ORD-003',
    customer: 'Global Enterprises',
    customerEmail: 'procurement@globalent.com',
    shippingAddress: '78 Corporate Drive, Port Harcourt',
    items: [
      { product: 'Hardware Bundle', quantity: 10, unitPrice: 850 },
      { product: 'Installation', quantity: 10, unitPrice: 100 },
    ],
    subtotal: 9500,
    shipping: 250,
    tax: 712.5,
    total: 10462.5,
    status: 'Shipped',
    paymentStatus: 'Partial',
    orderDate: '2024-01-16',
    deliveryDate: '2024-01-22',
  },
  {
    id: 'ORD-004',
    customer: 'Local Shop Ltd',
    customerEmail: 'orders@localshop.com',
    shippingAddress: '12 Market Street, Kano',
    items: [
      { product: 'POS Terminal', quantity: 2, unitPrice: 450 },
    ],
    subtotal: 900,
    shipping: 50,
    tax: 67.5,
    total: 1017.5,
    status: 'Pending',
    paymentStatus: 'Unpaid',
    orderDate: '2024-01-18',
    deliveryDate: '2024-01-28',
  },
];

const orderStatuses: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const paymentStatuses: Order['paymentStatus'][] = ['Paid', 'Unpaid', 'Partial'];

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    customer: '',
    customerEmail: '',
    shippingAddress: '',
    productName: '',
    quantity: '',
    unitPrice: '',
    shipping: '0',
  });

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      customer: '',
      customerEmail: '',
      shippingAddress: '',
      productName: '',
      quantity: '',
      unitPrice: '',
      shipping: '0',
    });
    setEditMode(false);
    setSelectedOrder(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (order: Order) => {
    setFormData({
      customer: order.customer,
      customerEmail: order.customerEmail,
      shippingAddress: order.shippingAddress,
      productName: order.items[0]?.product || '',
      quantity: order.items[0]?.quantity.toString() || '',
      unitPrice: order.items[0]?.unitPrice.toString() || '',
      shipping: order.shipping.toString(),
    });
    setSelectedOrder(order);
    setEditMode(true);
    setMenuVisible(false);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.customer || !formData.customerEmail || !formData.productName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const quantity = parseInt(formData.quantity) || 1;
    const unitPrice = parseFloat(formData.unitPrice) || 0;
    const shipping = parseFloat(formData.shipping) || 0;
    const subtotal = quantity * unitPrice;
    const tax = subtotal * 0.075;
    const total = subtotal + shipping + tax;

    if (editMode && selectedOrder) {
      setOrders(
        orders.map((o) =>
          o.id === selectedOrder.id
            ? {
                ...o,
                customer: formData.customer,
                customerEmail: formData.customerEmail,
                shippingAddress: formData.shippingAddress,
                items: [{ product: formData.productName, quantity, unitPrice }],
                subtotal,
                shipping,
                tax,
                total,
              }
            : o
        )
      );
      Alert.alert('Success', 'Order updated successfully');
    } else {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 7);

      const newOrder: Order = {
        id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
        customer: formData.customer,
        customerEmail: formData.customerEmail,
        shippingAddress: formData.shippingAddress,
        items: [{ product: formData.productName, quantity, unitPrice }],
        subtotal,
        shipping,
        tax,
        total,
        status: 'Pending',
        paymentStatus: 'Unpaid',
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: deliveryDate.toISOString().split('T')[0],
      };
      setOrders([newOrder, ...orders]);
      Alert.alert('Success', 'Order created successfully');
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDelete = (order: Order) => {
    Alert.alert('Delete Order', `Are you sure you want to delete ${order.id}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setOrders(orders.filter((o) => o.id !== order.id));
          setMenuVisible(false);
          Alert.alert('Success', 'Order deleted successfully');
        },
      },
    ]);
  };

  const handleUpdateStatus = (order: Order, newStatus: Order['status']) => {
    setOrders(
      orders.map((o) =>
        o.id === order.id ? { ...o, status: newStatus } : o
      )
    );
    setMenuVisible(false);
    Alert.alert('Success', `Order status updated to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#F59E0B';
      case 'Processing':
        return '#3B82F6';
      case 'Shipped':
        return '#8B5CF6';
      case 'Delivered':
        return '#10B981';
      case 'Cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return '#10B981';
      case 'Unpaid':
        return '#EF4444';
      case 'Partial':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return Clock;
      case 'Processing':
        return Package;
      case 'Shipped':
        return Truck;
      case 'Delivered':
        return CheckCircle;
      case 'Cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const StatusIcon = getStatusIcon(item.status);
    return (
      <TouchableOpacity style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.orderCustomer}>{item.customer}</Text>
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

        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <MapPin size={14} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text style={styles.detailText} numberOfLines={1}>{item.shippingAddress}</Text>
          </View>
          <View style={styles.detailRow}>
            <Calendar size={14} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text style={styles.detailText}>Order: {item.orderDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Truck size={14} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text style={styles.detailText}>Delivery: {item.deliveryDate}</Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          {item.items.map((orderItem, index) => (
            <Text key={index} style={styles.itemText} numberOfLines={1}>
              {orderItem.quantity}x {orderItem.product} @ ${orderItem.unitPrice}
            </Text>
          ))}
        </View>

        <View style={styles.orderTotal}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${item.total.toLocaleString()}</Text>
        </View>

        <View style={styles.orderFooter}>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <StatusIcon size={12} color={getStatusColor(item.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
          </View>
          <View style={[styles.paymentBadge, { backgroundColor: `${getPaymentColor(item.paymentStatus)}20` }]}>
            <DollarSign size={12} color={getPaymentColor(item.paymentStatus)} />
            <Text style={[styles.paymentText, { color: getPaymentColor(item.paymentStatus) }]}>
              {item.paymentStatus}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ModuleLayout moduleId="sales" navItems={salesNavItems} activeScreen="SalesOrders" title="Orders">
      <View style={styles.container}>
        {/* Search and Add */}
        <View style={styles.toolbar}>
          <View style={styles.searchContainer}>
            <Search size={18} color={isDark ? '#64748B' : '#94A3B8'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search orders..."
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
          {['All', ...orderStatuses].map((status) => (
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

        {/* Orders List */}
        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <ShoppingCart size={48} color={isDark ? '#334155' : '#CBD5E1'} />
              <Text style={styles.emptyText}>No orders found</Text>
            </View>
          }
        />
      </View>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editMode ? 'Edit Order' : 'Create Order'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Customer Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.customer}
                  onChangeText={(text) => setFormData({ ...formData, customer: text })}
                  placeholder="Enter customer name"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Customer Email *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.customerEmail}
                  onChangeText={(text) => setFormData({ ...formData, customerEmail: text })}
                  placeholder="Enter customer email"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Shipping Address</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={formData.shippingAddress}
                  onChangeText={(text) => setFormData({ ...formData, shippingAddress: text })}
                  placeholder="Enter shipping address"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  multiline
                  numberOfLines={2}
                />
              </View>

              <Text style={styles.sectionLabel}>Order Item</Text>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Product Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.productName}
                  onChangeText={(text) => setFormData({ ...formData, productName: text })}
                  placeholder="Product name"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Quantity</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.quantity}
                    onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                    placeholder="1"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Unit Price ($)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.unitPrice}
                    onChangeText={(text) => setFormData({ ...formData, unitPrice: text })}
                    placeholder="0.00"
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Shipping Cost ($)</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.shipping}
                  onChangeText={(text) => setFormData({ ...formData, shipping: text })}
                  placeholder="0.00"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="numeric"
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
              onPress={() => selectedOrder && openEditModal(selectedOrder)}
            >
              <Edit size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
              <Text style={styles.menuItemText}>Edit Order</Text>
            </TouchableOpacity>

            {selectedOrder?.status !== 'Delivered' && selectedOrder?.status !== 'Cancelled' && (
              <>
                <View style={styles.menuDivider} />
                <Text style={styles.menuLabel}>Update Status</Text>
                {orderStatuses
                  .filter((s) => s !== selectedOrder?.status)
                  .map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={styles.menuItem}
                      onPress={() => selectedOrder && handleUpdateStatus(selectedOrder, status)}
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
      backgroundColor: '#2196F3',
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
      backgroundColor: '#2196F3',
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
    orderId: {
      fontSize: 14,
      fontWeight: '600',
      color: '#2196F3',
      marginBottom: 2,
    },
    orderCustomer: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    menuButton: {
      padding: 8,
    },
    orderDetails: {
      gap: 6,
      marginBottom: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    detailText: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
      flex: 1,
    },
    orderItems: {
      marginBottom: 12,
    },
    itemText: {
      fontSize: 13,
      color: isDark ? '#CBD5E1' : '#475569',
      marginBottom: 4,
    },
    orderTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      marginBottom: 12,
    },
    totalLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    totalValue: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
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
    paymentBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
    },
    paymentText: {
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
    textArea: {
      minHeight: 60,
      textAlignVertical: 'top',
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
      backgroundColor: '#2196F3',
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
