import { z } from 'zod';
import {
  insertTenantSchema,
  insertUserSchema,
  insertChartOfAccountSchema,
  insertJournalSchema,
  insertJournalLineSchema,
  insertCustomerSchema,
  insertProductSchema,
  insertProductCategorySchema,
  insertInvoiceSchema,
  insertInvoiceLineSchema,
  insertPaymentSchema,
  insertSalesLeadSchema,
  insertDepartmentSchema,
  insertGradeSchema,
  insertSalaryComponentSchema,
  insertEmployeeSchema,
  insertLeaveTypeSchema,
  insertLeaveRequestSchema,
  insertPayrollRunSchema,
  insertPayrollRecordSchema,
  insertPayrollLineSchema,
  insertExpenseCategorySchema,
  insertExpenseSchema,
  insertBudgetSchema,
  insertAssetCategorySchema,
  insertFixedAssetSchema,
  insertAssetMaintenanceSchema,
  insertStockAdjustmentSchema,
  insertWorkScheduleSchema,
  insertHolidaySchema,
  insertAttendanceRecordSchema,
  insertSubscriptionPlanSchema,
  tenants,
  users,
  chartOfAccounts,
  journals,
  journalLines,
  customers,
  products,
  productCategories,
  invoices,
  invoiceLines,
  payments,
  salesLeads,
  departments,
  grades,
  salaryComponents,
  employees,
  leaveTypes,
  leaveRequests,
  payrollRuns,
  payrollRecords,
  payrollLines,
  expenseCategories,
  expenses,
  budgets,
  assetCategories,
  fixedAssets,
  assetMaintenances,
  stockAdjustments,
  workSchedules,
  holidays,
  attendanceRecords,
  subscriptionPlans
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  // ============================================
  // AUTH
  // ============================================
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized
      }
    },
    signup: {
      method: 'POST' as const,
      path: '/api/auth/signup',
      input: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        companyName: z.string().min(1),
        phone: z.string().optional(),
        industry: z.string().optional(),
      }),
      responses: {
        201: z.object({
          user: z.custom<typeof users.$inferSelect>(),
          tenant: z.custom<typeof tenants.$inferSelect>()
        }),
        400: errorSchemas.validation
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ message: z.string() })
      }
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: z.object({
          user: z.custom<typeof users.$inferSelect>(),
          tenant: z.custom<typeof tenants.$inferSelect>()
        }),
        401: errorSchemas.unauthorized
      }
    },
    forgotPassword: {
      method: 'POST' as const,
      path: '/api/auth/forgot-password',
      input: z.object({ email: z.string().email() }),
      responses: {
        200: z.object({ message: z.string() })
      }
    }
  },

  // ============================================
  // SUBSCRIPTION PLANS (Public)
  // ============================================
  plans: {
    list: {
      method: 'GET' as const,
      path: '/api/plans',
      responses: {
        200: z.array(z.custom<typeof subscriptionPlans.$inferSelect>())
      }
    }
  },

  // ============================================
  // TENANTS
  // ============================================
  tenants: {
    get: {
      method: 'GET' as const,
      path: '/api/tenants/:id',
      responses: {
        200: z.custom<typeof tenants.$inferSelect>(),
        404: errorSchemas.notFound
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/tenants/:id',
      input: insertTenantSchema.partial(),
      responses: {
        200: z.custom<typeof tenants.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },

  // ============================================
  // DASHBOARD
  // ============================================
  dashboard: {
    stats: {
      method: 'GET' as const,
      path: '/api/dashboard/stats',
      responses: {
        200: z.object({
          totalRevenue: z.number(),
          totalExpenses: z.number(),
          receivables: z.number(),
          payables: z.number(),
          customerCount: z.number(),
          employeeCount: z.number(),
          invoiceCount: z.number(),
          pendingInvoices: z.number(),
        })
      }
    },
    recentInvoices: {
      method: 'GET' as const,
      path: '/api/dashboard/recent-invoices',
      responses: {
        200: z.array(z.custom<typeof invoices.$inferSelect>())
      }
    },
    revenueChart: {
      method: 'GET' as const,
      path: '/api/dashboard/revenue-chart',
      responses: {
        200: z.array(z.object({
          month: z.string(),
          revenue: z.number(),
          expenses: z.number(),
        }))
      }
    }
  },

  // ============================================
  // ACCOUNTING - Chart of Accounts
  // ============================================
  chartOfAccounts: {
    list: {
      method: 'GET' as const,
      path: '/api/accounting/accounts',
      responses: {
        200: z.array(z.custom<typeof chartOfAccounts.$inferSelect>())
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/accounting/accounts/:id',
      responses: {
        200: z.custom<typeof chartOfAccounts.$inferSelect>(),
        404: errorSchemas.notFound
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/accounting/accounts',
      input: insertChartOfAccountSchema,
      responses: {
        201: z.custom<typeof chartOfAccounts.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/accounting/accounts/:id',
      input: insertChartOfAccountSchema.partial(),
      responses: {
        200: z.custom<typeof chartOfAccounts.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/accounting/accounts/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound
      }
    }
  },

  // ============================================
  // ACCOUNTING - Journals
  // ============================================
  journals: {
    list: {
      method: 'GET' as const,
      path: '/api/accounting/journals',
      responses: {
        200: z.array(z.custom<typeof journals.$inferSelect>())
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/accounting/journals/:id',
      responses: {
        200: z.object({
          journal: z.custom<typeof journals.$inferSelect>(),
          lines: z.array(z.custom<typeof journalLines.$inferSelect>())
        }),
        404: errorSchemas.notFound
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/accounting/journals',
      input: z.object({
        journal: insertJournalSchema,
        lines: z.array(insertJournalLineSchema.omit({ journalId: true }))
      }),
      responses: {
        201: z.custom<typeof journals.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    post: {
      method: 'POST' as const,
      path: '/api/accounting/journals/:id/post',
      responses: {
        200: z.custom<typeof journals.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },

  // ============================================
  // ACCOUNTING - Reports
  // ============================================
  reports: {
    trialBalance: {
      method: 'GET' as const,
      path: '/api/accounting/reports/trial-balance',
      input: z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional()
      }).optional(),
      responses: {
        200: z.array(z.object({
          accountId: z.string(),
          accountCode: z.string(),
          accountName: z.string(),
          accountType: z.string(),
          debit: z.number(),
          credit: z.number()
        }))
      }
    },
    profitLoss: {
      method: 'GET' as const,
      path: '/api/accounting/reports/profit-loss',
      input: z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional()
      }).optional(),
      responses: {
        200: z.object({
          revenue: z.array(z.object({ name: z.string(), amount: z.number() })),
          expenses: z.array(z.object({ name: z.string(), amount: z.number() })),
          totalRevenue: z.number(),
          totalExpenses: z.number(),
          netProfit: z.number()
        })
      }
    },
    balanceSheet: {
      method: 'GET' as const,
      path: '/api/accounting/reports/balance-sheet',
      input: z.object({ asOfDate: z.string().optional() }).optional(),
      responses: {
        200: z.object({
          assets: z.array(z.object({ name: z.string(), amount: z.number() })),
          liabilities: z.array(z.object({ name: z.string(), amount: z.number() })),
          equity: z.array(z.object({ name: z.string(), amount: z.number() })),
          totalAssets: z.number(),
          totalLiabilities: z.number(),
          totalEquity: z.number()
        })
      }
    }
  },

  // ============================================
  // SALES - Customers
  // ============================================
  customers: {
    list: {
      method: 'GET' as const,
      path: '/api/sales/customers',
      responses: {
        200: z.array(z.custom<typeof customers.$inferSelect>())
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/sales/customers/:id',
      responses: {
        200: z.custom<typeof customers.$inferSelect>(),
        404: errorSchemas.notFound
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/sales/customers',
      input: insertCustomerSchema,
      responses: {
        201: z.custom<typeof customers.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/sales/customers/:id',
      input: insertCustomerSchema.partial(),
      responses: {
        200: z.custom<typeof customers.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/sales/customers/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound
      }
    }
  },

  // ============================================
  // SALES - Product Categories
  // ============================================
  productCategories: {
    list: {
      method: 'GET' as const,
      path: '/api/sales/product-categories',
      responses: {
        200: z.array(z.custom<typeof productCategories.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/sales/product-categories',
      input: insertProductCategorySchema,
      responses: {
        201: z.custom<typeof productCategories.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },

  // ============================================
  // SALES - Products
  // ============================================
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/sales/products',
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>())
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/sales/products/:id',
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/sales/products',
      input: insertProductSchema,
      responses: {
        201: z.custom<typeof products.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/sales/products/:id',
      input: insertProductSchema.partial(),
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/sales/products/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound
      }
    }
  },

  // ============================================
  // SALES - Invoices
  // ============================================
  invoices: {
    list: {
      method: 'GET' as const,
      path: '/api/sales/invoices',
      responses: {
        200: z.array(z.custom<typeof invoices.$inferSelect>())
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/sales/invoices/:id',
      responses: {
        200: z.object({
          invoice: z.custom<typeof invoices.$inferSelect>(),
          lines: z.array(z.custom<typeof invoiceLines.$inferSelect>()),
          customer: z.custom<typeof customers.$inferSelect>()
        }),
        404: errorSchemas.notFound
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/sales/invoices',
      input: z.object({
        invoice: insertInvoiceSchema.omit({ number: true, subtotal: true, totalAmount: true, balanceDue: true }),
        lines: z.array(insertInvoiceLineSchema.omit({ invoiceId: true, total: true }))
      }),
      responses: {
        201: z.custom<typeof invoices.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/sales/invoices/:id',
      input: insertInvoiceSchema.partial(),
      responses: {
        200: z.custom<typeof invoices.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/sales/invoices/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound
      }
    }
  },

  // ============================================
  // SALES - Payments
  // ============================================
  payments: {
    list: {
      method: 'GET' as const,
      path: '/api/sales/payments',
      responses: {
        200: z.array(z.custom<typeof payments.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/sales/payments',
      input: insertPaymentSchema.omit({ number: true }),
      responses: {
        201: z.custom<typeof payments.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },

  // ============================================
  // SALES - Leads
  // ============================================
  salesLeads: {
    list: {
      method: 'GET' as const,
      path: '/api/sales/leads',
      responses: {
        200: z.array(z.custom<typeof salesLeads.$inferSelect>())
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/sales/leads/:id',
      responses: {
        200: z.custom<typeof salesLeads.$inferSelect>(),
        404: errorSchemas.notFound
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/sales/leads',
      input: insertSalesLeadSchema,
      responses: {
        201: z.custom<typeof salesLeads.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/sales/leads/:id',
      input: insertSalesLeadSchema.partial(),
      responses: {
        200: z.custom<typeof salesLeads.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/sales/leads/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound
      }
    },
    convertToCustomer: {
      method: 'POST' as const,
      path: '/api/sales/leads/:id/convert',
      responses: {
        200: z.object({
          lead: z.custom<typeof salesLeads.$inferSelect>(),
          customer: z.custom<typeof customers.$inferSelect>()
        }),
        400: errorSchemas.validation
      }
    }
  },

  // ============================================
  // HR - Departments
  // ============================================
  departments: {
    list: {
      method: 'GET' as const,
      path: '/api/hr/departments',
      responses: {
        200: z.array(z.custom<typeof departments.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/hr/departments',
      input: insertDepartmentSchema,
      responses: {
        201: z.custom<typeof departments.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/hr/departments/:id',
      input: insertDepartmentSchema.partial(),
      responses: {
        200: z.custom<typeof departments.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/hr/departments/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound
      }
    }
  },

  // ============================================
  // HR - Grades
  // ============================================
  grades: {
    list: {
      method: 'GET' as const,
      path: '/api/hr/grades',
      responses: {
        200: z.array(z.custom<typeof grades.$inferSelect>())
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/hr/grades/:id',
      responses: {
        200: z.custom<typeof grades.$inferSelect>(),
        404: errorSchemas.notFound
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/hr/grades',
      input: insertGradeSchema,
      responses: {
        201: z.custom<typeof grades.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/hr/grades/:id',
      input: insertGradeSchema.partial(),
      responses: {
        200: z.custom<typeof grades.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/hr/grades/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound
      }
    }
  },

  // ============================================
  // HR - Salary Components
  // ============================================
  salaryComponents: {
    list: {
      method: 'GET' as const,
      path: '/api/hr/salary-components',
      responses: {
        200: z.array(z.custom<typeof salaryComponents.$inferSelect>())
      }
    },
    listByGrade: {
      method: 'GET' as const,
      path: '/api/hr/grades/:gradeId/salary-components',
      responses: {
        200: z.array(z.custom<typeof salaryComponents.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/hr/salary-components',
      input: insertSalaryComponentSchema,
      responses: {
        201: z.custom<typeof salaryComponents.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/hr/salary-components/:id',
      input: insertSalaryComponentSchema.partial(),
      responses: {
        200: z.custom<typeof salaryComponents.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/hr/salary-components/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound
      }
    }
  },

  // ============================================
  // HR - Employees
  // ============================================
  employees: {
    list: {
      method: 'GET' as const,
      path: '/api/hr/employees',
      responses: {
        200: z.array(z.custom<typeof employees.$inferSelect>())
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/hr/employees/:id',
      responses: {
        200: z.custom<typeof employees.$inferSelect>(),
        404: errorSchemas.notFound
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/hr/employees',
      input: insertEmployeeSchema,
      responses: {
        201: z.custom<typeof employees.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/hr/employees/:id',
      input: insertEmployeeSchema.partial(),
      responses: {
        200: z.custom<typeof employees.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/hr/employees/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound
      }
    }
  },

  // ============================================
  // HR - Leave
  // ============================================
  leaveTypes: {
    list: {
      method: 'GET' as const,
      path: '/api/hr/leave-types',
      responses: {
        200: z.array(z.custom<typeof leaveTypes.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/hr/leave-types',
      input: insertLeaveTypeSchema,
      responses: {
        201: z.custom<typeof leaveTypes.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },

  leaveRequests: {
    list: {
      method: 'GET' as const,
      path: '/api/hr/leave-requests',
      responses: {
        200: z.array(z.custom<typeof leaveRequests.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/hr/leave-requests',
      input: insertLeaveRequestSchema,
      responses: {
        201: z.custom<typeof leaveRequests.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    approve: {
      method: 'POST' as const,
      path: '/api/hr/leave-requests/:id/approve',
      responses: {
        200: z.custom<typeof leaveRequests.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    reject: {
      method: 'POST' as const,
      path: '/api/hr/leave-requests/:id/reject',
      input: z.object({ reason: z.string() }),
      responses: {
        200: z.custom<typeof leaveRequests.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },

  // ============================================
  // HR - Payroll
  // ============================================
  payrollRuns: {
    list: {
      method: 'GET' as const,
      path: '/api/hr/payroll-runs',
      responses: {
        200: z.array(z.custom<typeof payrollRuns.$inferSelect>())
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/hr/payroll-runs/:id',
      responses: {
        200: z.object({
          run: z.custom<typeof payrollRuns.$inferSelect>(),
          records: z.array(z.custom<typeof payrollRecords.$inferSelect>())
        }),
        404: errorSchemas.notFound
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/hr/payroll-runs',
      input: z.object({
        month: z.number().min(1).max(12),
        year: z.number().min(2020).max(2100)
      }),
      responses: {
        201: z.custom<typeof payrollRuns.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    process: {
      method: 'POST' as const,
      path: '/api/hr/payroll-runs/:id/process',
      responses: {
        200: z.custom<typeof payrollRuns.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    approve: {
      method: 'POST' as const,
      path: '/api/hr/payroll-runs/:id/approve',
      responses: {
        200: z.custom<typeof payrollRuns.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    markPaid: {
      method: 'POST' as const,
      path: '/api/hr/payroll-runs/:id/mark-paid',
      responses: {
        200: z.custom<typeof payrollRuns.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },

  payrollRecords: {
    list: {
      method: 'GET' as const,
      path: '/api/hr/payroll-records',
      responses: {
        200: z.array(z.custom<typeof payrollRecords.$inferSelect>())
      }
    },
    getByEmployee: {
      method: 'GET' as const,
      path: '/api/hr/employees/:employeeId/payroll-records',
      responses: {
        200: z.array(z.custom<typeof payrollRecords.$inferSelect>())
      }
    },
    getPayslip: {
      method: 'GET' as const,
      path: '/api/hr/payroll-records/:id/payslip',
      responses: {
        200: z.object({
          record: z.custom<typeof payrollRecords.$inferSelect>(),
          lines: z.array(z.custom<typeof payrollLines.$inferSelect>()),
          employee: z.custom<typeof employees.$inferSelect>()
        }),
        404: errorSchemas.notFound
      }
    }
  },

  // ============================================
  // EXPENSES
  // ============================================
  expenseCategories: {
    list: {
      method: 'GET' as const,
      path: '/api/expenses/categories',
      responses: {
        200: z.array(z.custom<typeof expenseCategories.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/expenses/categories',
      input: insertExpenseCategorySchema,
      responses: {
        201: z.custom<typeof expenseCategories.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },

  expenses: {
    list: {
      method: 'GET' as const,
      path: '/api/expenses',
      responses: {
        200: z.array(z.custom<typeof expenses.$inferSelect>())
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/expenses/:id',
      responses: {
        200: z.custom<typeof expenses.$inferSelect>(),
        404: errorSchemas.notFound
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/expenses',
      input: insertExpenseSchema.omit({ number: true }),
      responses: {
        201: z.custom<typeof expenses.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/expenses/:id',
      input: insertExpenseSchema.partial(),
      responses: {
        200: z.custom<typeof expenses.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    approve: {
      method: 'POST' as const,
      path: '/api/expenses/:id/approve',
      responses: {
        200: z.custom<typeof expenses.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    reject: {
      method: 'POST' as const,
      path: '/api/expenses/:id/reject',
      responses: {
        200: z.custom<typeof expenses.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },

  budgets: {
    list: {
      method: 'GET' as const,
      path: '/api/expenses/budgets',
      responses: {
        200: z.array(z.custom<typeof budgets.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/expenses/budgets',
      input: insertBudgetSchema,
      responses: {
        201: z.custom<typeof budgets.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/expenses/budgets/:id',
      input: insertBudgetSchema.partial(),
      responses: {
        200: z.custom<typeof budgets.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/expenses/budgets/:id',
      responses: {
        200: z.object({ success: z.boolean() }),
        404: errorSchemas.notFound
      }
    }
  },

  // ============================================
  // ASSETS
  // ============================================
  assetCategories: {
    list: {
      method: 'GET' as const,
      path: '/api/assets/categories',
      responses: {
        200: z.array(z.custom<typeof assetCategories.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/assets/categories',
      input: insertAssetCategorySchema,
      responses: {
        201: z.custom<typeof assetCategories.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },

  assets: {
    list: {
      method: 'GET' as const,
      path: '/api/assets',
      responses: {
        200: z.array(z.custom<typeof fixedAssets.$inferSelect>())
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/assets/:id',
      responses: {
        200: z.custom<typeof fixedAssets.$inferSelect>(),
        404: errorSchemas.notFound
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/assets',
      input: insertFixedAssetSchema,
      responses: {
        201: z.custom<typeof fixedAssets.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/assets/:id',
      input: insertFixedAssetSchema.partial(),
      responses: {
        200: z.custom<typeof fixedAssets.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    assign: {
      method: 'POST' as const,
      path: '/api/assets/:id/assign',
      input: z.object({ employeeId: z.string().uuid() }),
      responses: {
        200: z.custom<typeof fixedAssets.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },

  assetMaintenances: {
    list: {
      method: 'GET' as const,
      path: '/api/assets/:assetId/maintenances',
      responses: {
        200: z.array(z.custom<typeof assetMaintenances.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/assets/:assetId/maintenances',
      input: insertAssetMaintenanceSchema.omit({ assetId: true }),
      responses: {
        201: z.custom<typeof assetMaintenances.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },

  // ============================================
  // INVENTORY
  // ============================================
  stockAdjustments: {
    list: {
      method: 'GET' as const,
      path: '/api/inventory/adjustments',
      responses: {
        200: z.array(z.custom<typeof stockAdjustments.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/inventory/adjustments',
      input: insertStockAdjustmentSchema.omit({ number: true }),
      responses: {
        201: z.custom<typeof stockAdjustments.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },

  lowStockProducts: {
    list: {
      method: 'GET' as const,
      path: '/api/inventory/low-stock',
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>())
      }
    }
  },

  // ============================================
  // ATTENDANCE
  // ============================================
  workSchedules: {
    list: {
      method: 'GET' as const,
      path: '/api/attendance/schedules',
      responses: {
        200: z.array(z.custom<typeof workSchedules.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/attendance/schedules',
      input: insertWorkScheduleSchema,
      responses: {
        201: z.custom<typeof workSchedules.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },

  holidays: {
    list: {
      method: 'GET' as const,
      path: '/api/attendance/holidays',
      responses: {
        200: z.array(z.custom<typeof holidays.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/attendance/holidays',
      input: insertHolidaySchema,
      responses: {
        201: z.custom<typeof holidays.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },

  attendanceRecords: {
    list: {
      method: 'GET' as const,
      path: '/api/attendance/records',
      responses: {
        200: z.array(z.custom<typeof attendanceRecords.$inferSelect>())
      }
    },
    clockIn: {
      method: 'POST' as const,
      path: '/api/attendance/clock-in',
      input: z.object({
        employeeId: z.string().uuid(),
        location: z.string().optional()
      }),
      responses: {
        201: z.custom<typeof attendanceRecords.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    clockOut: {
      method: 'POST' as const,
      path: '/api/attendance/clock-out',
      input: z.object({
        employeeId: z.string().uuid(),
        location: z.string().optional()
      }),
      responses: {
        200: z.custom<typeof attendanceRecords.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// Type exports
export type LoginInput = z.infer<typeof api.auth.login.input>;
export type SignupInput = z.infer<typeof api.auth.signup.input>;
export type CustomerInput = z.infer<typeof api.customers.create.input>;
export type ProductInput = z.infer<typeof api.products.create.input>;
export type EmployeeInput = z.infer<typeof api.employees.create.input>;
export type ExpenseInput = z.infer<typeof api.expenses.create.input>;
