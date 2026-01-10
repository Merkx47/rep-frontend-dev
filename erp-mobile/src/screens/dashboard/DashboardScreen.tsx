/**
 * Dashboard Screen
 * Mirrors the web app dashboard exactly - module grid with category sidebar
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  Users,
  LayoutGrid,
  ShoppingCart,
  Calculator,
  Factory,
  FileText,
  Building2,
  Package,
  CreditCard,
  FileCheck,
} from 'lucide-react-native';

import { useAuth } from '@/hooks/useAuth';
import { modules, categories } from '@/config/modules';
import { spacing, borderRadius } from '@/config/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Icon mapping - matches web app icons
const getModuleIcon = (moduleId: string, color: string, size: number = 24) => {
  const icons: Record<string, React.ReactNode> = {
    sales: <ShoppingCart size={size} color={color} />,
    accounting: <Calculator size={size} color={color} />,
    hr: <Users size={size} color={color} />,
    production: <Factory size={size} color={color} />,
    invoice: <FileText size={size} color={color} />,
    bank: <Building2 size={size} color={color} />,
    'fixed-assets': <Package size={size} color={color} />,
    'corporate-cards': <CreditCard size={size} color={color} />,
    'nrs-einvoice': <FileCheck size={size} color={color} />,
  };
  return icons[moduleId] || <Package size={size} color={color} />;
};

// Module ID to screen name mapping
const moduleScreenMap: Record<string, string> = {
  sales: 'Sales',
  accounting: 'Accounting',
  hr: 'HR',
  production: 'Production',
  invoice: 'Invoice',
  bank: 'Bank',
  'fixed-assets': 'FixedAssets',
  'corporate-cards': 'CorporateCards',
  'nrs-einvoice': 'NRSEInvoice',
};

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const systemColorScheme = useColorScheme();

  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = async () => {
    await logout();
  };

  const handleModulePress = (moduleId: string, _moduleName: string) => {
    const screenName = moduleScreenMap[moduleId];
    if (screenName) {
      // @ts-ignore - dynamic navigation
      navigation.navigate(screenName);
    }
  };

  const filteredModules = selectedCategory
    ? modules.filter((m) => m.category === selectedCategory)
    : modules;

  const currentCategoryName = selectedCategory || 'All Apps';
  const currentCategoryDescription = selectedCategory
    ? `Explore ${selectedCategory.toLowerCase()} tools to boost your productivity`
    : 'Select an app to get started with your business operations';

  // Get user initials
  const userInitials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`;

  const styles = createStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header - matches web exactly */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setSidebarOpen(true)}
          >
            <Menu size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
          <Text style={styles.logo}>Qorpy</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
            {isDarkMode ? (
              <Sun size={18} color="#9CA3AF" />
            ) : (
              <Moon size={18} color="#6B7280" />
            )}
          </TouchableOpacity>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitials}</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={18} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Header */}
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>{currentCategoryName}</Text>
          <Text style={styles.categoryDescription}>{currentCategoryDescription}</Text>
        </View>

        {/* Category Pills (Horizontal Scroll for Mobile) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryPills}
          contentContainerStyle={styles.categoryPillsContent}
        >
          {categories.map((category) => {
            const isActive =
              (category.filter === null && selectedCategory === null) ||
              category.filter === selectedCategory;

            return (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryPill,
                  isActive && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(category.filter)}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isActive && styles.categoryPillTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* App Cards Grid - Zoho Style matching web */}
        <View style={styles.modulesGrid}>
          {filteredModules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={[styles.moduleCard, { borderColor: module.color }]}
              activeOpacity={0.7}
              onPress={() => handleModulePress(module.id, module.name)}
            >
              {/* Icon */}
              <View style={[styles.moduleIcon, { backgroundColor: `${module.color}15` }]}>
                {getModuleIcon(module.id, module.color)}
              </View>

              {/* Name */}
              <Text style={[styles.moduleName, { color: module.color }]}>
                {module.name}
              </Text>

              {/* Description */}
              <Text style={styles.moduleDescription} numberOfLines={2}>
                {module.shortDescription}
              </Text>

              {/* Try Now Link */}
              <View style={styles.tryNowContainer}>
                <Text style={[styles.tryNowText, { color: module.color }]}>
                  TRY NOW
                </Text>
                <ChevronRight size={12} color={module.color} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Sidebar Modal - matches web sidebar */}
      <Modal
        visible={sidebarOpen}
        animationType="none"
        transparent={true}
        onRequestClose={() => setSidebarOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setSidebarOpen(false)}
          />
          <View style={[styles.sidebar, isDarkMode && styles.sidebarDark]}>
            {/* Sidebar Header */}
            <View style={styles.sidebarHeader}>
              <Text style={[styles.logo, isDarkMode && styles.textWhite]}>Qorpy</Text>
              <TouchableOpacity onPress={() => setSidebarOpen(false)}>
                <X size={24} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.sidebarContent}>
              {/* Apps Section */}
              <Text style={styles.sidebarSectionTitle}>APPS</Text>
              {categories.map((category) => {
                const isActive =
                  (category.filter === null && selectedCategory === null) ||
                  category.filter === selectedCategory;

                return (
                  <TouchableOpacity
                    key={category.name}
                    style={[
                      styles.sidebarItem,
                      isActive && styles.sidebarItemActive,
                    ]}
                    onPress={() => {
                      setSelectedCategory(category.filter);
                      setSidebarOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.sidebarItemText,
                        isActive && styles.sidebarItemTextActive,
                      ]}
                    >
                      {category.name}
                    </Text>
                    {isActive && (
                      <ChevronRight size={16} color="#3B82F6" />
                    )}
                  </TouchableOpacity>
                );
              })}

              {/* Administration Section */}
              <View style={styles.sidebarDivider} />
              <Text style={styles.sidebarSectionTitle}>ADMINISTRATION</Text>

              <TouchableOpacity
                style={styles.sidebarItem}
                onPress={() => {
                  setSidebarOpen(false);
                  // @ts-ignore
                  navigation.navigate('UserManagement');
                }}
              >
                <View style={styles.sidebarItemWithIcon}>
                  <Users size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                  <Text style={styles.sidebarItemText}>User Management</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sidebarItem}
                onPress={() => {
                  setSidebarOpen(false);
                  // @ts-ignore
                  navigation.navigate('AppManagement');
                }}
              >
                <View style={styles.sidebarItemWithIcon}>
                  <LayoutGrid size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                  <Text style={styles.sidebarItemText}>App Management</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
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
    // Header
    header: {
      height: 64,
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
    menuButton: {
      padding: 8,
    },
    logo: {
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
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark ? '#3B82F620' : '#3B82F610',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#3B82F6',
    },
    logoutButton: {
      padding: 8,
    },
    // Content
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 32,
    },
    categoryHeader: {
      marginBottom: 16,
    },
    categoryTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 4,
    },
    categoryDescription: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    // Category Pills
    categoryPills: {
      marginBottom: 20,
    },
    categoryPillsContent: {
      gap: 8,
    },
    categoryPill: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
    },
    categoryPillActive: {
      backgroundColor: '#3B82F620',
    },
    categoryPillText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    categoryPillTextActive: {
      color: '#3B82F6',
    },
    // Module Cards Grid
    modulesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    moduleCard: {
      width: (SCREEN_WIDTH - 44) / 2,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      borderWidth: 2,
      padding: 16,
    },
    moduleIcon: {
      width: 44,
      height: 44,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    moduleName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    moduleDescription: {
      fontSize: 12,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 12,
      lineHeight: 16,
    },
    tryNowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    tryNowText: {
      fontSize: 12,
      fontWeight: '600',
    },
    // Modal & Sidebar
    modalOverlay: {
      flex: 1,
      flexDirection: 'row',
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sidebar: {
      width: 280,
      backgroundColor: '#FFFFFF',
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
    },
    sidebarDark: {
      backgroundColor: '#1E293B',
    },
    sidebarHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      paddingTop: 60,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    sidebarContent: {
      flex: 1,
      padding: 16,
    },
    sidebarSectionTitle: {
      fontSize: 11,
      fontWeight: '600',
      color: isDark ? '#64748B' : '#94A3B8',
      letterSpacing: 1,
      marginBottom: 12,
      marginTop: 8,
    },
    sidebarItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginBottom: 4,
    },
    sidebarItemActive: {
      backgroundColor: '#3B82F610',
    },
    sidebarItemText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    sidebarItemTextActive: {
      color: '#3B82F6',
    },
    sidebarItemWithIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    sidebarDivider: {
      height: 1,
      backgroundColor: isDark ? '#334155' : '#E2E8F0',
      marginVertical: 16,
    },
    textWhite: {
      color: '#FFFFFF',
    },
  });
