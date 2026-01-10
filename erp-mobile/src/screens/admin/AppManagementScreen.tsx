/**
 * App Management Admin Screen
 * Matches web app's centralized app management
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Switch,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Sun,
  Moon,
  LayoutGrid,
  Users,
  Shield,
  Settings,
  ShoppingCart,
  Calculator,
  Factory,
  FileText,
  Building2,
  Package,
  CreditCard,
  FileCheck,
  ChevronRight,
} from 'lucide-react-native';

import { modules } from '@/config/modules';

// Mock app data with usage stats
const appData = modules.map((m) => ({
  ...m,
  isEnabled: true,
  usersWithAccess: Math.floor(Math.random() * 20) + 5,
  roles: [
    { id: '1', name: 'Admin', isSystem: true },
    { id: '2', name: 'Manager', isSystem: true },
    { id: '3', name: 'Viewer', isSystem: true },
  ],
}));

// Icon mapping
const getIcon = (moduleId: string) => {
  const icons: Record<string, any> = {
    sales: ShoppingCart,
    accounting: Calculator,
    hr: Users,
    production: Factory,
    invoice: FileText,
    bank: Building2,
    'fixed-assets': Package,
    'corporate-cards': CreditCard,
    'nrs-einvoice': FileCheck,
  };
  return icons[moduleId] || Package;
};

// Stats data
const appStats = [
  { label: 'Enabled Apps', value: '9', icon: LayoutGrid, color: '#6366F1' },
  { label: 'Available', value: '12', icon: Package, color: '#10B981' },
  { label: 'Users w/ Access', value: '24', icon: Users, color: '#3B82F6' },
  { label: 'Custom Roles', value: '6', icon: Shield, color: '#8B5CF6' },
];

export default function AppManagementScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [apps, setApps] = useState(appData);
  const [selectedApp, setSelectedApp] = useState<typeof appData[0] | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const goBack = () => {
    navigation.goBack();
  };

  const toggleApp = (appId: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, isEnabled: !app.isEnabled } : app
      )
    );
  };

  const openAppDetails = (app: typeof appData[0]) => {
    setSelectedApp(app);
    setDetailsVisible(true);
  };

  const styles = createStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <ArrowLeft size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>App Management</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
            {isDarkMode ? (
              <Sun size={18} color="#9CA3AF" />
            ) : (
              <Moon size={18} color="#6B7280" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {appStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                  <Icon size={18} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Apps List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Apps</Text>

          <View style={styles.appsCard}>
            {apps.map((app, index) => {
              const Icon = getIcon(app.id);
              return (
                <TouchableOpacity
                  key={app.id}
                  style={[
                    styles.appRow,
                    index !== apps.length - 1 && styles.appRowBorder,
                  ]}
                  onPress={() => openAppDetails(app)}
                >
                  <View style={[styles.appIcon, { backgroundColor: `${app.color}20` }]}>
                    <Icon size={20} color={app.color} />
                  </View>
                  <View style={styles.appInfo}>
                    <Text style={styles.appName}>{app.name}</Text>
                    <Text style={styles.appDescription} numberOfLines={1}>
                      {app.shortDescription}
                    </Text>
                    <View style={styles.appMeta}>
                      <Users size={12} color={isDarkMode ? '#64748B' : '#94A3B8'} />
                      <Text style={styles.appMetaText}>
                        {app.usersWithAccess} users
                      </Text>
                      <Shield size={12} color={isDarkMode ? '#64748B' : '#94A3B8'} />
                      <Text style={styles.appMetaText}>
                        {app.roles.length} roles
                      </Text>
                    </View>
                  </View>
                  <View style={styles.appActions}>
                    <Switch
                      value={app.isEnabled}
                      onValueChange={() => toggleApp(app.id)}
                      trackColor={{ false: '#334155', true: `${app.color}50` }}
                      thumbColor={app.isEnabled ? app.color : '#64748B'}
                    />
                    <ChevronRight size={16} color={isDarkMode ? '#64748B' : '#94A3B8'} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* App Details Modal */}
      <Modal
        visible={detailsVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDetailsVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, isDarkMode && styles.modalContainerDark]}>
          {selectedApp && (
            <>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setDetailsVisible(false)}>
                  <ArrowLeft size={24} color={isDarkMode ? '#FFFFFF' : '#0F172A'} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{selectedApp.name}</Text>
                <View style={{ width: 24 }} />
              </View>

              <ScrollView style={styles.modalContent}>
                {/* App Info */}
                <View style={styles.modalSection}>
                  <View
                    style={[
                      styles.modalAppIcon,
                      { backgroundColor: `${selectedApp.color}20` },
                    ]}
                  >
                    {(() => {
                      const Icon = getIcon(selectedApp.id);
                      return <Icon size={32} color={selectedApp.color} />;
                    })()}
                  </View>
                  <Text style={styles.modalAppName}>{selectedApp.name}</Text>
                  <Text style={styles.modalAppDescription}>
                    {selectedApp.shortDescription}
                  </Text>
                </View>

                {/* Status */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Status</Text>
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>App Enabled</Text>
                    <Switch
                      value={selectedApp.isEnabled}
                      onValueChange={() => {
                        toggleApp(selectedApp.id);
                        setSelectedApp((prev) =>
                          prev ? { ...prev, isEnabled: !prev.isEnabled } : null
                        );
                      }}
                      trackColor={{ false: '#334155', true: `${selectedApp.color}50` }}
                      thumbColor={selectedApp.isEnabled ? selectedApp.color : '#64748B'}
                    />
                  </View>
                </View>

                {/* Users */}
                <View style={styles.modalSection}>
                  <View style={styles.modalSectionHeader}>
                    <Text style={styles.modalSectionTitle}>Users with Access</Text>
                    <TouchableOpacity>
                      <Text style={[styles.manageLink, { color: selectedApp.color }]}>
                        Manage
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.userCount}>
                    {selectedApp.usersWithAccess} users have access to this app
                  </Text>
                </View>

                {/* Roles */}
                <View style={styles.modalSection}>
                  <View style={styles.modalSectionHeader}>
                    <Text style={styles.modalSectionTitle}>Roles</Text>
                    <TouchableOpacity>
                      <Text style={[styles.manageLink, { color: selectedApp.color }]}>
                        Add Role
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rolesCard}>
                    {selectedApp.roles.map((role, index) => (
                      <View
                        key={role.id}
                        style={[
                          styles.roleRow,
                          index !== selectedApp.roles.length - 1 && styles.roleRowBorder,
                        ]}
                      >
                        <View style={styles.roleInfo}>
                          <Text style={styles.roleName}>{role.name}</Text>
                          {role.isSystem && (
                            <View style={styles.systemBadge}>
                              <Text style={styles.systemBadgeText}>System</Text>
                            </View>
                          )}
                        </View>
                        <ChevronRight
                          size={16}
                          color={isDarkMode ? '#64748B' : '#94A3B8'}
                        />
                      </View>
                    ))}
                  </View>
                </View>

                {/* Settings */}
                <View style={styles.modalSection}>
                  <TouchableOpacity style={styles.settingsButton}>
                    <Settings size={20} color={selectedApp.color} />
                    <Text style={[styles.settingsButtonText, { color: selectedApp.color }]}>
                      App Settings
                    </Text>
                    <ChevronRight size={16} color={selectedApp.color} />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    },
    header: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#1E293B' : '#E2E8F0',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    themeButton: {
      padding: 8,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 32,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      width: '48%',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      alignItems: 'center',
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    statValue: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 12,
    },
    appsCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      overflow: 'hidden',
    },
    appRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    appRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    appIcon: {
      width: 44,
      height: 44,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    appInfo: {
      flex: 1,
    },
    appName: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    appDescription: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 6,
    },
    appMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    appMetaText: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
      marginRight: 8,
    },
    appActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    // Modal
    modalContainer: {
      flex: 1,
      backgroundColor: '#F8FAFC',
    },
    modalContainerDark: {
      backgroundColor: '#0F172A',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#1E293B' : '#E2E8F0',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    modalContent: {
      flex: 1,
      padding: 16,
    },
    modalSection: {
      marginBottom: 24,
    },
    modalAppIcon: {
      width: 64,
      height: 64,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 16,
    },
    modalAppName: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
      textAlign: 'center',
      marginBottom: 8,
    },
    modalAppDescription: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
      textAlign: 'center',
    },
    modalSectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 12,
    },
    modalSectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    manageLink: {
      fontSize: 14,
      fontWeight: '500',
    },
    statusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    statusLabel: {
      fontSize: 15,
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    userCount: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    rolesCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      overflow: 'hidden',
    },
    roleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    roleRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    roleInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    roleName: {
      fontSize: 15,
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    systemBadge: {
      backgroundColor: isDark ? '#334155' : '#E2E8F0',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    systemBadgeText: {
      fontSize: 11,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    settingsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      gap: 12,
    },
    settingsButtonText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
    },
  });
