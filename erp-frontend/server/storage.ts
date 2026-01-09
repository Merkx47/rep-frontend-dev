import { db } from "./db";
import {
  users, tenants, chartOfAccounts, journals, journalLines,
  customers, products, productCategories, invoices, invoiceLines, payments, salesLeads,
  employees, departments, grades, salaryComponents, leaveTypes, leaveRequests,
  payrollRuns, payrollRecords, payrollLines,
  expenses, expenseCategories, budgets,
  fixedAssets, assetCategories, assetMaintenances,
  stockAdjustments, workSchedules, holidays, attendanceRecords,
  subscriptionPlans, tenantSubscriptions,
  type User, type Tenant, type ChartOfAccount, type Journal, type JournalLine,
  type Customer, type Product, type ProductCategory, type Invoice, type InvoiceLine, type Payment, type SalesLead,
  type Employee, type Department, type Grade, type SalaryComponent, type LeaveType, type LeaveRequest,
  type PayrollRun, type PayrollRecord, type PayrollLine,
  type Expense, type ExpenseCategory, type Budget,
  type FixedAsset, type AssetCategory, type AssetMaintenance,
  type StockAdjustment, type WorkSchedule, type Holiday, type AttendanceRecord,
  type SubscriptionPlan, type TenantSubscription,
  type InsertUser, type InsertTenant, type InsertChartOfAccount, type InsertJournal, type InsertJournalLine,
  type InsertCustomer, type InsertProduct, type InsertProductCategory, type InsertInvoice, type InsertInvoiceLine, type InsertPayment, type InsertSalesLead,
  type InsertEmployee, type InsertDepartment, type InsertGrade, type InsertSalaryComponent, type InsertLeaveType, type InsertLeaveRequest,
  type InsertPayrollRun, type InsertPayrollRecord, type InsertPayrollLine,
  type InsertExpense, type InsertExpenseCategory, type InsertBudget,
  type InsertFixedAsset, type InsertAssetCategory, type InsertAssetMaintenance,
  type InsertStockAdjustment, type InsertWorkSchedule, type InsertHoliday, type InsertAttendanceRecord,
  type InsertSubscriptionPlan, type InsertTenantSubscription
} from "@shared/schema";
import { eq, and, lt, sql } from "drizzle-orm";

export interface IStorage {
  // Users & Tenants
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  getTenant(id: string): Promise<Tenant | undefined>;
  getTenantBySlug(slug: string): Promise<Tenant | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: string, data: Partial<InsertTenant>): Promise<Tenant | undefined>;
  
  // Subscription Plans
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  createTenantSubscription(sub: InsertTenantSubscription): Promise<TenantSubscription>;
  
  // Accounting
  getChartOfAccounts(tenantId: string): Promise<ChartOfAccount[]>;
  getChartOfAccount(id: string): Promise<ChartOfAccount | undefined>;
  createChartOfAccount(account: InsertChartOfAccount): Promise<ChartOfAccount>;
  updateChartOfAccount(id: string, data: Partial<InsertChartOfAccount>): Promise<ChartOfAccount | undefined>;
  deleteChartOfAccount(id: string): Promise<void>;
  
  getJournals(tenantId: string): Promise<Journal[]>;
  getJournal(id: string): Promise<Journal | undefined>;
  createJournal(journal: InsertJournal): Promise<Journal>;
  updateJournal(id: string, data: Partial<InsertJournal>): Promise<Journal | undefined>;
  getJournalLines(journalId: string): Promise<JournalLine[]>;
  createJournalLine(line: InsertJournalLine): Promise<JournalLine>;
  
  // Sales
  getCustomers(tenantId: string): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, data: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<void>;
  
  getProductCategories(tenantId: string): Promise<ProductCategory[]>;
  createProductCategory(category: InsertProductCategory): Promise<ProductCategory>;
  
  getProducts(tenantId: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<void>;
  getLowStockProducts(tenantId: string): Promise<Product[]>;
  
  getInvoices(tenantId: string): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, data: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: string): Promise<void>;
  getInvoiceLines(invoiceId: string): Promise<InvoiceLine[]>;
  createInvoiceLine(line: InsertInvoiceLine): Promise<InvoiceLine>;
  
  getPayments(tenantId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;

  // Sales Leads
  getSalesLeads(tenantId: string): Promise<SalesLead[]>;
  getSalesLead(id: string): Promise<SalesLead | undefined>;
  createSalesLead(lead: InsertSalesLead): Promise<SalesLead>;
  updateSalesLead(id: string, data: Partial<InsertSalesLead>): Promise<SalesLead | undefined>;
  deleteSalesLead(id: string): Promise<void>;

  // HR
  getDepartments(tenantId: string): Promise<Department[]>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: string, data: Partial<InsertDepartment>): Promise<Department | undefined>;
  deleteDepartment(id: string): Promise<void>;
  
  getGrades(tenantId: string): Promise<Grade[]>;
  getGrade(id: string): Promise<Grade | undefined>;
  createGrade(grade: InsertGrade): Promise<Grade>;
  updateGrade(id: string, data: Partial<InsertGrade>): Promise<Grade | undefined>;
  deleteGrade(id: string): Promise<void>;

  // Salary Components
  getSalaryComponents(gradeId: string): Promise<SalaryComponent[]>;
  getSalaryComponentsByTenant(tenantId: string): Promise<SalaryComponent[]>;
  createSalaryComponent(component: InsertSalaryComponent): Promise<SalaryComponent>;
  updateSalaryComponent(id: string, data: Partial<InsertSalaryComponent>): Promise<SalaryComponent | undefined>;
  deleteSalaryComponent(id: string): Promise<void>;

  getEmployees(tenantId: string): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, data: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<void>;
  
  getLeaveTypes(tenantId: string): Promise<LeaveType[]>;
  createLeaveType(leaveType: InsertLeaveType): Promise<LeaveType>;
  
  getLeaveRequests(tenantId: string): Promise<LeaveRequest[]>;
  createLeaveRequest(leaveRequest: InsertLeaveRequest): Promise<LeaveRequest>;
  updateLeaveRequest(id: string, data: Partial<InsertLeaveRequest>): Promise<LeaveRequest | undefined>;

  // Payroll
  getPayrollRuns(tenantId: string): Promise<PayrollRun[]>;
  getPayrollRun(id: string): Promise<PayrollRun | undefined>;
  createPayrollRun(run: InsertPayrollRun): Promise<PayrollRun>;
  updatePayrollRun(id: string, data: Partial<InsertPayrollRun>): Promise<PayrollRun | undefined>;

  getPayrollRecords(payrollRunId: string): Promise<PayrollRecord[]>;
  getPayrollRecordsByEmployee(employeeId: string): Promise<PayrollRecord[]>;
  createPayrollRecord(record: InsertPayrollRecord): Promise<PayrollRecord>;
  updatePayrollRecord(id: string, data: Partial<InsertPayrollRecord>): Promise<PayrollRecord | undefined>;

  getPayrollLines(payrollRecordId: string): Promise<PayrollLine[]>;
  createPayrollLine(line: InsertPayrollLine): Promise<PayrollLine>;

  // Expenses
  getExpenseCategories(tenantId: string): Promise<ExpenseCategory[]>;
  createExpenseCategory(category: InsertExpenseCategory): Promise<ExpenseCategory>;
  
  getExpenses(tenantId: string): Promise<Expense[]>;
  getExpense(id: string): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: string, data: Partial<InsertExpense>): Promise<Expense | undefined>;
  
  getBudgets(tenantId: string): Promise<Budget[]>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  
  // Assets
  getAssetCategories(tenantId: string): Promise<AssetCategory[]>;
  createAssetCategory(category: InsertAssetCategory): Promise<AssetCategory>;
  
  getFixedAssets(tenantId: string): Promise<FixedAsset[]>;
  getFixedAsset(id: string): Promise<FixedAsset | undefined>;
  createFixedAsset(asset: InsertFixedAsset): Promise<FixedAsset>;
  updateFixedAsset(id: string, data: Partial<InsertFixedAsset>): Promise<FixedAsset | undefined>;
  
  getAssetMaintenances(assetId: string): Promise<AssetMaintenance[]>;
  createAssetMaintenance(maintenance: InsertAssetMaintenance): Promise<AssetMaintenance>;
  
  // Inventory
  getStockAdjustments(tenantId: string): Promise<StockAdjustment[]>;
  createStockAdjustment(adjustment: InsertStockAdjustment): Promise<StockAdjustment>;
  
  // Attendance
  getWorkSchedules(tenantId: string): Promise<WorkSchedule[]>;
  createWorkSchedule(schedule: InsertWorkSchedule): Promise<WorkSchedule>;
  
  getHolidays(tenantId: string): Promise<Holiday[]>;
  createHoliday(holiday: InsertHoliday): Promise<Holiday>;
  
  getAttendanceRecords(tenantId: string): Promise<AttendanceRecord[]>;
  createAttendanceRecord(record: InsertAttendanceRecord): Promise<AttendanceRecord>;
  updateAttendanceRecord(id: string, data: Partial<InsertAttendanceRecord>): Promise<AttendanceRecord | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Users & Tenants
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return user;
  }

  async getTenant(id: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant;
  }

  async getTenantBySlug(slug: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, slug));
    return tenant;
  }

  async createTenant(insertTenant: InsertTenant): Promise<Tenant> {
    const [tenant] = await db.insert(tenants).values(insertTenant).returning();
    return tenant;
  }

  async updateTenant(id: string, data: Partial<InsertTenant>): Promise<Tenant | undefined> {
    const [tenant] = await db.update(tenants).set({ ...data, updatedAt: new Date() }).where(eq(tenants.id, id)).returning();
    return tenant;
  }

  // Subscription Plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
  }

  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const [result] = await db.insert(subscriptionPlans).values(plan).returning();
    return result;
  }

  async createTenantSubscription(sub: InsertTenantSubscription): Promise<TenantSubscription> {
    const [result] = await db.insert(tenantSubscriptions).values(sub).returning();
    return result;
  }

  // Accounting
  async getChartOfAccounts(tenantId: string): Promise<ChartOfAccount[]> {
    return await db.select().from(chartOfAccounts).where(eq(chartOfAccounts.tenantId, tenantId));
  }

  async getChartOfAccount(id: string): Promise<ChartOfAccount | undefined> {
    const [account] = await db.select().from(chartOfAccounts).where(eq(chartOfAccounts.id, id));
    return account;
  }

  async createChartOfAccount(insertAccount: InsertChartOfAccount): Promise<ChartOfAccount> {
    const [account] = await db.insert(chartOfAccounts).values(insertAccount).returning();
    return account;
  }

  async updateChartOfAccount(id: string, data: Partial<InsertChartOfAccount>): Promise<ChartOfAccount | undefined> {
    const [account] = await db.update(chartOfAccounts).set({ ...data, updatedAt: new Date() }).where(eq(chartOfAccounts.id, id)).returning();
    return account;
  }

  async deleteChartOfAccount(id: string): Promise<void> {
    await db.delete(chartOfAccounts).where(eq(chartOfAccounts.id, id));
  }

  async getJournals(tenantId: string): Promise<Journal[]> {
    return await db.select().from(journals).where(eq(journals.tenantId, tenantId));
  }

  async getJournal(id: string): Promise<Journal | undefined> {
    const [journal] = await db.select().from(journals).where(eq(journals.id, id));
    return journal;
  }

  async createJournal(insertJournal: InsertJournal): Promise<Journal> {
    const [journal] = await db.insert(journals).values(insertJournal).returning();
    return journal;
  }

  async updateJournal(id: string, data: Partial<InsertJournal>): Promise<Journal | undefined> {
    const [journal] = await db.update(journals).set({ ...data, updatedAt: new Date() }).where(eq(journals.id, id)).returning();
    return journal;
  }

  async getJournalLines(journalId: string): Promise<JournalLine[]> {
    return await db.select().from(journalLines).where(eq(journalLines.journalId, journalId));
  }

  async createJournalLine(line: InsertJournalLine): Promise<JournalLine> {
    const [result] = await db.insert(journalLines).values(line).returning();
    return result;
  }

  // Sales
  async getCustomers(tenantId: string): Promise<Customer[]> {
    return await db.select().from(customers).where(eq(customers.tenantId, tenantId));
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const [customer] = await db.insert(customers).values(insertCustomer).returning();
    return customer;
  }

  async updateCustomer(id: string, data: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const [customer] = await db.update(customers).set({ ...data, updatedAt: new Date() }).where(eq(customers.id, id)).returning();
    return customer;
  }

  async deleteCustomer(id: string): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
  }

  async getProductCategories(tenantId: string): Promise<ProductCategory[]> {
    return await db.select().from(productCategories).where(eq(productCategories.tenantId, tenantId));
  }

  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    const [result] = await db.insert(productCategories).values(category).returning();
    return result;
  }

  async getProducts(tenantId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.tenantId, tenantId));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db.update(products).set({ ...data, updatedAt: new Date() }).where(eq(products.id, id)).returning();
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getLowStockProducts(tenantId: string): Promise<Product[]> {
    return await db.select().from(products)
      .where(and(
        eq(products.tenantId, tenantId),
        eq(products.trackInventory, true),
        sql`CAST(${products.quantityOnHand} AS NUMERIC) <= ${products.reorderLevel}`
      ));
  }

  async getInvoices(tenantId: string): Promise<Invoice[]> {
    return await db.select().from(invoices).where(eq(invoices.tenantId, tenantId));
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(insertInvoice).returning();
    return invoice;
  }

  async updateInvoice(id: string, data: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const [invoice] = await db.update(invoices).set({ ...data, updatedAt: new Date() }).where(eq(invoices.id, id)).returning();
    return invoice;
  }

  async deleteInvoice(id: string): Promise<void> {
    await db.delete(invoices).where(eq(invoices.id, id));
  }

  async getInvoiceLines(invoiceId: string): Promise<InvoiceLine[]> {
    return await db.select().from(invoiceLines).where(eq(invoiceLines.invoiceId, invoiceId));
  }

  async createInvoiceLine(line: InsertInvoiceLine): Promise<InvoiceLine> {
    const [result] = await db.insert(invoiceLines).values(line).returning();
    return result;
  }

  async getPayments(tenantId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.tenantId, tenantId));
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [result] = await db.insert(payments).values(payment).returning();
    return result;
  }

  // Sales Leads
  async getSalesLeads(tenantId: string): Promise<SalesLead[]> {
    return await db.select().from(salesLeads).where(eq(salesLeads.tenantId, tenantId));
  }

  async getSalesLead(id: string): Promise<SalesLead | undefined> {
    const [lead] = await db.select().from(salesLeads).where(eq(salesLeads.id, id));
    return lead;
  }

  async createSalesLead(lead: InsertSalesLead): Promise<SalesLead> {
    const [result] = await db.insert(salesLeads).values(lead).returning();
    return result;
  }

  async updateSalesLead(id: string, data: Partial<InsertSalesLead>): Promise<SalesLead | undefined> {
    const [result] = await db.update(salesLeads).set({ ...data, updatedAt: new Date() }).where(eq(salesLeads.id, id)).returning();
    return result;
  }

  async deleteSalesLead(id: string): Promise<void> {
    await db.delete(salesLeads).where(eq(salesLeads.id, id));
  }

  // HR
  async getDepartments(tenantId: string): Promise<Department[]> {
    return await db.select().from(departments).where(eq(departments.tenantId, tenantId));
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const [result] = await db.insert(departments).values(department).returning();
    return result;
  }

  async updateDepartment(id: string, data: Partial<InsertDepartment>): Promise<Department | undefined> {
    const [result] = await db.update(departments).set({ ...data, updatedAt: new Date() }).where(eq(departments.id, id)).returning();
    return result;
  }

  async deleteDepartment(id: string): Promise<void> {
    await db.delete(departments).where(eq(departments.id, id));
  }

  async getGrades(tenantId: string): Promise<Grade[]> {
    return await db.select().from(grades).where(eq(grades.tenantId, tenantId));
  }

  async getGrade(id: string): Promise<Grade | undefined> {
    const [grade] = await db.select().from(grades).where(eq(grades.id, id));
    return grade;
  }

  async createGrade(grade: InsertGrade): Promise<Grade> {
    const [result] = await db.insert(grades).values(grade).returning();
    return result;
  }

  async updateGrade(id: string, data: Partial<InsertGrade>): Promise<Grade | undefined> {
    const [result] = await db.update(grades).set({ ...data, updatedAt: new Date() }).where(eq(grades.id, id)).returning();
    return result;
  }

  async deleteGrade(id: string): Promise<void> {
    await db.delete(grades).where(eq(grades.id, id));
  }

  // Salary Components
  async getSalaryComponents(gradeId: string): Promise<SalaryComponent[]> {
    return await db.select().from(salaryComponents).where(eq(salaryComponents.gradeId, gradeId));
  }

  async getSalaryComponentsByTenant(tenantId: string): Promise<SalaryComponent[]> {
    return await db.select().from(salaryComponents).where(eq(salaryComponents.tenantId, tenantId));
  }

  async createSalaryComponent(component: InsertSalaryComponent): Promise<SalaryComponent> {
    const [result] = await db.insert(salaryComponents).values(component).returning();
    return result;
  }

  async updateSalaryComponent(id: string, data: Partial<InsertSalaryComponent>): Promise<SalaryComponent | undefined> {
    const [result] = await db.update(salaryComponents).set({ ...data, updatedAt: new Date() }).where(eq(salaryComponents.id, id)).returning();
    return result;
  }

  async deleteSalaryComponent(id: string): Promise<void> {
    await db.delete(salaryComponents).where(eq(salaryComponents.id, id));
  }

  async getEmployees(tenantId: string): Promise<Employee[]> {
    return await db.select().from(employees).where(eq(employees.tenantId, tenantId));
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee;
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const [employee] = await db.insert(employees).values(insertEmployee).returning();
    return employee;
  }

  async updateEmployee(id: string, data: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const [employee] = await db.update(employees).set({ ...data, updatedAt: new Date() }).where(eq(employees.id, id)).returning();
    return employee;
  }

  async deleteEmployee(id: string): Promise<void> {
    await db.delete(employees).where(eq(employees.id, id));
  }

  async getLeaveTypes(tenantId: string): Promise<LeaveType[]> {
    return await db.select().from(leaveTypes).where(eq(leaveTypes.tenantId, tenantId));
  }

  async createLeaveType(leaveType: InsertLeaveType): Promise<LeaveType> {
    const [result] = await db.insert(leaveTypes).values(leaveType).returning();
    return result;
  }

  async getLeaveRequests(tenantId: string): Promise<LeaveRequest[]> {
    return await db.select().from(leaveRequests).where(eq(leaveRequests.tenantId, tenantId));
  }

  async createLeaveRequest(leaveRequest: InsertLeaveRequest): Promise<LeaveRequest> {
    const [result] = await db.insert(leaveRequests).values(leaveRequest).returning();
    return result;
  }

  async updateLeaveRequest(id: string, data: Partial<InsertLeaveRequest>): Promise<LeaveRequest | undefined> {
    const [result] = await db.update(leaveRequests).set({ ...data, updatedAt: new Date() }).where(eq(leaveRequests.id, id)).returning();
    return result;
  }

  // Payroll
  async getPayrollRuns(tenantId: string): Promise<PayrollRun[]> {
    return await db.select().from(payrollRuns).where(eq(payrollRuns.tenantId, tenantId));
  }

  async getPayrollRun(id: string): Promise<PayrollRun | undefined> {
    const [run] = await db.select().from(payrollRuns).where(eq(payrollRuns.id, id));
    return run;
  }

  async createPayrollRun(run: InsertPayrollRun): Promise<PayrollRun> {
    const [result] = await db.insert(payrollRuns).values(run).returning();
    return result;
  }

  async updatePayrollRun(id: string, data: Partial<InsertPayrollRun>): Promise<PayrollRun | undefined> {
    const [result] = await db.update(payrollRuns).set({ ...data, updatedAt: new Date() }).where(eq(payrollRuns.id, id)).returning();
    return result;
  }

  async getPayrollRecords(payrollRunId: string): Promise<PayrollRecord[]> {
    return await db.select().from(payrollRecords).where(eq(payrollRecords.payrollRunId, payrollRunId));
  }

  async getPayrollRecordsByEmployee(employeeId: string): Promise<PayrollRecord[]> {
    return await db.select().from(payrollRecords).where(eq(payrollRecords.employeeId, employeeId));
  }

  async createPayrollRecord(record: InsertPayrollRecord): Promise<PayrollRecord> {
    const [result] = await db.insert(payrollRecords).values(record).returning();
    return result;
  }

  async updatePayrollRecord(id: string, data: Partial<InsertPayrollRecord>): Promise<PayrollRecord | undefined> {
    const [result] = await db.update(payrollRecords).set({ ...data, updatedAt: new Date() }).where(eq(payrollRecords.id, id)).returning();
    return result;
  }

  async getPayrollLines(payrollRecordId: string): Promise<PayrollLine[]> {
    return await db.select().from(payrollLines).where(eq(payrollLines.payrollRecordId, payrollRecordId));
  }

  async createPayrollLine(line: InsertPayrollLine): Promise<PayrollLine> {
    const [result] = await db.insert(payrollLines).values(line).returning();
    return result;
  }

  // Expenses
  async getExpenseCategories(tenantId: string): Promise<ExpenseCategory[]> {
    return await db.select().from(expenseCategories).where(eq(expenseCategories.tenantId, tenantId));
  }

  async createExpenseCategory(category: InsertExpenseCategory): Promise<ExpenseCategory> {
    const [result] = await db.insert(expenseCategories).values(category).returning();
    return result;
  }

  async getExpenses(tenantId: string): Promise<Expense[]> {
    return await db.select().from(expenses).where(eq(expenses.tenantId, tenantId));
  }

  async getExpense(id: string): Promise<Expense | undefined> {
    const [expense] = await db.select().from(expenses).where(eq(expenses.id, id));
    return expense;
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const [result] = await db.insert(expenses).values(expense).returning();
    return result;
  }

  async updateExpense(id: string, data: Partial<InsertExpense>): Promise<Expense | undefined> {
    const [result] = await db.update(expenses).set({ ...data, updatedAt: new Date() }).where(eq(expenses.id, id)).returning();
    return result;
  }

  async getBudgets(tenantId: string): Promise<Budget[]> {
    return await db.select().from(budgets).where(eq(budgets.tenantId, tenantId));
  }

  async createBudget(budget: InsertBudget): Promise<Budget> {
    const [result] = await db.insert(budgets).values(budget).returning();
    return result;
  }

  // Assets
  async getAssetCategories(tenantId: string): Promise<AssetCategory[]> {
    return await db.select().from(assetCategories).where(eq(assetCategories.tenantId, tenantId));
  }

  async createAssetCategory(category: InsertAssetCategory): Promise<AssetCategory> {
    const [result] = await db.insert(assetCategories).values(category).returning();
    return result;
  }

  async getFixedAssets(tenantId: string): Promise<FixedAsset[]> {
    return await db.select().from(fixedAssets).where(eq(fixedAssets.tenantId, tenantId));
  }

  async getFixedAsset(id: string): Promise<FixedAsset | undefined> {
    const [asset] = await db.select().from(fixedAssets).where(eq(fixedAssets.id, id));
    return asset;
  }

  async createFixedAsset(asset: InsertFixedAsset): Promise<FixedAsset> {
    const [result] = await db.insert(fixedAssets).values(asset).returning();
    return result;
  }

  async updateFixedAsset(id: string, data: Partial<InsertFixedAsset>): Promise<FixedAsset | undefined> {
    const [result] = await db.update(fixedAssets).set({ ...data, updatedAt: new Date() }).where(eq(fixedAssets.id, id)).returning();
    return result;
  }

  async getAssetMaintenances(assetId: string): Promise<AssetMaintenance[]> {
    return await db.select().from(assetMaintenances).where(eq(assetMaintenances.assetId, assetId));
  }

  async createAssetMaintenance(maintenance: InsertAssetMaintenance): Promise<AssetMaintenance> {
    const [result] = await db.insert(assetMaintenances).values(maintenance).returning();
    return result;
  }

  // Inventory
  async getStockAdjustments(tenantId: string): Promise<StockAdjustment[]> {
    return await db.select().from(stockAdjustments).where(eq(stockAdjustments.tenantId, tenantId));
  }

  async createStockAdjustment(adjustment: InsertStockAdjustment): Promise<StockAdjustment> {
    const [result] = await db.insert(stockAdjustments).values(adjustment).returning();
    return result;
  }

  // Attendance
  async getWorkSchedules(tenantId: string): Promise<WorkSchedule[]> {
    return await db.select().from(workSchedules).where(eq(workSchedules.tenantId, tenantId));
  }

  async createWorkSchedule(schedule: InsertWorkSchedule): Promise<WorkSchedule> {
    const [result] = await db.insert(workSchedules).values(schedule).returning();
    return result;
  }

  async getHolidays(tenantId: string): Promise<Holiday[]> {
    return await db.select().from(holidays).where(eq(holidays.tenantId, tenantId));
  }

  async createHoliday(holiday: InsertHoliday): Promise<Holiday> {
    const [result] = await db.insert(holidays).values(holiday).returning();
    return result;
  }

  async getAttendanceRecords(tenantId: string): Promise<AttendanceRecord[]> {
    return await db.select().from(attendanceRecords).where(eq(attendanceRecords.tenantId, tenantId));
  }

  async createAttendanceRecord(record: InsertAttendanceRecord): Promise<AttendanceRecord> {
    const [result] = await db.insert(attendanceRecords).values(record).returning();
    return result;
  }

  async updateAttendanceRecord(id: string, data: Partial<InsertAttendanceRecord>): Promise<AttendanceRecord | undefined> {
    const [result] = await db.update(attendanceRecords).set({ ...data, updatedAt: new Date() }).where(eq(attendanceRecords.id, id)).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
