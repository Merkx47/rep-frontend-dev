/**
 * User Management Admin Screen
 * Matches web app's centralized user management
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Sun,
  Moon,
  Users,
  UserPlus,
  UserCheck,
  Shield,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Key,
} from 'lucide-react-native';

import { useAuth } from '@/hooks/useAuth';

// Mock users data
const mockUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@company.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2 hours ago',
    appAccess: ['HR', 'Sales', 'Accounting'],
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@company.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: 'Yesterday',
    appAccess: ['HR', 'Sales'],
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Brown',
    email: 'mike@company.com',
    role: 'Viewer',
    status: 'Inactive',
    lastLogin: '1 week ago',
    appAccess: ['Sales'],
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily@company.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Today',
    appAccess: ['HR', 'Accounting', 'Production'],
  },
];

// Stats data
const userStats = [
  { label: 'Total Users', value: '24', icon: Users, color: '#6366F1' },
  { label: 'Active', value: '21', icon: UserCheck, color: '#10B981' },
  { label: 'Pending Invites', value: '3', icon: UserPlus, color: '#F59E0B' },
  { label: 'Admins', value: '4', icon: Shield, color: '#8B5CF6' },
];

export default function UserManagementScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const colorScheme = useColorScheme();

  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const goBack = () => {
    navigation.goBack();
  };

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'Active' ? '#10B981' : '#94A3B8';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return '#8B5CF6';
      case 'Manager':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
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
          <Text style={styles.headerTitle}>User Management</Text>
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
          {userStats.map((stat, index) => {
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

        {/* Search and Add */}
        <View style={styles.toolbar}>
          <View style={styles.searchContainer}>
            <Search size={18} color={isDarkMode ? '#64748B' : '#94A3B8'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add User</Text>
          </TouchableOpacity>
        </View>

        {/* Users List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Users ({filteredUsers.length})</Text>

          <View style={styles.usersCard}>
            {filteredUsers.map((userData, index) => (
              <TouchableOpacity
                key={userData.id}
                style={[
                  styles.userRow,
                  index !== filteredUsers.length - 1 && styles.userRowBorder,
                ]}
              >
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {userData.firstName[0]}{userData.lastName[0]}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {userData.firstName} {userData.lastName}
                  </Text>
                  <Text style={styles.userEmail}>{userData.email}</Text>
                  <View style={styles.userTags}>
                    <View
                      style={[
                        styles.roleBadge,
                        { backgroundColor: `${getRoleColor(userData.role)}20` },
                      ]}
                    >
                      <Text
                        style={[styles.roleText, { color: getRoleColor(userData.role) }]}
                      >
                        {userData.role}
                      </Text>
                    </View>
                    <Text style={styles.appCount}>
                      {userData.appAccess.length} apps
                    </Text>
                  </View>
                </View>
                <View style={styles.userActions}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(userData.status) },
                    ]}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedUser(userData.id);
                      setMenuVisible(true);
                    }}
                  >
                    <MoreVertical size={18} color={isDarkMode ? '#64748B' : '#94A3B8'} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Action Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menuContainer, isDarkMode && styles.menuContainerDark]}>
            <TouchableOpacity style={styles.menuItem}>
              <Edit size={18} color={isDarkMode ? '#FFFFFF' : '#0F172A'} />
              <Text style={styles.menuItemText}>Edit User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Key size={18} color={isDarkMode ? '#FFFFFF' : '#0F172A'} />
              <Text style={styles.menuItemText}>Manage App Access</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Shield size={18} color={isDarkMode ? '#FFFFFF' : '#0F172A'} />
              <Text style={styles.menuItemText}>Change Role</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem}>
              <Trash2 size={18} color="#EF4444" />
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>
                Remove User
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
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
    toolbar: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
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
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#6366F1',
      borderRadius: 10,
      paddingHorizontal: 16,
      gap: 6,
    },
    addButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
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
    usersCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      overflow: 'hidden',
    },
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    userRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    userAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDark ? '#6366F120' : '#6366F110',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    userAvatarText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#6366F1',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#0F172A',
      marginBottom: 2,
    },
    userEmail: {
      fontSize: 13,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: 6,
    },
    userTags: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    roleBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    roleText: {
      fontSize: 11,
      fontWeight: '600',
    },
    appCount: {
      fontSize: 12,
      color: isDark ? '#64748B' : '#94A3B8',
    },
    userActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    menuContainer: {
      width: '100%',
      maxWidth: 300,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 8,
    },
    menuContainerDark: {
      backgroundColor: '#1E293B',
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
