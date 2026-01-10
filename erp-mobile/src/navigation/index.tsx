/**
 * Root Navigation
 * Mirrors web app navigation - no bottom tabs, stack-based navigation
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme, View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type {
  RootStackParamList,
  AuthStackParamList,
  MainStackParamList,
} from './types';
import { useAuth } from '@/hooks/useAuth';
import { colors, darkColors } from '@/config/theme';

// Auth screens
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';

// Main screens
import DashboardScreen from '@/screens/dashboard/DashboardScreen';

// Module screens
import SalesScreen from '@/screens/modules/sales/SalesScreen';
import AccountingScreen from '@/screens/modules/accounting/AccountingScreen';
import HRScreen from '@/screens/modules/hr/HRScreen';
import ProductionScreen from '@/screens/modules/production/ProductionScreen';
import InvoiceScreen from '@/screens/modules/invoice/InvoiceScreen';
import BankScreen from '@/screens/modules/bank/BankScreen';
import FixedAssetsScreen from '@/screens/modules/fixed-assets/FixedAssetsScreen';
import CorporateCardsScreen from '@/screens/modules/corporate-cards/CorporateCardsScreen';
import NRSEInvoiceScreen from '@/screens/modules/nrs-einvoice/NRSEInvoiceScreen';

// Submodule screens - Sales
import CustomersScreen from '@/screens/modules/sales/CustomersScreen';
import LeadsScreen from '@/screens/modules/sales/LeadsScreen';
import QuotationsScreen from '@/screens/modules/sales/QuotationsScreen';
import OrdersScreen from '@/screens/modules/sales/OrdersScreen';

// Submodule screens - Accounting
import ChartOfAccountsScreen from '@/screens/modules/accounting/ChartOfAccountsScreen';
import JournalEntriesScreen from '@/screens/modules/accounting/JournalEntriesScreen';
import ReportsScreen from '@/screens/modules/accounting/ReportsScreen';

// Submodule screens - HR
import EmployeesScreen from '@/screens/modules/hr/EmployeesScreen';
import AttendanceScreen from '@/screens/modules/hr/AttendanceScreen';
import PayrollScreen from '@/screens/modules/hr/PayrollScreen';
import LeaveScreen from '@/screens/modules/hr/LeaveScreen';

// Submodule screens - Production
import WorkOrdersScreen from '@/screens/modules/production/WorkOrdersScreen';
import BOMScreen from '@/screens/modules/production/BOMScreen';
import QualityScreen from '@/screens/modules/production/QualityScreen';

// Submodule screens - Invoice
import InvoicesListScreen from '@/screens/modules/invoice/InvoicesListScreen';
import RecurringInvoicesScreen from '@/screens/modules/invoice/RecurringInvoicesScreen';
import TemplatesScreen from '@/screens/modules/invoice/TemplatesScreen';

// Submodule screens - Bank
import BankAccountsScreen from '@/screens/modules/bank/BankAccountsScreen';
import TransactionsScreen from '@/screens/modules/bank/TransactionsScreen';
import ReconciliationScreen from '@/screens/modules/bank/ReconciliationScreen';

// Submodule screens - Fixed Assets
import AssetRegisterScreen from '@/screens/modules/fixed-assets/AssetRegisterScreen';
import AssetCategoriesScreen from '@/screens/modules/fixed-assets/CategoriesScreen';
import DepreciationScreen from '@/screens/modules/fixed-assets/DepreciationScreen';

// Submodule screens - Corporate Cards
import CardsListScreen from '@/screens/modules/corporate-cards/CardsListScreen';
import CardExpensesScreen from '@/screens/modules/corporate-cards/ExpensesScreen';
import CardLimitsScreen from '@/screens/modules/corporate-cards/LimitsScreen';

// Submodule screens - NRS E-Invoice
import EInvoicesListScreen from '@/screens/modules/nrs-einvoice/EInvoicesListScreen';
import NRSComplianceScreen from '@/screens/modules/nrs-einvoice/ComplianceScreen';

// Admin screens
import UserManagementScreen from '@/screens/admin/UserManagementScreen';
import AppManagementScreen from '@/screens/admin/AppManagementScreen';

// Create navigators
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

/**
 * Auth Navigator
 */
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

/**
 * Main Stack Navigator (replaces tabs - matches web structure)
 */
function MainNavigator() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Dashboard */}
      <MainStack.Screen name="Dashboard" component={DashboardScreen} />

      {/* Module screens */}
      <MainStack.Screen name="Sales" component={SalesScreen} />
      <MainStack.Screen name="Accounting" component={AccountingScreen} />
      <MainStack.Screen name="HR" component={HRScreen} />
      <MainStack.Screen name="Production" component={ProductionScreen} />
      <MainStack.Screen name="Invoice" component={InvoiceScreen} />
      <MainStack.Screen name="Bank" component={BankScreen} />
      <MainStack.Screen name="FixedAssets" component={FixedAssetsScreen} />
      <MainStack.Screen name="CorporateCards" component={CorporateCardsScreen} />
      <MainStack.Screen name="NRSEInvoice" component={NRSEInvoiceScreen} />

      {/* Sales submodule screens */}
      <MainStack.Screen name="SalesCustomers" component={CustomersScreen} />
      <MainStack.Screen name="SalesLeads" component={LeadsScreen} />
      <MainStack.Screen name="SalesQuotations" component={QuotationsScreen} />
      <MainStack.Screen name="SalesOrders" component={OrdersScreen} />

      {/* Accounting submodule screens */}
      <MainStack.Screen name="AccountingChartOfAccounts" component={ChartOfAccountsScreen} />
      <MainStack.Screen name="AccountingJournals" component={JournalEntriesScreen} />
      <MainStack.Screen name="AccountingReports" component={ReportsScreen} />

      {/* HR submodule screens */}
      <MainStack.Screen name="HREmployees" component={EmployeesScreen} />
      <MainStack.Screen name="HRAttendance" component={AttendanceScreen} />
      <MainStack.Screen name="HRPayroll" component={PayrollScreen} />
      <MainStack.Screen name="HRLeave" component={LeaveScreen} />

      {/* Production submodule screens */}
      <MainStack.Screen name="ProductionWorkOrders" component={WorkOrdersScreen} />
      <MainStack.Screen name="ProductionBOM" component={BOMScreen} />
      <MainStack.Screen name="ProductionQuality" component={QualityScreen} />

      {/* Invoice submodule screens */}
      <MainStack.Screen name="InvoiceList" component={InvoicesListScreen} />
      <MainStack.Screen name="InvoiceRecurring" component={RecurringInvoicesScreen} />
      <MainStack.Screen name="InvoiceTemplates" component={TemplatesScreen} />

      {/* Bank submodule screens */}
      <MainStack.Screen name="BankAccounts" component={BankAccountsScreen} />
      <MainStack.Screen name="BankTransactions" component={TransactionsScreen} />
      <MainStack.Screen name="BankReconciliation" component={ReconciliationScreen} />

      {/* Fixed Assets submodule screens */}
      <MainStack.Screen name="FixedAssetsList" component={AssetRegisterScreen} />
      <MainStack.Screen name="FixedAssetsCategories" component={AssetCategoriesScreen} />
      <MainStack.Screen name="FixedAssetsDepreciation" component={DepreciationScreen} />

      {/* Corporate Cards submodule screens */}
      <MainStack.Screen name="CorporateCardsList" component={CardsListScreen} />
      <MainStack.Screen name="CorporateCardsExpenses" component={CardExpensesScreen} />
      <MainStack.Screen name="CorporateCardsLimits" component={CardLimitsScreen} />

      {/* NRS E-Invoice submodule screens */}
      <MainStack.Screen name="NRSEInvoiceList" component={EInvoicesListScreen} />
      <MainStack.Screen name="NRSEInvoiceCompliance" component={NRSComplianceScreen} />

      {/* Admin screens */}
      <MainStack.Screen name="UserManagement" component={UserManagementScreen} />
      <MainStack.Screen name="AppManagement" component={AppManagementScreen} />
    </MainStack.Navigator>
  );
}

/**
 * Loading Screen
 */
function LoadingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? darkColors : colors;

  return (
    <View
      style={[
        styles.loadingContainer,
        { backgroundColor: themeColors.background.primary },
      ]}
    >
      <ActivityIndicator size="large" color={themeColors.primary[500]} />
    </View>
  );
}

/**
 * Root Navigator
 */
export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? darkColors : colors;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: themeColors.background.primary,
        },
      }}
    >
      {isAuthenticated ? (
        <RootStack.Screen name="Main" component={MainNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}

/**
 * Navigation Container with Provider
 */
export function Navigation() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? darkColors : colors;

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          dark: isDark,
          colors: {
            primary: themeColors.primary[500],
            background: themeColors.background.primary,
            card: themeColors.background.secondary,
            text: themeColors.text.primary,
            border: themeColors.border.default,
            notification: themeColors.error.main,
          },
          fonts: {
            regular: {
              fontFamily: 'System',
              fontWeight: '400',
            },
            medium: {
              fontFamily: 'System',
              fontWeight: '500',
            },
            bold: {
              fontFamily: 'System',
              fontWeight: '700',
            },
            heavy: {
              fontFamily: 'System',
              fontWeight: '900',
            },
          },
        }}
      >
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Navigation;
