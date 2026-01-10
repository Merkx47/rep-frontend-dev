/**
 * Depreciation Schedule Screen
 * View and run depreciation calculations
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
  Package,
  Layers,
  TrendingDown,
  Settings,
  LayoutDashboard,
  Calendar,
  Play,
  CheckCircle,
  Clock,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

const fixedAssetsNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'FixedAssets' },
  { id: 'register', label: 'Asset Register', icon: Package, screenName: 'FixedAssetsList' },
  { id: 'categories', label: 'Categories', icon: Layers, screenName: 'FixedAssetsCategories' },
  { id: 'depreciation', label: 'Depreciation', icon: TrendingDown, screenName: 'FixedAssetsDepreciation' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'FixedAssetsSettings' },
];

interface DepreciationRecord {
  id: string;
  period: string;
  assetCount: number;
  totalDepreciation: number;
  status: 'Pending' | 'Processed' | 'Posted';
  processedDate: string | null;
}

interface AssetDepreciation {
  id: string;
  assetNumber: string;
  assetName: string;
  category: string;
  openingValue: number;
  depreciation: number;
  closingValue: number;
}

const depreciationRecords: DepreciationRecord[] = [
  { id: '1', period: 'January 2024', assetCount: 156, totalDepreciation: 18420, status: 'Pending', processedDate: null },
  { id: '2', period: 'December 2023', assetCount: 154, totalDepreciation: 18100, status: 'Posted', processedDate: '2024-01-05' },
  { id: '3', period: 'November 2023', assetCount: 152, totalDepreciation: 17850, status: 'Posted', processedDate: '2023-12-05' },
  { id: '4', period: 'October 2023', assetCount: 150, totalDepreciation: 17600, status: 'Posted', processedDate: '2023-11-05' },
];

const assetDepreciations: AssetDepreciation[] = [
  { id: '1', assetNumber: 'AST-001', assetName: 'Dell Server Rack', category: 'IT Equipment', openingValue: 38750, depreciation: 750, closingValue: 38000 },
  { id: '2', assetNumber: 'AST-002', assetName: 'Office Building', category: 'Real Estate', openingValue: 1112500, depreciation: 2500, closingValue: 1110000 },
  { id: '3', assetNumber: 'AST-003', assetName: 'MacBook Pro Fleet', category: 'IT Equipment', openingValue: 73420, depreciation: 1420, closingValue: 72000 },
  { id: '4', assetNumber: 'AST-004', assetName: 'Office Furniture', category: 'Furniture', openingValue: 26267, depreciation: 267, closingValue: 26000 },
  { id: '5', assetNumber: 'AST-005', assetName: 'Company Vehicle', category: 'Vehicles', openingValue: 28583, depreciation: 583, closingValue: 28000 },
];

const statusFilters = ['All', 'Pending', 'Processed', 'Posted'];

export default function DepreciationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [records] = useState<DepreciationRecord[]>(depreciationRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DepreciationRecord | null>(null);
  const [viewMode, setViewMode] = useState<'periods' | 'assets'>('periods');

  const moduleColor = '#009688';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Posted': return '#10B981';
      case 'Processed': return '#3B82F6';
      case 'Pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Posted': return CheckCircle;
      case 'Processed': return Play;
      case 'Pending': return Clock;
      default: return Clock;
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.period.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRunDepreciation = () => {
    Alert.alert(
      'Run Depreciation',
      'This will calculate depreciation for all active assets for January 2024. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Run', onPress: () => Alert.alert('Success', 'Depreciation calculation completed') },
      ]
    );
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

  const renderPeriodRecord = ({ item }: { item: DepreciationRecord }) => {
    const StatusIcon = getStatusIcon(item.status);
    return (
      <TouchableOpacity
        style={styles.recordCard}
        onPress={() => {
          setSelectedRecord(item);
          setIsDetailModalVisible(true);
        }}
      >
        <View style={styles.recordHeader}>
          <View style={styles.periodInfo}>
            <Calendar size={18} color={moduleColor} />
            <Text style={styles.periodText}>{item.period}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <StatusIcon size={12} color={getStatusColor(item.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.recordDetails}>
          <View style={styles.recordDetailItem}>
            <Text style={styles.recordDetailLabel}>Assets</Text>
            <Text style={styles.recordDetailValue}>{item.assetCount}</Text>
          </View>
          <View style={styles.recordDetailItem}>
            <Text style={styles.recordDetailLabel}>Total Depreciation</Text>
            <Text style={[styles.recordDetailValue, { color: '#F59E0B' }]}>-{formatCurrency(item.totalDepreciation)}</Text>
          </View>
        </View>

        {item.processedDate && (
          <Text style={styles.processedDate}>Processed on {item.processedDate}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderAssetDepreciation = ({ item }: { item: AssetDepreciation }) => (
    <View style={styles.assetRow}>
      <View style={styles.assetInfo}>
        <Text style={styles.assetNumber}>{item.assetNumber}</Text>
        <Text style={styles.assetName}>{item.assetName}</Text>
        <Text style={styles.assetCategory}>{item.category}</Text>
      </View>
      <View style={styles.assetValues}>
        <View style={styles.valueItem}>
          <Text style={styles.valueLabel}>Opening</Text>
          <Text style={styles.valueAmount}>{formatCurrency(item.openingValue)}</Text>
        </View>
        <View style={styles.valueItem}>
          <Text style={styles.valueLabel}>Dep.</Text>
          <Text style={[styles.valueAmount, { color: '#F59E0B' }]}>-{formatCurrency(item.depreciation)}</Text>
        </View>
        <View style={styles.valueItem}>
          <Text style={styles.valueLabel}>Closing</Text>
          <Text style={[styles.valueAmount, { color: '#10B981' }]}>{formatCurrency(item.closingValue)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ModuleLayout
      moduleId="fixed-assets"
      navItems={fixedAssetsNavItems}
      activeScreen="FixedAssetsDepreciation"
      title="Depreciation"
    >
      <View style={styles.container}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Current Period</Text>
              <Text style={styles.summaryValue}>January 2024</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Monthly Total</Text>
              <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>-$18,420</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.runButton, { backgroundColor: moduleColor }]}
            onPress={handleRunDepreciation}
          >
            <Play size={18} color="#FFFFFF" />
            <Text style={styles.runButtonText}>Run Depreciation</Text>
          </TouchableOpacity>
        </View>

        {/* View Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'periods' && { backgroundColor: moduleColor }]}
            onPress={() => setViewMode('periods')}
          >
            <Text style={[styles.toggleText, viewMode === 'periods' && { color: '#FFFFFF' }]}>By Period</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'assets' && { backgroundColor: moduleColor }]}
            onPress={() => setViewMode('assets')}
          >
            <Text style={[styles.toggleText, viewMode === 'assets' && { color: '#FFFFFF' }]}>By Asset</Text>
          </TouchableOpacity>
        </View>

        {viewMode === 'periods' ? (
          <>
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Search size={18} color={isDark ? '#94A3B8' : '#64748B'} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search periods..."
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
              {statusFilters.map(filter => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterChip, statusFilter === filter && { backgroundColor: moduleColor }]}
                  onPress={() => setStatusFilter(filter)}
                >
                  <Text style={[styles.filterText, statusFilter === filter && { color: '#FFFFFF' }]}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <FlatList
              data={filteredRecords}
              renderItem={renderPeriodRecord}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <FlatList
            data={assetDepreciations}
            renderItem={renderAssetDepreciation}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Detail Modal */}
        <Modal visible={isDetailModalVisible} animationType="slide" transparent onRequestClose={() => setIsDetailModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedRecord?.period}</Text>
                <TouchableOpacity onPress={() => setIsDetailModalVisible(false)}>
                  <TrendingDown size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              {selectedRecord && (
                <ScrollView style={styles.modalBody}>
                  <View style={styles.detailCard}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Status</Text>
                      <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(selectedRecord.status)}20` }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(selectedRecord.status) }]}>
                          {selectedRecord.status}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Assets Processed</Text>
                      <Text style={styles.detailValue}>{selectedRecord.assetCount}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Total Depreciation</Text>
                      <Text style={[styles.detailValue, { color: '#F59E0B' }]}>-{formatCurrency(selectedRecord.totalDepreciation)}</Text>
                    </View>
                    {selectedRecord.processedDate && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Processed Date</Text>
                        <Text style={styles.detailValue}>{selectedRecord.processedDate}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.sectionTitle}>Assets in this period</Text>
                  {assetDepreciations.map(asset => (
                    <View key={asset.id} style={styles.assetItem}>
                      <Text style={styles.assetItemName}>{asset.assetName}</Text>
                      <Text style={styles.assetItemDep}>-{formatCurrency(asset.depreciation)}</Text>
                    </View>
                  ))}
                </ScrollView>
              )}

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setIsDetailModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
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
    container: { flex: 1 },
    summaryCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF', margin: 16, borderRadius: 12, padding: 16,
      borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    summaryItem: {},
    summaryLabel: { fontSize: 12, color: isDark ? '#64748B' : '#94A3B8', marginBottom: 4 },
    summaryValue: { fontSize: 18, fontWeight: '700', color: isDark ? '#FFFFFF' : '#0F172A' },
    runButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 10 },
    runButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
    toggleContainer: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderRadius: 10, padding: 4 },
    toggleButton: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    toggleText: { fontSize: 14, fontWeight: '500', color: isDark ? '#94A3B8' : '#64748B' },
    searchContainer: { paddingHorizontal: 16, marginBottom: 12 },
    searchBar: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    searchInput: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, color: isDark ? '#FFFFFF' : '#0F172A', fontSize: 15 },
    filterContainer: { maxHeight: 44, paddingHorizontal: 16 },
    filterChip: {
      paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
      backgroundColor: isDark ? '#1E293B' : '#F1F5F9', marginRight: 8,
    },
    filterText: { fontSize: 13, fontWeight: '500', color: isDark ? '#94A3B8' : '#64748B' },
    listContent: { padding: 16, gap: 12 },
    recordCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 12, padding: 16,
      borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    recordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    periodInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    periodText: { fontSize: 16, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
    statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 12, fontWeight: '600' },
    recordDetails: { flexDirection: 'row', gap: 24 },
    recordDetailItem: {},
    recordDetailLabel: { fontSize: 11, color: isDark ? '#64748B' : '#94A3B8', marginBottom: 2 },
    recordDetailValue: { fontSize: 16, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
    processedDate: { fontSize: 12, color: isDark ? '#64748B' : '#94A3B8', marginTop: 12 },
    assetRow: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 12, padding: 14,
      borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    assetInfo: { marginBottom: 12 },
    assetNumber: { fontSize: 12, color: isDark ? '#64748B' : '#94A3B8' },
    assetName: { fontSize: 15, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
    assetCategory: { fontSize: 13, color: isDark ? '#94A3B8' : '#64748B' },
    assetValues: { flexDirection: 'row', justifyContent: 'space-between' },
    valueItem: { alignItems: 'center' },
    valueLabel: { fontSize: 10, color: isDark ? '#64748B' : '#94A3B8', marginBottom: 2 },
    valueAmount: { fontSize: 13, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%' },
    modalHeader: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20,
      borderBottomWidth: 1, borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    modalTitle: { fontSize: 18, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
    modalBody: { padding: 20 },
    detailCard: { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderRadius: 12, padding: 16, marginBottom: 20 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    detailLabel: { fontSize: 14, color: isDark ? '#94A3B8' : '#64748B' },
    detailValue: { fontSize: 14, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 12 },
    assetItem: {
      flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12,
      borderBottomWidth: 1, borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    assetItemName: { fontSize: 14, color: isDark ? '#FFFFFF' : '#0F172A' },
    assetItemDep: { fontSize: 14, fontWeight: '600', color: '#F59E0B' },
    modalFooter: { padding: 20, borderTopWidth: 1, borderTopColor: isDark ? '#334155' : '#E2E8F0' },
    closeButton: { paddingVertical: 14, borderRadius: 10, alignItems: 'center', backgroundColor: isDark ? '#0F172A' : '#F1F5F9' },
    closeButtonText: { fontSize: 15, fontWeight: '600', color: isDark ? '#94A3B8' : '#64748B' },
  });
