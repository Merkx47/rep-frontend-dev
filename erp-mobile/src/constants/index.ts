/**
 * Application Constants
 * Centralized configuration values for the Qorpy ERP mobile app
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.qorpy.com',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Storage Keys (for secure storage)
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'qorpy_access_token',
  REFRESH_TOKEN: 'qorpy_refresh_token',
  USER_DATA: 'qorpy_user_data',
  BIOMETRIC_ENABLED: 'qorpy_biometric_enabled',
  THEME_PREFERENCE: 'qorpy_theme_preference',
  ONBOARDING_COMPLETE: 'qorpy_onboarding_complete',
  LAST_SYNC: 'qorpy_last_sync',
  DEVICE_ID: 'qorpy_device_id',
} as const;

// Authentication
export const AUTH_CONFIG = {
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes before expiry
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
} as const;

// App Modules (matching web ERP modules)
export const APP_MODULES = {
  DASHBOARD: 'dashboard',
  HR: 'hr',
  SALES: 'sales',
  ACCOUNTING: 'accounting',
  INVENTORY: 'inventory',
  PRODUCTION: 'production',
  BANK: 'bank',
  CORPORATE_CARDS: 'corporate-cards',
  INVOICE: 'invoice',
  FIXED_ASSETS: 'fixed-assets',
  SETTINGS: 'settings',
  ADMIN: 'admin',
} as const;

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'superAdmin',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
} as const;

// Screen Names (for navigation)
export const SCREENS = {
  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  RESET_PASSWORD: 'ResetPassword',
  BIOMETRIC_AUTH: 'BiometricAuth',

  // Main
  DASHBOARD: 'Dashboard',
  NOTIFICATIONS: 'Notifications',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',

  // HR
  HR_HOME: 'HRHome',
  EMPLOYEES: 'Employees',
  EMPLOYEE_DETAIL: 'EmployeeDetail',
  PAYROLL: 'Payroll',
  LEAVE: 'Leave',
  ATTENDANCE: 'Attendance',

  // Sales
  SALES_HOME: 'SalesHome',
  ORDERS: 'Orders',
  ORDER_DETAIL: 'OrderDetail',
  CUSTOMERS: 'Customers',
  CUSTOMER_DETAIL: 'CustomerDetail',
  QUOTATIONS: 'Quotations',

  // Accounting
  ACCOUNTING_HOME: 'AccountingHome',
  ACCOUNTS: 'Accounts',
  JOURNALS: 'Journals',
  REPORTS: 'Reports',

  // Inventory
  INVENTORY_HOME: 'InventoryHome',
  PRODUCTS: 'Products',
  PRODUCT_DETAIL: 'ProductDetail',
  STOCK: 'Stock',

  // Admin
  ADMIN_HOME: 'AdminHome',
  USER_MANAGEMENT: 'UserManagement',
  APP_MANAGEMENT: 'AppManagement',
  ROLE_MANAGEMENT: 'RoleManagement',
} as const;

// Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  PHONE_REGEX: /^\+?[\d\s-]{10,}$/,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
} as const;

// Currency
export const CURRENCY = {
  DEFAULT: 'NGN',
  SYMBOL: '₦',
  DECIMAL_PLACES: 2,
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
export type AppModule = typeof APP_MODULES[keyof typeof APP_MODULES];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type ScreenName = typeof SCREENS[keyof typeof SCREENS];
