/**
 * Module Layout Component
 * Matches web app's SidebarLayout - sidebar with nav items + content area
 */

import React, { useState, createContext, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Menu,
  X,
  Sun,
  Moon,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  LogOut,
  type LucideIcon,
} from 'lucide-react-native';

import { useAuth } from '@/hooks/useAuth';
import { modules } from '@/config/modules';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Module Context for sharing module color
interface ModuleContextType {
  moduleId: string;
  moduleColor: string;
  moduleName: string;
}

const ModuleContext = createContext<ModuleContextType>({
  moduleId: '',
  moduleColor: '#3B82F6',
  moduleName: '',
});

export const useModule = () => useContext(ModuleContext);

// Nav Item type
export interface NavItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  screenName?: string;
  children?: NavItem[];
}

interface ModuleLayoutProps {
  moduleId: string;
  navItems: NavItem[];
  activeScreen?: string;
  children: React.ReactNode;
  title?: string;
}

export default function ModuleLayout({
  moduleId,
  navItems,
  activeScreen,
  children,
  title,
}: ModuleLayoutProps) {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const systemColorScheme = useColorScheme();

  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const module = modules.find((m) => m.id === moduleId);
  const moduleColor = module?.color || '#3B82F6';
  const moduleName = module?.name || 'Module';

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = async () => {
    await logout();
  };

  const goBack = () => {
    navigation.goBack();
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const navigateToScreen = (screenName: string) => {
    setSidebarOpen(false);
    // @ts-ignore - dynamic navigation
    navigation.navigate(screenName);
  };

  // Get user initials
  const userInitials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`;

  const styles = createStyles(isDarkMode, moduleColor);

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const isActive = activeScreen === item.screenName;
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon;

    return (
      <View key={item.id}>
        <TouchableOpacity
          style={[
            styles.navItem,
            { paddingLeft: 16 + depth * 16 },
            isActive && styles.navItemActive,
          ]}
          onPress={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else if (item.screenName) {
              navigateToScreen(item.screenName);
            }
          }}
        >
          <View style={styles.navItemContent}>
            {Icon && (
              <Icon
                size={18}
                color={isActive ? moduleColor : isDarkMode ? '#94A3B8' : '#64748B'}
              />
            )}
            <Text
              style={[
                styles.navItemText,
                isActive && { color: moduleColor },
              ]}
            >
              {item.label}
            </Text>
          </View>
          {hasChildren && (
            isExpanded ? (
              <ChevronDown size={16} color={isDarkMode ? '#94A3B8' : '#64748B'} />
            ) : (
              <ChevronRight size={16} color={isDarkMode ? '#94A3B8' : '#64748B'} />
            )
          )}
        </TouchableOpacity>

        {hasChildren && isExpanded && (
          <View style={styles.navChildren}>
            {item.children!.map((child) => renderNavItem(child, depth + 1))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ModuleContext.Provider value={{ moduleId, moduleColor, moduleName }}>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setSidebarOpen(true)}
            >
              <Menu size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
            <View style={[styles.moduleIndicator, { backgroundColor: `${moduleColor}20` }]}>
              <Text style={[styles.moduleIndicatorText, { color: moduleColor }]}>
                {moduleName}
              </Text>
            </View>
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

        {/* Page Title (if provided) */}
        {title && (
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>{title}</Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>

        {/* Sidebar Modal */}
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
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    setSidebarOpen(false);
                    goBack();
                  }}
                >
                  <ArrowLeft size={18} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                  <Text style={styles.backText}>Back to Apps</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSidebarOpen(false)}>
                  <X size={24} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                </TouchableOpacity>
              </View>

              {/* Module Header */}
              <View style={styles.moduleHeader}>
                <View style={[styles.moduleIcon, { backgroundColor: `${moduleColor}20` }]}>
                  <Text style={[styles.moduleIconText, { color: moduleColor }]}>
                    {moduleName.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.moduleName}>{moduleName}</Text>
                  <Text style={styles.tenantName}>Qorpy ERP</Text>
                </View>
              </View>

              {/* Navigation */}
              <ScrollView style={styles.sidebarNav}>
                {navItems.map((item) => renderNavItem(item))}
              </ScrollView>

              {/* User Section */}
              <View style={styles.userSection}>
                <View style={styles.userInfo}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>{userInitials}</Text>
                  </View>
                  <View>
                    <Text style={styles.userName}>
                      {user?.firstName} {user?.lastName}
                    </Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={handleLogout}>
                  <LogOut size={18} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ModuleContext.Provider>
  );
}

const createStyles = (isDark: boolean, moduleColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    },
    // Header
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
    menuButton: {
      padding: 8,
    },
    moduleIndicator: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    moduleIndicatorText: {
      fontSize: 13,
      fontWeight: '600',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    themeButton: {
      padding: 8,
    },
    // Page Header
    pageHeader: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    // Content
    content: {
      flex: 1,
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
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    backText: {
      fontSize: 14,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    // Module Header
    moduleHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    moduleIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    moduleIconText: {
      fontSize: 18,
      fontWeight: '700',
    },
    moduleName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    tenantName: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    // Navigation
    sidebarNav: {
      flex: 1,
      padding: 8,
    },
    navItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingRight: 16,
      borderRadius: 8,
      marginBottom: 2,
    },
    navItemActive: {
      backgroundColor: `${moduleColor}15`,
    },
    navItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    navItemText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    navChildren: {
      borderLeftWidth: 2,
      borderLeftColor: isDark ? '#334155' : '#E2E8F0',
      marginLeft: 28,
    },
    // User Section
    userSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    userAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark ? '#3B82F620' : '#3B82F610',
      justifyContent: 'center',
      alignItems: 'center',
    },
    userAvatarText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#3B82F6',
    },
    userName: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    userEmail: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
    },
  });
