// Mock API Handler for Frontend-Only Development
// Intercepts fetch calls and returns mock data

import {
  mockTenant,
  mockUser,
  mockChartOfAccounts,
  mockCustomers,
  mockProductCategories,
  mockProducts,
  mockInvoices,
  mockDepartments,
  mockGrades,
  mockEmployees,
  mockLeaveTypes,
  mockLeaveRequests,
  mockExpenseCategories,
  mockExpenses,
  mockAssetCategories,
  mockFixedAssets,
  mockWorkSchedules,
  mockHolidays,
  mockAttendanceRecords,
  mockDashboardStats,
  mockRevenueChart,
  mockSubscriptionPlans,
  mockBudgets,
  mockStockAdjustments,
  mockPayments,
  mockJournals,
  mockJournalLines,
} from "./mockData";

// Simulated delay for realistic API feel
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Store for session state
let isAuthenticated = false;

// Route handlers
const routes: Record<string, (req: MockRequest) => Promise<MockResponse>> = {
  // Auth
  "GET /api/auth/me": async () => {
    if (!isAuthenticated) {
      return { status: 401, data: { message: "Unauthorized" } };
    }
    return { status: 200, data: { user: mockUser, tenant: mockTenant } };
  },

  "POST /api/auth/login": async (req) => {
    const { email, password } = req.body || {};
    // Accept any credentials for demo
    if (email && password) {
      isAuthenticated = true;
      return { status: 200, data: { user: mockUser, tenant: mockTenant } };
    }
    return { status: 401, data: { message: "Invalid credentials" } };
  },

  "POST /api/auth/signup": async (req) => {
    const { email, firstName, lastName, companyName } = req.body || {};
    if (email && firstName && lastName && companyName) {
      isAuthenticated = true;
      const newUser = { ...mockUser, userEmail: email, userFirstName: firstName, userLastName: lastName };
      const newTenant = { ...mockTenant, tenantName: companyName };
      return { status: 201, data: { user: newUser, tenant: newTenant } };
    }
    return { status: 400, data: { message: "Missing required fields" } };
  },

  "POST /api/auth/logout": async () => {
    isAuthenticated = false;
    return { status: 200, data: { message: "Logged out successfully" } };
  },

  // Dashboard
  "GET /api/dashboard/stats": async () => {
    return { status: 200, data: mockDashboardStats };
  },

  "GET /api/dashboard/recent-invoices": async () => {
    return { status: 200, data: mockInvoices.slice(0, 5) };
  },

  "GET /api/dashboard/revenue-chart": async () => {
    return { status: 200, data: mockRevenueChart };
  },

  // Subscription Plans
  "GET /api/plans": async () => {
    return { status: 200, data: mockSubscriptionPlans };
  },

  // Chart of Accounts
  "GET /api/accounting/accounts": async () => {
    return { status: 200, data: mockChartOfAccounts };
  },

  "POST /api/accounting/accounts": async (req) => {
    const newAccount = {
      id: `coa-${Date.now()}`,
      tenantId: mockTenant.id,
      ...req.body,
      accountBalance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockChartOfAccounts.push(newAccount);
    return { status: 201, data: newAccount };
  },

  // Journals
  "GET /api/accounting/journals": async () => {
    return { status: 200, data: mockJournals };
  },

  "GET /api/accounting/journal-lines": async () => {
    return { status: 200, data: mockJournalLines };
  },

  "POST /api/accounting/journals": async (req) => {
    const jrnNum = mockJournals.length + 1;
    const newJournal = {
      id: `jrn-${Date.now()}`,
      tenantId: mockTenant.id,
      number: `JRN-2024-${String(jrnNum).padStart(4, "0")}`,
      ...req.body,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockJournals.push(newJournal);
    return { status: 201, data: newJournal };
  },

  // Reports
  "GET /api/accounting/reports/trial-balance": async () => {
    const trialBalance = mockChartOfAccounts.map((acc) => ({
      accountId: acc.id,
      accountCode: acc.accountCode,
      accountName: acc.accountName,
      accountType: acc.accountType,
      debit: ["asset", "expense"].includes(acc.accountType) ? acc.accountBalance : 0,
      credit: ["liability", "equity", "revenue"].includes(acc.accountType) ? acc.accountBalance : 0,
    }));
    return { status: 200, data: trialBalance };
  },

  "GET /api/accounting/reports/profit-loss": async () => {
    const revenue = mockChartOfAccounts
      .filter((a) => a.accountType === "revenue")
      .map((a) => ({ name: a.accountName, amount: a.accountBalance }));
    const expenses = mockChartOfAccounts
      .filter((a) => a.accountType === "expense")
      .map((a) => ({ name: a.accountName, amount: a.accountBalance }));
    const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      status: 200,
      data: {
        revenue,
        expenses,
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
      },
    };
  },

  "GET /api/accounting/reports/balance-sheet": async () => {
    const assets = mockChartOfAccounts
      .filter((a) => a.accountType === "asset")
      .map((a) => ({ name: a.accountName, amount: a.accountBalance }));
    const liabilities = mockChartOfAccounts
      .filter((a) => a.accountType === "liability")
      .map((a) => ({ name: a.accountName, amount: a.accountBalance }));
    const equity = mockChartOfAccounts
      .filter((a) => a.accountType === "equity")
      .map((a) => ({ name: a.accountName, amount: a.accountBalance }));
    return {
      status: 200,
      data: {
        assets,
        liabilities,
        equity,
        totalAssets: assets.reduce((sum, a) => sum + a.amount, 0),
        totalLiabilities: liabilities.reduce((sum, l) => sum + l.amount, 0),
        totalEquity: equity.reduce((sum, e) => sum + e.amount, 0),
      },
    };
  },

  // Customers
  "GET /api/sales/customers": async () => {
    return { status: 200, data: mockCustomers };
  },

  "POST /api/sales/customers": async (req) => {
    const newCustomer = {
      id: `cust-${Date.now()}`,
      tenantId: mockTenant.id,
      ...req.body,
      customerBalance: 0,
      customerStatus: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCustomers.push(newCustomer);
    return { status: 201, data: newCustomer };
  },

  // Product Categories
  "GET /api/sales/product-categories": async () => {
    return { status: 200, data: mockProductCategories };
  },

  "POST /api/sales/product-categories": async (req) => {
    const newCategory = {
      id: `cat-${Date.now()}`,
      tenantId: mockTenant.id,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockProductCategories.push(newCategory);
    return { status: 201, data: newCategory };
  },

  // Products
  "GET /api/sales/products": async () => {
    return { status: 200, data: mockProducts };
  },

  "POST /api/sales/products": async (req) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      tenantId: mockTenant.id,
      ...req.body,
      productIsActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockProducts.push(newProduct);
    return { status: 201, data: newProduct };
  },

  // Invoices
  "GET /api/sales/invoices": async () => {
    return { status: 200, data: mockInvoices };
  },

  "POST /api/sales/invoices": async (req) => {
    const { invoice, lines } = req.body || {};
    const invoiceNum = mockInvoices.length + 1;
    const newInvoice = {
      id: `inv-${Date.now()}`,
      tenantId: mockTenant.id,
      invoiceNumber: `INV-2024-${String(invoiceNum).padStart(4, "0")}`,
      ...invoice,
      invoiceStatus: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockInvoices.push(newInvoice);
    return { status: 201, data: newInvoice };
  },

  // Payments
  "GET /api/sales/payments": async () => {
    return { status: 200, data: mockPayments };
  },

  "POST /api/sales/payments": async (req) => {
    const pmtNum = mockPayments.length + 1;
    const newPayment = {
      id: `pmt-${Date.now()}`,
      tenantId: mockTenant.id,
      number: `PMT-2024-${String(pmtNum).padStart(3, "0")}`,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockPayments.push(newPayment);
    return { status: 201, data: newPayment };
  },

  // Departments
  "GET /api/hr/departments": async () => {
    return { status: 200, data: mockDepartments };
  },

  "POST /api/hr/departments": async (req) => {
    const newDept = {
      id: `dept-${Date.now()}`,
      tenantId: mockTenant.id,
      ...req.body,
      departmentIsActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDepartments.push(newDept);
    return { status: 201, data: newDept };
  },

  // Grades
  "GET /api/hr/grades": async () => {
    return { status: 200, data: mockGrades };
  },

  "POST /api/hr/grades": async (req) => {
    const newGrade = {
      id: `grade-${Date.now()}`,
      tenantId: mockTenant.id,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockGrades.push(newGrade);
    return { status: 201, data: newGrade };
  },

  // Employees
  "GET /api/hr/employees": async () => {
    return { status: 200, data: mockEmployees };
  },

  "POST /api/hr/employees": async (req) => {
    const empNum = mockEmployees.length + 1;
    const newEmployee = {
      id: `emp-${Date.now()}`,
      tenantId: mockTenant.id,
      employeeNumber: `MRX-${String(empNum).padStart(3, "0")}`,
      ...req.body,
      employeeStatus: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockEmployees.push(newEmployee);
    return { status: 201, data: newEmployee };
  },

  // Leave Types
  "GET /api/hr/leave-types": async () => {
    return { status: 200, data: mockLeaveTypes };
  },

  // Leave Requests
  "GET /api/hr/leave-requests": async () => {
    return { status: 200, data: mockLeaveRequests };
  },

  "POST /api/hr/leave-requests": async (req) => {
    const newRequest = {
      id: `lr-${Date.now()}`,
      tenantId: mockTenant.id,
      ...req.body,
      leaveRequestStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockLeaveRequests.push(newRequest);
    return { status: 201, data: newRequest };
  },

  // Expense Categories
  "GET /api/expenses/categories": async () => {
    return { status: 200, data: mockExpenseCategories };
  },

  // Expenses
  "GET /api/expenses": async () => {
    return { status: 200, data: mockExpenses };
  },

  "POST /api/expenses": async (req) => {
    const { categoryId, amount, date } = req.body || {};
    const expenseAmount = parseFloat(amount) || 0;
    const expenseDate = new Date(date);

    // Find the budget for this expense category and month/year
    const budget = mockBudgets.find(
      (b) => b.categoryId === categoryId &&
             b.year === expenseDate.getFullYear() &&
             b.month === (expenseDate.getMonth() + 1)
    );

    // Warn if expense would exceed budget when approved (still allow creation as pending)
    let budgetWarning = null;
    if (budget) {
      const projectedSpent = budget.spent + expenseAmount;
      if (projectedSpent > budget.amount) {
        budgetWarning = `Warning: This expense would exceed the budget by ₦${(projectedSpent - budget.amount).toLocaleString()} if approved`;
      }
    }

    const expNum = mockExpenses.length + 1;
    const newExpense = {
      id: `exp-${Date.now()}`,
      tenantId: mockTenant.id,
      number: `EXP-2025-${String(expNum).padStart(3, "0")}`,
      ...req.body,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockExpenses.push(newExpense);
    return { status: 201, data: { ...newExpense, budgetWarning } };
  },

  // Expense Approve/Reject - syncs with budgets
  "POST /api/expenses/:id/approve": async (req) => {
    const expenseId = req.url.split("/")[3]; // Extract ID from URL
    const expense = mockExpenses.find((e) => e.id === expenseId);
    if (expense) {
      // Check if expense was already approved (prevent double-counting)
      if (expense.status === "approved") {
        return { status: 400, data: { message: "Expense already approved" } };
      }

      // Find the budget for this expense category and current month/year
      const expenseDate = new Date(expense.date);
      const budget = mockBudgets.find(
        (b) => b.categoryId === expense.categoryId &&
               b.year === expenseDate.getFullYear() &&
               b.month === (expenseDate.getMonth() + 1)
      );

      // Check if approving would exceed budget
      if (budget) {
        const newSpent = budget.spent + expense.amount;
        if (newSpent > budget.amount) {
          return {
            status: 400,
            data: {
              message: `Cannot approve: expense of ₦${expense.amount.toLocaleString()} would exceed budget by ₦${(newSpent - budget.amount).toLocaleString()}`
            }
          };
        }
        // Update budget spent amount
        budget.spent = newSpent;
        budget.updatedAt = new Date();
      }

      expense.status = "approved";
      expense.approvedAt = new Date();
      expense.updatedAt = new Date();
      return { status: 200, data: expense };
    }
    return { status: 404, data: { message: "Expense not found" } };
  },

  "POST /api/expenses/:id/reject": async (req) => {
    const expenseId = req.url.split("/")[3]; // Extract ID from URL
    const expense = mockExpenses.find((e) => e.id === expenseId);
    if (expense) {
      expense.status = "rejected";
      expense.updatedAt = new Date();
      return { status: 200, data: expense };
    }
    return { status: 404, data: { message: "Expense not found" } };
  },

  // Budgets
  "GET /api/expenses/budgets": async () => {
    return { status: 200, data: mockBudgets };
  },

  "POST /api/expenses/budgets": async (req) => {
    const newBudget = {
      id: `bud-${Date.now()}`,
      tenantId: mockTenant.id,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockBudgets.push(newBudget);
    return { status: 201, data: newBudget };
  },

  // Asset Categories
  "GET /api/assets/categories": async () => {
    return { status: 200, data: mockAssetCategories };
  },

  // Fixed Assets
  "GET /api/assets": async () => {
    return { status: 200, data: mockFixedAssets };
  },

  "POST /api/assets": async (req) => {
    const assetNum = mockFixedAssets.length + 1;
    const newAsset = {
      id: `fa-${Date.now()}`,
      tenantId: mockTenant.id,
      assetNumber: `AST-${String(assetNum).padStart(3, "0")}`,
      ...req.body,
      assetStatus: "available",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockFixedAssets.push(newAsset);
    return { status: 201, data: newAsset };
  },

  // Inventory - Stock Adjustments
  "GET /api/inventory/adjustments": async () => {
    return { status: 200, data: mockStockAdjustments };
  },

  "POST /api/inventory/adjustments": async (req) => {
    const adjNum = mockStockAdjustments.length + 1;
    const newAdj = {
      id: `adj-${Date.now()}`,
      tenantId: mockTenant.id,
      number: `ADJ-2024-${String(adjNum).padStart(3, "0")}`,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockStockAdjustments.push(newAdj);
    return { status: 201, data: newAdj };
  },

  // Inventory - Low Stock
  "GET /api/inventory/low-stock": async () => {
    const lowStock = mockProducts.filter(
      (p) => p.productQuantity <= p.productReorderLevel
    );
    return { status: 200, data: lowStock };
  },

  // Attendance - Work Schedules
  "GET /api/attendance/schedules": async () => {
    return { status: 200, data: mockWorkSchedules };
  },

  // Attendance - Holidays
  "GET /api/attendance/holidays": async () => {
    return { status: 200, data: mockHolidays };
  },

  // Attendance - Records
  "GET /api/attendance/records": async () => {
    return { status: 200, data: mockAttendanceRecords };
  },

  "POST /api/attendance/clock-in": async (req) => {
    const { employeeId, location } = req.body || {};
    const newRecord = {
      id: `att-${Date.now()}`,
      tenantId: mockTenant.id,
      employeeId,
      attendanceDate: new Date(),
      attendanceClockIn: new Date(),
      attendanceClockOut: null,
      attendanceStatus: "present",
      attendanceHoursWorked: 0,
      attendanceLocation: location || "Office",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockAttendanceRecords.push(newRecord);
    return { status: 201, data: newRecord };
  },

  "POST /api/attendance/clock-out": async (req) => {
    const { employeeId } = req.body || {};
    const record = mockAttendanceRecords.find(
      (r) => r.employeeId === employeeId && !r.attendanceClockOut
    );
    if (record) {
      record.attendanceClockOut = new Date();
      record.attendanceHoursWorked = 8; // Simplified
      record.updatedAt = new Date();
      return { status: 200, data: record };
    }
    return { status: 400, data: { message: "No active clock-in found" } };
  },
};

interface MockRequest {
  method: string;
  url: string;
  body?: any;
}

interface MockResponse {
  status: number;
  data: any;
}

// Find matching route handler
function findHandler(method: string, url: string): ((req: MockRequest) => Promise<MockResponse>) | null {
  // Strip query parameters for matching
  const urlWithoutQuery = url.split("?")[0];

  // First try exact match
  const exactKey = `${method} ${urlWithoutQuery}`;
  if (routes[exactKey]) {
    return routes[exactKey];
  }

  // Try pattern matching for routes with :id parameters
  for (const routeKey of Object.keys(routes)) {
    const [routeMethod, routePath] = routeKey.split(" ");
    if (routeMethod !== method) continue;

    // Convert route pattern to regex
    const pattern = routePath.replace(/:[^/]+/g, "[^/]+");
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(urlWithoutQuery)) {
      return routes[routeKey];
    }
  }

  return null;
}

// Mock fetch implementation
export async function mockFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const url = typeof input === "string" ? input : input.toString();
  const method = init?.method || "GET";

  // Only intercept API calls
  if (!url.startsWith("/api")) {
    return originalFetch(input, init);
  }

  // Simulate network delay
  await delay(100 + Math.random() * 200);

  const handler = findHandler(method, url);

  if (!handler) {
    console.warn(`[Mock API] No handler for ${method} ${url}`);
    return new Response(JSON.stringify({ message: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body = undefined;
  if (init?.body) {
    try {
      body = JSON.parse(init.body as string);
    } catch {
      body = init.body;
    }
  }

  const response = await handler({ method, url, body });

  console.log(`[Mock API] ${method} ${url} -> ${response.status}`);

  return new Response(JSON.stringify(response.data), {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}

// Store original fetch
const originalFetch = window.fetch;

// Enable mock mode
export function enableMockMode() {
  console.log("[Mock API] Mock mode enabled - using local mock data");
  window.fetch = mockFetch as typeof fetch;
}

// Disable mock mode
export function disableMockMode() {
  console.log("[Mock API] Mock mode disabled - using real API");
  window.fetch = originalFetch;
}

// Auto-login for demo purposes
export function autoLogin() {
  isAuthenticated = true;
}
