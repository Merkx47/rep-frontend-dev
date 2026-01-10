/**
 * Navigation Types
 * Type definitions for React Navigation - Stack-based to match web app
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

// Main Stack Navigator (replaces tabs - matches web structure)
export type MainStackParamList = {
  // Dashboard
  Dashboard: undefined;

  // Sales Module
  Sales: undefined;
  SalesCustomers: undefined;
  SalesCustomerDetail: { customerId: string };
  SalesLeads: undefined;
  SalesLeadDetail: { leadId: string };
  SalesQuotations: undefined;
  SalesQuotationDetail: { quotationId: string };
  SalesOrders: undefined;
  SalesOrderDetail: { orderId: string };

  // Accounting Module
  Accounting: undefined;
  AccountingChartOfAccounts: undefined;
  AccountingAccountDetail: { accountId: string };
  AccountingJournals: undefined;
  AccountingJournalDetail: { journalId: string };
  AccountingReports: undefined;
  AccountingSettings: undefined;

  // HR Module
  HR: undefined;
  HREmployees: undefined;
  HREmployeeDetail: { employeeId: string };
  HRPayroll: undefined;
  HRPayrollDetail: { payrollId: string };
  HRLeave: undefined;
  HRAttendance: undefined;
  HRDepartments: undefined;
  HRSettings: undefined;

  // Production Module
  Production: undefined;
  ProductionOrders: undefined;
  ProductionOrderDetail: { orderId: string };
  ProductionBOM: undefined;
  ProductionBOMDetail: { bomId: string };
  ProductionQuality: undefined;
  ProductionSettings: undefined;

  // Invoice Module
  Invoice: undefined;
  InvoiceList: undefined;
  InvoiceDetail: { invoiceId: string };
  InvoiceCreate: undefined;
  InvoiceSettings: undefined;

  // Bank Module
  Bank: undefined;
  BankAccounts: undefined;
  BankAccountDetail: { accountId: string };
  BankTransactions: undefined;
  BankReconciliation: undefined;
  BankSettings: undefined;

  // Fixed Assets Module
  FixedAssets: undefined;
  FixedAssetsList: undefined;
  FixedAssetDetail: { assetId: string };
  FixedAssetsDepreciation: undefined;
  FixedAssetsCategories: undefined;
  FixedAssetsSettings: undefined;

  // Corporate Cards Module
  CorporateCards: undefined;
  CorporateCardsList: undefined;
  CorporateCardDetail: { cardId: string };
  CorporateCardsExpenses: undefined;
  CorporateCardsLimits: undefined;
  CorporateCardsSettings: undefined;

  // NRS E-Invoice Module
  NRSEInvoice: undefined;
  NRSEInvoiceList: undefined;
  NRSEInvoiceDetail: { invoiceId: string };
  NRSEInvoiceSubmit: undefined;
  NRSEInvoiceSettings: undefined;

  // Admin Screens (from dashboard sidebar)
  UserManagement: undefined;
  UserDetail: { userId: string };
  UserCreate: undefined;
  UserEdit: { userId: string };
  AppManagement: undefined;
  AppDetail: { appId: string };
  RoleManagement: { appId: string };

  // Profile & Settings
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Security: undefined;
};

// Root Navigator (combines Auth and Main)
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
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

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<MainStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Declare global types for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
