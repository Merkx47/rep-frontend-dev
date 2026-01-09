# Qorpy ERP - Multi-Tenant Enterprise Resource Planning System

## Overview

Qorpy ERP is a modern, multi-tenant SaaS Enterprise Resource Planning system designed for Nigerian businesses. The application provides comprehensive business management capabilities including accounting, sales, HR & payroll, expenses, assets, inventory, and attendance tracking. Built with a focus on simplicity and usability, the platform supports multiple organizations with complete data isolation using a shared database architecture with tenant-level separation.

**Target Market:** Nigerian SMEs and Enterprises  
**Base Currency:** Nigerian Naira (NGN)  
**Tax Context:** Nigerian tax regulations (VAT 7.5%, WHT, PAYE)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework:** React with TypeScript, using Vite as the build tool
- **Routing:** Wouter for lightweight client-side routing
- **State Management:** TanStack React Query for server state management
- **UI Components:** shadcn/ui component library built on Radix UI primitives
- **Styling:** Tailwind CSS with custom CSS variables for theming (light/dark mode support)
- **Charts:** Recharts for dashboard analytics and data visualization
- **Forms:** React Hook Form with Zod validation using @hookform/resolvers

### Backend Architecture
- **Runtime:** Node.js with Express.js
- **Language:** TypeScript with ESM modules
- **API Design:** RESTful API with typed route definitions in shared/routes.ts
- **Authentication:** Passport.js with local strategy, session-based auth using express-session
- **Password Security:** scrypt-based password hashing with random salts

### Multi-Tenancy Model
- **Strategy:** Shared database with `tenant_id` column on every table
- **Isolation:** Each organization's data is filtered by tenant ID at the application level
- **User Association:** Users belong to a single tenant and can only access their tenant's data

### Database Layer
- **ORM:** Drizzle ORM with PostgreSQL dialect
- **Schema Location:** shared/schema.ts contains all table definitions
- **Migrations:** Drizzle Kit for schema migrations (output to ./migrations)
- **Connection:** Node-postgres (pg) pool for database connections

### Project Structure
```
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/   # UI components (shadcn/ui in ui/, custom in root)
│   │   ├── hooks/        # Custom React hooks for data fetching
│   │   ├── pages/        # Page components mapped to routes
│   │   └── lib/          # Utilities (queryClient, utils)
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Data access layer
│   └── db.ts         # Database connection
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route definitions with Zod schemas
```

### Build System
- **Development:** tsx for running TypeScript directly
- **Production Build:** Custom build script using esbuild for server and Vite for client
- **Output:** dist/index.cjs for server, dist/public for static frontend assets

### Authentication Flow
- Cookie-based sessions with `credentials: "include"` on all fetch requests
- Sessions stored server-side (configurable for PostgreSQL via connect-pg-simple)
- User context includes both user data and tenant information

### Key Design Patterns
- **Shared Types:** Schema types generated from Drizzle tables using drizzle-zod
- **API Hooks:** Custom hooks in client/src/hooks/ wrap React Query mutations and queries
- **Form Validation:** Zod schemas shared between client validation and server validation
- **Currency Handling:** All monetary values stored as numeric/decimal, formatted as NGN on display

## External Dependencies

### Database
- **PostgreSQL:** Primary data store, connection via DATABASE_URL environment variable
- **connect-pg-simple:** Session storage in PostgreSQL (optional)

### Authentication & Security
- **passport:** Authentication middleware
- **passport-local:** Username/password authentication strategy
- **express-session:** Session management
- **crypto (Node.js built-in):** Password hashing with scrypt

### Core Libraries
- **drizzle-orm:** Type-safe ORM for PostgreSQL
- **drizzle-zod:** Schema validation integration between Drizzle and Zod
- **zod:** Runtime type validation for API requests and forms
- **express:** HTTP server framework

### Frontend Libraries
- **@tanstack/react-query:** Server state management and caching
- **@radix-ui/*:** Accessible UI primitive components
- **recharts:** Charting library for dashboard visualizations
- **date-fns:** Date formatting and manipulation
- **lucide-react:** Icon library
- **wouter:** Lightweight routing library

### Development Tools
- **vite:** Frontend build tool and dev server
- **tsx:** TypeScript execution for development
- **esbuild:** Production bundling for server code
- **tailwindcss:** Utility-first CSS framework

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SESSION_SECRET`: Secret key for session encryption (defaults to fallback in dev)

## Recent Changes

### January 2026 - API Integration for Modules
- **Expenses Module**: Fully integrated with backend API
  - Created `use-expenses.ts` hook with `useExpenses`, `useExpenseCategories`, `useCreateExpense`, `useApproveExpense`
  - Added POST /api/expenses route with server-side expense number generation
  - Added POST /api/expenses/:id/approve route for expense approval workflow
  - Expense IDs are UUIDs (not integers)
  
- **Assets Module**: Added API hooks and create route
  - Created `use-assets.ts` hook with `useAssets`, `useCreateAsset`, `useUpdateAsset`
  - Added POST /api/assets route

- **Inventory Module**: Added API hooks
  - Created `use-inventory.ts` hook with `useProducts`, `useCreateProduct`, `useUpdateProduct`

- **Attendance Module**: Added clock-in/out functionality
  - Created `use-attendance.ts` hook with `useAttendance`, `useClockIn`, `useClockOut`
  - Added POST /api/attendance/clock-in and POST /api/attendance/clock-out routes

### Demo Credentials
- Email: admin@democorp.ng
- Password: password123
- Auth page: /auth