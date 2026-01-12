import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/theme-provider";
import { Loader2 } from "lucide-react";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import AccountingPage from "@/pages/accounting";
import SalesPage from "@/pages/sales";
import HRPage from "@/pages/hr";
import ExpensesPage from "@/pages/expenses";
import AssetsPage from "@/pages/assets";
import InventoryPage from "@/pages/inventory";
import AttendancePage from "@/pages/attendance";
// SettingsPage import removed - now using AdminSettingsPage from /admin/settings
import LandingPage from "@/pages/landing";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import FeaturesPage from "@/pages/features";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import DemoPage from "@/pages/demo";
import ForgotPasswordPage from "@/pages/forgot-password";
import ResetPasswordPage from "@/pages/reset-password";
import EmployeeDetailPage from "@/pages/employee-detail";
// AdminPortalPage removed - redirects to /platform-admin/login
import EInvoicePage from "@/pages/e-invoice";
import NRSEInvoicePage from "@/pages/nrs-einvoice";
import ProductionPage from "@/pages/production";
import CorporateCardsPage from "@/pages/corporate-cards";
import BankPage from "@/pages/bank";
import InvoicePage from "@/pages/invoice";
import SalesOrdersPage from "@/pages/sales/orders";
import CustomersPage from "@/pages/sales/customers";
import QuotationsPage from "@/pages/sales/quotations";
import SalesAccountsPage from "@/pages/sales/accounts";
import SalesJournalsPage from "@/pages/sales/journals";
import SalesProfitLossPage from "@/pages/sales/profit-loss";
import SalesBalanceSheetPage from "@/pages/sales/balance-sheet";
// import SalesUsersPage from "@/pages/sales/users"; // Moved to centralized admin
import SalesBankPage from "@/pages/sales/bank";

// Accounting sub-modules
import AccountsPage from "@/pages/accounting/accounts";
import JournalsPage from "@/pages/accounting/journals";
import AccountingReportsPage from "@/pages/accounting/reports";
import ProfitLossPage from "@/pages/accounting/profit-loss";
import BalanceSheetPage from "@/pages/accounting/balance-sheet";
// import AccountingUsersPage from "@/pages/accounting/users"; // Moved to centralized admin
import AccountingBankPage from "@/pages/accounting/bank";

// HR sub-modules
import EmployeesPage from "@/pages/hr/employees";
import PayrollPage from "@/pages/hr/payroll";
import LeavePage from "@/pages/hr/leave";
import HRAttendancePage from "@/pages/hr/attendance";

// Products sub-modules (now under Sales)
import ProductsListPage from "@/pages/products/list";
import ProductsCategoriesPage from "@/pages/products/categories";
import ProductsInventoryPage from "@/pages/products/inventory";

// Services sub-modules (now under Sales)
import ServicesListPage from "@/pages/services/list";
import ServicesCategoriesPage from "@/pages/services/categories";
import ServicesDeliveryPage from "@/pages/services/delivery";

// Bank sub-modules
import BankAccountsPage from "@/pages/bank/accounts";
import BankTransactionsPage from "@/pages/bank/transactions";
import BankReconciliationPage from "@/pages/bank/reconciliation";

// Corporate Cards sub-modules
import CardsPage from "@/pages/corporate-cards/cards";
import CardTransactionsPage from "@/pages/corporate-cards/transactions";
import CardLimitsPage from "@/pages/corporate-cards/limits";

// Production sub-modules
import ProductionOrdersPage from "@/pages/production/orders";
import ManufacturingPage from "@/pages/production/manufacturing";
import QualityControlPage from "@/pages/production/quality";

// Invoice sub-modules
import InvoiceListPage from "@/pages/invoice/list";
import RecurringInvoicesPage from "@/pages/invoice/recurring";
import InvoiceTemplatesPage from "@/pages/invoice/templates";

// NRS E-Invoice sub-modules
import NRSInvoicesPage from "@/pages/nrs-einvoice/invoices";
import NRSCompliancePage from "@/pages/nrs-einvoice/compliance";
import NRSSettingsPage from "@/pages/nrs-einvoice/settings";

// Module Settings Pages
import AccountingSettingsPage from "@/pages/accounting/settings";
import HRSettingsPage from "@/pages/hr/settings";
import ProductionSettingsPage from "@/pages/production/settings";
import SalesSettingsPage from "@/pages/sales/settings";
import SalesLeadsPage from "@/pages/sales/leads";
import CorporateCardsSettingsPage from "@/pages/corporate-cards/settings";
import InvoiceSettingsPage from "@/pages/invoice/settings";
import BankSettingsPage from "@/pages/bank/settings";

// Fixed Assets sub-modules
import FixedAssetsPage from "@/pages/fixed-assets";
import AssetRegisterPage from "@/pages/fixed-assets/register";
import AssetCategoriesPage from "@/pages/fixed-assets/categories";
import DepreciationPage from "@/pages/fixed-assets/depreciation";
import DisposalPage from "@/pages/fixed-assets/disposal";
// import FixedAssetsUsersPage from "@/pages/fixed-assets/users"; // Moved to centralized admin
import FixedAssetsSettingsPage from "@/pages/fixed-assets/settings";

// Admin pages (centralized user & app management for tenant super admins)
import AdminUsersPage from "@/pages/admin/users";
import AdminAddUserPage from "@/pages/admin/users/add";
import AdminAppsPage from "@/pages/admin/apps/index";
import AdminAppDetailPage from "@/pages/admin/apps/[id]";
import AdminAddRolePage from "@/pages/admin/apps/[id]/roles/add";

// Platform Portal pages (for Qorpy platform owners)
import PlatformLoginPage from "@/pages/platform/login";
import PlatformDashboardPage from "@/pages/platform/dashboard";
import PlatformTenantsPage from "@/pages/platform/tenants";
import PlatformSubscriptionsPage from "@/pages/platform/subscriptions";
import PlatformCategoriesPage from "@/pages/platform/categories";
import PlatformAppsPage from "@/pages/platform/platform-apps";
import PlatformTeamPage from "@/pages/platform/team";
import PlatformSupportPage from "@/pages/platform/support";
import PlatformSettingsPage from "@/pages/platform/settings";

// Admin pages - billing, subscription, support, settings (consolidated under /admin)
import AdminBillingPage from "@/pages/admin/billing";
import AdminSubscriptionPage from "@/pages/admin/subscription";
import AdminSupportPage from "@/pages/admin/support";
import AdminSettingsPage from "@/pages/admin/settings";

// Protected Route Wrapper
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => {
        const { user, isLoading } = useAuth();
        if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
        return user ? <Dashboard /> : <LandingPage />;
      }} />
      
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/accounting">
        <ProtectedRoute component={AccountingPage} />
      </Route>
      <Route path="/accounting/accounts">
        <ProtectedRoute component={AccountsPage} />
      </Route>
      <Route path="/accounting/journals">
        <ProtectedRoute component={JournalsPage} />
      </Route>
      <Route path="/accounting/reports">
        <ProtectedRoute component={AccountingReportsPage} />
      </Route>
      <Route path="/accounting/settings">
        <ProtectedRoute component={AccountingSettingsPage} />
      </Route>
      <Route path="/accounting/reports/profit-loss">
        <ProtectedRoute component={ProfitLossPage} />
      </Route>
      <Route path="/accounting/reports/balance-sheet">
        <ProtectedRoute component={BalanceSheetPage} />
      </Route>
      <Route path="/accounting/bank">
        <ProtectedRoute component={AccountingBankPage} />
      </Route>
      <Route path="/sales">
        <ProtectedRoute component={SalesPage} />
      </Route>
      <Route path="/sales/orders">
        <ProtectedRoute component={SalesOrdersPage} />
      </Route>
      <Route path="/sales/customers">
        <ProtectedRoute component={CustomersPage} />
      </Route>
      <Route path="/sales/leads">
        <ProtectedRoute component={SalesLeadsPage} />
      </Route>
      <Route path="/sales/quotations">
        <ProtectedRoute component={QuotationsPage} />
      </Route>
      <Route path="/sales/settings">
        <ProtectedRoute component={SalesSettingsPage} />
      </Route>
      <Route path="/sales/accounts">
        <ProtectedRoute component={SalesAccountsPage} />
      </Route>
      <Route path="/sales/journals">
        <ProtectedRoute component={SalesJournalsPage} />
      </Route>
      <Route path="/sales/reports/profit-loss">
        <ProtectedRoute component={SalesProfitLossPage} />
      </Route>
      <Route path="/sales/reports/balance-sheet">
        <ProtectedRoute component={SalesBalanceSheetPage} />
      </Route>
      <Route path="/sales/bank">
        <ProtectedRoute component={SalesBankPage} />
      </Route>
      {/* Products module (under Sales) */}
      <Route path="/sales/products">
        <ProtectedRoute component={ProductsListPage} />
      </Route>
      <Route path="/sales/products/categories">
        <ProtectedRoute component={ProductsCategoriesPage} />
      </Route>
      <Route path="/sales/products/inventory">
        <ProtectedRoute component={ProductsInventoryPage} />
      </Route>
      {/* Services module (under Sales) */}
      <Route path="/sales/services">
        <ProtectedRoute component={ServicesListPage} />
      </Route>
      <Route path="/sales/services/categories">
        <ProtectedRoute component={ServicesCategoriesPage} />
      </Route>
      <Route path="/sales/services/delivery">
        <ProtectedRoute component={ServicesDeliveryPage} />
      </Route>
      <Route path="/hr">
        <ProtectedRoute component={HRPage} />
      </Route>
      <Route path="/hr/employees">
        <ProtectedRoute component={EmployeesPage} />
      </Route>
      <Route path="/hr/payroll">
        <ProtectedRoute component={PayrollPage} />
      </Route>
      <Route path="/hr/leave">
        <ProtectedRoute component={LeavePage} />
      </Route>
      <Route path="/hr/attendance">
        <ProtectedRoute component={HRAttendancePage} />
      </Route>
      <Route path="/hr/settings">
        <ProtectedRoute component={HRSettingsPage} />
      </Route>
      <Route path="/hr/employee/:id">
        <ProtectedRoute component={EmployeeDetailPage} />
      </Route>
      <Route path="/expenses">
        <ProtectedRoute component={ExpensesPage} />
      </Route>
      <Route path="/assets">
        <ProtectedRoute component={AssetsPage} />
      </Route>
      <Route path="/inventory">
        <ProtectedRoute component={InventoryPage} />
      </Route>
      <Route path="/attendance">
        <ProtectedRoute component={AttendancePage} />
      </Route>
      <Route path="/e-invoice">
        <ProtectedRoute component={EInvoicePage} />
      </Route>
      <Route path="/nrs-einvoice">
        <ProtectedRoute component={NRSEInvoicePage} />
      </Route>
      <Route path="/nrs-einvoice/invoices">
        <ProtectedRoute component={NRSInvoicesPage} />
      </Route>
      <Route path="/nrs-einvoice/compliance">
        <ProtectedRoute component={NRSCompliancePage} />
      </Route>
      <Route path="/nrs-einvoice/settings">
        <ProtectedRoute component={NRSSettingsPage} />
      </Route>
      {/* Redirects from old standalone Products routes to Sales/Products */}
      <Route path="/products">
        <Redirect to="/sales/products" />
      </Route>
      <Route path="/products/list">
        <Redirect to="/sales/products" />
      </Route>
      <Route path="/products/categories">
        <Redirect to="/sales/products/categories" />
      </Route>
      <Route path="/products/inventory">
        <Redirect to="/sales/products/inventory" />
      </Route>
      <Route path="/products/settings">
        <Redirect to="/sales/settings" />
      </Route>
      {/* Redirects from old standalone Services routes to Sales/Services */}
      <Route path="/services">
        <Redirect to="/sales/services" />
      </Route>
      <Route path="/services/list">
        <Redirect to="/sales/services" />
      </Route>
      <Route path="/services/categories">
        <Redirect to="/sales/services/categories" />
      </Route>
      <Route path="/services/delivery">
        <Redirect to="/sales/services/delivery" />
      </Route>
      <Route path="/services/settings">
        <Redirect to="/sales/settings" />
      </Route>
      <Route path="/production">
        <ProtectedRoute component={ProductionPage} />
      </Route>
      <Route path="/production/orders">
        <ProtectedRoute component={ProductionOrdersPage} />
      </Route>
      <Route path="/production/manufacturing">
        <ProtectedRoute component={ManufacturingPage} />
      </Route>
      <Route path="/production/quality">
        <ProtectedRoute component={QualityControlPage} />
      </Route>
      <Route path="/production/settings">
        <ProtectedRoute component={ProductionSettingsPage} />
      </Route>
      <Route path="/corporate-cards">
        <ProtectedRoute component={CorporateCardsPage} />
      </Route>
      <Route path="/corporate-cards/cards">
        <ProtectedRoute component={CardsPage} />
      </Route>
      <Route path="/corporate-cards/transactions">
        <ProtectedRoute component={CardTransactionsPage} />
      </Route>
      <Route path="/corporate-cards/limits">
        <ProtectedRoute component={CardLimitsPage} />
      </Route>
      <Route path="/corporate-cards/settings">
        <ProtectedRoute component={CorporateCardsSettingsPage} />
      </Route>
      <Route path="/bank">
        <ProtectedRoute component={BankPage} />
      </Route>
      <Route path="/bank/accounts">
        <ProtectedRoute component={BankAccountsPage} />
      </Route>
      <Route path="/bank/transactions">
        <ProtectedRoute component={BankTransactionsPage} />
      </Route>
      <Route path="/bank/reconciliation">
        <ProtectedRoute component={BankReconciliationPage} />
      </Route>
      <Route path="/bank/settings">
        <ProtectedRoute component={BankSettingsPage} />
      </Route>
      <Route path="/invoice">
        <ProtectedRoute component={InvoicePage} />
      </Route>
      <Route path="/invoice/list">
        <ProtectedRoute component={InvoiceListPage} />
      </Route>
      <Route path="/invoice/recurring">
        <ProtectedRoute component={RecurringInvoicesPage} />
      </Route>
      <Route path="/invoice/templates">
        <ProtectedRoute component={InvoiceTemplatesPage} />
      </Route>
      <Route path="/invoice/settings">
        <ProtectedRoute component={InvoiceSettingsPage} />
      </Route>
      {/* Fixed Assets routes */}
      <Route path="/fixed-assets">
        <ProtectedRoute component={FixedAssetsPage} />
      </Route>
      <Route path="/fixed-assets/register">
        <ProtectedRoute component={AssetRegisterPage} />
      </Route>
      <Route path="/fixed-assets/categories">
        <ProtectedRoute component={AssetCategoriesPage} />
      </Route>
      <Route path="/fixed-assets/depreciation">
        <ProtectedRoute component={DepreciationPage} />
      </Route>
      <Route path="/fixed-assets/disposal">
        <ProtectedRoute component={DisposalPage} />
      </Route>
      <Route path="/fixed-assets/settings">
        <ProtectedRoute component={FixedAssetsSettingsPage} />
      </Route>

      {/* Admin Routes - Centralized User & App Management for Tenant Super Admins */}
      <Route path="/admin/users">
        <ProtectedRoute component={AdminUsersPage} />
      </Route>
      <Route path="/admin/users/add">
        <ProtectedRoute component={AdminAddUserPage} />
      </Route>
      <Route path="/admin/apps">
        <ProtectedRoute component={AdminAppsPage} />
      </Route>
      <Route path="/admin/apps/:id">
        <ProtectedRoute component={AdminAppDetailPage} />
      </Route>
      <Route path="/admin/apps/:id/roles/add">
        <ProtectedRoute component={AdminAddRolePage} />
      </Route>

      {/* Redirects from old per-app user management to /admin */}
      <Route path="/accounting/users">
        <Redirect to="/admin/users" />
      </Route>
      <Route path="/sales/users">
        <Redirect to="/admin/users" />
      </Route>
      <Route path="/fixed-assets/users">
        <Redirect to="/admin/users" />
      </Route>
      {/* Redirects from old /tenant-admin routes to new /admin structure */}
      <Route path="/tenant-admin/users">
        <Redirect to="/admin/users" />
      </Route>
      <Route path="/tenant-admin/apps">
        <Redirect to="/admin/apps" />
      </Route>

      {/* Admin - Billing, Subscription, Support, Settings */}
      <Route path="/admin/billing">
        <ProtectedRoute component={AdminBillingPage} />
      </Route>
      <Route path="/admin/subscription">
        <ProtectedRoute component={AdminSubscriptionPage} />
      </Route>
      <Route path="/admin/support">
        <ProtectedRoute component={AdminSupportPage} />
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute component={AdminSettingsPage} />
      </Route>

      {/* Redirects from old /account and /settings routes */}
      <Route path="/settings">
        <Redirect to="/admin/settings" />
      </Route>
      <Route path="/account/profile">
        <Redirect to="/admin/settings" />
      </Route>
      <Route path="/account/billing">
        <Redirect to="/admin/billing" />
      </Route>
      <Route path="/account/subscription">
        <Redirect to="/admin/subscription" />
      </Route>
      <Route path="/account/support">
        <Redirect to="/admin/support" />
      </Route>

      {/* Platform Portal Routes (for Qorpy platform owners - separate from tenant auth) */}
      <Route path="/platform/login" component={PlatformLoginPage} />
      <Route path="/platform/dashboard" component={PlatformDashboardPage} />
      <Route path="/platform/tenants" component={PlatformTenantsPage} />
      <Route path="/platform/subscriptions" component={PlatformSubscriptionsPage} />
      <Route path="/platform/categories" component={PlatformCategoriesPage} />
      <Route path="/platform/apps" component={PlatformAppsPage} />
      <Route path="/platform/team" component={PlatformTeamPage} />
      <Route path="/platform/support" component={PlatformSupportPage} />
      <Route path="/platform/settings" component={PlatformSettingsPage} />
      {/* Redirect old platform admin routes */}
      <Route path="/platform-admin/login">
        <Redirect to="/platform/login" />
      </Route>
      <Route path="/platform-admin/dashboard">
        <Redirect to="/platform/dashboard" />
      </Route>
      <Route path="/platform-admin/tenants">
        <Redirect to="/platform/tenants" />
      </Route>
      <Route path="/platform-admin/subscriptions">
        <Redirect to="/platform/subscriptions" />
      </Route>
      <Route path="/platform-admin/categories">
        <Redirect to="/platform/categories" />
      </Route>
      <Route path="/platform-admin/apps">
        <Redirect to="/platform/apps" />
      </Route>
      <Route path="/platform-admin/team">
        <Redirect to="/platform/team" />
      </Route>
      <Route path="/platform-admin/support">
        <Redirect to="/platform/support" />
      </Route>
      <Route path="/platform-admin/settings">
        <Redirect to="/platform/settings" />
      </Route>

      {/* Public Pages */}
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/demo" component={DemoPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="qucoon-ui-theme">
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
