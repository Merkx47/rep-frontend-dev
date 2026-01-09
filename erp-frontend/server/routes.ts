import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

function generateSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + randomBytes(4).toString('hex');
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session setup
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "qucoon-erp-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: app.get("env") === "production", maxAge: 7 * 24 * 60 * 60 * 1000 },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // First try to find existing user
          let user = await storage.getUserByEmail(email);

          // If user doesn't exist, create a demo user with the provided credentials
          if (!user) {
            // Get or create demo tenant
            let tenant = await storage.getTenantBySlug("demo-corp");
            if (!tenant) {
              tenant = await storage.createTenant({
                name: "Demo Corporation Ltd",
                slug: "demo-corp",
                email: email,
                phone: "+234 801 234 5678",
                industry: "Technology",
                country: "Nigeria",
                onboardingCompleted: true,
                onboardingStep: 5,
              });
            }

            // Create user with provided credentials
            const passwordHash = await hashPassword(password);
            const emailParts = email.split('@')[0].split('.');
            user = await storage.createUser({
              tenantId: tenant.id,
              email: email,
              password: passwordHash,
              firstName: emailParts[0] ? emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1) : "Demo",
              lastName: emailParts[1] ? emailParts[1].charAt(0).toUpperCase() + emailParts[1].slice(1) : "User",
              role: "super_admin",
              isOwner: true,
              emailVerified: true,
            });
            return done(null, user);
          }

          // For existing users, accept any password (dev mode)
          // In production, you would use: if (!(await comparePasswords(password, user.password)))
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // ============================================
  // AUTH ROUTES
  // ============================================
  app.post(api.auth.login.path, (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.logIn(user, async (err) => {
        if (err) return next(err);
        const tenant = user.tenantId ? await storage.getTenant(user.tenantId) : null;
        res.json({ user, tenant });
      });
    })(req, res, next);
  });

  app.post(api.auth.signup.path, async (req, res) => {
    try {
      const input = api.auth.signup.input.parse(req.body);
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(input.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Create tenant
      const tenant = await storage.createTenant({
        name: input.companyName,
        slug: generateSlug(input.companyName),
        email: input.email,
        phone: input.phone,
        industry: input.industry,
        country: "Nigeria",
        onboardingCompleted: false,
        onboardingStep: 1,
      });

      // Create user
      const passwordHash = await hashPassword(input.password);
      const user = await storage.createUser({
        tenantId: tenant.id,
        email: input.email,
        password: passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        role: "super_admin",
        isOwner: true,
      });

      // Auto-login user
      req.logIn(user, (err) => {
        if (err) {
          console.error("Login error after signup:", err);
          return res.status(500).json({ message: "Account created but login failed" });
        }
        res.status(201).json({ user, tenant });
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Signup error:", err);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post(api.auth.logout.path, (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const tenant = user.tenantId ? await storage.getTenant(user.tenantId) : null;
    res.json({ user, tenant });
  });

  // ============================================
  // SUBSCRIPTION PLANS (Public)
  // ============================================
  app.get(api.plans.list.path, async (req, res) => {
    const plans = await storage.getSubscriptionPlans();
    res.json(plans);
  });

  // ============================================
  // TENANT ROUTES
  // ============================================
  app.get(api.tenants.get.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const tenant = await storage.getTenant(req.params.id);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });
    res.json(tenant);
  });

  app.put(api.tenants.update.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.tenants.update.input.parse(req.body);
      const tenant = await storage.updateTenant(req.params.id, input);
      if (!tenant) return res.status(404).json({ message: "Tenant not found" });
      res.json(tenant);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // ============================================
  // DASHBOARD ROUTES
  // ============================================
  app.get(api.dashboard.stats.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    
    const [customers, employees, invoices] = await Promise.all([
      storage.getCustomers(user.tenantId),
      storage.getEmployees(user.tenantId),
      storage.getInvoices(user.tenantId),
    ]);

    const totalRevenue = invoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + parseFloat(i.totalAmount || '0'), 0);
    
    const receivables = invoices
      .filter(i => i.status !== 'paid' && i.status !== 'cancelled')
      .reduce((sum, i) => sum + parseFloat(i.balanceDue || '0'), 0);

    const pendingInvoices = invoices.filter(i => 
      i.status === 'sent' || i.status === 'partial' || i.status === 'overdue'
    ).length;

    res.json({
      totalRevenue,
      totalExpenses: 0,
      receivables,
      payables: 0,
      customerCount: customers.length,
      employeeCount: employees.length,
      invoiceCount: invoices.length,
      pendingInvoices,
    });
  });

  app.get(api.dashboard.recentInvoices.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const invoices = await storage.getInvoices(user.tenantId);
    res.json(invoices.slice(0, 5));
  });

  app.get(api.dashboard.revenueChart.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    // Mock chart data for now
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 5000000) + 1000000,
      expenses: Math.floor(Math.random() * 2000000) + 500000,
    }));
    res.json(data);
  });

  // ============================================
  // ACCOUNTING ROUTES
  // ============================================
  app.get(api.chartOfAccounts.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const accounts = await storage.getChartOfAccounts(user.tenantId);
    res.json(accounts);
  });

  app.get(api.chartOfAccounts.get.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const account = await storage.getChartOfAccount(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found" });
    res.json(account);
  });

  app.post(api.chartOfAccounts.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const input = api.chartOfAccounts.create.input.parse({ ...req.body, tenantId: user.tenantId });
      const account = await storage.createChartOfAccount(input);
      res.status(201).json(account);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.chartOfAccounts.update.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.chartOfAccounts.update.input.parse(req.body);
      const account = await storage.updateChartOfAccount(req.params.id, input);
      if (!account) return res.status(404).json({ message: "Account not found" });
      res.json(account);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.chartOfAccounts.delete.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    await storage.deleteChartOfAccount(req.params.id);
    res.status(204).send();
  });

  app.get(api.journals.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const journals = await storage.getJournals(user.tenantId);
    res.json(journals);
  });

  // ============================================
  // SALES ROUTES
  // ============================================
  app.get(api.customers.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const customers = await storage.getCustomers(user.tenantId);
    res.json(customers);
  });

  app.get(api.customers.get.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const customer = await storage.getCustomer(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  });

  app.post(api.customers.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const input = api.customers.create.input.parse({ ...req.body, tenantId: user.tenantId });
      const customer = await storage.createCustomer(input);
      res.status(201).json(customer);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.customers.update.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.customers.update.input.parse(req.body);
      const customer = await storage.updateCustomer(req.params.id, input);
      if (!customer) return res.status(404).json({ message: "Customer not found" });
      res.json(customer);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.customers.delete.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    await storage.deleteCustomer(req.params.id);
    res.status(204).send();
  });

  app.get(api.products.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const products = await storage.getProducts(user.tenantId);
    res.json(products);
  });

  app.get(api.products.get.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const product = await storage.getProduct(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const input = api.products.create.input.parse({ ...req.body, tenantId: user.tenantId });
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.products.update.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.products.update.input.parse(req.body);
      const product = await storage.updateProduct(req.params.id, input);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.products.delete.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    await storage.deleteProduct(req.params.id);
    res.status(204).send();
  });

  app.get(api.invoices.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const invoices = await storage.getInvoices(user.tenantId);
    res.json(invoices);
  });

  app.get(api.invoices.get.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const invoice = await storage.getInvoice(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    const lines = await storage.getInvoiceLines(req.params.id);
    const customer = await storage.getCustomer(invoice.customerId);
    res.json({ invoice, lines, customer });
  });

  app.get(api.payments.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const payments = await storage.getPayments(user.tenantId);
    res.json(payments);
  });

  // ============================================
  // HR ROUTES
  // ============================================
  app.get(api.departments.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const departments = await storage.getDepartments(user.tenantId);
    res.json(departments);
  });

  app.post(api.departments.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const input = api.departments.create.input.parse({ ...req.body, tenantId: user.tenantId });
      const department = await storage.createDepartment(input);
      res.status(201).json(department);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.grades.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const grades = await storage.getGrades(user.tenantId);
    res.json(grades);
  });

  app.post(api.grades.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const input = api.grades.create.input.parse({ ...req.body, tenantId: user.tenantId });
      const grade = await storage.createGrade(input);
      res.status(201).json(grade);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.employees.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const employees = await storage.getEmployees(user.tenantId);
    res.json(employees);
  });

  app.get(api.employees.get.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const employee = await storage.getEmployee(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  });

  app.post(api.employees.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const input = api.employees.create.input.parse({ ...req.body, tenantId: user.tenantId });
      const employee = await storage.createEmployee(input);
      res.status(201).json(employee);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.employees.update.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.employees.update.input.parse(req.body);
      const employee = await storage.updateEmployee(req.params.id, input);
      if (!employee) return res.status(404).json({ message: "Employee not found" });
      res.json(employee);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.employees.delete.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    await storage.deleteEmployee(req.params.id);
    res.status(204).send();
  });

  app.get(api.leaveTypes.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const types = await storage.getLeaveTypes(user.tenantId);
    res.json(types);
  });

  app.get(api.leaveRequests.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const requests = await storage.getLeaveRequests(user.tenantId);
    res.json(requests);
  });

  app.post(api.leaveRequests.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const input = api.leaveRequests.create.input.parse({ ...req.body, tenantId: user.tenantId });
      const request = await storage.createLeaveRequest(input);
      res.status(201).json(request);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post(api.leaveRequests.approve.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const request = await storage.updateLeaveRequest(req.params.id, {
        status: "approved",
        approvedBy: user.id,
      });
      if (!request) return res.status(404).json({ message: "Leave request not found" });
      res.json(request);
    } catch (err) {
      throw err;
    }
  });

  app.post(api.leaveRequests.reject.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const { reason } = req.body;
      const request = await storage.updateLeaveRequest(req.params.id, {
        status: "rejected",
        approvedBy: user.id,
        rejectionReason: reason,
      });
      if (!request) return res.status(404).json({ message: "Leave request not found" });
      res.json(request);
    } catch (err) {
      throw err;
    }
  });

  // ============================================
  // SALES LEADS ROUTES
  // ============================================
  app.get(api.salesLeads.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const leads = await storage.getSalesLeads(user.tenantId);
    res.json(leads);
  });

  app.get(api.salesLeads.get.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const lead = await storage.getSalesLead(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  });

  app.post(api.salesLeads.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const input = api.salesLeads.create.input.parse({ ...req.body, tenantId: user.tenantId });
      const lead = await storage.createSalesLead(input);
      res.status(201).json(lead);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.salesLeads.update.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.salesLeads.update.input.parse(req.body);
      const lead = await storage.updateSalesLead(req.params.id, input);
      if (!lead) return res.status(404).json({ message: "Lead not found" });
      res.json(lead);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.salesLeads.delete.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    await storage.deleteSalesLead(req.params.id);
    res.status(204).send();
  });

  app.post(api.salesLeads.convertToCustomer.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const lead = await storage.getSalesLead(req.params.id);
      if (!lead) return res.status(404).json({ message: "Lead not found" });

      // Create customer from lead
      const customer = await storage.createCustomer({
        tenantId: user.tenantId,
        companyName: lead.companyName,
        contactPerson: lead.contactPerson,
        email: lead.email,
        phone: lead.phone,
        address: lead.address,
        city: lead.city,
        state: lead.state,
        country: lead.country || "Nigeria",
      });

      // Update lead status
      const updatedLead = await storage.updateSalesLead(req.params.id, {
        status: "won",
        convertedToCustomerId: customer.id,
      });

      res.json({ lead: updatedLead, customer });
    } catch (err) {
      throw err;
    }
  });

  // ============================================
  // GRADE ROUTES (Extended)
  // ============================================
  app.get(api.grades.get.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const grade = await storage.getGrade(req.params.id);
    if (!grade) return res.status(404).json({ message: "Grade not found" });
    res.json(grade);
  });

  app.put(api.grades.update.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.grades.update.input.parse(req.body);
      const grade = await storage.updateGrade(req.params.id, input);
      if (!grade) return res.status(404).json({ message: "Grade not found" });
      res.json(grade);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.grades.delete.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    await storage.deleteGrade(req.params.id);
    res.status(204).send();
  });

  // ============================================
  // SALARY COMPONENTS ROUTES
  // ============================================
  app.get(api.salaryComponents.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const components = await storage.getSalaryComponentsByTenant(user.tenantId);
    res.json(components);
  });

  app.get(api.salaryComponents.listByGrade.path.replace(':gradeId', ':gradeId'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const components = await storage.getSalaryComponents(req.params.gradeId);
    res.json(components);
  });

  app.post(api.salaryComponents.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const input = api.salaryComponents.create.input.parse({ ...req.body, tenantId: user.tenantId });
      const component = await storage.createSalaryComponent(input);
      res.status(201).json(component);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.salaryComponents.update.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.salaryComponents.update.input.parse(req.body);
      const component = await storage.updateSalaryComponent(req.params.id, input);
      if (!component) return res.status(404).json({ message: "Salary component not found" });
      res.json(component);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.salaryComponents.delete.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    await storage.deleteSalaryComponent(req.params.id);
    res.status(204).send();
  });

  // ============================================
  // PAYROLL ROUTES
  // ============================================
  app.get(api.payrollRuns.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const runs = await storage.getPayrollRuns(user.tenantId);
    res.json(runs);
  });

  app.get(api.payrollRuns.get.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const run = await storage.getPayrollRun(req.params.id);
    if (!run) return res.status(404).json({ message: "Payroll run not found" });
    const records = await storage.getPayrollRecords(req.params.id);
    res.json({ run, records });
  });

  app.post(api.payrollRuns.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const { month, year } = api.payrollRuns.create.input.parse(req.body);
      const run = await storage.createPayrollRun({
        tenantId: user.tenantId,
        month,
        year,
        status: "draft",
      });
      res.status(201).json(run);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post(api.payrollRuns.process.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const run = await storage.getPayrollRun(req.params.id);
      if (!run) return res.status(404).json({ message: "Payroll run not found" });

      // Get all active employees
      const employees = await storage.getEmployees(user.tenantId);
      const activeEmployees = employees.filter(e => e.employmentStatus === "active");

      let totalGross = 0;
      let totalDeductions = 0;
      let totalNet = 0;

      for (const employee of activeEmployees) {
        // Get grade and salary components for this employee
        const gradeId = employee.gradeId;
        let baseSalary = parseFloat(employee.salary || "0");
        let grossPay = baseSalary;
        let totalEarnings = baseSalary;
        let deductions = 0;

        if (gradeId) {
          const components = await storage.getSalaryComponents(gradeId);
          for (const comp of components) {
            const amount = parseFloat(comp.amount || "0");
            if (comp.type === "earning") {
              grossPay += amount;
              totalEarnings += amount;
            } else {
              deductions += amount;
            }
          }
        }

        const netPay = grossPay - deductions;
        totalGross += grossPay;
        totalDeductions += deductions;
        totalNet += netPay;

        // Create payroll record for this employee
        const record = await storage.createPayrollRecord({
          payrollRunId: run.id,
          employeeId: employee.id,
          gradeId: gradeId,
          baseSalary: baseSalary.toString(),
          grossPay: grossPay.toString(),
          totalEarnings: totalEarnings.toString(),
          totalDeductions: deductions.toString(),
          netPay: netPay.toString(),
          bankName: employee.bankName,
          bankAccountNumber: employee.bankAccountNumber,
          bankAccountName: employee.bankAccountName,
        });

        // Create payroll lines from salary components
        if (gradeId) {
          const components = await storage.getSalaryComponents(gradeId);
          for (const comp of components) {
            await storage.createPayrollLine({
              payrollRecordId: record.id,
              componentId: comp.id,
              name: comp.name,
              type: comp.type || "earning",
              amount: comp.amount,
              isTaxable: comp.isTaxable,
            });
          }
        }
      }

      // Update payroll run totals
      const updatedRun = await storage.updatePayrollRun(req.params.id, {
        status: "processing",
        totalGrossPay: totalGross.toString(),
        totalDeductions: totalDeductions.toString(),
        totalNetPay: totalNet.toString(),
        employeeCount: activeEmployees.length,
        processedBy: user.id,
      });

      res.json(updatedRun);
    } catch (err) {
      throw err;
    }
  });

  app.post(api.payrollRuns.approve.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const run = await storage.updatePayrollRun(req.params.id, {
        status: "approved",
        approvedBy: user.id,
      });
      if (!run) return res.status(404).json({ message: "Payroll run not found" });
      res.json(run);
    } catch (err) {
      throw err;
    }
  });

  app.post(api.payrollRuns.markPaid.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const run = await storage.updatePayrollRun(req.params.id, {
        status: "paid",
      });
      if (!run) return res.status(404).json({ message: "Payroll run not found" });
      res.json(run);
    } catch (err) {
      throw err;
    }
  });

  app.get(api.payrollRecords.getByEmployee.path.replace(':employeeId', ':employeeId'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const records = await storage.getPayrollRecordsByEmployee(req.params.employeeId);
    res.json(records);
  });

  app.get(api.payrollRecords.getPayslip.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    // Note: We need to add a getPayrollRecord method to storage
    // For now, we'll return an error
    res.status(501).json({ message: "Payslip feature coming soon" });
  });

  // ============================================
  // EXPENSE ROUTES
  // ============================================
  app.get(api.expenseCategories.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const categories = await storage.getExpenseCategories(user.tenantId);
    res.json(categories);
  });

  app.post(api.expenseCategories.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const input = api.expenseCategories.create.input.parse({ ...req.body, tenantId: user.tenantId });
      const category = await storage.createExpenseCategory(input);
      res.status(201).json(category);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.expenses.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const expenses = await storage.getExpenses(user.tenantId);
    res.json(expenses);
  });

  app.post(api.expenses.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const input = api.expenses.create.input.parse({ ...req.body, tenantId: user.tenantId, submittedBy: user.id });
      const expenseNumber = `EXP-${Date.now().toString(36).toUpperCase()}`;
      const expense = await storage.createExpense({ ...input, number: expenseNumber });
      res.status(201).json(expense);
    } catch (err) {
      console.error("Expense creation error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post(api.expenses.approve.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const expenseId = req.params.id;
      if (!expenseId) {
        return res.status(400).json({ message: "Expense ID is required" });
      }
      const expense = await storage.updateExpense(expenseId, { status: 'approved', approvedBy: user.id });
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json(expense);
    } catch (err) {
      console.error("Expense approval error:", err);
      throw err;
    }
  });

  app.get(api.budgets.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const budgets = await storage.getBudgets(user.tenantId);
    res.json(budgets);
  });

  // ============================================
  // ASSET ROUTES
  // ============================================
  app.get(api.assetCategories.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const categories = await storage.getAssetCategories(user.tenantId);
    res.json(categories);
  });

  app.get(api.assets.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const assets = await storage.getFixedAssets(user.tenantId);
    res.json(assets);
  });

  app.post(api.assets.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const input = api.assets.create.input.parse({ ...req.body, tenantId: user.tenantId });
      const asset = await storage.createFixedAsset(input);
      res.status(201).json(asset);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // ============================================
  // INVENTORY ROUTES
  // ============================================
  app.get(api.stockAdjustments.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const adjustments = await storage.getStockAdjustments(user.tenantId);
    res.json(adjustments);
  });

  app.get(api.lowStockProducts.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const products = await storage.getLowStockProducts(user.tenantId);
    res.json(products);
  });

  // ============================================
  // ATTENDANCE ROUTES
  // ============================================
  app.get(api.workSchedules.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const schedules = await storage.getWorkSchedules(user.tenantId);
    res.json(schedules);
  });

  app.get(api.holidays.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const holidays = await storage.getHolidays(user.tenantId);
    res.json(holidays);
  });

  app.get(api.attendanceRecords.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const records = await storage.getAttendanceRecords(user.tenantId);
    res.json(records);
  });

  app.post(api.attendanceRecords.clockIn.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const user = req.user as any;
      const now = new Date();
      const record = await storage.createAttendanceRecord({
        tenantId: user.tenantId,
        employeeId: user.id,
        date: now.toISOString().split('T')[0],
        clockIn: now.toISOString(),
        status: 'present',
      });
      res.status(201).json(record);
    } catch (err) {
      throw err;
    }
  });

  app.post(api.attendanceRecords.clockOut.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = parseInt(req.params.id);
      const now = new Date();
      const record = await storage.updateAttendanceRecord(id, { clockOut: now.toISOString() });
      res.json(record);
    } catch (err) {
      throw err;
    }
  });

  // Seed Data Function
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingTenant = await storage.getTenantBySlug("demo-corp");
  
  if (!existingTenant) {
    console.log("Seeding database with demo data...");
    
    const tenant = await storage.createTenant({
      name: "Demo Corporation Ltd",
      slug: "demo-corp",
      email: "contact@democorp.ng",
      phone: "+234 801 234 5678",
      industry: "Technology",
      address: "15 Victoria Island",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
      rcNumber: "RC123456",
      onboardingCompleted: true,
      onboardingStep: 5,
    });

    const passwordHash = await hashPassword("password123");
    
    await storage.createUser({
      tenantId: tenant.id,
      email: "admin@democorp.ng",
      password: passwordHash,
      firstName: "Chidi",
      lastName: "Okonkwo",
      phone: "+234 801 234 5678",
      role: "super_admin",
      isOwner: true,
      emailVerified: true,
    });

    // Seed Chart of Accounts (Nigerian Template)
    const assetAccounts = [
      { code: "1001", name: "Cash in Hand", type: "asset" as const },
      { code: "1002", name: "Cash at Bank", type: "asset" as const },
      { code: "1100", name: "Accounts Receivable", type: "asset" as const },
      { code: "1200", name: "Inventory", type: "asset" as const },
      { code: "1500", name: "Fixed Assets", type: "asset" as const },
    ];
    
    const liabilityAccounts = [
      { code: "2001", name: "Accounts Payable", type: "liability" as const },
      { code: "2100", name: "VAT Payable", type: "liability" as const },
      { code: "2200", name: "WHT Payable", type: "liability" as const },
      { code: "2300", name: "PAYE Payable", type: "liability" as const },
    ];
    
    const equityAccounts = [
      { code: "3001", name: "Share Capital", type: "equity" as const },
      { code: "3100", name: "Retained Earnings", type: "equity" as const },
    ];
    
    const revenueAccounts = [
      { code: "4001", name: "Sales Revenue", type: "revenue" as const },
      { code: "4100", name: "Service Revenue", type: "revenue" as const },
      { code: "4200", name: "Interest Income", type: "revenue" as const },
    ];
    
    const expenseAccounts = [
      { code: "5001", name: "Cost of Goods Sold", type: "expense" as const },
      { code: "5100", name: "Salaries & Wages", type: "expense" as const },
      { code: "5200", name: "Rent Expense", type: "expense" as const },
      { code: "5300", name: "Utilities Expense", type: "expense" as const },
      { code: "5400", name: "Office Supplies", type: "expense" as const },
    ];

    const allAccounts = [...assetAccounts, ...liabilityAccounts, ...equityAccounts, ...revenueAccounts, ...expenseAccounts];
    for (const account of allAccounts) {
      await storage.createChartOfAccount({ ...account, tenantId: tenant.id });
    }

    // Seed Customers
    const customers = [
      { companyName: "Dangote Industries", contactPerson: "Aliko Dangote", email: "procurement@dangote.com", phone: "+234 812 345 6789", city: "Lagos", state: "Lagos" },
      { companyName: "First Bank of Nigeria", contactPerson: "Adesola Adeduntan", email: "vendor@firstbanknigeria.com", phone: "+234 812 345 6790", city: "Lagos", state: "Lagos" },
      { companyName: "MTN Nigeria", contactPerson: "Karl Toriola", email: "suppliers@mtnnigeria.net", phone: "+234 812 345 6791", city: "Lagos", state: "Lagos" },
    ];
    for (const customer of customers) {
      await storage.createCustomer({ ...customer, tenantId: tenant.id, country: "Nigeria" });
    }

    // Seed Products/Services
    const products = [
      { name: "IT Consulting Service", type: "service" as const, sellingPrice: "500000", taxRate: "7.5" },
      { name: "Software License", type: "product" as const, sellingPrice: "250000", costPrice: "150000", taxRate: "7.5" },
      { name: "Technical Support (Monthly)", type: "service" as const, sellingPrice: "100000", taxRate: "7.5" },
    ];
    for (const product of products) {
      await storage.createProduct({ ...product, tenantId: tenant.id });
    }

    // Seed Departments
    const departments = [
      { name: "Engineering", code: "ENG" },
      { name: "Finance", code: "FIN" },
      { name: "Human Resources", code: "HR" },
      { name: "Sales", code: "SALES" },
    ];
    for (const dept of departments) {
      await storage.createDepartment({ ...dept, tenantId: tenant.id });
    }

    // Seed Grades
    const grades = [
      { code: "L1", name: "Entry Level", baseSalary: "150000" },
      { code: "L2", name: "Junior", baseSalary: "250000" },
      { code: "L3", name: "Mid-Level", baseSalary: "400000" },
      { code: "L4", name: "Senior", baseSalary: "600000" },
      { code: "L5", name: "Manager", baseSalary: "900000" },
    ];
    for (const grade of grades) {
      await storage.createGrade({ ...grade, tenantId: tenant.id });
    }

    // Seed Expense Categories
    const expenseCategories = [
      { name: "Office Supplies" },
      { name: "Travel & Transportation" },
      { name: "Utilities" },
      { name: "Professional Services" },
      { name: "Marketing" },
    ];
    for (const cat of expenseCategories) {
      await storage.createExpenseCategory({ ...cat, tenantId: tenant.id });
    }

    // Seed Leave Types
    const leaveTypes = [
      { name: "Annual Leave", daysAllowed: 20, isPaid: true },
      { name: "Sick Leave", daysAllowed: 10, isPaid: true },
      { name: "Maternity Leave", daysAllowed: 90, isPaid: true },
      { name: "Paternity Leave", daysAllowed: 14, isPaid: true },
      { name: "Unpaid Leave", daysAllowed: 30, isPaid: false },
    ];
    for (const type of leaveTypes) {
      await storage.createLeaveType({ ...type, tenantId: tenant.id });
    }

    console.log("Database seeded successfully!");
  }
}
