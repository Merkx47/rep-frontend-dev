# Qucoon ERP - Multi-Tenant Enterprise Resource Planning System

## Project Overview

Build a modern, multi-tenant Enterprise Resource Planning (ERP) system designed for Nigerian businesses. The application should be simple, user-friendly, and built to Silicon Valley standards with bulletproof security and best practices.

**Target Market:** Nigerian SMEs and Enterprises
**Base Currency:** Nigerian Naira (NGN)
**Tax Context:** Nigerian tax regulations (VAT 7.5%, WHT, PAYE)
**Year Context:** 2026

---

## Technical Requirements

### Architecture
- **Multi-tenancy:** True SaaS model - multiple organizations/companies onboard independently
- **Tenant Isolation:** Shared database with `tenant_id` on every table + Row Level Security (RLS)
- **Frontend:** Modern React/Next.js with TypeScript
- **Styling:** Tailwind CSS for responsive, clean UI
- **State Management:** React Query / Zustand
- **Database:** PostgreSQL with row-level security policies
- **Authentication:** JWT-based with refresh tokens
- **API:** RESTful API with proper versioning

### SaaS Multi-Tenancy Model

This is a **true SaaS application** where:
- Multiple companies/organizations can sign up and use the platform independently
- Each organization (tenant) has completely isolated data
- Organizations manage their own users, settings, and data
- Platform owner can manage all tenants from a super admin panel

#### Tenant Isolation Strategy
```
┌─────────────────────────────────────────────────────────┐
│                    QUCOON ERP PLATFORM                   │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Tenant A   │  │   Tenant B   │  │   Tenant C   │  │
│  │  (Dangote)   │  │  (MTN NG)    │  │  (Access Bk) │  │
│  │              │  │              │  │              │  │
│  │ - Users      │  │ - Users      │  │ - Users      │  │
│  │ - Customers  │  │ - Customers  │  │ - Customers  │  │
│  │ - Invoices   │  │ - Invoices   │  │ - Invoices   │  │
│  │ - Employees  │  │ - Employees  │  │ - Employees  │  │
│  │ - Assets     │  │ - Assets     │  │ - Assets     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│              SHARED DATABASE (with tenant_id)            │
│              PostgreSQL + Row Level Security             │
└─────────────────────────────────────────────────────────┘
```

### Security Requirements
- Row-level security enforcing tenant isolation
- Input validation and sanitization on all endpoints
- CSRF protection
- Rate limiting
- Encrypted data at rest and in transit
- Audit logging for all CRUD operations
- Session management with secure token handling
- SQL injection prevention
- XSS protection

### UI/UX Requirements
- Mobile-responsive design (mobile-first approach)
- Clean, modern dashboard with analytics
- Intuitive navigation with sidebar
- Data tables with search, filter, sort, and pagination
- Form validation with clear error messages
- Loading states and skeleton screens
- Toast notifications for actions
- Dark/Light mode support
- Export functionality (PDF, Excel, CSV)

---

## Public Website & Landing Pages

### Landing Page (Homepage)

A professional, conversion-focused landing page that showcases the ERP platform.

#### Hero Section
- Compelling headline: "Modern ERP for Nigerian Businesses"
- Subheadline explaining the value proposition
- CTA buttons: "Start Free Trial" and "Book a Demo"
- Hero image/illustration showing dashboard preview
- Trust badges (security certifications, payment partners)

#### Features Section
- Grid of key features with icons
- Each module highlighted with brief description
- Animated on scroll

#### How It Works
- 3-step process: Sign Up → Set Up → Start Growing
- Visual timeline or numbered steps

#### Modules Overview
- Tabbed or carousel display of all modules
- Screenshots of each module interface
- Key features bullet points per module

#### Pricing Section
- 3-tier pricing cards (Starter, Professional, Enterprise)
- Monthly/Yearly toggle with discount highlight
- Feature comparison table
- "Most Popular" badge on recommended plan
- CTA: "Start Free Trial" on each plan

#### Testimonials
- Customer quotes with photos, names, companies
- Industry variety (manufacturing, retail, services)
- Star ratings

#### Stats/Social Proof
- Number of businesses using the platform
- Transactions processed
- Customer satisfaction rate

#### FAQ Section
- Accordion-style frequently asked questions
- Categories: General, Pricing, Security, Features

#### CTA Section
- Final call-to-action before footer
- "Ready to transform your business?"
- Email capture or direct sign-up

#### Footer
- Navigation links
- Contact information
- Social media links
- Legal links (Privacy, Terms)
- Newsletter signup

### Additional Public Pages

| Page | Description |
|------|-------------|
| **/pricing** | Detailed pricing page with full feature comparison matrix |
| **/features** | In-depth feature breakdown by module |
| **/features/[module]** | Individual module detail pages |
| **/about** | Company story, mission, team (optional) |
| **/contact** | Contact form, office address, support email |
| **/demo** | Book a demo form with calendar integration |
| **/blog** | Blog/resources section (optional, can be placeholder) |
| **/privacy** | Privacy policy |
| **/terms** | Terms of service |
| **/security** | Security practices and compliance |

### Authentication Pages

| Page | Description |
|------|-------------|
| **/login** | User login with email/password |
| **/signup** | New organization registration (starts onboarding) |
| **/forgot-password** | Password reset request |
| **/reset-password** | Password reset form |
| **/verify-email** | Email verification page |
| **/onboarding** | Multi-step onboarding wizard |

### Landing Page Design Requirements
- **Hero**: Full-width, gradient background or subtle pattern
- **Colors**: Professional blue/indigo primary, green accents for CTAs
- **Typography**: Modern sans-serif (Inter, Plus Jakarta Sans)
- **Animations**: Subtle scroll animations, hover effects
- **Mobile**: Fully responsive, hamburger menu on mobile
- **Speed**: Optimized images, lazy loading, fast load times
- **SEO**: Meta tags, Open Graph, structured data

---

## User Roles & Permissions

### Two-Level Role System

#### Level 1: Platform Roles (SaaS Management)
These users manage the entire Qucoon ERP platform, NOT individual tenants.

| Role | Description | Access |
|------|-------------|--------|
| **Platform Owner** | Owns the SaaS platform | Full platform control, billing, all tenants |
| **Platform Support** | Customer support staff | View tenants, assist with issues, limited admin |

#### Level 2: Tenant Roles (Organization Level)
These users belong to a specific organization/company using the platform.

| Role | Description | Access Level |
|------|-------------|--------------|
| **Super Admin** | Tenant owner (created the account) | Full access, manages admins, billing, settings |
| **Admin** | Power users / managers | Full CRUD on all modules, cannot manage other Admins |
| **Viewer** | Read-only users | View-only access across all modules |

### Platform Permission Matrix

| Action | Platform Owner | Platform Support |
|--------|----------------|------------------|
| View All Tenants | ✅ | ✅ |
| Create/Edit Tenant | ✅ | ❌ |
| Suspend/Activate Tenant | ✅ | ❌ |
| Delete Tenant | ✅ | ❌ |
| Manage Subscription Plans | ✅ | ❌ |
| View Platform Analytics | ✅ | ✅ |
| Manage Platform Admins | ✅ | ❌ |
| Access Tenant Data (Support) | ✅ | ✅ (read-only) |
| Platform Settings | ✅ | ❌ |

### Tenant Permission Matrix

| Action | Super Admin | Admin | Viewer |
|--------|-------------|-------|--------|
| Create/Edit/Delete Records | ✅ | ✅ | ❌ |
| View Records | ✅ | ✅ | ✅ |
| Manage Users | ✅ | ❌ | ❌ |
| Invite New Users | ✅ | ❌ | ❌ |
| Organization Settings | ✅ | ❌ | ❌ |
| Billing & Subscription | ✅ | ❌ | ❌ |
| Export Data | ✅ | ✅ | ✅ |
| View Reports | ✅ | ✅ | ✅ |
| View Audit Logs | ✅ | ✅ | ❌ |

---

## Database Schema - Core Entities

### Platform Administration (System-Level)

```
PlatformAdmin
├── platformAdminId (UUID, PK)
├── platformAdminEmail (string, unique)
├── platformAdminPasswordHash (string)
├── platformAdminFirstName (string)
├── platformAdminLastName (string)
├── platformAdminRole (enum: platform_owner, platform_support)
├── platformAdminIsActive (boolean)
├── platformAdminLastLogin (timestamp)
├── platformAdminCreatedAt (timestamp)
└── platformAdminUpdatedAt (timestamp)

Note: PlatformAdmins are NOT tied to any tenant. They manage the entire SaaS platform.
```

### Subscription & Billing

```
SubscriptionPlan
├── subscriptionPlanId (UUID, PK)
├── subscriptionPlanName (string) // Starter, Professional, Enterprise
├── subscriptionPlanCode (string, unique)
├── subscriptionPlanDescription (text)
├── subscriptionPlanPriceMonthlyNgn (decimal)
├── subscriptionPlanPriceYearlyNgn (decimal)
├── subscriptionPlanMaxUsers (integer) // -1 for unlimited
├── subscriptionPlanMaxEmployees (integer)
├── subscriptionPlanMaxCustomers (integer)
├── subscriptionPlanMaxProducts (integer)
├── subscriptionPlanMaxInvoicesPerMonth (integer)
├── subscriptionPlanModulesIncluded (JSONB) // ["accounting", "sales", "hr", ...]
├── subscriptionPlanFeatures (JSONB) // Additional feature flags
├── subscriptionPlanIsActive (boolean)
├── subscriptionPlanIsPopular (boolean) // Highlight on pricing page
├── subscriptionPlanSortOrder (integer)
├── subscriptionPlanCreatedAt (timestamp)
└── subscriptionPlanUpdatedAt (timestamp)

TenantSubscription
├── tenantSubscriptionId (UUID, PK)
├── tenantSubscriptionTenantId (UUID, FK → Tenant)
├── tenantSubscriptionPlanId (UUID, FK → SubscriptionPlan)
├── tenantSubscriptionStatus (enum: trial, active, past_due, cancelled, expired)
├── tenantSubscriptionBillingCycle (enum: monthly, yearly)
├── tenantSubscriptionCurrentPeriodStart (timestamp)
├── tenantSubscriptionCurrentPeriodEnd (timestamp)
├── tenantSubscriptionTrialEndsAt (timestamp, nullable)
├── tenantSubscriptionCancelledAt (timestamp, nullable)
├── tenantSubscriptionCancellationReason (text, nullable)
├── tenantSubscriptionCreatedAt (timestamp)
└── tenantSubscriptionUpdatedAt (timestamp)

PlatformInvoice (Platform Billing - separate from tenant invoices)
├── platformInvoiceId (UUID, PK)
├── platformInvoiceTenantId (UUID, FK → Tenant)
├── platformInvoiceNumber (string)
├── platformInvoiceAmount (decimal)
├── platformInvoiceCurrency (string, default: NGN)
├── platformInvoiceStatus (enum: draft, sent, paid, overdue, cancelled)
├── platformInvoiceDueDate (date)
├── platformInvoicePaidAt (timestamp, nullable)
├── platformInvoicePaymentReference (string, nullable)
├── platformInvoiceBillingPeriodStart (date)
├── platformInvoiceBillingPeriodEnd (date)
├── platformInvoiceCreatedAt (timestamp)
└── platformInvoiceUpdatedAt (timestamp)
```

### Multi-Tenancy Core (Organization Level)

```
Tenant
├── tenantId (UUID, PK)
├── tenantName (string) // Company/Organization name
├── tenantSlug (string, unique) // URL-friendly identifier
├── tenantSubdomain (string, unique, nullable) // For custom subdomain access
├── tenantLogoUrl (string, nullable)
├── tenantIndustry (string, nullable)
├── tenantCompanySize (enum: 1-10, 11-50, 51-200, 201-500, 500+)
├── tenantAddress (text)
├── tenantCity (string)
├── tenantState (string)
├── tenantCountry (string, default: Nigeria)
├── tenantPhone (string)
├── tenantEmail (string)
├── tenantWebsite (string, nullable)
├── tenantTaxId (string, nullable) // Company TIN
├── tenantRcNumber (string, nullable) // CAC Registration Number
├── tenantSettings (JSONB) // Tenant-specific settings
│   ├── fiscalYearStart (integer) // Month 1-12
│   ├── defaultCurrency (string)
│   ├── dateFormat (string)
│   ├── timezone (string)
│   └── ...
├── tenantOnboardingCompleted (boolean, default: false)
├── tenantOnboardingStep (integer, default: 1)
├── tenantIsActive (boolean, default: true)
├── tenantSuspendedAt (timestamp, nullable)
├── tenantSuspensionReason (text, nullable)
├── tenantCreatedAt (timestamp)
└── tenantUpdatedAt (timestamp)

User (Tenant Users)
├── userId (UUID, PK)
├── userTenantId (UUID, FK → Tenant)
├── userEmail (string, unique per tenant)
├── userPasswordHash (string)
├── userFirstName (string)
├── userLastName (string)
├── userPhone (string, nullable)
├── userAvatarUrl (string, nullable)
├── userRole (enum: super_admin, admin, viewer)
├── userIsOwner (boolean, default: false) // The user who created the tenant
├── userIsActive (boolean, default: true)
├── userEmailVerified (boolean, default: false)
├── userEmailVerifiedAt (timestamp, nullable)
├── userLastLogin (timestamp, nullable)
├── userPasswordResetToken (string, nullable)
├── userPasswordResetExpires (timestamp, nullable)
├── userCreatedAt (timestamp)
└── userUpdatedAt (timestamp)

AuditLog
├── auditLogId (UUID, PK)
├── auditLogTenantId (UUID, FK → Tenant)
├── auditLogUserId (UUID, FK → User)
├── auditLogAction (enum: create, read, update, delete, login, logout, export)
├── auditLogEntityType (string) // e.g., "Customer", "Invoice"
├── auditLogEntityId (UUID, nullable)
├── auditLogOldValues (JSONB, nullable)
├── auditLogNewValues (JSONB, nullable)
├── auditLogIpAddress (string)
├── auditLogUserAgent (string)
├── auditLogCreatedAt (timestamp)
└── (no updatedAt - audit logs are immutable)
```

### Tenant Onboarding Flow

```
Step 1: Sign Up
├── Email & Password
├── First Name & Last Name
└── Email Verification

Step 2: Company Information
├── Company Name
├── Industry
├── Company Size
├── Phone Number
└── RC Number (optional)

Step 3: Select Plan
├── View available plans
├── Select billing cycle (monthly/yearly)
└── Start trial or enter payment

Step 4: Initial Setup
├── Upload company logo
├── Set fiscal year
├── Set timezone
└── Invite team members (optional)

Step 5: Module Activation
├── Select modules to enable
└── Quick tour of enabled modules

→ Redirect to Dashboard
```

---

## Module 1: Accounting

### Sub-Module: General Ledger

#### Entities

```
ChartOfAccount
├── chartOfAccountId (UUID, PK)
├── chartOfAccountTenantId (UUID, FK)
├── chartOfAccountCode (string)
├── chartOfAccountName (string)
├── chartOfAccountType (enum: asset, liability, equity, revenue, expense)
├── chartOfAccountParentId (UUID, FK → self, nullable)
├── chartOfAccountIsActive (boolean)
├── chartOfAccountDescription (text)
├── chartOfAccountCreatedAt (timestamp)
└── chartOfAccountUpdatedAt (timestamp)

Journal
├── journalId (UUID, PK)
├── journalTenantId (UUID, FK)
├── journalNumber (string, auto-generated)
├── journalDate (date)
├── journalDescription (text)
├── journalReference (string)
├── journalStatus (enum: draft, posted, reversed)
├── journalTotalDebit (decimal)
├── journalTotalCredit (decimal)
├── journalCreatedBy (UUID, FK → User)
├── journalPostedBy (UUID, FK → User, nullable)
├── journalPostedAt (timestamp, nullable)
├── journalCreatedAt (timestamp)
└── journalUpdatedAt (timestamp)

JournalLine
├── journalLineId (UUID, PK)
├── journalLineJournalId (UUID, FK → Journal)
├── journalLineAccountId (UUID, FK → ChartOfAccount)
├── journalLineDescription (text)
├── journalLineDebit (decimal, default 0)
├── journalLineCredit (decimal, default 0)
├── journalLineCreatedAt (timestamp)
└── journalLineUpdatedAt (timestamp)
```

#### Features - Version 1

| Feature | Description |
|---------|-------------|
| Create Journal Entry | Create new journal with multiple debit/credit lines. Auto-validate debit = credit |
| Edit Journal Entry | Edit draft journals only. Posted journals cannot be edited |
| Delete Journal Entry | Soft delete draft journals only |
| View Journal Entries | List all journals with filters (date range, status, account) |
| Post Journal Entry | Change status from draft to posted, lock for editing |
| Reverse Journal Entry | Create reversing entry for posted journals |
| Create Account | Add new account to chart of accounts |
| Edit Account | Modify account details (not code if transactions exist) |
| Delete Account | Soft delete accounts with no transactions |
| View Chart of Accounts | Hierarchical view of all accounts with balances |
| Nigerian COA Template | Pre-loaded Nigerian standard chart of accounts |

### Sub-Module: Financial Reports

#### Features - Version 1

| Feature | Description |
|---------|-------------|
| Profit & Loss Statement | Generate P&L for selected period with comparison options |
| Balance Sheet | Generate balance sheet as at selected date |
| Cash Flow Statement | Generate cash flow using indirect method |
| Trial Balance | Generate trial balance for selected period |
| View Reports | View generated reports with drill-down capability |
| Export Reports | Export to PDF, Excel, CSV formats |
| Schedule Reports | Set up automated report generation (daily, weekly, monthly) |

### Sub-Module: Business Reports

#### Features - Version 1

| Feature | Description |
|---------|-------------|
| Accounts Receivable Aging | AR aging by 30/60/90/120+ days buckets |
| Accounts Payable Aging | AP aging by 30/60/90/120+ days buckets |
| Bank Reconciliation | Match bank statements with book entries |

### Sub-Module: Auto-Journaling (GL Integration)

All financial transactions automatically create journal entries in the General Ledger. This ensures the books are always in sync.

#### Auto-Journal Triggers

| Transaction | Debit Account | Credit Account |
|-------------|---------------|----------------|
| **Invoice Created** | Accounts Receivable | Sales Revenue + VAT Payable |
| **Payment Received** | Bank/Cash | Accounts Receivable |
| **Expense Recorded** | Expense Category Account | Bank/Cash/Accounts Payable |
| **Payroll Processed** | Salary Expense, PAYE Payable, Pension Payable | Bank/Cash |
| **Asset Purchased** | Fixed Asset Account | Bank/Cash/Accounts Payable |
| **Depreciation Run** | Depreciation Expense | Accumulated Depreciation |
| **Asset Disposed** | Bank/Cash, Accumulated Depreciation, Loss on Disposal | Fixed Asset, Gain on Disposal |
| **WHT Deducted** | WHT Receivable | Accounts Receivable |

#### Features - Version 1

| Feature | Description |
|---------|-------------|
| Auto-Post Invoices | When invoice is sent, auto-create AR journal entry |
| Auto-Post Payments | When payment recorded, auto-create bank/AR entry |
| Auto-Post Expenses | When expense paid, auto-create expense journal |
| Journal Reference | Each auto-journal links back to source document |
| View Source | From journal, navigate to original transaction |
| Manual Override | Option to create manual adjusting entries |

#### Journal Entity Update

Add to Journal entity:
```
Journal (Updated)
├── ... (existing fields)
├── journalSourceType (enum: manual, invoice, payment, expense, payroll, asset, depreciation, nullable)
├── journalSourceId (UUID, nullable) // FK to source document
└── ... (existing fields)
```

---

## Module 2: Sales

### Sub-Module: Customer Management

#### Entities

```
Customer
├── customerId (UUID, PK)
├── customerTenantId (UUID, FK)
├── customerCode (string, auto-generated)
├── customerCompanyName (string)
├── customerContactPerson (string)
├── customerEmail (string)
├── customerPhone (string)
├── customerAlternatePhone (string, nullable)
├── customerAddress (text)
├── customerCity (string)
├── customerState (string)
├── customerCountry (string, default: Nigeria)
├── customerTaxId (string, nullable) // TIN
├── customerCreditLimit (decimal, default 0)
├── customerPaymentTerms (integer, days, default 30)
├── customerIsActive (boolean)
├── customerNotes (text)
├── customerCreatedAt (timestamp)
└── customerUpdatedAt (timestamp)
```

#### Features - Version 1

| Feature | Description |
|---------|-------------|
| Create Customer | Add new customer with full details |
| Edit Customer | Update customer information |
| Delete Customer | Soft delete (prevent if has invoices) |
| View Customer List | Paginated list with search and filters |
| View Customer Details | Full customer profile with transaction history |
| Bulk Create Customers | CSV/Excel import for multiple customers |
| Customer Credit Limit | Set and track credit limits per customer |
| Payment Terms | Configure default payment terms per customer |

### Sub-Module: Product Management

#### Entities

```
ProductCategory
├── productCategoryId (UUID, PK)
├── productCategoryTenantId (UUID, FK)
├── productCategoryName (string)
├── productCategoryDescription (text)
├── productCategoryParentId (UUID, FK → self, nullable)
├── productCategoryCreatedAt (timestamp)
└── productCategoryUpdatedAt (timestamp)

Product
├── productId (UUID, PK)
├── productTenantId (UUID, FK)
├── productSku (string, unique per tenant)
├── productName (string)
├── productDescription (text)
├── productType (enum: product, service) // Products track inventory, Services don't
├── productCategoryId (UUID, FK → ProductCategory)
├── productUnitOfMeasure (string)
├── productCostPrice (decimal)
├── productSellingPrice (decimal)
├── productTaxRate (decimal, default 7.5) // VAT
├── productIsActive (boolean)
├── productQuantityOnHand (decimal, default 0) // Current stock (for products only)
├── productTrackInventory (boolean, default true) // false for services
├── productReorderLevel (integer, nullable) // Alert threshold
├── productReorderQuantity (integer, nullable) // Suggested reorder amount
├── productCreatedAt (timestamp)
└── productUpdatedAt (timestamp)
```

#### Features - Version 1

| Feature | Description |
|---------|-------------|
| Create Product | Add new product/service with pricing |
| Edit Product | Update product details and pricing |
| Delete Product | Soft delete (prevent if has transactions) |
| View Product List | Paginated list with category filters |
| View Product Details | Full product info with sales history |
| Bulk Create Products | CSV/Excel import for multiple products |
| Low Stock Alerts | Dashboard alerts for products below reorder level |

### Sub-Module: Sales & Invoicing

#### Entities

```
Invoice
├── invoiceId (UUID, PK)
├── invoiceTenantId (UUID, FK)
├── invoiceNumber (string, auto-generated)
├── invoiceType (enum: invoice, quotation, credit_note)
├── invoiceCustomerId (UUID, FK → Customer)
├── invoiceDate (date)
├── invoiceDueDate (date)
├── invoiceSubtotal (decimal)
├── invoiceVatAmount (decimal)
├── invoiceWhtAmount (decimal)
├── invoiceTotalAmount (decimal)
├── invoiceAmountPaid (decimal, default 0)
├── invoiceBalanceDue (decimal, computed)
├── invoiceStatus (enum: draft, sent, partial, paid, overdue, cancelled)
├── invoiceNotes (text)
├── invoiceTerms (text)
├── invoiceCreatedBy (UUID, FK → User)
├── invoiceCreatedAt (timestamp)
└── invoiceUpdatedAt (timestamp)

InvoiceLine
├── invoiceLineId (UUID, PK)
├── invoiceLineInvoiceId (UUID, FK → Invoice)
├── invoiceLineProductId (UUID, FK → Product)
├── invoiceLineDescription (text)
├── invoiceLineQuantity (decimal)
├── invoiceLineUnitPrice (decimal)
├── invoiceLineTaxRate (decimal)
├── invoiceLineTaxAmount (decimal)
├── invoiceLineTotal (decimal)
├── invoiceLineCreatedAt (timestamp)
└── invoiceLineUpdatedAt (timestamp)

Payment
├── paymentId (UUID, PK)
├── paymentTenantId (UUID, FK)
├── paymentNumber (string, auto-generated)
├── paymentInvoiceId (UUID, FK → Invoice)
├── paymentDate (date)
├── paymentAmount (decimal)
├── paymentMethod (enum: cash, bank_transfer, cheque, card, mobile_money)
├── paymentReference (string)
├── paymentBankName (string, nullable)
├── paymentNotes (text)
├── paymentCreatedBy (UUID, FK → User)
├── paymentCreatedAt (timestamp)
└── paymentUpdatedAt (timestamp)

WhtDeduction
├── whtDeductionId (UUID, PK)
├── whtDeductionTenantId (UUID, FK)
├── whtDeductionInvoiceId (UUID, FK → Invoice)
├── whtDeductionRate (decimal)
├── whtDeductionAmount (decimal)
├── whtDeductionCertificateNumber (string)
├── whtDeductionDate (date)
├── whtDeductionCreatedBy (UUID, FK → User)
├── whtDeductionCreatedAt (timestamp)
└── whtDeductionUpdatedAt (timestamp)
```

#### Features - Version 1

| Feature | Description |
|---------|-------------|
| Create Invoice | Generate invoice with line items, auto-calculate VAT |
| Edit Invoice | Edit draft/unpaid invoices only |
| Delete Invoice | Delete only draft or unpaid invoices |
| View Invoices | List with filters (status, date, customer) |
| Create Quotation | Generate quote, convert to invoice on approval |
| Create Credit Note | Issue credit note against invoice |
| Record Payment | Record full or partial payments |
| Record WHT Deduction | Record withholding tax deductions with certificate |
| Auto VAT Calculation | 7.5% VAT auto-calculated on taxable items |
| Payment Reminders | Flag overdue invoices on dashboard |
| Invoice PDF | Generate professional PDF invoices |

### Sub-Module: Leads (Version 2)

#### Entities

```
SalesLead
├── salesLeadId (UUID, PK)
├── salesLeadTenantId (UUID, FK)
├── salesLeadSource (enum: website, referral, cold_call, social_media, other)
├── salesLeadCompanyName (string)
├── salesLeadContactName (string)
├── salesLeadEmail (string)
├── salesLeadPhone (string)
├── salesLeadStatus (enum: new, contacted, qualified, proposal, negotiation, won, lost)
├── salesLeadEstimatedValue (decimal)
├── salesLeadNotes (text)
├── salesLeadAssignedTo (UUID, FK → User)
├── salesLeadConvertedCustomerId (UUID, FK → Customer, nullable)
├── salesLeadCreatedAt (timestamp)
└── salesLeadUpdatedAt (timestamp)
```

#### Features - Version 2

| Feature | Description |
|---------|-------------|
| Create Lead | Add new sales lead |
| Edit Lead | Update lead status and details |
| Delete Lead | Remove lead from pipeline |
| View Leads | Pipeline view with drag-drop status change |
| Bulk Create Leads | CSV/Excel import |
| Convert to Customer | Convert won lead to customer record |

---

## Module 3: Human Resources (HR)

### Sub-Module: Employee Management

#### Entities

```
Department
├── departmentId (UUID, PK)
├── departmentTenantId (UUID, FK)
├── departmentName (string)
├── departmentCode (string)
├── departmentManagerId (UUID, FK → Employee, nullable)
├── departmentParentId (UUID, FK → self, nullable)
├── departmentIsActive (boolean)
├── departmentCreatedAt (timestamp)
└── departmentUpdatedAt (timestamp)

Employee
├── employeeId (UUID, PK)
├── employeeTenantId (UUID, FK)
├── employeeCode (string, auto-generated)
├── employeeUserId (UUID, FK → User, nullable) // Link to system user
├── employeeFirstName (string)
├── employeeLastName (string)
├── employeeMiddleName (string, nullable)
├── employeeEmail (string)
├── employeePhone (string)
├── employeePersonalEmail (string, nullable)
├── employeeDateOfBirth (date)
├── employeeGender (enum: male, female, other)
├── employeeMaritalStatus (enum: single, married, divorced, widowed)
├── employeeAddress (text)
├── employeeCity (string)
├── employeeState (string)
├── employeeCountry (string, default: Nigeria)
├── employeeNationality (string)
├── employeeNin (string) // National Identification Number
├── employeeTaxId (string) // TIN
├── employeeBankName (string)
├── employeeBankAccountNumber (string)
├── employeeBankAccountName (string)
├── employeeDepartmentId (UUID, FK → Department)
├── employeeJobTitle (string)
├── employeeGradeId (UUID, FK → Grade)
├── employeeEmploymentType (enum: full_time, part_time, contract, intern)
├── employeeEmploymentStatus (enum: active, on_leave, suspended, terminated, resigned)
├── employeeHireDate (date)
├── employeeConfirmationDate (date, nullable)
├── employeeTerminationDate (date, nullable)
├── employeeTerminationReason (text, nullable)
├── employeeReportsTo (UUID, FK → Employee, nullable)
├── employeeCreatedAt (timestamp)
└── employeeUpdatedAt (timestamp)
```

#### Features - Version 1

| Feature | Description |
|---------|-------------|
| Create Employee | Full employee enrollment with all details |
| Edit Employee | Update employee info, promotion, transfer |
| View Employee List | Directory with search and department filters |
| View Employee Profile | Complete employee profile with history |
| Employee Promotion | Change grade, title with effective date |
| Employee Exit | Process resignation/termination |
| Employee Directory | Org chart and searchable directory |

### Sub-Module: Payroll

#### Entities

```
Grade
├── gradeId (UUID, PK)
├── gradeTenantId (UUID, FK)
├── gradeCode (string)
├── gradeName (string)
├── gradeDescription (text)
├── gradeBaseSalary (decimal) // Standard salary for this grade
├── gradeIsActive (boolean)
├── gradeCreatedAt (timestamp)
└── gradeUpdatedAt (timestamp)

SalaryStructure
├── salaryStructureId (UUID, PK)
├── salaryStructureTenantId (UUID, FK)
├── salaryStructureGradeId (UUID, FK → Grade)
├── salaryStructureComponentName (string) // Basic, Housing, Transport, etc.
├── salaryStructureComponentType (enum: earning, deduction, tax)
├── salaryStructureCalculationType (enum: fixed, percentage)
├── salaryStructureAmount (decimal, nullable) // For fixed
├── salaryStructurePercentage (decimal, nullable) // For percentage
├── salaryStructurePercentageOf (string, nullable) // Base component
├── salaryStructureIsTaxable (boolean)
├── salaryStructureIsActive (boolean)
├── salaryStructureCreatedAt (timestamp)
└── salaryStructureUpdatedAt (timestamp)

PayrollRun
├── payrollRunId (UUID, PK)
├── payrollRunTenantId (UUID, FK)
├── payrollRunPeriod (string) // e.g., "2026-01"
├── payrollRunStartDate (date)
├── payrollRunEndDate (date)
├── payrollRunStatus (enum: draft, processing, approved, paid)
├── payrollRunTotalGross (decimal)
├── payrollRunTotalDeductions (decimal)
├── payrollRunTotalNet (decimal)
├── payrollRunTotalEmployees (integer)
├── payrollRunProcessedBy (UUID, FK → User)
├── payrollRunApprovedBy (UUID, FK → User, nullable)
├── payrollRunPaidDate (date, nullable)
├── payrollRunCreatedAt (timestamp)
└── payrollRunUpdatedAt (timestamp)

Payslip
├── payslipId (UUID, PK)
├── payslipPayrollRunId (UUID, FK → PayrollRun)
├── payslipEmployeeId (UUID, FK → Employee)
├── payslipGrossSalary (decimal)
├── payslipTotalEarnings (decimal)
├── payslipTotalDeductions (decimal)
├── payslipPayeTax (decimal)
├── payslipPensionEmployee (decimal)
├── payslipPensionEmployer (decimal)
├── payslipNhf (decimal) // National Housing Fund
├── payslipNetSalary (decimal)
├── payslipPaymentStatus (enum: pending, paid)
├── payslipBankName (string)
├── payslipAccountNumber (string)
├── payslipCreatedAt (timestamp)
└── payslipUpdatedAt (timestamp)

PayslipLine
├── payslipLineId (UUID, PK)
├── payslipLinePayslipId (UUID, FK → Payslip)
├── payslipLineComponentName (string)
├── payslipLineComponentType (enum: earning, deduction, tax)
├── payslipLineAmount (decimal)
├── payslipLineCreatedAt (timestamp)
└── payslipLineUpdatedAt (timestamp)

EmployeeSalary (Individual salary assignment based on grade)
├── employeeSalaryId (UUID, PK)
├── employeeSalaryTenantId (UUID, FK)
├── employeeSalaryEmployeeId (UUID, FK → Employee)
├── employeeSalaryGradeId (UUID, FK → Grade)
├── employeeSalaryBasicSalary (decimal) // Inherited from grade's baseSalary
├── employeeSalaryEffectiveDate (date)
├── employeeSalaryEndDate (date, nullable) // Null means current
├── employeeSalaryIsCurrent (boolean)
├── employeeSalaryCreatedAt (timestamp)
└── employeeSalaryUpdatedAt (timestamp)

Note: Employee's salary is determined by their Grade. When assigned to a grade,
the employee automatically inherits the grade's baseSalary.
```

### Sub-Module: Promotion & Salary Changes (Maker-Checker Workflow)

This module handles all employee promotions and salary changes with a **maker-checker** approval workflow:
- **Maker (Admin):** Creates the change request
- **Checker (Super Admin):** Approves or rejects the request

#### Entities

```
SalaryChangeRequest
├── salaryChangeRequestId (UUID, PK)
├── salaryChangeRequestTenantId (UUID, FK)
├── salaryChangeRequestNumber (string, auto-generated) // e.g., "SCR-2026-0001"
├── salaryChangeRequestEmployeeId (UUID, FK → Employee)
│
│   // Change Type
├── salaryChangeRequestType (enum: promotion, demotion, salary_adjustment, grade_change)
│
│   // Current Values (snapshot at request time)
├── salaryChangeRequestCurrentGradeId (UUID, FK → Grade)
├── salaryChangeRequestCurrentJobTitle (string)
├── salaryChangeRequestCurrentBasicSalary (decimal)
│
│   // Proposed Changes
├── salaryChangeRequestNewGradeId (UUID, FK → Grade, nullable) // For grade changes
├── salaryChangeRequestNewJobTitle (string, nullable) // For promotions
├── salaryChangeRequestNewBasicSalary (decimal) // Auto-set from new grade's baseSalary
├── salaryChangeRequestEffectiveDate (date)
│
│   // Justification
├── salaryChangeRequestReason (text) // Why this change is needed
├── salaryChangeRequestSupportingDocuments (JSONB, nullable) // Array of document URLs
│
│   // Maker-Checker Workflow
├── salaryChangeRequestStatus (enum: pending, approved, rejected, cancelled)
├── salaryChangeRequestCreatedBy (UUID, FK → User) // Maker (Admin)
├── salaryChangeRequestReviewedBy (UUID, FK → User, nullable) // Checker (Super Admin)
├── salaryChangeRequestReviewedAt (timestamp, nullable)
├── salaryChangeRequestRejectionReason (text, nullable)
│
├── salaryChangeRequestCreatedAt (timestamp)
└── salaryChangeRequestUpdatedAt (timestamp)

SalaryChangeHistory (Audit trail of all approved changes)
├── salaryChangeHistoryId (UUID, PK)
├── salaryChangeHistoryTenantId (UUID, FK)
├── salaryChangeHistoryEmployeeId (UUID, FK → Employee)
├── salaryChangeHistoryRequestId (UUID, FK → SalaryChangeRequest)
├── salaryChangeHistoryType (enum: promotion, demotion, salary_adjustment, grade_change)
├── salaryChangeHistoryPreviousGradeId (UUID, FK → Grade)
├── salaryChangeHistoryPreviousJobTitle (string)
├── salaryChangeHistoryPreviousBasicSalary (decimal)
├── salaryChangeHistoryNewGradeId (UUID, FK → Grade)
├── salaryChangeHistoryNewJobTitle (string)
├── salaryChangeHistoryNewBasicSalary (decimal)
├── salaryChangeHistoryEffectiveDate (date)
├── salaryChangeHistoryApprovedBy (UUID, FK → User)
├── salaryChangeHistoryCreatedAt (timestamp)
└── (no updatedAt - history is immutable)
```

#### Maker-Checker Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SALARY CHANGE WORKFLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │  Admin   │───▶│ PENDING  │───▶│  Super   │───▶│ APPROVED │      │
│  │ (Maker)  │    │          │    │  Admin   │    │          │      │
│  │ Creates  │    │ Awaiting │    │(Checker) │    │ Applied  │      │
│  │ Request  │    │ Approval │    │ Reviews  │    │ to Emp   │      │
│  └──────────┘    └──────────┘    └────┬─────┘    └──────────┘      │
│                                       │                              │
│                                       ▼                              │
│                                  ┌──────────┐                        │
│                                  │ REJECTED │                        │
│                                  │          │                        │
│                                  │ With     │                        │
│                                  │ Reason   │                        │
│                                  └──────────┘                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Features - Version 1

| Feature | Description |
|---------|-------------|
| **Maker (Admin) Actions** | |
| Create Salary Change Request | Admin initiates promotion/salary adjustment |
| Edit Pending Request | Modify own pending requests before approval |
| Cancel Pending Request | Cancel own pending requests |
| View Own Requests | See all requests created by self |
| **Checker (Super Admin) Actions** | |
| View Pending Requests | Dashboard of all awaiting approval |
| Approve Request | Approve and auto-apply changes to employee |
| Reject Request | Reject with mandatory reason |
| View All Requests | See all requests across the organization |
| **Validation Rules** | |
| Grade Salary Auto-Set | New salary auto-inherits from new grade's baseSalary |
| Effective Date Validation | Cannot be backdated beyond current month |
| **Reports & History** | |
| Salary Change History | Full audit trail per employee |
| Pending Approvals Report | All pending requests for Super Admin |
| Salary Change Report | All changes within a date range |

#### Grade → Salary Relationship

```
┌─────────────────────────────────────────────────────────────────────┐
│                      GRADE-BASED SALARY                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Grade: "Senior Manager" (Level 5)                                   │
│  └── gradeBaseSalary: ₦950,000                                      │
│                                                                      │
│  Grade: "Manager" (Level 4)                                          │
│  └── gradeBaseSalary: ₦650,000                                      │
│                                                                      │
│  Employee: "Chinedu Okafor"                                          │
│  ├── employeeGradeId: → Senior Manager                              │
│  └── EmployeeSalary:                                                │
│      └── employeeSalaryBasicSalary: ₦950,000 (auto from grade)      │
│                                                                      │
│  When Chinedu is promoted from Manager → Senior Manager:             │
│  ✅ Salary automatically changes from ₦650,000 → ₦950,000           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Features - Version 1 & 2

| Feature | Version | Description |
|---------|---------|-------------|
| Create Grade | 1 | Add new salary grade with base salary |
| Edit Grade | 1 | Modify grade details and base salary |
| Delete Grade | 1 | Remove unused grades |
| Create Salary Structure | 1 | Define salary components per grade |
| Assign Employee to Grade | 1 | Employee inherits grade's base salary |
| View Payslip | 1 | Employee can view their payslips |
| Create Salary Change Request | 1 | Maker initiates change (Admin) |
| Approve/Reject Change | 1 | Checker reviews change (Super Admin) |
| Salary Change History | 1 | View audit trail of all changes |
| Run Payroll | 2 | Process monthly payroll for all employees |
| PAYE Calculation | 2 | Auto-calculate PAYE using Nigerian tax bands |
| Pension Calculation | 2 | Auto-calculate pension (employee 8%, employer 10%) |
| Generate Bank Schedule | 2 | Export payment file for bank upload |
| Payroll Reports | 2 | Summary and detailed payroll reports |

### Sub-Module: Leave Management (Version 2)

#### Entities

```
LeaveType
├── leaveTypeId (UUID, PK)
├── leaveTypeTenantId (UUID, FK)
├── leaveTypeName (string) // Annual, Sick, Maternity, etc.
├── leaveTypeDaysAllowed (integer)
├── leaveTypeCarryOverAllowed (boolean)
├── leaveTypeMaxCarryOverDays (integer)
├── leaveTypeIsPaid (boolean)
├── leaveTypeIsActive (boolean)
├── leaveTypeCreatedAt (timestamp)
└── leaveTypeUpdatedAt (timestamp)

LeaveBalance
├── leaveBalanceId (UUID, PK)
├── leaveBalanceTenantId (UUID, FK)
├── leaveBalanceEmployeeId (UUID, FK → Employee)
├── leaveBalanceLeaveTypeId (UUID, FK → LeaveType)
├── leaveBalanceYear (integer)
├── leaveBalanceEntitledDays (decimal)
├── leaveBalanceUsedDays (decimal)
├── leaveBalanceCarriedOver (decimal)
├── leaveBalanceBalance (decimal, computed)
├── leaveBalanceCreatedAt (timestamp)
└── leaveBalanceUpdatedAt (timestamp)

LeaveRequest
├── leaveRequestId (UUID, PK)
├── leaveRequestTenantId (UUID, FK)
├── leaveRequestEmployeeId (UUID, FK → Employee)
├── leaveRequestLeaveTypeId (UUID, FK → LeaveType)
├── leaveRequestStartDate (date)
├── leaveRequestEndDate (date)
├── leaveRequestDaysRequested (decimal)
├── leaveRequestReason (text)
├── leaveRequestStatus (enum: pending, approved, rejected, cancelled)
├── leaveRequestApprovedBy (UUID, FK → User, nullable)
├── leaveRequestApprovedAt (timestamp, nullable)
├── leaveRequestRejectionReason (text, nullable)
├── leaveRequestCreatedAt (timestamp)
└── leaveRequestUpdatedAt (timestamp)
```

#### Features - Version 2

| Feature | Description |
|---------|-------------|
| Create Leave Request | Employee submits leave request |
| Edit Leave Request | Modify pending requests |
| Cancel Leave | Cancel approved/pending leave |
| Approve/Reject Leave | Manager approves or rejects requests |
| View Leave Requests | List all requests with filters |
| Leave Balance | View remaining leave balance by type |
| Leave Calendar | Visual calendar of team leave |

---

## Module 4: Expense Management (Standalone)

### Entities

```
ExpenseCategory
├── expenseCategoryId (UUID, PK)
├── expenseCategoryTenantId (UUID, FK)
├── expenseCategoryName (string)
├── expenseCategoryDescription (text)
├── expenseCategoryGlAccountId (UUID, FK → ChartOfAccount)
├── expenseCategoryIsActive (boolean)
├── expenseCategoryCreatedAt (timestamp)
└── expenseCategoryUpdatedAt (timestamp)

Budget
├── budgetId (UUID, PK)
├── budgetTenantId (UUID, FK)
├── budgetName (string)
├── budgetFiscalYear (integer)
├── budgetDepartmentId (UUID, FK → Department, nullable)
├── budgetCategoryId (UUID, FK → ExpenseCategory, nullable)
├── budgetAmount (decimal)
├── budgetSpentAmount (decimal, computed)
├── budgetRemainingAmount (decimal, computed)
├── budgetStatus (enum: draft, active, closed)
├── budgetStartDate (date)
├── budgetEndDate (date)
├── budgetNotes (text)
├── budgetCreatedBy (UUID, FK → User)
├── budgetCreatedAt (timestamp)
└── budgetUpdatedAt (timestamp)

Expense
├── expenseId (UUID, PK)
├── expenseTenantId (UUID, FK)
├── expenseNumber (string, auto-generated)
├── expenseCategoryId (UUID, FK → ExpenseCategory)
├── expenseBudgetId (UUID, FK → Budget, nullable)
├── expenseDepartmentId (UUID, FK → Department, nullable)
├── expenseVendorName (string)
├── expenseDescription (text)
├── expenseAmount (decimal)
├── expenseCurrency (string, default: NGN)
├── expenseExchangeRate (decimal, default: 1)
├── expenseAmountNgn (decimal, computed)
├── expenseDate (date)
├── expensePaymentMethod (enum: cash, bank_transfer, card, petty_cash)
├── expenseReferenceNumber (string, nullable)
├── expenseReceiptUrl (string, nullable)
├── expenseIsRecurring (boolean, default: false)
├── expenseRecurrencePattern (string, nullable) // monthly, weekly, etc.
├── expenseStatus (enum: draft, submitted, paid)
├── expensePaidBy (UUID, FK → User)
├── expenseCreatedAt (timestamp)
└── expenseUpdatedAt (timestamp)
```

### Features - Version 1

| Feature | Description |
|---------|-------------|
| Create Expense | Record new expense with receipt upload |
| Edit Expense | Modify expense details |
| Delete Expense | Remove draft expenses |
| View Expenses | List with filters (category, date, department) |
| Create Budget | Set budget by department/category/period |
| Edit Budget | Modify budget allocations |
| View Budgets | List all budgets with utilization |
| Budget vs Actual | Compare spending against budget |
| Budget Alerts | Warn when approaching/exceeding budget |
| Recurring Expenses | Set up auto-recurring expenses |
| Receipt Upload | Attach receipt images/PDFs |
| Expense Reports | Summary by category, department, period |
| Currency Support | Multi-currency with NGN conversion |

---

## Module 5: Asset Management (Standalone)

### Entities

```
AssetCategory
├── assetCategoryId (UUID, PK)
├── assetCategoryTenantId (UUID, FK)
├── assetCategoryName (string) // Vehicles, IT Equipment, Furniture, etc.
├── assetCategoryDescription (text)
├── assetCategoryDepreciationMethod (enum: straight_line, reducing_balance)
├── assetCategoryUsefulLifeYears (integer)
├── assetCategoryDepreciationRate (decimal)
├── assetCategoryGlAssetAccountId (UUID, FK → ChartOfAccount)
├── assetCategoryGlDepreciationAccountId (UUID, FK → ChartOfAccount)
├── assetCategoryGlAccumulatedDepreciationAccountId (UUID, FK → ChartOfAccount)
├── assetCategoryCreatedAt (timestamp)
└── assetCategoryUpdatedAt (timestamp)

FixedAsset
├── fixedAssetId (UUID, PK)
├── fixedAssetTenantId (UUID, FK)
├── fixedAssetCode (string, auto-generated)
├── fixedAssetName (string)
├── fixedAssetDescription (text)
├── fixedAssetCategoryId (UUID, FK → AssetCategory)
├── fixedAssetType (enum: vehicle, laptop, phone, furniture, equipment, other)
│
│   // Unique Identifiers (based on asset type)
├── fixedAssetSerialNumber (string, nullable)
├── fixedAssetMacAddress (string, nullable) // For laptops/computers
├── fixedAssetImeiNumber (string, nullable) // For phones
├── fixedAssetVinNumber (string, nullable) // For vehicles
├── fixedAssetLicensePlate (string, nullable) // For vehicles
├── fixedAssetTag (string, nullable) // Internal tracking tag
│
│   // Financial Information
├── fixedAssetPurchaseDate (date)
├── fixedAssetPurchasePrice (decimal)
├── fixedAssetVendorName (string)
├── fixedAssetInvoiceNumber (string, nullable)
├── fixedAssetCurrentValue (decimal, computed)
├── fixedAssetAccumulatedDepreciation (decimal, computed)
├── fixedAssetSalvageValue (decimal, default: 0)
│
│   // Status & Location
├── fixedAssetStatus (enum: available, assigned, under_maintenance, disposed, lost, stolen)
├── fixedAssetLocation (string)
├── fixedAssetCondition (enum: excellent, good, fair, poor)
│
│   // Warranty & Insurance
├── fixedAssetWarrantyStartDate (date, nullable)
├── fixedAssetWarrantyEndDate (date, nullable)
├── fixedAssetWarrantyProvider (string, nullable)
├── fixedAssetInsurancePolicyNumber (string, nullable)
├── fixedAssetInsuranceExpiryDate (date, nullable)
├── fixedAssetInsuranceProvider (string, nullable)
│
│   // Current Assignment
├── fixedAssetCurrentCustodianId (UUID, FK → Employee, nullable)
├── fixedAssetAssignedDate (date, nullable)
│
├── fixedAssetNotes (text)
├── fixedAssetCreatedAt (timestamp)
└── fixedAssetUpdatedAt (timestamp)

AssetAssignment
├── assetAssignmentId (UUID, PK)
├── assetAssignmentAssetId (UUID, FK → FixedAsset)
├── assetAssignmentEmployeeId (UUID, FK → Employee)
├── assetAssignmentDate (date)
├── assetAssignmentReturnedDate (date, nullable)
├── assetAssignmentAssignedBy (UUID, FK → User)
├── assetAssignmentReturnCondition (enum: excellent, good, fair, poor, damaged, nullable)
├── assetAssignmentNotes (text)
├── assetAssignmentAcknowledgmentSigned (boolean, default: false)
├── assetAssignmentCreatedAt (timestamp)
└── assetAssignmentUpdatedAt (timestamp)

AssetMaintenance
├── assetMaintenanceId (UUID, PK)
├── assetMaintenanceAssetId (UUID, FK → FixedAsset)
├── assetMaintenanceType (enum: preventive, corrective, upgrade)
├── assetMaintenanceDescription (text)
├── assetMaintenanceDate (date)
├── assetMaintenanceCost (decimal)
├── assetMaintenanceVendorName (string)
├── assetMaintenanceNextDate (date, nullable)
├── assetMaintenancePerformedBy (string)
├── assetMaintenanceCreatedAt (timestamp)
└── assetMaintenanceUpdatedAt (timestamp)

AssetDepreciation
├── assetDepreciationId (UUID, PK)
├── assetDepreciationAssetId (UUID, FK → FixedAsset)
├── assetDepreciationDate (date)
├── assetDepreciationPeriod (string) // e.g., "2026-01"
├── assetDepreciationOpeningValue (decimal)
├── assetDepreciationAmount (decimal)
├── assetDepreciationClosingValue (decimal)
├── assetDepreciationCreatedAt (timestamp)
└── assetDepreciationUpdatedAt (timestamp)

AssetDocument
├── assetDocumentId (UUID, PK)
├── assetDocumentAssetId (UUID, FK → FixedAsset)
├── assetDocumentType (enum: purchase_receipt, warranty_card, insurance, manual, other)
├── assetDocumentName (string)
├── assetDocumentUrl (string)
├── assetDocumentUploadedBy (UUID, FK → User)
├── assetDocumentCreatedAt (timestamp)
└── assetDocumentUpdatedAt (timestamp)

AssetDisposal
├── assetDisposalId (UUID, PK)
├── assetDisposalAssetId (UUID, FK → FixedAsset)
├── assetDisposalDate (date)
├── assetDisposalMethod (enum: sold, donated, scrapped, traded_in)
├── assetDisposalValue (decimal)
├── assetDisposalBuyerName (string, nullable)
├── assetDisposalReason (text)
├── assetDisposalBookValueAtDisposal (decimal)
├── assetDisposalGainLoss (decimal, computed)
├── assetDisposalApprovedBy (UUID, FK → User)
├── assetDisposalCreatedAt (timestamp)
└── assetDisposalUpdatedAt (timestamp)
```

### Features - Version 1 & 2

| Feature | Version | Description |
|---------|---------|-------------|
| Create Asset | 1 | Register new asset with all details |
| Edit Asset | 1 | Update asset information |
| View Asset List | 1 | List with filters (category, status, location) |
| View Asset Details | 1 | Full asset profile with history |
| Assign Asset | 1 | Assign asset to employee custodian |
| Return Asset | 1 | Process asset return from employee |
| Assignment History | 1 | View full assignment history per asset |
| Asset by Employee | 1 | View all assets assigned to an employee |
| Upload Documents | 1 | Attach purchase receipts, warranty, insurance docs |
| Asset Maintenance | 2 | Record maintenance activities and costs |
| Maintenance Schedule | 2 | Set and track preventive maintenance |
| Run Depreciation | 2 | Calculate monthly/yearly depreciation |
| Depreciation Report | 2 | Asset depreciation schedule report |
| Dispose Asset | 2 | Process asset disposal with gain/loss |
| Warranty Alerts | 1 | Dashboard alerts for expiring warranties |
| Insurance Alerts | 1 | Dashboard alerts for expiring insurance |
| Asset QR Codes | 2 | Generate QR codes for physical tagging |
| Asset Audit | 2 | Physical verification and reconciliation |

---

## Module 6: Inventory (Simple Stock Tracking)

This is a simplified inventory module focused on tracking stock quantities for products. No warehouse/location management.

### Entities

Note: Products and Services are defined in the Sales module (Product entity with productType field).

```
StockAdjustment
├── stockAdjustmentId (UUID, PK)
├── stockAdjustmentTenantId (UUID, FK)
├── stockAdjustmentNumber (string, auto-generated)
├── stockAdjustmentProductId (UUID, FK → Product)
├── stockAdjustmentType (enum: addition, subtraction, correction)
├── stockAdjustmentQuantity (decimal)
├── stockAdjustmentPreviousQuantity (decimal)
├── stockAdjustmentNewQuantity (decimal)
├── stockAdjustmentReason (text)
├── stockAdjustmentReference (string, nullable) // e.g., "Purchase from XYZ"
├── stockAdjustmentDate (date)
├── stockAdjustmentCreatedBy (UUID, FK → User)
├── stockAdjustmentCreatedAt (timestamp)
└── stockAdjustmentUpdatedAt (timestamp)
```

### Updated Product Entity (in Sales Module)

The Product entity should include these inventory-related fields:

```
Product (Updated)
├── ... (existing fields)
├── productType (enum: product, service) // NEW - Services don't track inventory
├── productQuantityOnHand (decimal, default 0) // Current stock
├── productTrackInventory (boolean, default true) // Only for products, not services
├── productReorderLevel (integer, nullable) // Alert when below this
├── productReorderQuantity (integer, nullable) // Suggested reorder amount
└── ... (existing fields)
```

### Features - Version 1

| Feature | Description |
|---------|-------------|
| **Products & Services** | |
| Create Product | Add physical product with stock tracking |
| Create Service | Add service item (no stock tracking) |
| Edit Product/Service | Update details and pricing |
| View Products | List with filters (type, category, stock status) |
| View Services | List all services |
| **Stock Management** | |
| View Stock Levels | See current quantity for all products |
| Adjust Stock | Add/remove stock with reason tracking |
| Stock History | View all adjustments for a product |
| **Alerts & Reports** | |
| Low Stock Alerts | Dashboard alerts for products below reorder level |
| Out of Stock Alert | Highlight products with zero quantity |
| Stock Valuation Report | Total inventory value (quantity × cost price) |
| Stock Movement Report | History of all adjustments |

### Stock Auto-Deduction (Invoicing Integration)

When an invoice is created/paid:
- Product quantities are automatically reduced
- Stock adjustment record created with reference to invoice

When a credit note is issued:
- Product quantities are automatically restored
- Stock adjustment record created with reference to credit note

---

## Module 7: Time & Attendance (Standalone)

### Entities

```
AttendanceRecord
├── attendanceRecordId (UUID, PK)
├── attendanceRecordTenantId (UUID, FK)
├── attendanceRecordEmployeeId (UUID, FK → Employee)
├── attendanceRecordDate (date)
├── attendanceRecordClockInTime (timestamp, nullable)
├── attendanceRecordClockOutTime (timestamp, nullable)
├── attendanceRecordClockInLocation (string, nullable)
├── attendanceRecordClockOutLocation (string, nullable)
├── attendanceRecordScheduledStart (time)
├── attendanceRecordScheduledEnd (time)
├── attendanceRecordHoursWorked (decimal, computed)
├── attendanceRecordOvertimeHours (decimal, computed)
├── attendanceRecordStatus (enum: present, absent, late, half_day, holiday, weekend)
├── attendanceRecordLateMinutes (integer, computed)
├── attendanceRecordEarlyDepartureMinutes (integer, computed)
├── attendanceRecordSource (enum: manual, biometric, mobile, web)
├── attendanceRecordNotes (text)
├── attendanceRecordCreatedAt (timestamp)
└── attendanceRecordUpdatedAt (timestamp)

AttendanceImport
├── attendanceImportId (UUID, PK)
├── attendanceImportTenantId (UUID, FK)
├── attendanceImportDate (timestamp)
├── attendanceImportFileName (string)
├── attendanceImportRecordsImported (integer)
├── attendanceImportRecordsFailed (integer)
├── attendanceImportStatus (enum: pending, processing, completed, failed)
├── attendanceImportErrorLog (text, nullable)
├── attendanceImportImportedBy (UUID, FK → User)
├── attendanceImportCreatedAt (timestamp)
└── attendanceImportUpdatedAt (timestamp)

WorkSchedule
├── workScheduleId (UUID, PK)
├── workScheduleTenantId (UUID, FK)
├── workScheduleName (string) // e.g., "Standard 9-5", "Shift A"
├── workScheduleMondayStart (time, nullable)
├── workScheduleMondayEnd (time, nullable)
├── workScheduleTuesdayStart (time, nullable)
├── workScheduleTuesdayEnd (time, nullable)
├── workScheduleWednesdayStart (time, nullable)
├── workScheduleWednesdayEnd (time, nullable)
├── workScheduleThursdayStart (time, nullable)
├── workScheduleThursdayEnd (time, nullable)
├── workScheduleFridayStart (time, nullable)
├── workScheduleFridayEnd (time, nullable)
├── workScheduleSaturdayStart (time, nullable)
├── workScheduleSaturdayEnd (time, nullable)
├── workScheduleSundayStart (time, nullable)
├── workScheduleSundayEnd (time, nullable)
├── workScheduleIsDefault (boolean)
├── workScheduleCreatedAt (timestamp)
└── workScheduleUpdatedAt (timestamp)

Holiday
├── holidayId (UUID, PK)
├── holidayTenantId (UUID, FK)
├── holidayName (string)
├── holidayDate (date)
├── holidayIsRecurring (boolean) // Repeats yearly
├── holidayCreatedAt (timestamp)
└── holidayUpdatedAt (timestamp)
```

### Features - Version 1

| Feature | Description |
|---------|-------------|
| Import Attendance | Import from biometric/external system (CSV) |
| Manual Clock In/Out | Manual entry for corrections |
| View Attendance | Daily/weekly/monthly attendance view |
| Employee Attendance | Individual employee attendance history |
| Late Arrival Report | List of late arrivals with minutes |
| Early Departure Report | List of early departures |
| Attendance Summary | Monthly summary per employee |
| Work Schedule Setup | Configure standard work hours |
| Holiday Calendar | Set up public holidays |
| Overtime Calculation | Auto-calculate overtime hours |
| Attendance Dashboard | Visual attendance analytics |
| Export Attendance | Export for payroll processing |

---

## Platform Admin Panel (SaaS Management)

A separate admin interface for managing the entire Qucoon ERP platform.

### Platform Dashboard
| Component | Description |
|-----------|-------------|
| **Total Tenants** | Active, trial, suspended, churned counts |
| **MRR/ARR** | Monthly/Annual recurring revenue |
| **New Signups** | Daily/weekly/monthly signups graph |
| **Churn Rate** | Tenant churn metrics |
| **Revenue Chart** | Revenue trend over time |
| **Top Tenants** | By revenue, users, activity |
| **Recent Activity** | Latest signups, upgrades, cancellations |
| **Support Tickets** | Open tickets requiring attention |

### Tenant Management
| Feature | Description |
|---------|-------------|
| **View All Tenants** | List with search, filter by status/plan |
| **Tenant Details** | Full profile, users, subscription, usage |
| **Create Tenant** | Manually create tenant (for enterprise sales) |
| **Edit Tenant** | Update tenant information |
| **Suspend Tenant** | Temporarily disable access |
| **Activate Tenant** | Re-enable suspended tenant |
| **Delete Tenant** | Permanent deletion (with confirmation) |
| **Impersonate** | Login as tenant for support (with audit log) |
| **Usage Stats** | Per-tenant usage metrics |

### Subscription Management
| Feature | Description |
|---------|-------------|
| **View Plans** | List all subscription plans |
| **Create Plan** | Add new subscription plan |
| **Edit Plan** | Modify plan features/pricing |
| **Deactivate Plan** | Hide plan from new signups |
| **Plan Analytics** | Subscribers per plan, revenue breakdown |

### Billing & Invoices
| Feature | Description |
|---------|-------------|
| **View Invoices** | All platform invoices |
| **Invoice Details** | Individual invoice view |
| **Record Payment** | Mark invoice as paid |
| **Send Reminder** | Send payment reminder to tenant |

### Revenue & Analytics Dashboard
| Component | Description |
|-----------|-------------|
| **MRR (Monthly Recurring Revenue)** | Current MRR with trend graph |
| **ARR (Annual Recurring Revenue)** | Projected annual revenue |
| **Revenue by Plan** | Breakdown by Starter/Pro/Enterprise |
| **Revenue Growth** | Month-over-month, year-over-year |
| **Churn Rate** | Monthly churn percentage |
| **Customer Lifetime Value (CLV)** | Average revenue per tenant |
| **Average Revenue Per User (ARPU)** | Revenue divided by total users |
| **New MRR** | Revenue from new signups this month |
| **Expansion MRR** | Revenue from plan upgrades |
| **Churned MRR** | Lost revenue from cancellations |
| **Net MRR Growth** | New + Expansion - Churned |
| **Trial Conversion Rate** | % of trials converting to paid |
| **Payment Success Rate** | Successful vs failed payments |

### Revenue Reports
| Report | Description |
|--------|-------------|
| **Monthly Revenue Report** | Detailed monthly breakdown |
| **Revenue by Plan** | Which plans generate most revenue |
| **Revenue by Industry** | Which industries pay most |
| **Cohort Analysis** | Revenue by signup month cohort |
| **Payment History** | All successful/failed payments |
| **Outstanding Invoices** | Unpaid invoices aging report |
| **Projected Revenue** | Forecast based on current MRR |
| **Export Reports** | Download as CSV, Excel, PDF |

### Platform Settings
| Feature | Description |
|---------|-------------|
| **General Settings** | Platform name, logo, contact info |
| **Email Templates** | Customize transactional emails |
| **Default Settings** | Default values for new tenants |
| **Feature Flags** | Enable/disable platform features |
| **Maintenance Mode** | Enable maintenance page |

### Platform Admin URL Structure
```
/platform/login          - Platform admin login (separate from tenant)
/platform/dashboard      - Platform overview
/platform/tenants        - Tenant management
/platform/tenants/:id    - Tenant details
/platform/plans          - Subscription plans
/platform/invoices       - Platform billing
/platform/admins         - Manage platform admins
/platform/settings       - Platform settings
/platform/analytics      - Detailed analytics
```

---

## Tenant Application Dashboard & Analytics

### Main Dashboard Components (Per Tenant)

| Component | Description |
|-----------|-------------|
| **Revenue Overview** | Monthly revenue trend, YoY comparison |
| **Expense Overview** | Monthly expenses by category |
| **Cash Position** | Current bank balances, cash flow |
| **Receivables** | Outstanding AR, aging summary |
| **Payables** | Outstanding AP, aging summary |
| **Top Customers** | Top 10 by revenue |
| **Recent Invoices** | Latest 10 invoices with status |
| **Low Stock Alerts** | Products below reorder level |
| **Upcoming Payments** | Bills due this week |
| **Employee Count** | Active employees by department |
| **Attendance Today** | Today's attendance summary |
| **Asset Alerts** | Expiring warranties/insurance |
| **Budget Utilization** | Budget vs actual by department |

### Module-Specific Dashboards

Each module should have its own dashboard with relevant KPIs and charts.

---

## Nigerian Tax Compliance

### VAT (Value Added Tax)
- Standard rate: 7.5%
- Auto-calculate on taxable sales
- VAT input/output tracking
- VAT return report generation

### WHT (Withholding Tax)
- Track WHT deductions by customers
- WHT certificate recording
- WHT credit tracking
- WHT report generation

### PAYE (Pay As You Earn)
Nigerian tax bands for 2026:
| Annual Income (NGN) | Rate |
|---------------------|------|
| First 300,000 | 7% |
| Next 300,000 | 11% |
| Next 500,000 | 15% |
| Next 500,000 | 19% |
| Next 1,600,000 | 21% |
| Above 3,200,000 | 24% |

### Pension
- Employee contribution: 8% of gross
- Employer contribution: 10% of gross
- Track PFA details per employee

### NHF (National Housing Fund)
- 2.5% of basic salary
- Optional tracking

---

## API Structure

### Base URL Pattern
```
/api/v1/{module}/{resource}
```

### Standard Endpoints per Resource
```
GET    /api/v1/sales/customers          - List all (paginated)
POST   /api/v1/sales/customers          - Create new
GET    /api/v1/sales/customers/:id      - Get single
PUT    /api/v1/sales/customers/:id      - Update
DELETE /api/v1/sales/customers/:id      - Soft delete
POST   /api/v1/sales/customers/bulk     - Bulk create
GET    /api/v1/sales/customers/export   - Export data
```

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": []
  }
}
```

---

## Mock Data Requirements

Generate realistic Nigerian mock data including:

### Companies
- 3-5 sample tenant companies
- Nigerian company names and addresses
- Lagos, Abuja, Port Harcourt locations

### Customers
- 50+ Nigerian company names
- Real Nigerian states and cities
- Nigerian phone format (+234)
- Nigerian TIN format

### Products
- Mix of goods and services
- Prices in NGN
- Nigerian product categories

### Employees
- Nigerian names (Yoruba, Igbo, Hausa mix)
- Nigerian banks (GTBank, Access, Zenith, UBA, First Bank)
- NUBAN account numbers (10 digits)
- Nigerian states and LGAs

### Transactions
- Invoices dated in 2026
- Realistic payment patterns
- Nigerian holidays in attendance

---

## Version Roadmap Summary

### Version 1 (Core)
- Multi-tenancy foundation
- User authentication & RBAC
- Accounting (GL, Reports)
- Sales (Customers, Products, Invoicing)
- HR (Employee, Grades, Basic Payroll)
- Expense Management (Full)
- Asset Management (Core)
- Inventory Management (Full)
- Time & Attendance (Full)
- Dashboard & Analytics

### Version 2 (Enhanced)
- Sales Leads/CRM
- Leave Management
- Full Payroll Processing
- Asset Depreciation & Disposal
- Advanced Reporting
- Scheduled Reports
- Approval Workflows

### Version 3 (Advanced)
- Purchase Orders
- Vendor Management
- Project Management
- Document Management
- API Integrations
- Mobile App

---

## Prompt for Replit

```
Build a multi-tenant Enterprise ERP system for Nigerian businesses with the following specifications:

TECH STACK:
- Next.js 14+ with App Router
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui components
- PostgreSQL with Prisma ORM
- NextAuth.js for authentication
- React Query for data fetching
- Zustand for state management

ARCHITECTURE:
- Multi-tenant with shared database (tenant_id isolation)
- Row-level security on all tenant data
- RESTful API with /api/v1/ prefix
- Server components where possible
- Mobile-responsive design

MODULES TO BUILD:
1. Accounting (GL, Financial Reports, Business Reports)
2. Sales (Customers, Products, Invoicing with VAT/WHT)
3. HR (Employees, Grades, Payroll structure)
4. Expense Management (Expenses, Budgets)
5. Asset Management (Fixed Assets, Assignment tracking)
6. Inventory (Warehouses, Stock movements)
7. Time & Attendance (Clock in/out, Reports)

KEY FEATURES:
- Nigerian tax compliance (VAT 7.5%, WHT, PAYE)
- Currency: NGN (Nigerian Naira)
- Role-based access: Super Admin, Admin, Viewer
- Professional dashboards with analytics
- Export to PDF, Excel, CSV
- Audit logging on all operations

SECURITY:
- JWT authentication with refresh tokens
- Input validation on all endpoints
- CSRF, XSS, SQL injection protection
- Rate limiting
- Secure password hashing

UI/UX:
- Clean, modern interface
- Mobile-first responsive design
- Dark/Light mode
- Loading states and skeletons
- Toast notifications
- Data tables with search, filter, sort, pagination

Generate realistic Nigerian mock data for testing including company names, customer names, employee names (mix of Yoruba, Igbo, Hausa), Nigerian banks, and addresses.

Refer to the full requirements document for detailed entity schemas and feature specifications.
```

---

## Notes for Development

1. **Start Simple**: Begin with authentication and tenant setup, then build modules incrementally
2. **Test Data**: Generate comprehensive mock data for all modules
3. **Mobile First**: Design for mobile screens first, then enhance for desktop
4. **Performance**: Implement pagination, lazy loading, and caching from the start
5. **Security**: Never trust client input, validate everything server-side
6. **Audit Trail**: Log all create, update, delete operations with user and timestamp
7. **Soft Deletes**: Use soft deletes (is_deleted flag) for all business entities
8. **Consistent UI**: Use shadcn/ui components for consistency
9. **Error Handling**: Implement proper error boundaries and user-friendly error messages
10. **Documentation**: Generate API documentation with Swagger/OpenAPI
