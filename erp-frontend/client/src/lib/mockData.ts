// Mock Data for Qucoon ERP - Based on QuCoon Limited, Lagos Nigeria
// Founded 2016 by Yinka Daramola - Digital, Technology & Consulting Services

const TENANT_ID = "tenant-qucoon-001";

// ============================================
// TENANT & USER DATA
// ============================================
export const mockTenant = {
  id: TENANT_ID,
  name: "QuCoon Limited",
  slug: "qucoon",
  email: "info@qucoon.com",
  phone: "+234 803 123 4567",
  address: "3rd Floor, Churchgate Tower, Victoria Island",
  city: "Lagos",
  state: "Lagos",
  country: "Nigeria",
  logo: null,
  currency: "NGN",
  taxId: "TIN-QUC-2016-001",
  rcNumber: "RC-1234567",
  industry: "Technology",
  subscriptionPlanId: "plan-003",
  subscriptionStatus: "active",
  trialEndsAt: null,
  createdAt: new Date("2016-01-15"),
  updatedAt: new Date("2024-12-01"),
};

export const mockUser = {
  id: "user-001",
  tenantId: TENANT_ID,
  email: "yinka.daramola@qucoon.com",
  firstName: "Yinka",
  lastName: "Daramola",
  phone: "+234 803 000 0001",
  role: "super_admin",
  status: "active",
  avatar: null,
  createdAt: new Date("2016-01-15"),
  updatedAt: new Date("2024-12-01"),
};

// ============================================
// CHART OF ACCOUNTS
// ============================================
export const mockChartOfAccounts: any[] = [
  { id: "coa-001", tenantId: TENANT_ID, code: "1000", name: "Cash on Hand", type: "asset", subtype: "current_asset", description: "Petty cash", balance: 850000, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-002", tenantId: TENANT_ID, code: "1010", name: "GTBank Current Account", type: "asset", subtype: "current_asset", description: "Main operating account", balance: 45750000, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-003", tenantId: TENANT_ID, code: "1020", name: "Zenith Bank Account", type: "asset", subtype: "current_asset", description: "Secondary account", balance: 28500000, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-004", tenantId: TENANT_ID, code: "1100", name: "Accounts Receivable", type: "asset", subtype: "current_asset", description: "Customer balances", balance: 32450000, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-005", tenantId: TENANT_ID, code: "1500", name: "Office Equipment", type: "asset", subtype: "fixed_asset", description: "Computers, servers", balance: 18500000, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-006", tenantId: TENANT_ID, code: "1510", name: "Motor Vehicles", type: "asset", subtype: "fixed_asset", description: "Company vehicles", balance: 35000000, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-007", tenantId: TENANT_ID, code: "2000", name: "Accounts Payable", type: "liability", subtype: "current_liability", description: "Vendor balances", balance: 8750000, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-008", tenantId: TENANT_ID, code: "2100", name: "VAT Payable (7.5%)", type: "liability", subtype: "current_liability", description: "VAT to FIRS", balance: 4562500, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-009", tenantId: TENANT_ID, code: "2200", name: "WHT Payable", type: "liability", subtype: "current_liability", description: "Withholding tax", balance: 2187500, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-010", tenantId: TENANT_ID, code: "2300", name: "PAYE Payable", type: "liability", subtype: "current_liability", description: "Employee tax to LIRS", balance: 3425000, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-011", tenantId: TENANT_ID, code: "3000", name: "Share Capital", type: "equity", subtype: "equity", description: "Paid-up capital", balance: 50000000, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-012", tenantId: TENANT_ID, code: "3100", name: "Retained Earnings", type: "equity", subtype: "equity", description: "Accumulated profits", balance: 45750000, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-013", tenantId: TENANT_ID, code: "4000", name: "Cloud Services Revenue", type: "revenue", subtype: "operating_revenue", description: "AWS/Azure/GCP", balance: 85000000, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-014", tenantId: TENANT_ID, code: "4100", name: "Software Development", type: "revenue", subtype: "operating_revenue", description: "Custom software", balance: 62500000, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-015", tenantId: TENANT_ID, code: "4200", name: "IT Consulting", type: "revenue", subtype: "operating_revenue", description: "Consulting fees", balance: 45000000, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-016", tenantId: TENANT_ID, code: "5000", name: "Salaries & Wages", type: "expense", subtype: "operating_expense", description: "Employee pay", balance: 95000000, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-017", tenantId: TENANT_ID, code: "5100", name: "Office Rent", type: "expense", subtype: "operating_expense", description: "VI office rent", balance: 24000000, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "coa-018", tenantId: TENANT_ID, code: "5200", name: "Utilities", type: "expense", subtype: "operating_expense", description: "Power, water, diesel", balance: 8500000, currency: "NGN", isActive: true, parentId: null, createdAt: new Date(), updatedAt: new Date() },
];

// ============================================
// CUSTOMERS
// ============================================
export const mockCustomers: any[] = [
  { id: "cust-001", tenantId: TENANT_ID, companyName: "Unified Cloud Services", contactPerson: "Michael Chen", email: "partnership@unifiedcloud.io", phone: "+1 415 555 1234", address: "100 Market Street, Suite 500", city: "San Francisco", state: "California", country: "USA", taxId: "EIN-98-7654321", type: "business", creditLimit: 500000000, balance: 125000000, status: "active", createdAt: new Date("2025-02-01"), updatedAt: new Date() },
  { id: "cust-002", tenantId: TENANT_ID, companyName: "Dangote Industries Limited", contactPerson: "Aliko Dangote Jr.", email: "ict@dangote.com", phone: "+234 802 111 2222", address: "1 Alfred Rewane Road, Ikoyi", city: "Lagos", state: "Lagos", country: "Nigeria", taxId: "TIN-DAN-001", type: "business", creditLimit: 250000000, balance: 45000000, status: "active", createdAt: new Date("2023-06-15"), updatedAt: new Date() },
  { id: "cust-003", tenantId: TENANT_ID, companyName: "MTN Nigeria Communications", contactPerson: "Karl Toriola", email: "enterprise@mtn.com.ng", phone: "+234 803 333 4444", address: "Golden Plaza, Falomo, Ikoyi", city: "Lagos", state: "Lagos", country: "Nigeria", taxId: "TIN-MTN-001", type: "business", creditLimit: 350000000, balance: 78500000, status: "active", createdAt: new Date("2022-03-01"), updatedAt: new Date() },
  { id: "cust-004", tenantId: TENANT_ID, companyName: "Access Bank Plc", contactPerson: "Roosevelt Ogbonna", email: "technology@accessbankplc.com", phone: "+234 804 555 6666", address: "999C Danmole Street, Victoria Island", city: "Lagos", state: "Lagos", country: "Nigeria", taxId: "TIN-ACC-001", type: "business", creditLimit: 200000000, balance: 32500000, status: "active", createdAt: new Date("2023-01-15"), updatedAt: new Date() },
  { id: "cust-005", tenantId: TENANT_ID, companyName: "Flutterwave Inc", contactPerson: "Olugbenga Agboola", email: "infrastructure@flutterwave.com", phone: "+234 805 777 8888", address: "10 Hughes Avenue, Alagomeji", city: "Lagos", state: "Lagos", country: "Nigeria", taxId: "TIN-FLW-001", type: "business", creditLimit: 150000000, balance: 28750000, status: "active", createdAt: new Date("2023-08-20"), updatedAt: new Date() },
  { id: "cust-006", tenantId: TENANT_ID, companyName: "Kuda Technologies", contactPerson: "Babs Ogundeyi", email: "cloud@kuda.com", phone: "+234 806 999 0000", address: "4 Idowu Taylor Street, VI", city: "Lagos", state: "Lagos", country: "Nigeria", taxId: "TIN-KUD-001", type: "business", creditLimit: 100000000, balance: 18500000, status: "active", createdAt: new Date("2023-04-10"), updatedAt: new Date() },
  { id: "cust-007", tenantId: TENANT_ID, companyName: "Interswitch Group", contactPerson: "Mitchell Elegbe", email: "vendors@interswitchgroup.com", phone: "+234 810 456 7890", address: "1648C Oko-Awo Close, Victoria Island", city: "Lagos", state: "Lagos", country: "Nigeria", taxId: "TIN-INT-001", type: "business", creditLimit: 180000000, balance: 35000000, status: "active", createdAt: new Date("2022-07-15"), updatedAt: new Date() },
  { id: "cust-008", tenantId: TENANT_ID, companyName: "Total Energies Nigeria", contactPerson: "Jean-Pierre Sbraire", email: "it.procurement@totalenergies.com", phone: "+234 808 234 5678", address: "4 Chief Yessufu Abiodun Way, Oniru", city: "Lagos", state: "Lagos", country: "Nigeria", taxId: "TIN-TOT-001", type: "business", creditLimit: 300000000, balance: 55000000, status: "active", createdAt: new Date("2022-11-20"), updatedAt: new Date() },
];

// ============================================
// PRODUCTS & CATEGORIES
// ============================================
export const mockProductCategories: any[] = [
  // Product Categories
  { id: "cat-001", tenantId: TENANT_ID, name: "SaaS Products", description: "Qucoon software products", type: "product", parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "cat-002", tenantId: TENANT_ID, name: "Enterprise Solutions", description: "Enterprise software licenses", type: "product", parentId: null, createdAt: new Date(), updatedAt: new Date() },
  // Service Categories
  { id: "cat-003", tenantId: TENANT_ID, name: "Cloud Services", description: "AWS, Azure, GCP solutions", type: "service", parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "cat-004", tenantId: TENANT_ID, name: "Software Development", description: "Custom software and apps", type: "service", parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "cat-005", tenantId: TENANT_ID, name: "IT Consulting", description: "Strategic IT consulting", type: "service", parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "cat-006", tenantId: TENANT_ID, name: "Support & Maintenance", description: "Ongoing support", type: "service", parentId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "cat-007", tenantId: TENANT_ID, name: "Training Programs", description: "Tech skills accelerator", type: "service", parentId: null, createdAt: new Date(), updatedAt: new Date() },
];

// Qucoon Software Products
export const mockProducts: any[] = [
  // Software Products - Qucoon's SaaS offerings
  { id: "prod-001", tenantId: TENANT_ID, name: "Pedigraph", sku: "PEDI-001", description: "AI-powered data analytics platform for intelligent business insights and decision-making", categoryId: "cat-001", type: "product", sellingPrice: 15000000, costPrice: 2000000, quantityOnHand: 999, reorderLevel: 0, unit: "license", isActive: true, taxable: true, features: ["AI-Powered Analytics", "Predictive Insights", "Custom Dashboards", "Data Visualization"], billingCycle: "annual", createdAt: new Date(), updatedAt: new Date() },
  { id: "prod-002", tenantId: TENANT_ID, name: "Qoonity", sku: "QOON-001", description: "AI-powered code generation platform for rapid software development", categoryId: "cat-001", type: "product", sellingPrice: 8500000, costPrice: 1500000, quantityOnHand: 999, reorderLevel: 0, unit: "license", isActive: true, taxable: true, features: ["AI Code Generation", "Multi-Language Support", "Code Review & Optimization", "IDE Integration"], billingCycle: "annual", createdAt: new Date(), updatedAt: new Date() },
  { id: "prod-003", tenantId: TENANT_ID, name: "Qorpy ERP", sku: "QORP-001", description: "Complete enterprise resource planning solution for Nigerian businesses", categoryId: "cat-001", type: "product", sellingPrice: 5000000, costPrice: 800000, quantityOnHand: 999, reorderLevel: 0, unit: "license", isActive: true, taxable: true, features: ["Accounting", "HR & Payroll", "Inventory", "Sales & CRM", "Multi-tenant"], billingCycle: "annual", createdAt: new Date(), updatedAt: new Date() },
  { id: "prod-004", tenantId: TENANT_ID, name: "Tymer", sku: "TYMR-001", description: "Biometric attendance and workforce management system", categoryId: "cat-001", type: "product", sellingPrice: 2500000, costPrice: 400000, quantityOnHand: 999, reorderLevel: 0, unit: "license", isActive: true, taxable: true, features: ["Facial Recognition", "Geofencing", "Leave Management", "Payroll Integration"], billingCycle: "annual", createdAt: new Date(), updatedAt: new Date() },
  { id: "prod-005", tenantId: TENANT_ID, name: "QFlow", sku: "QFLW-001", description: "Business process automation and workflow management platform", categoryId: "cat-001", type: "product", sellingPrice: 3500000, costPrice: 600000, quantityOnHand: 999, reorderLevel: 0, unit: "license", isActive: true, taxable: true, features: ["Visual Workflow Builder", "Approval Chains", "Integration Hub", "Analytics Dashboard"], billingCycle: "annual", createdAt: new Date(), updatedAt: new Date() },
  { id: "prod-006", tenantId: TENANT_ID, name: "DataVault Enterprise", sku: "DVE-001", description: "Enterprise data backup and disaster recovery solution", categoryId: "cat-002", type: "product", sellingPrice: 12000000, costPrice: 3000000, quantityOnHand: 50, reorderLevel: 5, unit: "license", isActive: true, taxable: true, features: ["Automated Backups", "Cross-Region Replication", "Point-in-Time Recovery", "Compliance Reports"], billingCycle: "annual", createdAt: new Date(), updatedAt: new Date() },
  { id: "prod-007", tenantId: TENANT_ID, name: "SecureGate", sku: "SGTE-001", description: "Zero-trust security and identity management platform", categoryId: "cat-002", type: "product", sellingPrice: 8000000, costPrice: 1800000, quantityOnHand: 999, reorderLevel: 0, unit: "license", isActive: true, taxable: true, features: ["SSO Integration", "MFA", "Access Policies", "Audit Logging"], billingCycle: "annual", createdAt: new Date(), updatedAt: new Date() },
];

// Qucoon Services
export const mockServices: any[] = [
  // Cloud Services
  { id: "svc-001", tenantId: TENANT_ID, name: "Cloud Infrastructure Setup", sku: "CLD-SETUP", description: "Complete AWS/Azure/GCP architecture design and deployment", categoryId: "cat-003", type: "service", sellingPrice: 15000000, costPrice: 0, unit: "project", isActive: true, taxable: true, deliveryTime: "4-8 weeks", createdAt: new Date(), updatedAt: new Date() },
  { id: "svc-002", tenantId: TENANT_ID, name: "Cloud Migration Service", sku: "CLD-MIG", description: "On-premise to cloud migration with zero downtime", categoryId: "cat-003", type: "service", sellingPrice: 2500000, costPrice: 0, unit: "server", isActive: true, taxable: true, deliveryTime: "2-4 weeks per server", createdAt: new Date(), updatedAt: new Date() },
  { id: "svc-003", tenantId: TENANT_ID, name: "Managed Cloud Services", sku: "CLD-MGD", description: "24/7 cloud infrastructure management and monitoring", categoryId: "cat-003", type: "service", sellingPrice: 5000000, costPrice: 0, unit: "month", isActive: true, taxable: true, deliveryTime: "Ongoing", createdAt: new Date(), updatedAt: new Date() },
  { id: "svc-004", tenantId: TENANT_ID, name: "Cloud Cost Optimization", sku: "CLD-OPT", description: "Reduce cloud spend by up to 40% with FinOps best practices", categoryId: "cat-003", type: "service", sellingPrice: 3500000, costPrice: 0, unit: "engagement", isActive: true, taxable: true, deliveryTime: "2-3 weeks", createdAt: new Date(), updatedAt: new Date() },
  // Software Development Services
  { id: "svc-005", tenantId: TENANT_ID, name: "Web Application Development", sku: "DEV-WEB", description: "Enterprise-grade web applications using React, Node.js", categoryId: "cat-004", type: "service", sellingPrice: 25000000, costPrice: 0, unit: "project", isActive: true, taxable: true, deliveryTime: "12-16 weeks", createdAt: new Date(), updatedAt: new Date() },
  { id: "svc-006", tenantId: TENANT_ID, name: "Mobile App Development", sku: "DEV-MOB", description: "Native iOS/Android or cross-platform mobile apps", categoryId: "cat-004", type: "service", sellingPrice: 18000000, costPrice: 0, unit: "project", isActive: true, taxable: true, deliveryTime: "10-14 weeks", createdAt: new Date(), updatedAt: new Date() },
  { id: "svc-007", tenantId: TENANT_ID, name: "API Development & Integration", sku: "DEV-API", description: "RESTful/GraphQL API development and third-party integrations", categoryId: "cat-004", type: "service", sellingPrice: 8000000, costPrice: 0, unit: "project", isActive: true, taxable: true, deliveryTime: "4-8 weeks", createdAt: new Date(), updatedAt: new Date() },
  { id: "svc-008", tenantId: TENANT_ID, name: "AI/ML Solution Development", sku: "AI-DEV", description: "Custom AI/ML models and intelligent automation", categoryId: "cat-004", type: "service", sellingPrice: 35000000, costPrice: 0, unit: "project", isActive: true, taxable: true, deliveryTime: "12-20 weeks", createdAt: new Date(), updatedAt: new Date() },
  // IT Consulting Services
  { id: "svc-009", tenantId: TENANT_ID, name: "IT Strategy Consulting", sku: "CON-STR", description: "Digital transformation roadmap and IT strategy", categoryId: "cat-005", type: "service", sellingPrice: 12000000, costPrice: 0, unit: "engagement", isActive: true, taxable: true, deliveryTime: "4-6 weeks", createdAt: new Date(), updatedAt: new Date() },
  { id: "svc-010", tenantId: TENANT_ID, name: "Technical Consulting (Daily)", sku: "CON-DAY", description: "Senior consultant daily rate for on-site/remote work", categoryId: "cat-005", type: "service", sellingPrice: 750000, costPrice: 0, unit: "day", isActive: true, taxable: true, deliveryTime: "Same day", createdAt: new Date(), updatedAt: new Date() },
  { id: "svc-011", tenantId: TENANT_ID, name: "Architecture Review", sku: "CON-ARCH", description: "Comprehensive system architecture assessment", categoryId: "cat-005", type: "service", sellingPrice: 5000000, costPrice: 0, unit: "review", isActive: true, taxable: true, deliveryTime: "2-3 weeks", createdAt: new Date(), updatedAt: new Date() },
  // Support Services
  { id: "svc-012", tenantId: TENANT_ID, name: "Premium Support (Annual)", sku: "SUP-PRE", description: "24x7 support with 4-hour response SLA", categoryId: "cat-006", type: "service", sellingPrice: 18000000, costPrice: 0, unit: "year", isActive: true, taxable: true, deliveryTime: "Ongoing", createdAt: new Date(), updatedAt: new Date() },
  { id: "svc-013", tenantId: TENANT_ID, name: "Standard Support (Annual)", sku: "SUP-STD", description: "Business hours support with 24-hour response", categoryId: "cat-006", type: "service", sellingPrice: 6000000, costPrice: 0, unit: "year", isActive: true, taxable: true, deliveryTime: "Ongoing", createdAt: new Date(), updatedAt: new Date() },
  { id: "svc-014", tenantId: TENANT_ID, name: "Emergency Support", sku: "SUP-EMG", description: "Critical issue resolution and emergency response", categoryId: "cat-006", type: "service", sellingPrice: 2000000, costPrice: 0, unit: "incident", isActive: true, taxable: true, deliveryTime: "4 hours", createdAt: new Date(), updatedAt: new Date() },
  // Training Services
  { id: "svc-015", tenantId: TENANT_ID, name: "QSA 3-Month Accelerator", sku: "TRN-QSA", description: "Qucoon Startup Accelerator program for tech entrepreneurs", categoryId: "cat-007", type: "service", sellingPrice: 5000000, costPrice: 0, unit: "seat", isActive: true, taxable: true, deliveryTime: "3 months", createdAt: new Date(), updatedAt: new Date() },
  { id: "svc-016", tenantId: TENANT_ID, name: "Cloud Certification Bootcamp", sku: "TRN-CLD", description: "AWS/Azure/GCP certification preparation", categoryId: "cat-007", type: "service", sellingPrice: 1500000, costPrice: 0, unit: "seat", isActive: true, taxable: true, deliveryTime: "4 weeks", createdAt: new Date(), updatedAt: new Date() },
  { id: "svc-017", tenantId: TENANT_ID, name: "Custom Corporate Training", sku: "TRN-CRP", description: "Tailored technical training for teams", categoryId: "cat-007", type: "service", sellingPrice: 3500000, costPrice: 0, unit: "day", isActive: true, taxable: true, deliveryTime: "As scheduled", createdAt: new Date(), updatedAt: new Date() },
];

// ============================================
// INVOICES
// ============================================
export const mockInvoices: any[] = [
  { id: "inv-001", tenantId: TENANT_ID, number: "QUC-2024-0001", customerId: "cust-001", date: new Date("2025-02-28"), dueDate: new Date("2025-03-30"), subtotal: 125000000, taxAmount: 9375000, discount: 5000000, totalAmount: 129375000, balanceDue: 129375000, status: "sent", notes: "UCS Partnership - MENA cloud infrastructure", createdAt: new Date(), updatedAt: new Date() },
  { id: "inv-002", tenantId: TENANT_ID, number: "QUC-2024-0002", customerId: "cust-002", date: new Date("2024-11-15"), dueDate: new Date("2024-12-15"), subtotal: 45000000, taxAmount: 3375000, discount: 0, totalAmount: 48375000, balanceDue: 0, status: "paid", notes: "Dangote - SAP cloud migration", createdAt: new Date(), updatedAt: new Date() },
  { id: "inv-003", tenantId: TENANT_ID, number: "QUC-2024-0003", customerId: "cust-003", date: new Date("2024-11-20"), dueDate: new Date("2024-12-20"), subtotal: 78500000, taxAmount: 5887500, discount: 2500000, totalAmount: 81887500, balanceDue: 40000000, status: "partial", notes: "MTN - Enterprise AI platform", createdAt: new Date(), updatedAt: new Date() },
  { id: "inv-004", tenantId: TENANT_ID, number: "QUC-2024-0004", customerId: "cust-004", date: new Date("2024-12-01"), dueDate: new Date("2025-01-01"), subtotal: 32500000, taxAmount: 2437500, discount: 0, totalAmount: 34937500, balanceDue: 34937500, status: "sent", notes: "Access Bank - Core banking migration", createdAt: new Date(), updatedAt: new Date() },
  { id: "inv-005", tenantId: TENANT_ID, number: "QUC-2024-0005", customerId: "cust-005", date: new Date("2024-12-05"), dueDate: new Date("2025-01-05"), subtotal: 28750000, taxAmount: 2156250, discount: 1500000, totalAmount: 29406250, balanceDue: 29406250, status: "sent", notes: "Flutterwave - Payment gateway optimization", createdAt: new Date(), updatedAt: new Date() },
  { id: "inv-006", tenantId: TENANT_ID, number: "QUC-2024-0006", customerId: "cust-006", date: new Date("2024-12-10"), dueDate: new Date("2025-01-10"), subtotal: 18500000, taxAmount: 1387500, discount: 0, totalAmount: 19887500, balanceDue: 19887500, status: "draft", notes: "Kuda - Mobile app optimization", createdAt: new Date(), updatedAt: new Date() },
  { id: "inv-007", tenantId: TENANT_ID, number: "QUC-2024-0007", customerId: "cust-008", date: new Date("2024-11-01"), dueDate: new Date("2024-12-01"), subtotal: 55000000, taxAmount: 4125000, discount: 0, totalAmount: 59125000, balanceDue: 0, status: "paid", notes: "TotalEnergies - Digital oilfield", createdAt: new Date(), updatedAt: new Date() },
  { id: "inv-008", tenantId: TENANT_ID, number: "QUC-2024-0008", customerId: "cust-007", date: new Date("2024-12-15"), dueDate: new Date("2025-01-15"), subtotal: 35000000, taxAmount: 2625000, discount: 0, totalAmount: 37625000, balanceDue: 37625000, status: "sent", notes: "Interswitch - Infrastructure upgrade", createdAt: new Date(), updatedAt: new Date() },
];

// ============================================
// DEPARTMENTS
// ============================================
export const mockDepartments: any[] = [
  { id: "dept-001", tenantId: TENANT_ID, name: "Executive Office", code: "EXEC", description: "CEO and leadership", headId: "emp-001", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "dept-002", tenantId: TENANT_ID, name: "Cloud & Infrastructure", code: "CLOUD", description: "Cloud services", headId: "emp-002", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "dept-003", tenantId: TENANT_ID, name: "Software Engineering", code: "ENG", description: "Software development", headId: "emp-003", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "dept-004", tenantId: TENANT_ID, name: "AI & Data Science", code: "AI", description: "AI/ML solutions", headId: "emp-004", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "dept-005", tenantId: TENANT_ID, name: "Business Development", code: "BIZ", description: "Sales and BD", headId: "emp-005", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "dept-006", tenantId: TENANT_ID, name: "Finance & Operations", code: "FIN", description: "Finance and ops", headId: "emp-006", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "dept-007", tenantId: TENANT_ID, name: "Human Resources", code: "HR", description: "People operations", headId: "emp-007", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "dept-008", tenantId: TENANT_ID, name: "Product Management", code: "PROD", description: "Product strategy", headId: "emp-008", isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

// ============================================
// GRADES
// ============================================
export const mockGrades: any[] = [
  { id: "grade-001", tenantId: TENANT_ID, name: "Executive (C-Suite)", code: "EX", level: 1, baseSalary: 8500000, description: "CEO, CTO, CFO", createdAt: new Date(), updatedAt: new Date() },
  { id: "grade-002", tenantId: TENANT_ID, name: "Director", code: "DR", level: 2, baseSalary: 5500000, description: "Department Directors", createdAt: new Date(), updatedAt: new Date() },
  { id: "grade-003", tenantId: TENANT_ID, name: "Senior Manager", code: "SM", level: 3, baseSalary: 3500000, description: "Senior Managers", createdAt: new Date(), updatedAt: new Date() },
  { id: "grade-004", tenantId: TENANT_ID, name: "Manager", code: "MG", level: 4, baseSalary: 2200000, description: "Managers", createdAt: new Date(), updatedAt: new Date() },
  { id: "grade-005", tenantId: TENANT_ID, name: "Senior Consultant", code: "SC", level: 5, baseSalary: 1500000, description: "Senior staff", createdAt: new Date(), updatedAt: new Date() },
  { id: "grade-006", tenantId: TENANT_ID, name: "Consultant", code: "CN", level: 6, baseSalary: 950000, description: "Mid-level", createdAt: new Date(), updatedAt: new Date() },
  { id: "grade-007", tenantId: TENANT_ID, name: "Associate", code: "AS", level: 7, baseSalary: 550000, description: "Junior staff", createdAt: new Date(), updatedAt: new Date() },
  { id: "grade-008", tenantId: TENANT_ID, name: "Intern/NYSC", code: "IN", level: 8, baseSalary: 150000, description: "Interns", createdAt: new Date(), updatedAt: new Date() },
];

// ============================================
// EMPLOYEES (QuCoon Team)
// ============================================
export const mockEmployees: any[] = [
  { id: "emp-001", tenantId: TENANT_ID, number: "QUC-001", firstName: "Yinka", lastName: "Daramola", email: "yinka.daramola@qucoon.com", phone: "+234 803 000 0001", departmentId: "dept-001", gradeId: "grade-001", position: "Chief Executive Officer", jobTitle: "CEO", hireDate: new Date("2016-01-15"), status: "active", bankName: "GTBank", bankAccountNumber: "0011223344", bankAccountName: "Olayinka Daramola", address: "Lekki Phase 1, Lagos", nin: "12345678901", createdAt: new Date(), updatedAt: new Date() },
  { id: "emp-002", tenantId: TENANT_ID, number: "QUC-002", firstName: "Tope", lastName: "Olakunle", email: "tope.olakunle@qucoon.com", phone: "+234 803 000 0002", departmentId: "dept-003", gradeId: "grade-001", position: "Chief Technology Officer", jobTitle: "CTO", hireDate: new Date("2016-03-01"), status: "active", bankName: "Zenith Bank", bankAccountNumber: "1122334455", bankAccountName: "Tope Olakunle", address: "Victoria Island, Lagos", nin: "23456789012", createdAt: new Date(), updatedAt: new Date() },
  { id: "emp-003", tenantId: TENANT_ID, number: "QUC-003", firstName: "Adebayo", lastName: "Ogunlesi", email: "adebayo.ogunlesi@qucoon.com", phone: "+234 803 000 0003", departmentId: "dept-002", gradeId: "grade-002", position: "Head of Cloud & DevOps", jobTitle: "Cloud Architect", hireDate: new Date("2017-03-01"), status: "active", bankName: "Access Bank", bankAccountNumber: "2233445566", bankAccountName: "Adebayo Ogunlesi", address: "Ikoyi, Lagos", nin: "34567890123", createdAt: new Date(), updatedAt: new Date() },
  { id: "emp-004", tenantId: TENANT_ID, number: "QUC-004", firstName: "Chioma", lastName: "Nwosu", email: "chioma.nwosu@qucoon.com", phone: "+234 803 000 0004", departmentId: "dept-003", gradeId: "grade-002", position: "Lead Backend Engineer", jobTitle: "Backend Lead", hireDate: new Date("2017-06-15"), status: "active", bankName: "First Bank", bankAccountNumber: "3344556677", bankAccountName: "Chioma Nwosu", address: "Surulere, Lagos", nin: "45678901234", createdAt: new Date(), updatedAt: new Date() },
  { id: "emp-005", tenantId: TENANT_ID, number: "QUC-005", firstName: "Olumide", lastName: "Bakare", email: "olumide.bakare@qucoon.com", phone: "+234 803 000 0005", departmentId: "dept-003", gradeId: "grade-003", position: "Lead Frontend Engineer", jobTitle: "Frontend Lead", hireDate: new Date("2018-09-01"), status: "active", bankName: "UBA", bankAccountNumber: "4455667788", bankAccountName: "Olumide Bakare", address: "Ikeja GRA, Lagos", nin: "56789012345", createdAt: new Date(), updatedAt: new Date() },
  { id: "emp-006", tenantId: TENANT_ID, number: "QUC-006", firstName: "Modesola", lastName: "Shoroye", email: "modesola.shoroye@qucoon.com", phone: "+234 803 000 0006", departmentId: "dept-005", gradeId: "grade-003", position: "Business Development Manager", jobTitle: "BD Manager", hireDate: new Date("2018-04-01"), status: "active", bankName: "Stanbic IBTC", bankAccountNumber: "5566778899", bankAccountName: "Modesola Shoroye", address: "Maryland, Lagos", nin: "67890123456", createdAt: new Date(), updatedAt: new Date() },
  { id: "emp-007", tenantId: TENANT_ID, number: "QUC-007", firstName: "Ngozi", lastName: "Okeke", email: "ngozi.okeke@qucoon.com", phone: "+234 803 000 0007", departmentId: "dept-006", gradeId: "grade-003", position: "Finance Manager", jobTitle: "Finance Manager", hireDate: new Date("2019-07-15"), status: "active", bankName: "Fidelity Bank", bankAccountNumber: "6677889900", bankAccountName: "Ngozi Okeke", address: "Yaba, Lagos", nin: "78901234567", createdAt: new Date(), updatedAt: new Date() },
  { id: "emp-008", tenantId: TENANT_ID, number: "QUC-008", firstName: "Funke", lastName: "Adeyemi", email: "funke.adeyemi@qucoon.com", phone: "+234 803 000 0008", departmentId: "dept-007", gradeId: "grade-004", position: "HR Manager", jobTitle: "HR Manager", hireDate: new Date("2020-02-01"), status: "active", bankName: "FCMB", bankAccountNumber: "7788990011", bankAccountName: "Funke Adeyemi", address: "Ajah, Lagos", nin: "89012345678", createdAt: new Date(), updatedAt: new Date() },
  { id: "emp-009", tenantId: TENANT_ID, number: "QUC-009", firstName: "Amara", lastName: "Efo", email: "amara.efo@qucoon.com", phone: "+234 803 000 0009", departmentId: "dept-008", gradeId: "grade-004", position: "Project Manager", jobTitle: "Project Manager", hireDate: new Date("2020-08-15"), status: "active", bankName: "GTBank", bankAccountNumber: "8899001122", bankAccountName: "Amara Efo", address: "Magodo, Lagos", nin: "90123456789", createdAt: new Date(), updatedAt: new Date() },
  { id: "emp-010", tenantId: TENANT_ID, number: "QUC-010", firstName: "Tunde", lastName: "Adekunle", email: "tunde.adekunle@qucoon.com", phone: "+234 803 000 0010", departmentId: "dept-003", gradeId: "grade-005", position: "Senior Backend Engineer", jobTitle: "Sr. Backend Dev", hireDate: new Date("2021-01-10"), status: "active", bankName: "Zenith Bank", bankAccountNumber: "9900112233", bankAccountName: "Tunde Adekunle", address: "Gbagada, Lagos", nin: "01234567890", createdAt: new Date(), updatedAt: new Date() },
  { id: "emp-011", tenantId: TENANT_ID, number: "QUC-011", firstName: "Adaeze", lastName: "Okonkwo", email: "adaeze.okonkwo@qucoon.com", phone: "+234 803 000 0011", departmentId: "dept-003", gradeId: "grade-005", position: "Senior Frontend Engineer", jobTitle: "Sr. Frontend Dev", hireDate: new Date("2021-06-01"), status: "active", bankName: "Access Bank", bankAccountNumber: "0011223355", bankAccountName: "Adaeze Okonkwo", address: "Lekki, Lagos", nin: "11234567890", createdAt: new Date(), updatedAt: new Date() },
  { id: "emp-012", tenantId: TENANT_ID, number: "QUC-012", firstName: "David", lastName: "Oyelaran", email: "david.oyelaran@qucoon.com", phone: "+234 803 000 0012", departmentId: "dept-002", gradeId: "grade-005", position: "DevOps Engineer", jobTitle: "DevOps Engineer", hireDate: new Date("2022-03-15"), status: "active", bankName: "First Bank", bankAccountNumber: "1122334466", bankAccountName: "David Oyelaran", address: "Festac, Lagos", nin: "22345678901", createdAt: new Date(), updatedAt: new Date() },
  { id: "emp-013", tenantId: TENANT_ID, number: "QUC-013", firstName: "Halima", lastName: "Ibrahim", email: "halima.ibrahim@qucoon.com", phone: "+234 803 000 0013", departmentId: "dept-005", gradeId: "grade-006", position: "Business Development Associate", jobTitle: "BD Associate", hireDate: new Date("2022-09-01"), status: "active", bankName: "UBA", bankAccountNumber: "2233445577", bankAccountName: "Halima Ibrahim", address: "Ikeja, Lagos", nin: "33456789012", createdAt: new Date(), updatedAt: new Date() },
  { id: "emp-014", tenantId: TENANT_ID, number: "QUC-014", firstName: "Emeka", lastName: "Obi", email: "emeka.obi@qucoon.com", phone: "+234 803 000 0014", departmentId: "dept-003", gradeId: "grade-006", position: "Backend Engineer", jobTitle: "Backend Developer", hireDate: new Date("2023-02-01"), status: "active", bankName: "GTBank", bankAccountNumber: "3344556688", bankAccountName: "Emeka Obi", address: "Ogba, Lagos", nin: "44567890123", createdAt: new Date(), updatedAt: new Date() },
  { id: "emp-015", tenantId: TENANT_ID, number: "QUC-015", firstName: "Blessing", lastName: "Eze", email: "blessing.eze@qucoon.com", phone: "+234 803 000 0015", departmentId: "dept-006", gradeId: "grade-007", position: "Accountant", jobTitle: "Accountant", hireDate: new Date("2023-05-15"), status: "active", bankName: "Zenith Bank", bankAccountNumber: "4455667799", bankAccountName: "Blessing Eze", address: "Yaba, Lagos", nin: "55678901234", createdAt: new Date(), updatedAt: new Date() },
  { id: "emp-016", tenantId: TENANT_ID, number: "QUC-016", firstName: "Chinedu", lastName: "Anyanwu", email: "chinedu.anyanwu@qucoon.com", phone: "+234 803 000 0016", departmentId: "dept-003", gradeId: "grade-008", position: "Frontend Engineer", jobTitle: "Frontend Developer", hireDate: new Date("2024-01-15"), status: "active", bankName: "Access Bank", bankAccountNumber: "5566778800", bankAccountName: "Chinedu Anyanwu", address: "Maryland, Lagos", nin: "66789012345", createdAt: new Date(), updatedAt: new Date() },
];

// ============================================
// LEAVE TYPES & REQUESTS
// ============================================
export const mockLeaveTypes: any[] = [
  { id: "lt-001", tenantId: TENANT_ID, name: "Annual Leave", code: "AL", daysAllowed: 21, isPaid: true, description: "Annual vacation", createdAt: new Date(), updatedAt: new Date() },
  { id: "lt-002", tenantId: TENANT_ID, name: "Sick Leave", code: "SL", daysAllowed: 12, isPaid: true, description: "Medical leave", createdAt: new Date(), updatedAt: new Date() },
  { id: "lt-003", tenantId: TENANT_ID, name: "Maternity Leave", code: "ML", daysAllowed: 90, isPaid: true, description: "Maternity", createdAt: new Date(), updatedAt: new Date() },
  { id: "lt-004", tenantId: TENANT_ID, name: "Paternity Leave", code: "PL", daysAllowed: 14, isPaid: true, description: "Paternity", createdAt: new Date(), updatedAt: new Date() },
  { id: "lt-005", tenantId: TENANT_ID, name: "Compassionate Leave", code: "CL", daysAllowed: 5, isPaid: true, description: "Family emergencies", createdAt: new Date(), updatedAt: new Date() },
];

export const mockLeaveRequests: any[] = [
  { id: "lr-001", tenantId: TENANT_ID, employeeId: "emp-010", leaveTypeId: "lt-001", startDate: new Date("2025-01-20"), endDate: new Date("2025-01-31"), days: 8, status: "approved", reason: "Year-end vacation to Ibadan", approverId: "emp-003", approvedAt: new Date("2025-01-05"), createdAt: new Date(), updatedAt: new Date() },
  { id: "lr-002", tenantId: TENANT_ID, employeeId: "emp-012", leaveTypeId: "lt-002", startDate: new Date("2025-01-15"), endDate: new Date("2025-01-17"), days: 3, status: "approved", reason: "Malaria treatment", approverId: "emp-003", approvedAt: new Date("2025-01-14"), createdAt: new Date(), updatedAt: new Date() },
  { id: "lr-003", tenantId: TENANT_ID, employeeId: "emp-014", leaveTypeId: "lt-001", startDate: new Date("2025-02-10"), endDate: new Date("2025-02-14"), days: 5, status: "pending", reason: "Wedding preparation", approverId: null, approvedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "lr-004", tenantId: TENANT_ID, employeeId: "emp-013", leaveTypeId: "lt-001", startDate: new Date("2025-01-27"), endDate: new Date("2025-01-31"), days: 5, status: "rejected", reason: "Personal travel", approverId: "emp-005", approvedAt: null, rejectionReason: "Critical presentation scheduled", createdAt: new Date(), updatedAt: new Date() },
];

// ============================================
// EXPENSE CATEGORIES & EXPENSES
// ============================================
export const mockExpenseCategories: any[] = [
  { id: "ec-001", tenantId: TENANT_ID, name: "Travel & Transportation", code: "TRV", description: "Business travel", budget: 25000000, createdAt: new Date(), updatedAt: new Date() },
  { id: "ec-002", tenantId: TENANT_ID, name: "Office Supplies", code: "OFS", description: "Stationery, equipment", budget: 3000000, createdAt: new Date(), updatedAt: new Date() },
  { id: "ec-003", tenantId: TENANT_ID, name: "Client Entertainment", code: "ENT", description: "Client meals, events", budget: 8000000, createdAt: new Date(), updatedAt: new Date() },
  { id: "ec-004", tenantId: TENANT_ID, name: "Training & Certifications", code: "TRD", description: "Staff training", budget: 12000000, createdAt: new Date(), updatedAt: new Date() },
  { id: "ec-005", tenantId: TENANT_ID, name: "Software Subscriptions", code: "SFT", description: "SaaS subscriptions", budget: 15000000, createdAt: new Date(), updatedAt: new Date() },
];

export const mockExpenses: any[] = [
  // All expenses dated January 2025 to match budget periods
  { id: "exp-001", tenantId: TENANT_ID, number: "EXP-2025-001", employeeId: "emp-005", categoryId: "ec-001", date: new Date("2025-01-10"), amount: 1850000, description: "Abuja trip - Air Peace + Transcorp Hilton", status: "approved", receiptUrl: null, approverId: "emp-001", approvedAt: new Date("2025-01-12"), createdAt: new Date(), updatedAt: new Date() },
  { id: "exp-002", tenantId: TENANT_ID, number: "EXP-2025-002", employeeId: "emp-005", categoryId: "ec-003", date: new Date("2025-01-11"), amount: 285000, description: "Client dinner at Nok by Alara", status: "approved", receiptUrl: null, approverId: "emp-001", approvedAt: new Date("2025-01-13"), createdAt: new Date(), updatedAt: new Date() },
  { id: "exp-003", tenantId: TENANT_ID, number: "EXP-2025-003", employeeId: "emp-002", categoryId: "ec-004", date: new Date("2025-01-05"), amount: 2500000, description: "AWS re:Invent 2024 - Las Vegas", status: "approved", receiptUrl: null, approverId: "emp-001", approvedAt: new Date("2025-01-06"), createdAt: new Date(), updatedAt: new Date() },
  { id: "exp-004", tenantId: TENANT_ID, number: "EXP-2025-004", employeeId: "emp-010", categoryId: "ec-004", date: new Date("2025-01-18"), amount: 450000, description: "GCP certification exam + materials", status: "pending", receiptUrl: null, approverId: null, approvedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "exp-005", tenantId: TENANT_ID, number: "EXP-2025-005", employeeId: "emp-003", categoryId: "ec-005", date: new Date("2025-01-02"), amount: 3500000, description: "GitHub Enterprise renewal (50 seats)", status: "approved", receiptUrl: null, approverId: "emp-006", approvedAt: new Date("2025-01-03"), createdAt: new Date(), updatedAt: new Date() },
];

// ============================================
// ASSET CATEGORIES & FIXED ASSETS
// ============================================
export const mockAssetCategories: any[] = [
  { id: "ac-001", tenantId: TENANT_ID, name: "Computer Equipment", code: "CE", depreciationRate: 25, usefulLife: 4, description: "Laptops, servers", createdAt: new Date(), updatedAt: new Date() },
  { id: "ac-002", tenantId: TENANT_ID, name: "Office Furniture", code: "OF", depreciationRate: 10, usefulLife: 10, description: "Desks, chairs", createdAt: new Date(), updatedAt: new Date() },
  { id: "ac-003", tenantId: TENANT_ID, name: "Motor Vehicles", code: "MV", depreciationRate: 20, usefulLife: 5, description: "Company cars", createdAt: new Date(), updatedAt: new Date() },
  { id: "ac-004", tenantId: TENANT_ID, name: "Office Equipment", code: "OE", depreciationRate: 20, usefulLife: 5, description: "Printers, ACs", createdAt: new Date(), updatedAt: new Date() },
];

export const mockFixedAssets: any[] = [
  { id: "fa-001", tenantId: TENANT_ID, number: "AST-001", name: "MacBook Pro 16-inch M3 Max", categoryId: "ac-001", purchaseDate: new Date("2024-03-01"), purchasePrice: 4500000, currentValue: 3375000, status: "in_use", location: "Engineering", assignedTo: "emp-001", serialNumber: "FVFG2CL3Q6LR", warrantyExpiry: new Date("2027-03-01"), createdAt: new Date(), updatedAt: new Date() },
  { id: "fa-002", tenantId: TENANT_ID, number: "AST-002", name: "MacBook Pro 14-inch M3 Pro", categoryId: "ac-001", purchaseDate: new Date("2024-02-15"), purchasePrice: 3200000, currentValue: 2560000, status: "in_use", location: "Engineering", assignedTo: "emp-003", serialNumber: "FVFH3MD4R8KP", warrantyExpiry: new Date("2027-02-15"), createdAt: new Date(), updatedAt: new Date() },
  { id: "fa-003", tenantId: TENANT_ID, number: "AST-003", name: "Dell PowerEdge R750 Server", categoryId: "ac-001", purchaseDate: new Date("2023-06-01"), purchasePrice: 15000000, currentValue: 11250000, status: "in_use", location: "Server Room", assignedTo: null, serialNumber: "CN4BGDFK3", warrantyExpiry: new Date("2026-06-01"), createdAt: new Date(), updatedAt: new Date() },
  { id: "fa-004", tenantId: TENANT_ID, number: "AST-004", name: "Toyota Camry 2024", categoryId: "ac-003", purchaseDate: new Date("2024-01-15"), purchasePrice: 42000000, currentValue: 35700000, status: "in_use", location: "Car Park", assignedTo: "emp-001", serialNumber: "JTDKN3DU5P3123456", warrantyExpiry: new Date("2027-01-15"), createdAt: new Date(), updatedAt: new Date() },
  { id: "fa-005", tenantId: TENANT_ID, number: "AST-005", name: "Toyota Corolla 2023", categoryId: "ac-003", purchaseDate: new Date("2023-03-01"), purchasePrice: 28000000, currentValue: 22400000, status: "in_use", location: "Car Park", assignedTo: "emp-005", serialNumber: "JTDKN3DU5P3234567", warrantyExpiry: new Date("2026-03-01"), createdAt: new Date(), updatedAt: new Date() },
  { id: "fa-006", tenantId: TENANT_ID, number: "AST-006", name: "Executive Conference Table", categoryId: "ac-002", purchaseDate: new Date("2022-06-01"), purchasePrice: 2500000, currentValue: 2000000, status: "in_use", location: "Conference Room A", assignedTo: null, serialNumber: null, warrantyExpiry: null, createdAt: new Date(), updatedAt: new Date() },
];

// ============================================
// WORK SCHEDULES & HOLIDAYS
// ============================================
export const mockWorkSchedules: any[] = [
  { id: "ws-001", tenantId: TENANT_ID, name: "Standard Hours", code: "STD", startTime: "09:00", endTime: "18:00", breakMinutes: 60, workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"], isDefault: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "ws-002", tenantId: TENANT_ID, name: "Flexible Hours", code: "FLX", startTime: "07:00", endTime: "19:00", breakMinutes: 60, workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"], isDefault: false, createdAt: new Date(), updatedAt: new Date() },
];

export const mockHolidays: any[] = [
  { id: "hol-001", tenantId: TENANT_ID, name: "New Year's Day", date: new Date("2025-01-01"), type: "public", description: "New Year", createdAt: new Date(), updatedAt: new Date() },
  { id: "hol-002", tenantId: TENANT_ID, name: "Workers' Day", date: new Date("2025-05-01"), type: "public", description: "Labour Day", createdAt: new Date(), updatedAt: new Date() },
  { id: "hol-003", tenantId: TENANT_ID, name: "Democracy Day", date: new Date("2025-06-12"), type: "public", description: "Democracy Day", createdAt: new Date(), updatedAt: new Date() },
  { id: "hol-004", tenantId: TENANT_ID, name: "Independence Day", date: new Date("2025-10-01"), type: "public", description: "Independence", createdAt: new Date(), updatedAt: new Date() },
  { id: "hol-005", tenantId: TENANT_ID, name: "Christmas Day", date: new Date("2025-12-25"), type: "public", description: "Christmas", createdAt: new Date(), updatedAt: new Date() },
  { id: "hol-006", tenantId: TENANT_ID, name: "Boxing Day", date: new Date("2025-12-26"), type: "public", description: "Boxing Day", createdAt: new Date(), updatedAt: new Date() },
];

export const mockAttendanceRecords: any[] = [
  { id: "att-001", tenantId: TENANT_ID, employeeId: "emp-001", date: new Date("2025-01-06"), clockIn: new Date("2025-01-06T09:05:00"), clockOut: new Date("2025-01-06T18:30:00"), status: "present", hoursWorked: 8.42, location: "VI Office", createdAt: new Date(), updatedAt: new Date() },
  { id: "att-002", tenantId: TENANT_ID, employeeId: "emp-002", date: new Date("2025-01-06"), clockIn: new Date("2025-01-06T08:55:00"), clockOut: new Date("2025-01-06T19:00:00"), status: "present", hoursWorked: 9.08, location: "VI Office", createdAt: new Date(), updatedAt: new Date() },
  { id: "att-003", tenantId: TENANT_ID, employeeId: "emp-003", date: new Date("2025-01-06"), clockIn: new Date("2025-01-06T09:00:00"), clockOut: new Date("2025-01-06T18:00:00"), status: "present", hoursWorked: 8.0, location: "Remote", createdAt: new Date(), updatedAt: new Date() },
  { id: "att-004", tenantId: TENANT_ID, employeeId: "emp-004", date: new Date("2025-01-06"), clockIn: new Date("2025-01-06T09:30:00"), clockOut: new Date("2025-01-06T18:30:00"), status: "late", hoursWorked: 8.0, location: "VI Office", createdAt: new Date(), updatedAt: new Date() },
  { id: "att-005", tenantId: TENANT_ID, employeeId: "emp-010", date: new Date("2025-01-06"), clockIn: null, clockOut: null, status: "leave", hoursWorked: 0, location: null, createdAt: new Date(), updatedAt: new Date() },
];

// ============================================
// DASHBOARD STATS
// ============================================
export const mockDashboardStats = {
  totalRevenue: 271500000,
  totalExpenses: 228800000,
  receivables: 291231250,
  payables: 39725000,
  customerCount: 8,
  employeeCount: 16,
  invoiceCount: 8,
  pendingInvoices: 5,
};

export const mockRevenueChart = [
  { month: "Aug", revenue: 42500000, expenses: 35800000 },
  { month: "Sep", revenue: 48200000, expenses: 38500000 },
  { month: "Oct", revenue: 52000000, expenses: 41200000 },
  { month: "Nov", revenue: 58500000, expenses: 44800000 },
  { month: "Dec", revenue: 45300000, expenses: 42500000 },
  { month: "Jan", revenue: 25000000, expenses: 26000000 },
];

// ============================================
// SUBSCRIPTION PLANS
// ============================================
export const mockSubscriptionPlans: any[] = [
  { id: "plan-001", name: "Starter", code: "STARTER", monthlyPrice: 25000, annualPrice: 250000, maxUsers: 3, maxCustomers: 50, features: ["Accounting", "Sales", "Basic Reports"], isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "plan-002", name: "Professional", code: "PRO", monthlyPrice: 75000, annualPrice: 750000, maxUsers: 15, maxCustomers: 500, features: ["All Starter", "HR", "Expenses", "Assets", "Inventory"], isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "plan-003", name: "Enterprise", code: "ENT", monthlyPrice: 200000, annualPrice: 2000000, maxUsers: -1, maxCustomers: -1, features: ["All Pro", "Attendance", "API Access", "Priority Support"], isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

// ============================================
// BUDGETS
// Budgets are synced with approved expenses by category
// Amount should always be >= spent
// ============================================
export const mockBudgets: any[] = [
  { id: "bud-001", tenantId: TENANT_ID, categoryId: "ec-001", year: 2025, month: 1, amount: 2500000, spent: 1850000, createdAt: new Date(), updatedAt: new Date() }, // Travel: exp-001 approved
  { id: "bud-002", tenantId: TENANT_ID, categoryId: "ec-003", year: 2025, month: 1, amount: 800000, spent: 285000, createdAt: new Date(), updatedAt: new Date() }, // Entertainment: exp-002 approved
  { id: "bud-003", tenantId: TENANT_ID, categoryId: "ec-004", year: 2025, month: 1, amount: 3500000, spent: 2500000, createdAt: new Date(), updatedAt: new Date() }, // Training: exp-003 approved (exp-004 pending)
  { id: "bud-004", tenantId: TENANT_ID, categoryId: "ec-005", year: 2025, month: 1, amount: 5000000, spent: 3500000, createdAt: new Date(), updatedAt: new Date() }, // Software: exp-005 approved
  { id: "bud-005", tenantId: TENANT_ID, categoryId: "ec-002", year: 2025, month: 1, amount: 500000, spent: 0, createdAt: new Date(), updatedAt: new Date() }, // Office Supplies: no expenses yet
];

// ============================================
// STOCK ADJUSTMENTS & PAYMENTS
// ============================================
export const mockStockAdjustments: any[] = [
  { id: "adj-001", tenantId: TENANT_ID, number: "ADJ-2024-001", productId: "prod-008", date: new Date("2024-12-15"), type: "addition", quantity: 20, reason: "New QSA cohort", reference: "QSA-2025-Q1", createdBy: "emp-008", createdAt: new Date(), updatedAt: new Date() },
];

export const mockPayments: any[] = [
  { id: "pmt-001", tenantId: TENANT_ID, number: "PMT-2024-001", invoiceId: "inv-002", date: new Date("2024-12-15"), amount: 48375000, method: "bank_transfer", reference: "DAN/QUC/2024/001", bankName: "GTBank", createdAt: new Date(), updatedAt: new Date() },
  { id: "pmt-002", tenantId: TENANT_ID, number: "PMT-2024-002", invoiceId: "inv-003", date: new Date("2024-12-20"), amount: 41887500, method: "bank_transfer", reference: "MTN/QUC/2024/001", bankName: "Zenith Bank", createdAt: new Date(), updatedAt: new Date() },
  { id: "pmt-003", tenantId: TENANT_ID, number: "PMT-2024-003", invoiceId: "inv-007", date: new Date("2024-12-01"), amount: 59125000, method: "bank_transfer", reference: "TOT/QUC/2024/001", bankName: "GTBank", createdAt: new Date(), updatedAt: new Date() },
];

// ============================================
// JOURNALS
// ============================================
export const mockJournals: any[] = [
  { id: "jrn-001", tenantId: TENANT_ID, number: "JRN-2024-0001", date: new Date("2024-11-15"), description: "Invoice QUC-2024-0002 payment - Dangote", reference: "PMT-001", type: "auto", status: "posted", createdBy: "system", createdAt: new Date(), updatedAt: new Date() },
  { id: "jrn-002", tenantId: TENANT_ID, number: "JRN-2024-0002", date: new Date("2024-11-20"), description: "Invoice QUC-2024-0003 raised - MTN", reference: "INV-003", type: "auto", status: "posted", createdBy: "system", createdAt: new Date(), updatedAt: new Date() },
];

export const mockJournalLines: any[] = [
  { id: "jrnl-001", journalId: "jrn-001", accountId: "coa-002", description: "Cash received", debit: 48375000, credit: 0, createdAt: new Date(), updatedAt: new Date() },
  { id: "jrnl-002", journalId: "jrn-001", accountId: "coa-004", description: "A/R cleared", debit: 0, credit: 48375000, createdAt: new Date(), updatedAt: new Date() },
];
