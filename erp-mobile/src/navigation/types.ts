/**
 * Navigation Types
 * Type definitions for React Navigation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

// Main Tab Navigator
export type MainTabParamList = {
  DashboardTab: undefined;
  ModulesTab: undefined;
  NotificationsTab: undefined;
  ProfileTab: undefined;
};

// Dashboard Stack (nested in DashboardTab)
export type DashboardStackParamList = {
  Dashboard: undefined;
  QuickActions: undefined;
};

// Modules Stack (nested in ModulesTab)
export type ModulesStackParamList = {
  ModulesList: undefined;
  // HR
  HRHome: undefined;
  Employees: undefined;
  EmployeeDetail: { employeeId: string };
  Payroll: undefined;
  Leave: undefined;
  Attendance: undefined;
  // Sales
  SalesHome: undefined;
  Orders: undefined;
  OrderDetail: { orderId: string };
  Customers: undefined;
  CustomerDetail: { customerId: string };
  Quotations: undefined;
  // Accounting
  AccountingHome: undefined;
  Accounts: undefined;
  Journals: undefined;
  Reports: undefined;
  // Inventory
  InventoryHome: undefined;
  Products: undefined;
  ProductDetail: { productId: string };
  Stock: undefined;
  // Admin
  AdminHome: undefined;
  UserManagement: undefined;
  UserDetail: { userId: string };
  AppManagement: undefined;
  AppDetail: { appId: string };
  RoleManagement: { appId: string };
};

// Profile Stack (nested in ProfileTab)
export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Security: undefined;
  About: undefined;
};

// Root Navigator (combines Auth and Main)
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  // Modal screens accessible from anywhere
  Scanner: undefined;
  Search: undefined;
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type DashboardStackScreenProps<T extends keyof DashboardStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<DashboardStackParamList, T>,
    MainTabScreenProps<'DashboardTab'>
  >;

export type ModulesStackScreenProps<T extends keyof ModulesStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ModulesStackParamList, T>,
    MainTabScreenProps<'ModulesTab'>
  >;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProfileStackParamList, T>,
    MainTabScreenProps<'ProfileTab'>
  >;

// Declare global types for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
