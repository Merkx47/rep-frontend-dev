/**
 * Production Quality Control Screen
 * Manage quality inspections and checks
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
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  User,
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

interface QualityCheck {
  id: string;
  checkNumber: string;
  workOrderNumber: string;
  productName: string;
  batchNumber: string;
  inspectorName: string;
  checkDate: string;
  sampleSize: number;
  passedCount: number;
  failedCount: number;
  status: 'Pending' | 'In Progress' | 'Passed' | 'Failed' | 'On Hold';
  notes: string;
  defects: string[];
}

const initialChecks: QualityCheck[] = [
  {
    id: '1',
    checkNumber: 'QC-001',
    workOrderNumber: 'WO-001',
    productName: 'Widget Assembly A',
    batchNumber: 'BATCH-2024-001',
    inspectorName: 'John Smith',
    checkDate: '2024-01-18',
    sampleSize: 50,
    passedCount: 48,
    failedCount: 2,
    status: 'Passed',
    notes: 'Minor cosmetic defects on 2 units',
    defects: ['Surface scratch', 'Color variation'],
  },
  {
    id: '2',
    checkNumber: 'QC-002',
    workOrderNumber: 'WO-002',
    productName: 'Component B-12',
    batchNumber: 'BATCH-2024-002',
    inspectorName: 'Sarah Johnson',
    checkDate: '2024-01-18',
    sampleSize: 100,
    passedCount: 100,
    failedCount: 0,
    status: 'Passed',
    notes: 'All units passed inspection',
    defects: [],
  },
  {
    id: '3',
    checkNumber: 'QC-003',
    workOrderNumber: 'WO-003',
    productName: 'Custom Part C-45',
    batchNumber: 'BATCH-2024-003',
    inspectorName: 'Mike Brown',
    checkDate: '2024-01-17',
    sampleSize: 30,
    passedCount: 0,
    failedCount: 0,
    status: 'Pending',
    notes: 'Awaiting inspection',
    defects: [],
  },
  {
    id: '4',
    checkNumber: 'QC-004',
    workOrderNumber: 'WO-001',
    productName: 'Widget Assembly A',
    batchNumber: 'BATCH-2024-004',
    inspectorName: 'Emily Davis',
    checkDate: '2024-01-16',
    sampleSize: 50,
    passedCount: 35,
    failedCount: 15,
    status: 'Failed',
    notes: 'High defect rate - production line issue',
    defects: ['Dimensional tolerance', 'Assembly error', 'Missing component'],
  },
];

const checkStatuses: QualityCheck['status'][] = ['Pending', 'In Progress', 'Passed', 'Failed', 'On Hold'];

export default function QualityScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [checks, setChecks] = useState<QualityCheck[]>(initialChecks);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<QualityCheck | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    workOrderNumber: '',
    productName: '',
    batchNumber: '',
    inspectorName: '',
    sampleSize: '',
    notes: '',
  });

  const filteredChecks = checks.filter((check) => {
    const matchesSearch =
      check.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.checkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || check.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: checks.length,
    passed: checks.filter((c) => c.status === 'Passed').length,
    failed: checks.filter((c) => c.status === 'Failed').length,
    pending: checks.filter((c) => c.status === 'Pending' || c.status === 'In Progress').length,
  };

  const resetForm = () => {
    setFormData({
      workOrderNumber: '',
      productName: '',
      batchNumber: '',
      inspectorName: '',
      sampleSize: '',
      notes: '',
    });
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const handleViewDetails = (check: QualityCheck) => {
    setSelectedCheck(check);
    setDetailModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.workOrderNumber || !formData.productName || !formData.sampleSize) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newCheck: QualityCheck = {
      id: String(checks.length + 1),
      checkNumber: `QC-${String(checks.length + 1).padStart(3, '0')}`,
      workOrderNumber: formData.workOrderNumber,
      productName: formData.productName,
      batchNumber: formData.batchNumber || `BATCH-${Date.now()}`,
      inspectorName: formData.inspectorName || 'Unassigned',
      checkDate: new Date().toISOString().split('T')[0],
      sampleSize: parseInt(formData.sampleSize) || 0,
      passedCount: 0,
      failedCount: 0,
      status: 'Pending',
      notes: formData.notes,
      defects: [],
    };
    setChecks([newCheck, ...checks]);
    setModalVisible(false);
    resetForm();
    Alert.alert('Success', 'Quality check created successfully');
  };

  const handleStartInspection = (check: QualityCheck) => {
    setChecks(
      checks.map((c) =>
        c.id === check.id ? { ...c, status: 'In Progress' } : c
      )
    );
    setDetailModalVisible(false);
    Alert.alert('Success', 'Inspection started');
  };

  const handleCompleteInspection = (check: QualityCheck, passed: boolean) => {
    const passRate = passed ? 0.95 : 0.7;
    const passedCount = Math.floor(check.sampleSize * passRate);
    const failedCount = check.sampleSize - passedCount;

    setChecks(
      checks.map((c) =>
        c.id === check.id
          ? {
              ...c,
              status: passed ? 'Passed' : 'Failed',
              passedCount,
              failedCount,
            }
          : c
      )
    );
    setDetailModalVisible(false);
    Alert.alert('Success', `Inspection completed - ${passed ? 'Passed' : 'Failed'}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#6B7280';
      case 'In Progress':
        return '#3B82F6';
      case 'Passed':
        return '#10B981';
      case 'Failed':
        return '#EF4444';
      case 'On Hold':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return Clock;
      case 'In Progress':
        return ClipboardList;
      case 'Passed':
        return CheckCircle;
      case 'Failed':
        return XCircle;
      case 'On Hold':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const renderCheck = ({ item }: { item: QualityCheck }) => {
    const StatusIcon = getStatusIcon(item.status);
    const passRate = item.sampleSize > 0 ? (item.passedCount / item.sampleSize) * 100 : 0;

    return (
      <TouchableOpacity style={styles.checkCard} onPress={() => handleViewDetails(item)}>
        <View style={styles.checkHeader}>
          <View>
            <Text style={styles.checkNumber}>{item.checkNumber}</Text>
            <Text style={styles.productName}>{item.productName}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <StatusIcon size={12} color={getStatusColor(item.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.checkDetails}>
          <View style={styles.detailRow}>
            <FileText size={14} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text style={styles.detailText}>WO: {item.workOrderNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <User size={14} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text style={styles.detailText}>{item.inspectorName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Calendar size={14} color={isDark ? '#64748B' : '#94A3B8'} />
            <Text style={styles.detailText}>{item.checkDate}</Text>
          </View>
        </View>

        {(item.status === 'Passed' || item.status === 'Failed') && (
          <View style={styles.resultsSection}>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Sample Size</Text>
              <Text style={styles.resultValue}>{item.sampleSize}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Passed</Text>
              <Text style={[styles.resultValue, { color: '#10B981' }]}>{item.passedCount}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Failed</Text>
              <Text style={[styles.resultValue, { color: '#EF4444' }]}>{item.failedCount}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Pass Rate</Text>
              <Text style={styles.resultValue}>{passRate.toFixed(1)}%</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ModuleLayout
      moduleId="production"
      navItems={productionNavItems}
      activeScreen="ProductionQuality"
      title="Quality Control"
    >
      <View style={styles.container}>
        {/* Stats Summary */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: '#9C27B0' }]}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
            <Text style={styles.statValue}>{stats.passed}</Text>
            <Text style={styles.statLabel}>Passed</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#EF4444' }]}>
            <Text style={styles.statValue}>{stats.failed}</Text>
            <Text style={styles.statLabel}>Failed</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
            <Text style={styles.statValue}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Search and Add */}
        <View style={styles.toolbar}>
          <View style={styles.searchContainer}>
            <Search size={18} color={isDark ? '#64748B' : '#94A3B8'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search inspections..."
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
          {['All', ...checkStatuses].map((status) => (
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

        {/* Checks List */}
        <FlatList
          data={filteredChecks}
          renderItem={renderCheck}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <CheckSquare size={48} color={isDark ? '#334155' : '#CBD5E1'} />
              <Text style={styles.emptyText}>No quality checks found</Text>
            </View>
          }
        />
      </View>

      {/* Add Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Quality Check</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Work Order Number *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.workOrderNumber}
                  onChangeText={(text) => setFormData({ ...formData, workOrderNumber: text })}
                  placeholder="e.g., WO-001"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

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
                <Text style={styles.formLabel}>Batch Number</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.batchNumber}
                  onChangeText={(text) => setFormData({ ...formData, batchNumber: text })}
                  placeholder="Auto-generated if empty"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Sample Size *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.sampleSize}
                  onChangeText={(text) => setFormData({ ...formData, sampleSize: text })}
                  placeholder="Number of units to inspect"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Inspector Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.inspectorName}
                  onChangeText={(text) => setFormData({ ...formData, inspectorName: text })}
                  placeholder="Assign inspector"
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
                <Text style={styles.saveButtonText}>Create Check</Text>
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
              <Text style={styles.modalTitle}>{selectedCheck?.checkNumber}</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            {selectedCheck && (
              <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailTitle}>{selectedCheck.productName}</Text>
                  <Text style={styles.detailSubtitle}>
                    {selectedCheck.workOrderNumber} • {selectedCheck.batchNumber}
                  </Text>
                </View>

                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Inspector</Text>
                    <Text style={styles.infoValue}>{selectedCheck.inspectorName}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Date</Text>
                    <Text style={styles.infoValue}>{selectedCheck.checkDate}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Sample Size</Text>
                    <Text style={styles.infoValue}>{selectedCheck.sampleSize} units</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Status</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${getStatusColor(selectedCheck.status)}20` },
                      ]}
                    >
                      <Text style={{ color: getStatusColor(selectedCheck.status), fontWeight: '600' }}>
                        {selectedCheck.status}
                      </Text>
                    </View>
                  </View>
                </View>

                {selectedCheck.notes && (
                  <View style={styles.notesSection}>
                    <Text style={styles.notesLabel}>Notes</Text>
                    <Text style={styles.notesText}>{selectedCheck.notes}</Text>
                  </View>
                )}

                {selectedCheck.defects.length > 0 && (
                  <View style={styles.defectsSection}>
                    <Text style={styles.defectsLabel}>Defects Found</Text>
                    {selectedCheck.defects.map((defect, index) => (
                      <View key={index} style={styles.defectItem}>
                        <AlertTriangle size={14} color="#EF4444" />
                        <Text style={styles.defectText}>{defect}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              {selectedCheck?.status === 'Pending' && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={() => selectedCheck && handleStartInspection(selectedCheck)}
                >
                  <Text style={styles.saveButtonText}>Start Inspection</Text>
                </TouchableOpacity>
              )}
              {selectedCheck?.status === 'In Progress' && (
                <>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.failButton]}
                    onPress={() => selectedCheck && handleCompleteInspection(selectedCheck, false)}
                  >
                    <XCircle size={16} color="#FFFFFF" />
                    <Text style={styles.saveButtonText}>Fail</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.passButton]}
                    onPress={() => selectedCheck && handleCompleteInspection(selectedCheck, true)}
                  >
                    <CheckCircle size={16} color="#FFFFFF" />
                    <Text style={styles.saveButtonText}>Pass</Text>
                  </TouchableOpacity>
                </>
              )}
              {(selectedCheck?.status === 'Passed' || selectedCheck?.status === 'Failed') && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton, { flex: 1 }]}
                  onPress={() => setDetailModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
              )}
            </View>
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
    statsGrid: {
      flexDirection: 'row',
      padding: 16,
      gap: 8,
    },
    statCard: {
      flex: 1,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 10,
      padding: 12,
      alignItems: 'center',
      borderLeftWidth: 3,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    statValue: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    statLabel: {
      fontSize: 11,
      color: isDark ? '#94A3B8' : '#64748B',
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
    checkCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    checkHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    checkNumber: {
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
    checkDetails: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 12,
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
    resultsSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    resultItem: {
      alignItems: 'center',
    },
    resultLabel: {
      fontSize: 11,
      color: isDark ? '#64748B' : '#94A3B8',
      marginBottom: 2,
    },
    resultValue: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
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
    formGroup: {
      marginBottom: 16,
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
    detailContainer: {
      padding: 20,
    },
    detailSection: {
      marginBottom: 20,
    },
    detailTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 4,
    },
    detailSubtitle: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    infoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 20,
    },
    infoItem: {
      width: '45%',
    },
    infoLabel: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    notesSection: {
      marginBottom: 20,
    },
    notesLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 8,
    },
    notesText: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
      lineHeight: 20,
    },
    defectsSection: {
      marginBottom: 20,
    },
    defectsLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 12,
    },
    defectItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    defectText: {
      fontSize: 14,
      color: isDark ? '#CBD5E1' : '#475569',
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
    passButton: {
      backgroundColor: '#10B981',
    },
    failButton: {
      backgroundColor: '#EF4444',
    },
  });
