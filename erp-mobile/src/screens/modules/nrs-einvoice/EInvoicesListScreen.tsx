/**
 * NRS E-Invoices List Screen
 * Manage electronic invoices for NRS compliance
 */

import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, useColorScheme,
  TextInput, Modal, ScrollView, Alert,
} from 'react-native';
import {
  Search, Plus, X, FileCheck, LayoutDashboard, Shield, Settings,
  Send, CheckCircle, Clock, AlertTriangle, Eye, RotateCcw,
} from 'lucide-react-native';
import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

const nrsNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'NRSEInvoice' },
  { id: 'invoices', label: 'E-Invoices', icon: FileCheck, screenName: 'NRSEInvoiceList' },
  { id: 'compliance', label: 'Compliance', icon: Shield, screenName: 'NRSEInvoiceCompliance' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'NRSEInvoiceSettings' },
];

interface EInvoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  customerTIN: string;
  amount: number;
  taxAmount: number;
  issueDate: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Cancelled';
  nrsReference?: string;
}

const initialInvoices: EInvoice[] = [
  { id: '1', invoiceNumber: 'INV-2024-001', customer: 'Acme Corporation', customerTIN: '12345678901', amount: 125450, taxAmount: 18817.50, issueDate: '2024-01-10', status: 'Approved', nrsReference: 'NRS-2024-00001' },
  { id: '2', invoiceNumber: 'INV-2024-002', customer: 'TechStart Inc', customerTIN: '98765432109', amount: 83200, taxAmount: 12480, issueDate: '2024-01-10', status: 'Submitted' },
  { id: '3', invoiceNumber: 'INV-2024-003', customer: 'Global Trade Ltd', customerTIN: '45678901234', amount: 241000, taxAmount: 36150, issueDate: '2024-01-09', status: 'Approved', nrsReference: 'NRS-2024-00002' },
  { id: '4', invoiceNumber: 'INV-2024-004', customer: 'Local Shop', customerTIN: '11223344556', amount: 35000, taxAmount: 5250, issueDate: '2024-01-08', status: 'Rejected' },
  { id: '5', invoiceNumber: 'INV-2024-005', customer: 'ABC Enterprises', customerTIN: '55667788990', amount: 92500, taxAmount: 13875, issueDate: '2024-01-08', status: 'Draft' },
];

const statusFilters = ['All', 'Draft', 'Submitted', 'Approved', 'Rejected'];

export default function EInvoicesListScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [invoices, setInvoices] = useState<EInvoice[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<EInvoice | null>(null);
  const [formData, setFormData] = useState({ customer: '', customerTIN: '', amount: '', taxAmount: '' });

  const moduleColor = '#F44336';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return '#10B981';
      case 'Submitted': return '#3B82F6';
      case 'Draft': return '#6B7280';
      case 'Rejected': return '#EF4444';
      case 'Cancelled': return '#9CA3AF';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return CheckCircle;
      case 'Submitted': return Clock;
      case 'Rejected': return AlertTriangle;
      default: return FileCheck;
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerTIN.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddInvoice = () => {
    if (!formData.customer || !formData.customerTIN || !formData.amount) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }
    const amount = parseFloat(formData.amount);
    const taxAmount = formData.taxAmount ? parseFloat(formData.taxAmount) : amount * 0.15;

    const newInvoice: EInvoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      customer: formData.customer,
      customerTIN: formData.customerTIN,
      amount,
      taxAmount,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'Draft',
    };
    setInvoices([newInvoice, ...invoices]);
    setFormData({ customer: '', customerTIN: '', amount: '', taxAmount: '' });
    setIsAddModalVisible(false);
  };

  const handleSubmitToNRS = (invoice: EInvoice) => {
    Alert.alert('Submit to NRS', `Submit invoice ${invoice.invoiceNumber} to NRS?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Submit', onPress: () => {
        setInvoices(invoices.map(i => i.id === invoice.id ? { ...i, status: 'Submitted' as const } : i));
        setIsDetailModalVisible(false);
      }},
    ]);
  };

  const handleRetry = (invoice: EInvoice) => {
    setInvoices(invoices.map(i => i.id === invoice.id ? { ...i, status: 'Submitted' as const } : i));
    Alert.alert('Resubmitted', 'Invoice has been resubmitted to NRS');
    setIsDetailModalVisible(false);
  };

  const formatCurrency = (amount: number) => `N${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const openDetail = (invoice: EInvoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalVisible(true);
  };

  const renderInvoice = ({ item }: { item: EInvoice }) => {
    const StatusIcon = getStatusIcon(item.status);
    return (
      <TouchableOpacity style={styles.invoiceCard} onPress={() => openDetail(item)}>
        <View style={styles.invoiceHeader}>
          <View style={[styles.statusIcon, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <StatusIcon size={20} color={getStatusColor(item.status)} />
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceNumber}>{item.invoiceNumber}</Text>
            <Text style={styles.customerName}>{item.customer}</Text>
            <Text style={styles.customerTIN}>TIN: {item.customerTIN}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.invoiceDetails}>
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountValue}>{formatCurrency(item.amount)}</Text>
          </View>
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Tax (15%)</Text>
            <Text style={styles.taxValue}>{formatCurrency(item.taxAmount)}</Text>
          </View>
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(item.amount + item.taxAmount)}</Text>
          </View>
        </View>

        <View style={styles.invoiceFooter}>
          <Text style={styles.issueDate}>Issued: {item.issueDate}</Text>
          {item.nrsReference && (
            <Text style={styles.nrsRef}>Ref: {item.nrsReference}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ModuleLayout moduleId="nrs-einvoice" navItems={nrsNavItems} activeScreen="NRSEInvoiceList" title="E-Invoices">
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            <TextInput style={styles.searchInput} placeholder="Search invoices..." placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={searchQuery} onChangeText={setSearchQuery} />
          </View>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: moduleColor }]} onPress={() => setIsAddModalVisible(true)}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {statusFilters.map(filter => (
            <TouchableOpacity key={filter} style={[styles.filterChip, statusFilter === filter && { backgroundColor: moduleColor }]}
              onPress={() => setStatusFilter(filter)}>
              <Text style={[styles.filterText, statusFilter === filter && { color: '#FFFFFF' }]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList data={filteredInvoices} renderItem={renderInvoice} keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />

        {/* Add Invoice Modal */}
        <Modal visible={isAddModalVisible} animationType="slide" transparent onRequestClose={() => setIsAddModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>New E-Invoice</Text>
                <TouchableOpacity onPress={() => setIsAddModalVisible(false)}><X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} /></TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody}>
                <Text style={styles.inputLabel}>Customer Name *</Text>
                <TextInput style={styles.input} value={formData.customer} onChangeText={t => setFormData({...formData, customer: t})}
                  placeholder="e.g., Acme Corporation" placeholderTextColor={isDark ? '#64748B' : '#94A3B8'} />
                <Text style={styles.inputLabel}>Customer TIN *</Text>
                <TextInput style={styles.input} value={formData.customerTIN} onChangeText={t => setFormData({...formData, customerTIN: t})}
                  placeholder="Tax Identification Number" keyboardType="numeric" placeholderTextColor={isDark ? '#64748B' : '#94A3B8'} />
                <Text style={styles.inputLabel}>Amount (before tax) *</Text>
                <TextInput style={styles.input} value={formData.amount} onChangeText={t => setFormData({...formData, amount: t})}
                  placeholder="0.00" keyboardType="numeric" placeholderTextColor={isDark ? '#64748B' : '#94A3B8'} />
                <Text style={styles.inputLabel}>Tax Amount (auto-calculated if empty)</Text>
                <TextInput style={styles.input} value={formData.taxAmount} onChangeText={t => setFormData({...formData, taxAmount: t})}
                  placeholder="15% of amount" keyboardType="numeric" placeholderTextColor={isDark ? '#64748B' : '#94A3B8'} />
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAddModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.submitButton, { backgroundColor: moduleColor }]} onPress={handleAddInvoice}>
                  <Text style={styles.submitButtonText}>Create Draft</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Detail Modal */}
        <Modal visible={isDetailModalVisible} animationType="slide" transparent onRequestClose={() => setIsDetailModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedInvoice?.invoiceNumber}</Text>
                <TouchableOpacity onPress={() => setIsDetailModalVisible(false)}><X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} /></TouchableOpacity>
              </View>
              {selectedInvoice && (
                <ScrollView style={styles.modalBody}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Customer</Text>
                    <Text style={styles.detailValue}>{selectedInvoice.customer}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>TIN</Text>
                    <Text style={styles.detailValue}>{selectedInvoice.customerTIN}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount</Text>
                    <Text style={styles.detailValue}>{formatCurrency(selectedInvoice.amount)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tax</Text>
                    <Text style={styles.detailValue}>{formatCurrency(selectedInvoice.taxAmount)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total</Text>
                    <Text style={[styles.detailValue, { fontWeight: '700' }]}>{formatCurrency(selectedInvoice.amount + selectedInvoice.taxAmount)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(selectedInvoice.status)}20` }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(selectedInvoice.status) }]}>{selectedInvoice.status}</Text>
                    </View>
                  </View>
                  {selectedInvoice.nrsReference && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>NRS Reference</Text>
                      <Text style={[styles.detailValue, { color: moduleColor }]}>{selectedInvoice.nrsReference}</Text>
                    </View>
                  )}
                </ScrollView>
              )}
              <View style={styles.modalFooter}>
                {selectedInvoice?.status === 'Draft' && (
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: moduleColor }]} onPress={() => handleSubmitToNRS(selectedInvoice)}>
                    <Send size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Submit to NRS</Text>
                  </TouchableOpacity>
                )}
                {selectedInvoice?.status === 'Rejected' && (
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F59E0B' }]} onPress={() => handleRetry(selectedInvoice)}>
                    <RotateCcw size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Retry Submission</Text>
                  </TouchableOpacity>
                )}
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
  invoiceCard: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0' },
  invoiceHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  statusIcon: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  invoiceInfo: { flex: 1 },
  invoiceNumber: { fontSize: 15, fontWeight: '700', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 2 },
  customerName: { fontSize: 14, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 2 },
  customerTIN: { fontSize: 12, color: isDark ? '#64748B' : '#94A3B8' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '600' },
  invoiceDetails: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  amountSection: { flex: 1, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderRadius: 8, padding: 10, alignItems: 'center' },
  amountLabel: { fontSize: 10, color: isDark ? '#64748B' : '#94A3B8', marginBottom: 4 },
  amountValue: { fontSize: 12, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
  taxValue: { fontSize: 12, fontWeight: '600', color: '#F59E0B' },
  totalValue: { fontSize: 12, fontWeight: '700', color: '#10B981' },
  invoiceFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  issueDate: { fontSize: 11, color: isDark ? '#64748B' : '#94A3B8' },
  nrsRef: { fontSize: 11, color: '#F44336', fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: isDark ? '#334155' : '#E2E8F0' },
  modalTitle: { fontSize: 18, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
  modalBody: { padding: 20 },
  inputLabel: { fontSize: 13, fontWeight: '500', color: isDark ? '#94A3B8' : '#64748B', marginBottom: 6 },
  input: { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderRadius: 10, padding: 12, fontSize: 15, color: isDark ? '#FFFFFF' : '#0F172A', borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0', marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: isDark ? '#334155' : '#E2E8F0' },
  detailLabel: { fontSize: 14, color: isDark ? '#94A3B8' : '#64748B' },
  detailValue: { fontSize: 14, fontWeight: '500', color: isDark ? '#FFFFFF' : '#0F172A' },
  modalFooter: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: isDark ? '#334155' : '#E2E8F0' },
  cancelButton: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', backgroundColor: isDark ? '#0F172A' : '#F1F5F9' },
  cancelButtonText: { fontSize: 15, fontWeight: '600', color: isDark ? '#94A3B8' : '#64748B' },
  submitButton: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  submitButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  actionButton: { flex: 1, flexDirection: 'row', gap: 8, paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
});
