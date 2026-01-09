import { pgTable, text, serial, integer, boolean, timestamp, numeric, date, jsonb, uuid, time } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================
// PLATFORM ADMINISTRATION (System-Level)
// ============================================

export const platformAdmins = pgTable("platform_admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role", { enum: ["platform_owner", "platform_support"] }).notNull().default("platform_support"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// SUBSCRIPTION & BILLING
// ============================================

export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  description: text("description"),
  priceMonthlyNgn: numeric("price_monthly_ngn").notNull(),
  priceYearlyNgn: numeric("price_yearly_ngn").notNull(),
  maxUsers: integer("max_users").default(-1),
  maxEmployees: integer("max_employees").default(-1),
  maxCustomers: integer("max_customers").default(-1),
  maxProducts: integer("max_products").default(-1),
  maxInvoicesPerMonth: integer("max_invoices_per_month").default(-1),
  modulesIncluded: jsonb("modules_included"),
  features: jsonb("features"),
  isActive: boolean("is_active").default(true),
  isPopular: boolean("is_popular").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// MULTI-TENANCY CORE
// ============================================

export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  subdomain: text("subdomain").unique(),
  logoUrl: text("logo_url"),
  industry: text("industry"),
  companySize: text("company_size", { enum: ["1-10", "11-50", "51-200", "201-500", "500+"] }),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country").default("Nigeria"),
  phone: text("phone"),
  email: text("email").notNull(),
  website: text("website"),
  taxId: text("tax_id"),
  rcNumber: text("rc_number"),
  settings: jsonb("settings"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  onboardingStep: integer("onboarding_step").default(1),
  isActive: boolean("is_active").default(true),
  suspendedAt: timestamp("suspended_at"),
  suspensionReason: text("suspension_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tenantSubscriptions = pgTable("tenant_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  planId: uuid("plan_id").references(() => subscriptionPlans.id).notNull(),
  status: text("status", { enum: ["trial", "active", "past_due", "cancelled", "expired"] }).default("trial"),
  billingCycle: text("billing_cycle", { enum: ["monthly", "yearly"] }).default("monthly"),
  currentPeriodStart: timestamp("current_period_start").defaultNow(),
  currentPeriodEnd: timestamp("current_period_end"),
  trialEndsAt: timestamp("trial_ends_at"),
  cancelledAt: timestamp("cancelled_at"),
  cancellationReason: text("cancellation_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  email: text("email").notNull(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
  role: text("role", { enum: ["super_admin", "admin", "viewer"] }).default("viewer"),
  isOwner: boolean("is_owner").default(false),
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified").default(false),
  emailVerifiedAt: timestamp("email_verified_at"),
  lastLogin: timestamp("last_login"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  userId: uuid("user_id").references(() => users.id),
  action: text("action", { enum: ["create", "read", "update", "delete", "login", "logout", "export"] }).notNull(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id"),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================
// MODULE 1: ACCOUNTING
// ============================================

export const chartOfAccounts = pgTable("chart_of_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  type: text("type", { enum: ["asset", "liability", "equity", "revenue", "expense"] }).notNull(),
  parentId: uuid("parent_id"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const journals = pgTable("journals", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  number: text("number").notNull(),
  date: date("date").notNull(),
  description: text("description"),
  reference: text("reference"),
  status: text("status", { enum: ["draft", "posted", "reversed"] }).default("draft"),
  totalDebit: numeric("total_debit").default("0"),
  totalCredit: numeric("total_credit").default("0"),
  sourceType: text("source_type", { enum: ["manual", "invoice", "payment", "expense", "payroll", "asset", "depreciation"] }),
  sourceId: uuid("source_id"),
  createdBy: uuid("created_by").references(() => users.id),
  postedBy: uuid("posted_by").references(() => users.id),
  postedAt: timestamp("posted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const journalLines = pgTable("journal_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  journalId: uuid("journal_id").references(() => journals.id).notNull(),
  accountId: uuid("account_id").references(() => chartOfAccounts.id).notNull(),
  description: text("description"),
  debit: numeric("debit").default("0"),
  credit: numeric("credit").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// MODULE 2: SALES
// ============================================

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  code: text("code"),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  alternatePhone: text("alternate_phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country").default("Nigeria"),
  taxId: text("tax_id"),
  creditLimit: numeric("credit_limit").default("0"),
  paymentTerms: integer("payment_terms").default(30),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productCategories = pgTable("product_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  sku: text("sku"),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type", { enum: ["product", "service"] }).default("product"),
  categoryId: uuid("category_id").references(() => productCategories.id),
  unitOfMeasure: text("unit_of_measure"),
  costPrice: numeric("cost_price").default("0"),
  sellingPrice: numeric("selling_price").notNull(),
  taxRate: numeric("tax_rate").default("7.5"),
  quantityOnHand: numeric("quantity_on_hand").default("0"),
  trackInventory: boolean("track_inventory").default(true),
  reorderLevel: integer("reorder_level"),
  reorderQuantity: integer("reorder_quantity"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  number: text("number").notNull(),
  type: text("type", { enum: ["invoice", "quotation", "credit_note"] }).default("invoice"),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  date: date("date").notNull(),
  dueDate: date("due_date").notNull(),
  subtotal: numeric("subtotal").notNull(),
  vatAmount: numeric("vat_amount").default("0"),
  whtAmount: numeric("wht_amount").default("0"),
  totalAmount: numeric("total_amount").notNull(),
  amountPaid: numeric("amount_paid").default("0"),
  balanceDue: numeric("balance_due"),
  status: text("status", { enum: ["draft", "sent", "partial", "paid", "overdue", "cancelled"] }).default("draft"),
  notes: text("notes"),
  terms: text("terms"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const invoiceLines = pgTable("invoice_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").references(() => invoices.id).notNull(),
  productId: uuid("product_id").references(() => products.id),
  description: text("description"),
  quantity: numeric("quantity").notNull(),
  unitPrice: numeric("unit_price").notNull(),
  taxRate: numeric("tax_rate").default("7.5"),
  taxAmount: numeric("tax_amount").default("0"),
  total: numeric("total").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  number: text("number").notNull(),
  invoiceId: uuid("invoice_id").references(() => invoices.id).notNull(),
  date: date("date").notNull(),
  amount: numeric("amount").notNull(),
  method: text("method", { enum: ["cash", "bank_transfer", "cheque", "card", "mobile_money"] }).notNull(),
  reference: text("reference"),
  bankName: text("bank_name"),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// MODULE 2B: SALES LEADS
// ============================================

export const salesLeads = pgTable("sales_leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  code: text("code"),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  source: text("source", { enum: ["website", "referral", "cold_call", "advertisement", "trade_show", "social_media", "other"] }),
  status: text("status", { enum: ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"] }).default("new"),
  priority: text("priority", { enum: ["low", "medium", "high"] }).default("medium"),
  estimatedValue: numeric("estimated_value"),
  notes: text("notes"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country").default("Nigeria"),
  assignedTo: uuid("assigned_to").references(() => users.id),
  convertedToCustomerId: uuid("converted_to_customer_id").references(() => customers.id),
  convertedAt: timestamp("converted_at"),
  lastContactDate: date("last_contact_date"),
  nextFollowUpDate: date("next_follow_up_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// MODULE 3: HR
// ============================================

export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  code: text("code"),
  managerId: uuid("manager_id"),
  parentId: uuid("parent_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const grades = pgTable("grades", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  baseSalary: numeric("base_salary").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const salaryComponents = pgTable("salary_components", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  gradeId: uuid("grade_id").references(() => grades.id).notNull(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  type: text("type", { enum: ["earning", "deduction"] }).default("earning"),
  amount: numeric("amount").notNull(),
  isPercentage: boolean("is_percentage").default(false),
  percentageOf: text("percentage_of"),
  isTaxable: boolean("is_taxable").default(true),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const employees = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  code: text("code"),
  userId: uuid("user_id").references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  middleName: text("middle_name"),
  email: text("email").notNull(),
  phone: text("phone"),
  personalEmail: text("personal_email"),
  dateOfBirth: date("date_of_birth"),
  gender: text("gender", { enum: ["male", "female", "other"] }),
  maritalStatus: text("marital_status", { enum: ["single", "married", "divorced", "widowed"] }),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country").default("Nigeria"),
  nationality: text("nationality"),
  nin: text("nin"),
  taxId: text("tax_id"),
  bankName: text("bank_name"),
  bankAccountNumber: text("bank_account_number"),
  bankAccountName: text("bank_account_name"),
  departmentId: uuid("department_id").references(() => departments.id),
  jobTitle: text("job_title"),
  gradeId: uuid("grade_id").references(() => grades.id),
  employmentType: text("employment_type", { enum: ["full_time", "part_time", "contract", "intern"] }).default("full_time"),
  employmentStatus: text("employment_status", { enum: ["active", "on_leave", "suspended", "terminated", "resigned"] }).default("active"),
  hireDate: date("hire_date"),
  confirmationDate: date("confirmation_date"),
  terminationDate: date("termination_date"),
  terminationReason: text("termination_reason"),
  reportsTo: uuid("reports_to"),
  salary: numeric("salary").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const leaveTypes = pgTable("leave_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  daysAllowed: integer("days_allowed").notNull(),
  isPaid: boolean("is_paid").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const leaveRequests = pgTable("leave_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  leaveTypeId: uuid("leave_type_id").references(() => leaveTypes.id).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  days: integer("days").notNull(),
  reason: text("reason"),
  status: text("status", { enum: ["pending", "approved", "rejected", "cancelled"] }).default("pending"),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// MODULE 3B: PAYROLL
// ============================================

export const payrollRuns = pgTable("payroll_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  status: text("status", { enum: ["draft", "processing", "approved", "paid", "cancelled"] }).default("draft"),
  totalGrossPay: numeric("total_gross_pay").default("0"),
  totalDeductions: numeric("total_deductions").default("0"),
  totalNetPay: numeric("total_net_pay").default("0"),
  employeeCount: integer("employee_count").default(0),
  processedBy: uuid("processed_by").references(() => users.id),
  processedAt: timestamp("processed_at"),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  paidAt: timestamp("paid_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const payrollRecords = pgTable("payroll_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  payrollRunId: uuid("payroll_run_id").references(() => payrollRuns.id).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  gradeId: uuid("grade_id").references(() => grades.id),
  baseSalary: numeric("base_salary").notNull(),
  grossPay: numeric("gross_pay").notNull(),
  totalEarnings: numeric("total_earnings").notNull(),
  totalDeductions: numeric("total_deductions").notNull(),
  netPay: numeric("net_pay").notNull(),
  taxAmount: numeric("tax_amount").default("0"),
  pensionAmount: numeric("pension_amount").default("0"),
  status: text("status", { enum: ["pending", "approved", "paid"] }).default("pending"),
  bankName: text("bank_name"),
  bankAccountNumber: text("bank_account_number"),
  bankAccountName: text("bank_account_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const payrollLines = pgTable("payroll_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  payrollRecordId: uuid("payroll_record_id").references(() => payrollRecords.id).notNull(),
  componentId: uuid("component_id").references(() => salaryComponents.id),
  name: text("name").notNull(),
  type: text("type", { enum: ["earning", "deduction"] }).notNull(),
  amount: numeric("amount").notNull(),
  isTaxable: boolean("is_taxable").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// MODULE 4: EXPENSE MANAGEMENT
// ============================================

export const expenseCategories = pgTable("expense_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  accountId: uuid("account_id").references(() => chartOfAccounts.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  number: text("number").notNull(),
  categoryId: uuid("category_id").references(() => expenseCategories.id).notNull(),
  date: date("date").notNull(),
  amount: numeric("amount").notNull(),
  vatAmount: numeric("vat_amount").default("0"),
  totalAmount: numeric("total_amount").notNull(),
  description: text("description"),
  vendor: text("vendor"),
  paymentMethod: text("payment_method", { enum: ["cash", "bank_transfer", "cheque", "card"] }),
  reference: text("reference"),
  receiptUrl: text("receipt_url"),
  status: text("status", { enum: ["draft", "pending", "approved", "rejected", "paid"] }).default("draft"),
  submittedBy: uuid("submitted_by").references(() => users.id),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const budgets = pgTable("budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  fiscalYear: integer("fiscal_year").notNull(),
  departmentId: uuid("department_id").references(() => departments.id),
  categoryId: uuid("category_id").references(() => expenseCategories.id),
  amount: numeric("amount").notNull(),
  spent: numeric("spent").default("0"),
  status: text("status", { enum: ["draft", "active", "closed"] }).default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// MODULE 5: ASSET MANAGEMENT
// ============================================

export const assetCategories = pgTable("asset_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  depreciationMethod: text("depreciation_method", { enum: ["straight_line", "declining_balance"] }).default("straight_line"),
  usefulLifeYears: integer("useful_life_years").default(5),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const fixedAssets = pgTable("fixed_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  assetCode: text("asset_code").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => assetCategories.id),
  purchaseDate: date("purchase_date").notNull(),
  purchasePrice: numeric("purchase_price").notNull(),
  currentValue: numeric("current_value"),
  location: text("location"),
  serialNumber: text("serial_number"),
  manufacturer: text("manufacturer"),
  model: text("model"),
  warrantyExpiry: date("warranty_expiry"),
  status: text("status", { enum: ["active", "disposed", "under_maintenance", "retired"] }).default("active"),
  assignedTo: uuid("assigned_to").references(() => employees.id),
  assignedAt: timestamp("assigned_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assetMaintenances = pgTable("asset_maintenances", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id").references(() => fixedAssets.id).notNull(),
  type: text("type", { enum: ["preventive", "corrective", "upgrade"] }).notNull(),
  description: text("description"),
  date: date("date").notNull(),
  cost: numeric("cost").default("0"),
  vendorName: text("vendor_name"),
  nextDate: date("next_date"),
  performedBy: text("performed_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// MODULE 6: INVENTORY
// ============================================

export const stockAdjustments = pgTable("stock_adjustments", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  number: text("number").notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  type: text("type", { enum: ["addition", "subtraction", "correction"] }).notNull(),
  quantity: numeric("quantity").notNull(),
  previousQuantity: numeric("previous_quantity").notNull(),
  newQuantity: numeric("new_quantity").notNull(),
  reason: text("reason"),
  reference: text("reference"),
  date: date("date").notNull(),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// MODULE 7: TIME & ATTENDANCE
// ============================================

export const workSchedules = pgTable("work_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  mondayStart: time("monday_start"),
  mondayEnd: time("monday_end"),
  tuesdayStart: time("tuesday_start"),
  tuesdayEnd: time("tuesday_end"),
  wednesdayStart: time("wednesday_start"),
  wednesdayEnd: time("wednesday_end"),
  thursdayStart: time("thursday_start"),
  thursdayEnd: time("thursday_end"),
  fridayStart: time("friday_start"),
  fridayEnd: time("friday_end"),
  saturdayStart: time("saturday_start"),
  saturdayEnd: time("saturday_end"),
  sundayStart: time("sunday_start"),
  sundayEnd: time("sunday_end"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const holidays = pgTable("holidays", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  date: date("date").notNull(),
  isRecurring: boolean("is_recurring").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const attendanceRecords = pgTable("attendance_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  date: date("date").notNull(),
  clockInTime: timestamp("clock_in_time"),
  clockOutTime: timestamp("clock_out_time"),
  clockInLocation: text("clock_in_location"),
  clockOutLocation: text("clock_out_location"),
  scheduledStart: time("scheduled_start"),
  scheduledEnd: time("scheduled_end"),
  hoursWorked: numeric("hours_worked"),
  overtimeHours: numeric("overtime_hours"),
  status: text("status", { enum: ["present", "absent", "late", "half_day", "holiday", "weekend"] }).default("present"),
  lateMinutes: integer("late_minutes"),
  earlyDepartureMinutes: integer("early_departure_minutes"),
  source: text("source", { enum: ["manual", "biometric", "mobile", "web"] }).default("web"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// PLATFORM INVOICES (for SaaS billing)
// ============================================

export const platformInvoices = pgTable("platform_invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  number: text("number").notNull(),
  amount: numeric("amount").notNull(),
  currency: text("currency").default("NGN"),
  status: text("status", { enum: ["draft", "sent", "paid", "overdue", "cancelled"] }).default("draft"),
  dueDate: date("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  paymentReference: text("payment_reference"),
  billingPeriodStart: date("billing_period_start"),
  billingPeriodEnd: date("billing_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// INSERT SCHEMAS
// ============================================

export const insertPlatformAdminSchema = createInsertSchema(platformAdmins).omit({ id: true, createdAt: true, updatedAt: true, lastLogin: true });
export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTenantSchema = createInsertSchema(tenants).omit({ id: true, createdAt: true, updatedAt: true, suspendedAt: true });
export const insertTenantSubscriptionSchema = createInsertSchema(tenantSubscriptions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true, lastLogin: true, emailVerifiedAt: true, passwordResetExpires: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });

export const insertChartOfAccountSchema = createInsertSchema(chartOfAccounts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertJournalSchema = createInsertSchema(journals).omit({ id: true, createdAt: true, updatedAt: true, postedAt: true });
export const insertJournalLineSchema = createInsertSchema(journalLines).omit({ id: true, createdAt: true, updatedAt: true });

export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProductCategorySchema = createInsertSchema(productCategories).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true, updatedAt: true });
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true, updatedAt: true });
export const insertInvoiceLineSchema = createInsertSchema(invoiceLines).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true, updatedAt: true });

export const insertSalesLeadSchema = createInsertSchema(salesLeads).omit({ id: true, createdAt: true, updatedAt: true, convertedAt: true });

export const insertDepartmentSchema = createInsertSchema(departments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertGradeSchema = createInsertSchema(grades).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSalaryComponentSchema = createInsertSchema(salaryComponents).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLeaveTypeSchema = createInsertSchema(leaveTypes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLeaveRequestSchema = createInsertSchema(leaveRequests).omit({ id: true, createdAt: true, updatedAt: true, approvedAt: true });
export const insertPayrollRunSchema = createInsertSchema(payrollRuns).omit({ id: true, createdAt: true, updatedAt: true, processedAt: true, approvedAt: true, paidAt: true });
export const insertPayrollRecordSchema = createInsertSchema(payrollRecords).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPayrollLineSchema = createInsertSchema(payrollLines).omit({ id: true, createdAt: true, updatedAt: true });

export const insertExpenseCategorySchema = createInsertSchema(expenseCategories).omit({ id: true, createdAt: true, updatedAt: true });
export const insertExpenseSchema = createInsertSchema(expenses).omit({ id: true, createdAt: true, updatedAt: true, approvedAt: true, paidAt: true });
export const insertBudgetSchema = createInsertSchema(budgets).omit({ id: true, createdAt: true, updatedAt: true });

export const insertAssetCategorySchema = createInsertSchema(assetCategories).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFixedAssetSchema = createInsertSchema(fixedAssets).omit({ id: true, createdAt: true, updatedAt: true, assignedAt: true });
export const insertAssetMaintenanceSchema = createInsertSchema(assetMaintenances).omit({ id: true, createdAt: true, updatedAt: true });

export const insertStockAdjustmentSchema = createInsertSchema(stockAdjustments).omit({ id: true, createdAt: true, updatedAt: true });

export const insertWorkScheduleSchema = createInsertSchema(workSchedules).omit({ id: true, createdAt: true, updatedAt: true });
export const insertHolidaySchema = createInsertSchema(holidays).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAttendanceRecordSchema = createInsertSchema(attendanceRecords).omit({ id: true, createdAt: true, updatedAt: true });

export const insertPlatformInvoiceSchema = createInsertSchema(platformInvoices).omit({ id: true, createdAt: true, updatedAt: true, paidAt: true });

// ============================================
// TYPE EXPORTS
// ============================================

export type PlatformAdmin = typeof platformAdmins.$inferSelect;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type Tenant = typeof tenants.$inferSelect;
export type TenantSubscription = typeof tenantSubscriptions.$inferSelect;
export type User = typeof users.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;

export type ChartOfAccount = typeof chartOfAccounts.$inferSelect;
export type Journal = typeof journals.$inferSelect;
export type JournalLine = typeof journalLines.$inferSelect;

export type Customer = typeof customers.$inferSelect;
export type ProductCategory = typeof productCategories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type InvoiceLine = typeof invoiceLines.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type SalesLead = typeof salesLeads.$inferSelect;

export type Department = typeof departments.$inferSelect;
export type Grade = typeof grades.$inferSelect;
export type SalaryComponent = typeof salaryComponents.$inferSelect;
export type Employee = typeof employees.$inferSelect;
export type LeaveType = typeof leaveTypes.$inferSelect;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type PayrollRun = typeof payrollRuns.$inferSelect;
export type PayrollRecord = typeof payrollRecords.$inferSelect;
export type PayrollLine = typeof payrollLines.$inferSelect;

export type ExpenseCategory = typeof expenseCategories.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type Budget = typeof budgets.$inferSelect;

export type AssetCategory = typeof assetCategories.$inferSelect;
export type FixedAsset = typeof fixedAssets.$inferSelect;
export type AssetMaintenance = typeof assetMaintenances.$inferSelect;

export type StockAdjustment = typeof stockAdjustments.$inferSelect;

export type WorkSchedule = typeof workSchedules.$inferSelect;
export type Holiday = typeof holidays.$inferSelect;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;

export type PlatformInvoice = typeof platformInvoices.$inferSelect;

export type InsertPlatformAdmin = z.infer<typeof insertPlatformAdminSchema>;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type InsertTenantSubscription = z.infer<typeof insertTenantSubscriptionSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

export type InsertChartOfAccount = z.infer<typeof insertChartOfAccountSchema>;
export type InsertJournal = z.infer<typeof insertJournalSchema>;
export type InsertJournalLine = z.infer<typeof insertJournalLineSchema>;

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type InsertInvoiceLine = z.infer<typeof insertInvoiceLineSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertSalesLead = z.infer<typeof insertSalesLeadSchema>;

export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type InsertSalaryComponent = z.infer<typeof insertSalaryComponentSchema>;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type InsertLeaveType = z.infer<typeof insertLeaveTypeSchema>;
export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;
export type InsertPayrollRun = z.infer<typeof insertPayrollRunSchema>;
export type InsertPayrollRecord = z.infer<typeof insertPayrollRecordSchema>;
export type InsertPayrollLine = z.infer<typeof insertPayrollLineSchema>;

export type InsertExpenseCategory = z.infer<typeof insertExpenseCategorySchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;

export type InsertAssetCategory = z.infer<typeof insertAssetCategorySchema>;
export type InsertFixedAsset = z.infer<typeof insertFixedAssetSchema>;
export type InsertAssetMaintenance = z.infer<typeof insertAssetMaintenanceSchema>;

export type InsertStockAdjustment = z.infer<typeof insertStockAdjustmentSchema>;

export type InsertWorkSchedule = z.infer<typeof insertWorkScheduleSchema>;
export type InsertHoliday = z.infer<typeof insertHolidaySchema>;
export type InsertAttendanceRecord = z.infer<typeof insertAttendanceRecordSchema>;

export type InsertPlatformInvoice = z.infer<typeof insertPlatformInvoiceSchema>;
