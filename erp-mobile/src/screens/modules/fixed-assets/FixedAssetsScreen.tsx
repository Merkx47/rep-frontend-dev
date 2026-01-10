/**
 * Fixed Assets Module Main Screen
 * Matches web app Fixed Assets module with sidebar navigation
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  LayoutDashboard,
  Package,
  Layers,
  TrendingDown,
  Trash2,
  Settings,
  Plus,
  Calculator,
  Building,
  Laptop,
} from 'lucide-react-native';

import ModuleLayout, { NavItem } from '@/components/ModuleLayout';

// Fixed Assets navigation items - matches web exactly
const fixedAssetsNavItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    screenName: 'FixedAssets',
  },
  {
    id: 'register',
    label: 'Asset Register',
    icon: Package,
    screenName: 'FixedAssetsList',
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: Layers,
    screenName: 'FixedAssetsCategories',
  },
  {
    id: 'depreciation',
    label: 'Depreciation',
    icon: TrendingDown,
    screenName: 'FixedAssetsDepreciation',
  },
  {
    id: 'disposal',
    label: 'Disposal',
    icon: Trash2,
    screenName: 'FixedAssetsDisposal',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    screenName: 'FixedAssetsSettings',
  },
];

// Mock stats data
const assetStats = [
  { label: 'Total Assets', value: '$2.4M', icon: Package, color: '#009688', change: '156 items' },
  { label: 'Monthly Depreciation', value: '$18,420', icon: TrendingDown, color: '#F59E0B', change: '-2.3%' },
  { label: 'Net Book Value', value: '$1.8M', icon: Calculator, color: '#3B82F6', change: 'Current' },
  { label: 'Disposals YTD', value: '$45,200', icon: Trash2, color: '#EF4444', change: '8 items' },
];

// Mock assets
const recentAssets = [
  { id: 'AST-001', name: 'Dell Server Rack', category: 'IT Equipment', value: '$45,000', depreciation: '$750/mo' },
  { id: 'AST-002', name: 'Office Building', category: 'Real Estate', value: '$1,200,000', depreciation: '$2,500/mo' },
  { id: 'AST-003', name: 'MacBook Pro Fleet', category: 'Computers', value: '$85,000', depreciation: '$1,420/mo' },
  { id: 'AST-004', name: 'Office Furniture', category: 'Furniture', value: '$32,000', depreciation: '$267/mo' },
];

export default function FixedAssetsScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const navigateTo = (screen: string) => {
    // @ts-ignore - dynamic navigation
    navigation.navigate(screen);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'IT Equipment':
      case 'Computers':
        return Laptop;
      case 'Real Estate':
        return Building;
      default:
        return Package;
    }
  };

  return (
    <ModuleLayout
      moduleId="fixed-assets"
      navItems={fixedAssetsNavItems}
      activeScreen="FixedAssets"
      title="Fixed Assets Overview"
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {assetStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <View key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                    <Icon size={18} color={stat.color} />
                  </View>
                  <Text style={styles.statChange}>{stat.change}</Text>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Asset Register */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Assets</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.assetsCard}>
            {recentAssets.map((asset, index) => {
              const CategoryIcon = getCategoryIcon(asset.category);
              return (
                <TouchableOpacity
                  key={asset.id}
                  style={[
                    styles.assetRow,
                    index !== recentAssets.length - 1 && styles.assetRowBorder,
                  ]}
                >
                  <View style={styles.assetIcon}>
                    <CategoryIcon size={20} color="#009688" />
                  </View>
                  <View style={styles.assetInfo}>
                    <Text style={styles.assetName}>{asset.name}</Text>
                    <Text style={styles.assetCategory}>{asset.category}</Text>
                  </View>
                  <View style={styles.assetDetails}>
                    <Text style={styles.assetValue}>{asset.value}</Text>
                    <Text style={styles.assetDepreciation}>{asset.depreciation}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo('FixedAssetsList')}
            >
              <Plus size={20} color="#009688" />
              <Text style={styles.actionText}>Add Asset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo('FixedAssetsDepreciation')}
            >
              <TrendingDown size={20} color="#009688" />
              <Text style={styles.actionText}>Depreciation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo('FixedAssetsCategories')}
            >
              <Layers size={20} color="#009688" />
              <Text style={styles.actionText}>Categories</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo('FixedAssetsList')}
            >
              <Calculator size={20} color="#009688" />
              <Text style={styles.actionText}>Reports</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ModuleLayout>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
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
    },
    statHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    statIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statChange: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#94A3B8' : '#64748B',
    },
    statValue: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
    viewAllText: {
      fontSize: 14,
      color: '#009688',
      fontWeight: '500',
    },
    assetsCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      overflow: 'hidden',
    },
    assetRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    assetRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    assetIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: isDark ? '#00968820' : '#00968810',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    assetInfo: {
      flex: 1,
    },
    assetName: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    assetCategory: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
    },
    assetDetails: {
      alignItems: 'flex-end',
    },
    assetValue: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    assetDepreciation: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    actionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    actionButton: {
      width: '48%',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    actionText: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#0F172A',
    },
  });
