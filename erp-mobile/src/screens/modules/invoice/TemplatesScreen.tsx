/**
 * Invoice Templates Screen
 * Manage invoice templates and customize design
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
  FileText,
  RefreshCw,
  Trash2,
  Edit,
  Copy,
  Check,
  LayoutDashboard,
  Palette,
  Settings,
  Eye,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// Invoice navigation items
const invoiceNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, screenName: 'Invoice' },
  { id: 'invoices', label: 'Invoices', icon: FileText, screenName: 'InvoiceList' },
  { id: 'recurring', label: 'Recurring', icon: RefreshCw, screenName: 'InvoiceRecurring' },
  { id: 'templates', label: 'Templates', icon: Palette, screenName: 'InvoiceTemplates' },
  { id: 'settings', label: 'Settings', icon: Settings, screenName: 'InvoiceSettings' },
];

interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  isDefault: boolean;
  layout: 'Standard' | 'Modern' | 'Classic' | 'Minimal';
  headerStyle: 'Logo Left' | 'Logo Center' | 'Logo Right' | 'Text Only';
  showPaymentTerms: boolean;
  showNotes: boolean;
  usageCount: number;
  lastUsed: string | null;
  createdAt: string;
}

const initialTemplates: InvoiceTemplate[] = [
  {
    id: '1',
    name: 'Professional Blue',
    description: 'Clean professional template with blue accents',
    primaryColor: '#3B82F6',
    isDefault: true,
    layout: 'Modern',
    headerStyle: 'Logo Left',
    showPaymentTerms: true,
    showNotes: true,
    usageCount: 156,
    lastUsed: '2024-01-22',
    createdAt: '2023-06-15',
  },
  {
    id: '2',
    name: 'Classic Invoice',
    description: 'Traditional invoice layout for formal documents',
    primaryColor: '#1F2937',
    isDefault: false,
    layout: 'Classic',
    headerStyle: 'Logo Center',
    showPaymentTerms: true,
    showNotes: false,
    usageCount: 89,
    lastUsed: '2024-01-20',
    createdAt: '2023-07-20',
  },
  {
    id: '3',
    name: 'Minimal White',
    description: 'Simple and clean minimal design',
    primaryColor: '#6B7280',
    isDefault: false,
    layout: 'Minimal',
    headerStyle: 'Text Only',
    showPaymentTerms: false,
    showNotes: true,
    usageCount: 45,
    lastUsed: '2024-01-18',
    createdAt: '2023-09-10',
  },
  {
    id: '4',
    name: 'Green Modern',
    description: 'Modern template with eco-friendly green theme',
    primaryColor: '#10B981',
    isDefault: false,
    layout: 'Modern',
    headerStyle: 'Logo Right',
    showPaymentTerms: true,
    showNotes: true,
    usageCount: 32,
    lastUsed: '2024-01-15',
    createdAt: '2023-10-05',
  },
];

const layoutOptions = ['Standard', 'Modern', 'Classic', 'Minimal'];
const headerOptions = ['Logo Left', 'Logo Center', 'Logo Right', 'Text Only'];
const colorOptions = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#1F2937',
];

export default function TemplatesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [templates, setTemplates] = useState<InvoiceTemplate[]>(initialTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    primaryColor: '#3B82F6',
    layout: 'Modern',
    headerStyle: 'Logo Left',
    showPaymentTerms: true,
    showNotes: true,
  });

  const moduleColor = '#3F51B5';

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTemplate = () => {
    if (!formData.name) {
      Alert.alert('Error', 'Please enter a template name');
      return;
    }

    const newTemplate: InvoiceTemplate = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      primaryColor: formData.primaryColor,
      isDefault: false,
      layout: formData.layout as InvoiceTemplate['layout'],
      headerStyle: formData.headerStyle as InvoiceTemplate['headerStyle'],
      showPaymentTerms: formData.showPaymentTerms,
      showNotes: formData.showNotes,
      usageCount: 0,
      lastUsed: null,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTemplates([newTemplate, ...templates]);
    resetForm();
    setIsAddModalVisible(false);
  };

  const handleUpdateTemplate = () => {
    if (!selectedTemplate || !formData.name) return;

    const updatedTemplates = templates.map(tpl =>
      tpl.id === selectedTemplate.id
        ? {
            ...tpl,
            name: formData.name,
            description: formData.description,
            primaryColor: formData.primaryColor,
            layout: formData.layout as InvoiceTemplate['layout'],
            headerStyle: formData.headerStyle as InvoiceTemplate['headerStyle'],
            showPaymentTerms: formData.showPaymentTerms,
            showNotes: formData.showNotes,
          }
        : tpl
    );

    setTemplates(updatedTemplates);
    resetForm();
    setIsAddModalVisible(false);
    setIsEditing(false);
  };

  const handleDeleteTemplate = () => {
    if (!selectedTemplate) return;

    if (selectedTemplate.isDefault) {
      Alert.alert('Error', 'Cannot delete the default template');
      return;
    }

    Alert.alert(
      'Delete Template',
      `Are you sure you want to delete "${selectedTemplate.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTemplates(templates.filter(t => t.id !== selectedTemplate.id));
            setIsActionMenuVisible(false);
            setSelectedTemplate(null);
          },
        },
      ]
    );
  };

  const handleSetDefault = () => {
    if (!selectedTemplate) return;

    const updatedTemplates = templates.map(tpl => ({
      ...tpl,
      isDefault: tpl.id === selectedTemplate.id,
    }));
    setTemplates(updatedTemplates);
    setIsActionMenuVisible(false);
    Alert.alert('Success', `"${selectedTemplate.name}" is now the default template`);
  };

  const handleDuplicate = () => {
    if (!selectedTemplate) return;

    const duplicatedTemplate: InvoiceTemplate = {
      ...selectedTemplate,
      id: Date.now().toString(),
      name: `${selectedTemplate.name} (Copy)`,
      isDefault: false,
      usageCount: 0,
      lastUsed: null,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTemplates([duplicatedTemplate, ...templates]);
    setIsActionMenuVisible(false);
    Alert.alert('Success', 'Template duplicated successfully');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      primaryColor: '#3B82F6',
      layout: 'Modern',
      headerStyle: 'Logo Left',
      showPaymentTerms: true,
      showNotes: true,
    });
    setSelectedTemplate(null);
    setIsEditing(false);
  };

  const openEditModal = () => {
    if (!selectedTemplate) return;

    setFormData({
      name: selectedTemplate.name,
      description: selectedTemplate.description,
      primaryColor: selectedTemplate.primaryColor,
      layout: selectedTemplate.layout,
      headerStyle: selectedTemplate.headerStyle,
      showPaymentTerms: selectedTemplate.showPaymentTerms,
      showNotes: selectedTemplate.showNotes,
    });
    setIsEditing(true);
    setIsActionMenuVisible(false);
    setIsAddModalVisible(true);
  };

  const renderTemplate = ({ item }: { item: InvoiceTemplate }) => (
    <TouchableOpacity
      style={styles.templateCard}
      onPress={() => {
        setSelectedTemplate(item);
        setIsPreviewModalVisible(true);
      }}
    >
      <View style={styles.templatePreview}>
        <View style={[styles.previewHeader, { backgroundColor: item.primaryColor }]}>
          <View style={styles.previewLogo} />
          <View style={styles.previewLines}>
            <View style={styles.previewLine} />
            <View style={[styles.previewLine, { width: '60%' }]} />
          </View>
        </View>
        <View style={styles.previewBody}>
          <View style={[styles.previewLine, { width: '80%' }]} />
          <View style={[styles.previewLine, { width: '100%' }]} />
          <View style={[styles.previewLine, { width: '70%' }]} />
        </View>
      </View>

      <View style={styles.templateInfo}>
        <View style={styles.templateHeader}>
          <View style={styles.templateNameRow}>
            <Text style={styles.templateName}>{item.name}</Text>
            {item.isDefault && (
              <View style={styles.defaultBadge}>
                <Check size={10} color="#10B981" />
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setSelectedTemplate(item);
              setIsActionMenuVisible(true);
            }}
          >
            <MoreVertical size={18} color={isDark ? '#94A3B8' : '#64748B'} />
          </TouchableOpacity>
        </View>

        <Text style={styles.templateDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.templateMeta}>
          <View style={styles.metaItem}>
            <View style={[styles.colorDot, { backgroundColor: item.primaryColor }]} />
            <Text style={styles.metaText}>{item.layout}</Text>
          </View>
          <Text style={styles.usageText}>{item.usageCount} uses</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ModuleLayout
      moduleId="invoice"
      navItems={invoiceNavItems}
      activeScreen="InvoiceTemplates"
      title="Invoice Templates"
    >
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={isDark ? '#94A3B8' : '#64748B'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search templates..."
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

        {/* Templates Grid */}
        <FlatList
          data={filteredTemplates}
          renderItem={renderTemplate}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />

        {/* Add/Edit Modal */}
        <Modal
          visible={isAddModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsAddModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isEditing ? 'Edit Template' : 'New Template'}
                </Text>
                <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                  <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.inputLabel}>Template Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="e.g., Professional Blue"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                />

                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Describe your template"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  multiline
                  numberOfLines={2}
                />

                <Text style={styles.inputLabel}>Primary Color</Text>
                <View style={styles.colorGrid}>
                  {colorOptions.map(color => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        formData.primaryColor === color && styles.colorSelected,
                      ]}
                      onPress={() => setFormData({ ...formData, primaryColor: color })}
                    >
                      {formData.primaryColor === color && (
                        <Check size={16} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Layout Style</Text>
                <View style={styles.optionsRow}>
                  {layoutOptions.map(layout => (
                    <TouchableOpacity
                      key={layout}
                      style={[
                        styles.optionButton,
                        formData.layout === layout && { backgroundColor: moduleColor, borderColor: moduleColor },
                      ]}
                      onPress={() => setFormData({ ...formData, layout })}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          formData.layout === layout && { color: '#FFFFFF' },
                        ]}
                      >
                        {layout}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Header Style</Text>
                <View style={styles.optionsRow}>
                  {headerOptions.map(header => (
                    <TouchableOpacity
                      key={header}
                      style={[
                        styles.optionButton,
                        formData.headerStyle === header && { backgroundColor: moduleColor, borderColor: moduleColor },
                      ]}
                      onPress={() => setFormData({ ...formData, headerStyle: header })}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          formData.headerStyle === header && { color: '#FFFFFF' },
                        ]}
                      >
                        {header}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Show Payment Terms</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggle,
                      formData.showPaymentTerms && { backgroundColor: moduleColor },
                    ]}
                    onPress={() => setFormData({ ...formData, showPaymentTerms: !formData.showPaymentTerms })}
                  >
                    {formData.showPaymentTerms && <Check size={14} color="#FFFFFF" />}
                  </TouchableOpacity>
                </View>

                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Show Notes Section</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggle,
                      formData.showNotes && { backgroundColor: moduleColor },
                    ]}
                    onPress={() => setFormData({ ...formData, showNotes: !formData.showNotes })}
                  >
                    {formData.showNotes && <Check size={14} color="#FFFFFF" />}
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsAddModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: moduleColor }]}
                  onPress={isEditing ? handleUpdateTemplate : handleAddTemplate}
                >
                  <Text style={styles.submitButtonText}>
                    {isEditing ? 'Update' : 'Create'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Preview Modal */}
        <Modal
          visible={isPreviewModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsPreviewModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedTemplate?.name}</Text>
                <TouchableOpacity onPress={() => setIsPreviewModalVisible(false)}>
                  <X size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              {selectedTemplate && (
                <ScrollView style={styles.modalBody}>
                  {/* Large Preview */}
                  <View style={styles.largePreview}>
                    <View style={[styles.largePreviewHeader, { backgroundColor: selectedTemplate.primaryColor }]}>
                      <View style={styles.largePreviewLogo}>
                        <Text style={styles.logoText}>LOGO</Text>
                      </View>
                      <View style={styles.largePreviewInfo}>
                        <Text style={styles.previewTitle}>INVOICE</Text>
                        <Text style={styles.previewInvoiceNo}>#INV-001</Text>
                      </View>
                    </View>
                    <View style={styles.largePreviewBody}>
                      <View style={styles.previewSection}>
                        <View style={styles.previewRow}>
                          <View style={styles.previewCol}>
                            <Text style={styles.previewLabel}>Bill To</Text>
                            <Text style={styles.previewValue}>Client Name</Text>
                          </View>
                          <View style={styles.previewCol}>
                            <Text style={styles.previewLabel}>Date</Text>
                            <Text style={styles.previewValue}>2024-01-22</Text>
                          </View>
                        </View>
                      </View>
                      <View style={[styles.previewTable, { borderColor: selectedTemplate.primaryColor }]}>
                        <View style={[styles.tableHeader, { backgroundColor: `${selectedTemplate.primaryColor}20` }]}>
                          <Text style={[styles.tableHeaderText, { color: selectedTemplate.primaryColor }]}>Item</Text>
                          <Text style={[styles.tableHeaderText, { color: selectedTemplate.primaryColor }]}>Amount</Text>
                        </View>
                        <View style={styles.tableRow}>
                          <Text style={styles.tableCell}>Service Item</Text>
                          <Text style={styles.tableCell}>$1,000</Text>
                        </View>
                      </View>
                      <View style={styles.totalSection}>
                        <Text style={[styles.totalLabel, { color: selectedTemplate.primaryColor }]}>Total: $1,000</Text>
                      </View>
                    </View>
                  </View>

                  {/* Template Details */}
                  <View style={styles.detailsSection}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Layout</Text>
                      <Text style={styles.detailValue}>{selectedTemplate.layout}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Header Style</Text>
                      <Text style={styles.detailValue}>{selectedTemplate.headerStyle}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Usage Count</Text>
                      <Text style={styles.detailValue}>{selectedTemplate.usageCount} invoices</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Created</Text>
                      <Text style={styles.detailValue}>{selectedTemplate.createdAt}</Text>
                    </View>
                  </View>
                </ScrollView>
              )}

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsPreviewModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: moduleColor }]}
                  onPress={() => {
                    setIsPreviewModalVisible(false);
                    handleSetDefault();
                  }}
                >
                  <Text style={styles.submitButtonText}>Use Template</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Action Menu Modal */}
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
                  setIsPreviewModalVisible(true);
                }}
              >
                <Eye size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
                <Text style={styles.actionMenuText}>Preview</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionMenuItem} onPress={openEditModal}>
                <Edit size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
                <Text style={styles.actionMenuText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionMenuItem} onPress={handleDuplicate}>
                <Copy size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
                <Text style={styles.actionMenuText}>Duplicate</Text>
              </TouchableOpacity>

              {!selectedTemplate?.isDefault && (
                <TouchableOpacity style={styles.actionMenuItem} onPress={handleSetDefault}>
                  <Check size={18} color="#10B981" />
                  <Text style={[styles.actionMenuText, { color: '#10B981' }]}>Set as Default</Text>
                </TouchableOpacity>
              )}

              {!selectedTemplate?.isDefault && (
                <TouchableOpacity style={styles.actionMenuItem} onPress={handleDeleteTemplate}>
                  <Trash2 size={18} color="#EF4444" />
                  <Text style={[styles.actionMenuText, { color: '#EF4444' }]}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </ModuleLayout>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    searchContainer: {
      flexDirection: 'row',
      padding: 16,
      gap: 12,
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    searchInput: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 8,
      color: isDark ? '#FFFFFF' : '#0F172A',
      fontSize: 15,
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listContent: {
      padding: 16,
      paddingTop: 0,
    },
    row: {
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    templateCard: {
      width: '48%',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    templatePreview: {
      height: 100,
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      padding: 12,
    },
    previewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
      padding: 6,
      borderRadius: 4,
    },
    previewLogo: {
      width: 20,
      height: 20,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 4,
    },
    previewLines: {
      flex: 1,
      gap: 4,
    },
    previewLine: {
      height: 4,
      backgroundColor: isDark ? '#334155' : '#E2E8F0',
      borderRadius: 2,
      width: '100%',
    },
    previewBody: {
      gap: 6,
    },
    templateInfo: {
      padding: 12,
    },
    templateHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    templateNameRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap',
    },
    templateName: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    defaultBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      backgroundColor: '#D1FAE5',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    defaultText: {
      fontSize: 10,
      fontWeight: '600',
      color: '#10B981',
    },
    menuButton: {
      padding: 2,
    },
    templateDescription: {
      fontSize: 12,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 8,
    },
    templateMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    colorDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    metaText: {
      fontSize: 11,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    usageText: {
      fontSize: 11,
      color: isDark ? '#64748B' : '#94A3B8',
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
    modalBody: {
      padding: 20,
    },
    inputLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 8,
    },
    input: {
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      borderRadius: 10,
      padding: 12,
      fontSize: 15,
      color: isDark ? '#FFFFFF' : '#0F172A',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      marginBottom: 16,
    },
    textArea: {
      height: 60,
      textAlignVertical: 'top',
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 16,
    },
    colorOption: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    colorSelected: {
      borderWidth: 3,
      borderColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    optionsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    optionButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    },
    optionText: {
      fontSize: 12,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    toggleLabel: {
      fontSize: 14,
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    toggle: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    },
    modalFooter: {
      flexDirection: 'row',
      padding: 20,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: isDark ? '#0F172A' : '#F1F5F9',
    },
    cancelButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    submitButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    submitButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    largePreview: {
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      marginBottom: 20,
    },
    largePreviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    largePreviewLogo: {
      width: 50,
      height: 50,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '600',
    },
    largePreviewInfo: {
      alignItems: 'flex-end',
    },
    previewTitle: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    previewInvoiceNo: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 12,
    },
    largePreviewBody: {
      backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
      padding: 16,
    },
    previewSection: {
      marginBottom: 16,
    },
    previewRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    previewCol: {},
    previewLabel: {
      fontSize: 10,
      color: isDark ? '#64748B' : '#94A3B8',
      marginBottom: 2,
    },
    previewValue: {
      fontSize: 12,
      color: isDark ? '#FFFFFF' : '#0F172A',
      fontWeight: '500',
    },
    previewTable: {
      borderWidth: 1,
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 12,
    },
    tableHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 8,
    },
    tableHeaderText: {
      fontSize: 10,
      fontWeight: '600',
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 8,
      backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
    },
    tableCell: {
      fontSize: 10,
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    totalSection: {
      alignItems: 'flex-end',
    },
    totalLabel: {
      fontSize: 14,
      fontWeight: '700',
    },
    detailsSection: {
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      borderRadius: 12,
      padding: 16,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    detailLabel: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    detailValue: {
      fontSize: 13,
      color: isDark ? '#FFFFFF' : '#0F172A',
      fontWeight: '500',
    },
    actionMenuOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionMenu: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 16,
      padding: 8,
      width: '80%',
      maxWidth: 300,
    },
    actionMenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      gap: 12,
    },
    actionMenuText: {
      fontSize: 15,
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
  });
