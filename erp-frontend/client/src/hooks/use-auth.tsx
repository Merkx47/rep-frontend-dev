import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { User, Tenant } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  tenant: Tenant | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: ReturnType<typeof useMutation<{ user: User; tenant: Tenant }, Error, { email: string; password: string }>>;
  signupMutation: ReturnType<typeof useMutation<{ user: User; tenant: Tenant }, Error, SignupData>>;
  logoutMutation: ReturnType<typeof useMutation<void, Error, void>>;
};

type SignupData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phone?: string;
  industry?: string;
};

const AUTH_STORAGE_KEY = "qorpy_auth_user";

// Mock user for demo purposes
const createMockUser = (email: string, firstName: string, lastName: string): User => ({
  id: "demo-user-001",
  email,
  firstName,
  lastName,
  password: "",
  role: "admin",
  tenantId: "demo-tenant-001",
  phone: null,
  avatarUrl: null,
  isOwner: true,
  isActive: true,
  emailVerified: true,
  emailVerifiedAt: new Date(),
  lastLogin: new Date(),
  passwordResetToken: null,
  passwordResetExpires: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createMockTenant = (companyName: string): Tenant => ({
  id: "demo-tenant-001",
  name: companyName,
  slug: companyName.toLowerCase().replace(/\s+/g, "-"),
  subdomain: null,
  logoUrl: null,
  industry: null,
  companySize: null,
  address: null,
  city: null,
  state: null,
  country: "Nigeria",
  phone: null,
  email: "demo@company.com",
  website: null,
  taxId: null,
  rcNumber: null,
  settings: null,
  onboardingCompleted: true,
  onboardingStep: 5,
  isActive: true,
  suspendedAt: null,
  suspensionReason: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setTenant(parsed.tenant);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // For demo, accept any email/password
      const mockUser = createMockUser(credentials.email, "Demo", "User");
      const mockTenant = createMockTenant("Demo Company");

      return { user: mockUser, tenant: mockTenant };
    },
    onSuccess: (data) => {
      setUser(data.user);
      setTenant(data.tenant);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
      toast({
        title: "Welcome back!",
        description: `Logged in as ${data.user.firstName} ${data.user.lastName}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUser = createMockUser(data.email, data.firstName, data.lastName);
      const mockTenant = createMockTenant(data.companyName);

      return { user: mockUser, tenant: mockTenant };
    },
    onSuccess: (data) => {
      setUser(data.user);
      setTenant(data.tenant);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
      toast({
        title: "Account created!",
        description: `Welcome to Qorpy ERP, ${data.user.firstName}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 200));
    },
    onSuccess: () => {
      setUser(null);
      setTenant(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      // Redirect to landing page
      window.location.href = "/";
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        isLoading,
        error: null,
        loginMutation,
        signupMutation,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
