import { useState } from "react";

export interface AppAccess {
  appId: string;
  appName: string;
  role: string;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "superAdmin" | "admin" | "member" | "viewer";
  isActive: boolean;
  lastLogin: Date | null;
  appAccess: AppAccess[];
}

// Mock data for demonstration
const initialUsers: AdminUser[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    role: "superAdmin",
    isActive: true,
    lastLogin: new Date("2025-01-08T10:30:00"),
    appAccess: [
      { appId: "hr", appName: "HR", role: "HR Admin" },
      { appId: "sales", appName: "Sales", role: "Sales Admin" },
      { appId: "accounting", appName: "Accounting", role: "Accountant" },
    ],
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@company.com",
    role: "admin",
    isActive: true,
    lastLogin: new Date("2025-01-07T14:20:00"),
    appAccess: [
      { appId: "hr", appName: "HR", role: "HR Manager" },
      { appId: "production", appName: "Production", role: "Production Manager" },
    ],
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@company.com",
    role: "member",
    isActive: true,
    lastLogin: new Date("2025-01-06T09:15:00"),
    appAccess: [
      { appId: "sales", appName: "Sales", role: "Sales Rep" },
      { appId: "hr", appName: "HR", role: "Employee" },
    ],
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@company.com",
    role: "admin",
    isActive: false,
    lastLogin: new Date("2024-12-15T16:45:00"),
    appAccess: [
      { appId: "accounting", appName: "Accounting", role: "Accountant" },
      { appId: "invoice", appName: "Invoice", role: "Invoice Manager" },
    ],
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@company.com",
    role: "viewer",
    isActive: true,
    lastLogin: null, // Never logged in - pending invite
    appAccess: [],
  },
];

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);

  const addUser = (userData: Omit<AdminUser, "id" | "lastLogin">) => {
    const newUser: AdminUser = {
      ...userData,
      id: `user-${Date.now()}`,
      lastLogin: null,
    };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<AdminUser>) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, ...updates } : user))
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const updateAppAccess = (userId: string, appAccess: AppAccess[]) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, appAccess } : user
      )
    );
  };

  const getUserById = (id: string) => {
    return users.find((user) => user.id === id);
  };

  const getUsersByApp = (appId: string) => {
    return users.filter((user) =>
      user.appAccess.some((access) => access.appId === appId)
    );
  };

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    updateAppAccess,
    getUserById,
    getUsersByApp,
  };
}
