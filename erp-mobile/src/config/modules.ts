/**
 * Module Configuration
 * Mirrors the web app's module structure exactly
 */

export interface AppModule {
  id: string;
  name: string;
  shortDescription: string;
  href: string;
  color: string;
  category: string;
}

export const modules: AppModule[] = [
  {
    id: 'sales',
    name: 'Sales',
    shortDescription: 'Manage customers, leads, quotations and orders',
    href: '/sales',
    color: '#2196F3',
    category: 'Sales',
  },
  {
    id: 'accounting',
    name: 'Accounting',
    shortDescription: 'Double-entry bookkeeping and financial reports',
    href: '/accounting',
    color: '#4CAF50',
    category: 'Finance',
  },
  {
    id: 'hr',
    name: 'HR',
    shortDescription: 'Complete employee management and payroll',
    href: '/hr',
    color: '#E91E63',
    category: 'Human Resources',
  },
  {
    id: 'production',
    name: 'Production',
    shortDescription: 'Manufacturing orders and quality control',
    href: '/production',
    color: '#607D8B',
    category: 'Operations',
  },
  {
    id: 'invoice',
    name: 'Invoice',
    shortDescription: 'Create and send professional invoices',
    href: '/invoice',
    color: '#3F51B5',
    category: 'Finance',
  },
  {
    id: 'bank',
    name: 'Bank',
    shortDescription: 'Bank account management and reconciliation',
    href: '/bank',
    color: '#00BCD4',
    category: 'Finance',
  },
  {
    id: 'fixed-assets',
    name: 'Fixed Assets',
    shortDescription: 'Track company assets and depreciation',
    href: '/fixed-assets',
    color: '#009688',
    category: 'Finance',
  },
  {
    id: 'corporate-cards',
    name: 'Corporate Cards',
    shortDescription: 'Issue and manage company expense cards',
    href: '/corporate-cards',
    color: '#FFC107',
    category: 'Finance',
  },
  {
    id: 'nrs-einvoice',
    name: 'NRS E-Invoice',
    shortDescription: 'Nigerian tax compliance and e-invoicing',
    href: '/nrs-einvoice',
    color: '#F44336',
    category: 'Compliance',
  },
];

export const categories = [
  { name: 'All Apps', filter: null },
  { name: 'Sales', filter: 'Sales' },
  { name: 'Finance', filter: 'Finance' },
  { name: 'Human Resources', filter: 'Human Resources' },
  { name: 'Operations', filter: 'Operations' },
  { name: 'Compliance', filter: 'Compliance' },
];

// Module icons mapping (using Lucide icon names)
export const moduleIcons: Record<string, string> = {
  sales: 'ShoppingCart',
  accounting: 'Calculator',
  hr: 'Users',
  production: 'Factory',
  invoice: 'FileText',
  bank: 'Building2',
  'fixed-assets': 'Package',
  'corporate-cards': 'CreditCard',
  'nrs-einvoice': 'FileCheck',
};

export default modules;
