/**
 * NRS E-Invoice Compliance Screen
 * Monitor compliance status and manage certificates
 */

import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, useColorScheme,
  Modal, Alert,
} from 'react-native';
import {
  LayoutDashboard, FileCheck, Shield, Settings, CheckCircle, AlertTriangle,
  Clock, X, RefreshCw, Key, Calendar, Server, TrendingUp, FileWarning,
} from 'lucide-react-native';
import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

const nrsNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'NRSEInvoice' },
  { id: 'invoices', label: 'E-Invoices', icon: FileCheck, screenName: 'NRSEInvoiceList' },
  { id: 'compliance', label: 'Compliance', icon: Shield, screenName: 'NRSEInvoiceCompliance' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'NRSEInvoiceSettings' },
];

interface ComplianceCheck {
  id: string;
  name: string;
  status: 'Passed' | 'Warning' | 'Failed';
  lastChecked: string;
  details: string;
}

interface Certificate {
  id: string;
  name: string;
  type: string;
  issuer: string;
  expiryDate: string;
  status: 'Valid' | 'Expiring' | 'Expired';
  daysRemaining: number;
}

const complianceChecks: ComplianceCheck[] = [
  { id: '1', name: 'API Connection', status: 'Passed', lastChecked: '2 mins ago', details: 'Successfully connected to NRS API' },
  { id: '2', name: 'Certificate Validity', status: 'Passed', lastChecked: '2 mins ago', details: 'Digital certificate is valid' },
  { id: '3', name: 'Invoice Format', status: 'Passed', lastChecked: '1 hour ago', details: 'All invoices comply with NRS format' },
  { id: '4', name: 'Data Encryption', status: 'Passed', lastChecked: '2 mins ago', details: 'TLS 1.3 encryption active' },
  { id: '5', name: 'Submission Rate', status: 'Warning', lastChecked: '5 mins ago', details: '3 invoices pending submission >24h' },
  { id: '6', name: 'Tax Calculation', status: 'Passed', lastChecked: '1 hour ago', details: 'All tax calculations verified' },
];

const certificates: Certificate[] = [
  { id: '1', name: 'NRS Digital Signature', type: 'Signing Certificate', issuer: 'National Revenue Service', expiryDate: '2024-04-10', status: 'Valid', daysRemaining: 89 },
  { id: '2', name: 'API Authentication', type: 'Client Certificate', issuer: 'NRS Authority', expiryDate: '2024-03-15', status: 'Expiring', daysRemaining: 63 },
  { id: '3', name: 'TLS Certificate', type: 'SSL/TLS', issuer: 'DigiCert', expiryDate: '2024-12-31', status: 'Valid', daysRemaining: 355 },
];

const complianceStats = {
  overallScore: 95,
  invoicesSubmitted: 1248,
  approvalRate: 95.2,
  avgProcessingTime: '2.3 mins',
  pendingIssues: 3,
  lastSync: '2 mins ago',
};

export default function ComplianceScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isCertModalVisible, setIsCertModalVisible] = useState(false);

  const moduleColor = '#F44336';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed':
      case 'Valid': return '#10B981';
      case 'Warning':
      case 'Expiring': return '#F59E0B';
      case 'Failed':
      case 'Expired': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Passed':
      case 'Valid': return CheckCircle;
      case 'Warning':
      case 'Expiring': return AlertTriangle;
      case 'Failed':
      case 'Expired': return X;
      default: return Clock;
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      Alert.alert('Refreshed', 'Compliance status has been updated');
    }, 2000);
  };

  const openCertDetail = (cert: Certificate) => {
    setSelectedCert(cert);
    setIsCertModalVisible(true);
  };

  const handleRenewCertificate = () => {
    Alert.alert('Renew Certificate', 'Certificate renewal request has been submitted. You will be notified once approved.');
    setIsCertModalVisible(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981';
    if (score >= 70) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <ModuleLayout moduleId="nrs-einvoice" navItems={nrsNavItems} activeScreen="NRSEInvoiceCompliance" title="Compliance">
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Compliance Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Compliance Score</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh} disabled={isRefreshing}>
              <RefreshCw size={18} color={moduleColor} style={isRefreshing ? { opacity: 0.5 } : undefined} />
            </TouchableOpacity>
          </View>
          <View style={styles.scoreContent}>
            <View style={[styles.scoreCircle, { borderColor: getScoreColor(complianceStats.overallScore) }]}>
              <Text style={[styles.scoreValue, { color: getScoreColor(complianceStats.overallScore) }]}>
                {complianceStats.overallScore}%
              </Text>
            </View>
            <View style={styles.scoreStats}>
              <View style={styles.scoreStat}>
                <FileCheck size={16} color="#3B82F6" />
                <Text style={styles.scoreStatValue}>{complianceStats.invoicesSubmitted}</Text>
                <Text style={styles.scoreStatLabel}>Submitted</Text>
              </View>
              <View style={styles.scoreStat}>
                <TrendingUp size={16} color="#10B981" />
                <Text style={styles.scoreStatValue}>{complianceStats.approvalRate}%</Text>
                <Text style={styles.scoreStatLabel}>Approval</Text>
              </View>
              <View style={styles.scoreStat}>
                <Clock size={16} color="#F59E0B" />
                <Text style={styles.scoreStatValue}>{complianceStats.avgProcessingTime}</Text>
                <Text style={styles.scoreStatLabel}>Avg Time</Text>
              </View>
            </View>
          </View>
          <Text style={styles.lastSync}>Last sync: {complianceStats.lastSync}</Text>
        </View>

        {/* Compliance Checks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compliance Checks</Text>
          <View style={styles.checksCard}>
            {complianceChecks.map((check, index) => {
              const StatusIcon = getStatusIcon(check.status);
              return (
                <View key={check.id} style={[styles.checkRow, index !== complianceChecks.length - 1 && styles.checkRowBorder]}>
                  <View style={[styles.checkIcon, { backgroundColor: `${getStatusColor(check.status)}20` }]}>
                    <StatusIcon size={16} color={getStatusColor(check.status)} />
                  </View>
                  <View style={styles.checkInfo}>
                    <Text style={styles.checkName}>{check.name}</Text>
                    <Text style={styles.checkDetails}>{check.details}</Text>
                  </View>
                  <View style={styles.checkStatus}>
                    <Text style={[styles.checkStatusText, { color: getStatusColor(check.status) }]}>{check.status}</Text>
                    <Text style={styles.checkTime}>{check.lastChecked}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Certificates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Digital Certificates</Text>
          <View style={styles.certsGrid}>
            {certificates.map(cert => {
              const StatusIcon = getStatusIcon(cert.status);
              return (
                <TouchableOpacity key={cert.id} style={styles.certCard} onPress={() => openCertDetail(cert)}>
                  <View style={styles.certHeader}>
                    <View style={[styles.certIcon, { backgroundColor: `${getStatusColor(cert.status)}20` }]}>
                      <Key size={20} color={getStatusColor(cert.status)} />
                    </View>
                    <StatusIcon size={16} color={getStatusColor(cert.status)} />
                  </View>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certType}>{cert.type}</Text>
                  <View style={styles.certExpiry}>
                    <Calendar size={12} color={isDark ? '#64748B' : '#94A3B8'} />
                    <Text style={styles.certExpiryText}>{cert.daysRemaining} days left</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* API Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Connection</Text>
          <View style={styles.apiCard}>
            <View style={styles.apiStatus}>
              <View style={[styles.apiDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.apiStatusText}>Connected to NRS API</Text>
            </View>
            <View style={styles.apiDetails}>
              <View style={styles.apiDetail}>
                <Server size={14} color={isDark ? '#64748B' : '#94A3B8'} />
                <Text style={styles.apiDetailText}>api.nrs.gov.ng</Text>
              </View>
              <View style={styles.apiDetail}>
                <Clock size={14} color={isDark ? '#64748B' : '#94A3B8'} />
                <Text style={styles.apiDetailText}>Latency: 45ms</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Certificate Detail Modal */}
        <Modal visible={isCertModalVisible} animationType="slide" transparent onRequestClose={() => setIsCertModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Certificate Details</Text>
                <TouchableOpacity onPress={() => setIsCertModalVisible(false)}><X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} /></TouchableOpacity>
              </View>
              {selectedCert && (
                <ScrollView style={styles.modalBody}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name</Text>
                    <Text style={styles.detailValue}>{selectedCert.name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Type</Text>
                    <Text style={styles.detailValue}>{selectedCert.type}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Issuer</Text>
                    <Text style={styles.detailValue}>{selectedCert.issuer}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Expiry Date</Text>
                    <Text style={styles.detailValue}>{selectedCert.expiryDate}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(selectedCert.status)}20` }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(selectedCert.status) }]}>{selectedCert.status}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Days Remaining</Text>
                    <Text style={[styles.detailValue, { color: getStatusColor(selectedCert.status), fontWeight: '700' }]}>
                      {selectedCert.daysRemaining} days
                    </Text>
                  </View>
                </ScrollView>
              )}
              <View style={styles.modalFooter}>
                {selectedCert?.status === 'Expiring' && (
                  <TouchableOpacity style={[styles.renewButton, { backgroundColor: moduleColor }]} onPress={handleRenewCertificate}>
                    <RefreshCw size={18} color="#FFFFFF" />
                    <Text style={styles.renewButtonText}>Renew Certificate</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ModuleLayout>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 32 },
  scoreCard: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0' },
  scoreHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  scoreTitle: { fontSize: 18, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
  refreshButton: { padding: 8 },
  scoreContent: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  scoreCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 6, justifyContent: 'center', alignItems: 'center' },
  scoreValue: { fontSize: 28, fontWeight: '700' },
  scoreStats: { flex: 1, gap: 12 },
  scoreStat: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scoreStatValue: { fontSize: 16, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
  scoreStatLabel: { fontSize: 12, color: isDark ? '#64748B' : '#94A3B8' },
  lastSync: { fontSize: 11, color: isDark ? '#64748B' : '#94A3B8', marginTop: 16, textAlign: 'center' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 12 },
  checksCard: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0' },
  checkRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  checkRowBorder: { borderBottomWidth: 1, borderBottomColor: isDark ? '#334155' : '#E2E8F0' },
  checkIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  checkInfo: { flex: 1 },
  checkName: { fontSize: 14, fontWeight: '500', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 2 },
  checkDetails: { fontSize: 12, color: isDark ? '#64748B' : '#94A3B8' },
  checkStatus: { alignItems: 'flex-end' },
  checkStatusText: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
  checkTime: { fontSize: 10, color: isDark ? '#64748B' : '#94A3B8' },
  certsGrid: { gap: 12 },
  certCard: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0' },
  certHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  certIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  certName: { fontSize: 15, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 4 },
  certType: { fontSize: 13, color: isDark ? '#94A3B8' : '#64748B', marginBottom: 12 },
  certExpiry: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  certExpiryText: { fontSize: 12, color: isDark ? '#64748B' : '#94A3B8' },
  apiCard: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0' },
  apiStatus: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  apiDot: { width: 10, height: 10, borderRadius: 5 },
  apiStatusText: { fontSize: 15, fontWeight: '500', color: isDark ? '#FFFFFF' : '#0F172A' },
  apiDetails: { flexDirection: 'row', gap: 20 },
  apiDetail: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  apiDetailText: { fontSize: 13, color: isDark ? '#94A3B8' : '#64748B' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: isDark ? '#334155' : '#E2E8F0' },
  modalTitle: { fontSize: 18, fontWeight: '600', color: isDark ? '#FFFFFF' : '#0F172A' },
  modalBody: { padding: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: isDark ? '#334155' : '#E2E8F0' },
  detailLabel: { fontSize: 14, color: isDark ? '#94A3B8' : '#64748B' },
  detailValue: { fontSize: 14, fontWeight: '500', color: isDark ? '#FFFFFF' : '#0F172A' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '600' },
  modalFooter: { padding: 20, borderTopWidth: 1, borderTopColor: isDark ? '#334155' : '#E2E8F0' },
  renewButton: { flexDirection: 'row', gap: 8, paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  renewButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
});
