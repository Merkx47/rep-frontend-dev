import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/theme-provider";
import { Redirect, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sun, Moon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import qorpyLogo from "@assets/qorpy-logo.png";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().min(1, "Company name is required"),
  phone: z.string().optional(),
  industry: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const industries = [
  "Technology",
  "Manufacturing",
  "Retail",
  "Healthcare",
  "Finance",
  "Education",
  "Construction",
  "Agriculture",
  "Transportation",
  "Other",
];

// Feature slides for the right panel
const features = [
  {
    title: "All-in-One ERP Solution",
    description: "Manage accounting, HR, inventory, sales, and more from a single platform designed for Nigerian businesses.",
    illustration: "erp",
  },
  {
    title: "Real-time Analytics",
    description: "Get instant insights into your business performance with powerful dashboards and reports.",
    illustration: "analytics",
  },
  {
    title: "Secure & Compliant",
    description: "Bank-grade security with NRS e-invoicing compliance and data encryption.",
    illustration: "security",
  },
];

// Illustrated SVG components
const ERPIllustration = () => (
  <svg viewBox="0 0 300 200" className="w-full h-48">
    {/* Person at desk */}
    <ellipse cx="150" cy="180" rx="80" ry="10" fill="#E2E8F0" />
    {/* Desk */}
    <rect x="80" y="130" width="140" height="8" rx="2" fill="#64748B" />
    <rect x="90" y="138" width="10" height="40" fill="#64748B" />
    <rect x="200" y="138" width="10" height="40" fill="#64748B" />
    {/* Monitor */}
    <rect x="115" y="70" width="70" height="55" rx="4" fill="#1E293B" />
    <rect x="120" y="75" width="60" height="40" rx="2" fill="#3B82F6" />
    <rect x="145" y="125" width="10" height="8" fill="#64748B" />
    <rect x="135" y="130" width="30" height="4" rx="1" fill="#64748B" />
    {/* Screen content - dashboard */}
    <rect x="125" y="80" width="20" height="12" rx="1" fill="#22C55E" fillOpacity="0.8" />
    <rect x="150" y="80" width="25" height="12" rx="1" fill="#F59E0B" fillOpacity="0.8" />
    <rect x="125" y="97" width="50" height="3" rx="1" fill="white" fillOpacity="0.5" />
    <rect x="125" y="103" width="35" height="3" rx="1" fill="white" fillOpacity="0.5" />
    {/* Person */}
    <circle cx="150" cy="50" r="18" fill="#FBBF24" />
    <path d="M150 68 C130 68 120 90 120 110 L180 110 C180 90 170 68 150 68" fill="#3B82F6" />
    {/* Floating icons */}
    <circle cx="60" cy="60" r="20" fill="#DCFCE7" />
    <text x="60" y="66" textAnchor="middle" fontSize="16" fill="#22C55E">₦</text>
    <circle cx="240" cy="50" r="18" fill="#FEF3C7" />
    <rect x="232" y="44" width="16" height="12" rx="2" fill="#F59E0B" />
    <circle cx="70" cy="120" r="15" fill="#E0E7FF" />
    <path d="M65 120 L68 123 L75 116" stroke="#6366F1" strokeWidth="2" fill="none" />
    <circle cx="230" cy="110" r="16" fill="#FCE7F3" />
    <path d="M224 110 L230 104 L236 110 L230 116 Z" fill="#EC4899" />
  </svg>
);

const AnalyticsIllustration = () => (
  <svg viewBox="0 0 300 200" className="w-full h-48">
    {/* Background chart area */}
    <rect x="50" y="40" width="200" height="120" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
    {/* Bar chart */}
    <rect x="70" y="100" width="25" height="50" rx="3" fill="#3B82F6" />
    <rect x="105" y="80" width="25" height="70" rx="3" fill="#22C55E" />
    <rect x="140" y="60" width="25" height="90" rx="3" fill="#F59E0B" />
    <rect x="175" y="90" width="25" height="60" rx="3" fill="#8B5CF6" />
    <rect x="210" y="70" width="25" height="80" rx="3" fill="#EC4899" />
    {/* Trend line */}
    <path d="M80 95 L117 75 L152 55 L187 85 L222 65" stroke="#EF4444" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="80" cy="95" r="4" fill="#EF4444" />
    <circle cx="117" cy="75" r="4" fill="#EF4444" />
    <circle cx="152" cy="55" r="4" fill="#EF4444" />
    <circle cx="187" cy="85" r="4" fill="#EF4444" />
    <circle cx="222" cy="65" r="4" fill="#EF4444" />
    {/* Floating elements */}
    <rect x="30" cy="30" width="50" height="30" rx="6" fill="#DCFCE7" />
    <text x="55" y="50" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#22C55E">+45%</text>
    <rect x="220" y="20" width="60" height="25" rx="6" fill="#FEF3C7" />
    <text x="250" y="38" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#F59E0B">₦2.5M</text>
    {/* Person with magnifier */}
    <circle cx="260" cy="160" r="25" fill="#E0E7FF" />
    <circle cx="255" cy="150" r="12" stroke="#6366F1" strokeWidth="3" fill="none" />
    <line x1="263" y1="158" x2="273" y2="168" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const SecurityIllustration = () => (
  <svg viewBox="0 0 300 200" className="w-full h-48">
    {/* Shield */}
    <path d="M150 20 C150 20 200 30 200 30 L200 90 C200 130 150 160 150 160 C150 160 100 130 100 90 L100 30 C100 30 150 20 150 20" fill="#DCFCE7" stroke="#22C55E" strokeWidth="3" />
    <path d="M130 85 L145 100 L175 70" stroke="#22C55E" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* Lock */}
    <rect x="40" y="100" width="40" height="35" rx="4" fill="#3B82F6" />
    <path d="M50 100 L50 85 C50 75 70 75 70 85 L70 100" stroke="#3B82F6" strokeWidth="4" fill="none" />
    <circle cx="60" cy="118" r="5" fill="white" />
    {/* Key */}
    <circle cx="250" cy="80" r="15" stroke="#F59E0B" strokeWidth="3" fill="#FEF3C7" />
    <rect x="250" y="90" width="6" height="30" rx="2" fill="#F59E0B" />
    <rect x="256" y="105" width="10" height="4" rx="1" fill="#F59E0B" />
    <rect x="256" y="112" width="8" height="4" rx="1" fill="#F59E0B" />
    {/* Encrypted data lines */}
    <rect x="220" y="140" width="60" height="8" rx="2" fill="#E2E8F0" />
    <rect x="220" y="152" width="45" height="8" rx="2" fill="#E2E8F0" />
    <rect x="220" y="164" width="55" height="8" rx="2" fill="#E2E8F0" />
    {/* Stars/sparkles */}
    <path d="M80 50 L82 56 L88 56 L83 60 L85 66 L80 62 L75 66 L77 60 L72 56 L78 56 Z" fill="#FBBF24" />
    <path d="M230 40 L231 44 L235 44 L232 47 L233 51 L230 48 L227 51 L228 47 L225 44 L229 44 Z" fill="#FBBF24" />
  </svg>
);

export default function AuthPage() {
  const { user, loginMutation, signupMutation } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [currentSlide, setCurrentSlide] = useState(0);

  const getEffectiveTheme = () => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  };

  const toggleTheme = () => {
    const effectiveTheme = getEffectiveTheme();
    setTheme(effectiveTheme === "dark" ? "light" : "dark");
  };

  const isDark = getEffectiveTheme() === "dark";

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      companyName: "",
      phone: "",
      industry: "",
    },
  });

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (user) {
    return <Redirect to="/dashboard" />;
  }

  const onLogin = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onSignup = (data: SignupFormValues) => {
    signupMutation.mutate(data);
  };

  const renderIllustration = (type: string) => {
    switch (type) {
      case "erp":
        return <ERPIllustration />;
      case "analytics":
        return <AnalyticsIllustration />;
      case "security":
        return <SecurityIllustration />;
      default:
        return <ERPIllustration />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Dark Mode Toggle - Fixed Position */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>

      {/* Left Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12 bg-white dark:bg-slate-800">
        <div className="w-full max-w-md mx-auto">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-0.5">
            {activeTab === "login" ? "Sign in" : "Create account"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {activeTab === "login" ? "to access Qorpy ERP" : "Start your 14-day free trial"}
          </p>

          {activeTab === "login" ? (
            /* Login Form */
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email address or mobile number"
                          className="h-12 text-base border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                          data-testid="input-login-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          className="h-12 text-base border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                          data-testid="input-login-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700"
                  disabled={loginMutation.isPending}
                  data-testid="button-login-submit"
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Next"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            /* Signup Form */
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={signupForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="First name"
                            className="h-11 border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                            data-testid="input-signup-firstname"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Last name"
                            className="h-11 border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                            data-testid="input-signup-lastname"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email address"
                          className="h-11 border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                          data-testid="input-signup-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password (min. 8 characters)"
                          className="h-11 border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                          data-testid="input-signup-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Company name"
                          className="h-11 border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                          data-testid="input-signup-company"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Phone (optional)"
                          className="h-11 border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                          data-testid="input-signup-phone"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white" data-testid="select-signup-industry">
                            <SelectValue placeholder="Select industry (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700"
                  disabled={signupMutation.isPending}
                  data-testid="button-signup-submit"
                >
                  {signupMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Start Free Trial"
                  )}
                </Button>
              </form>
            </Form>
          )}

          {/* Social Login (for login only) */}
          {activeTab === "login" && (
            <div className="mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Sign in using</p>
              <div className="flex gap-3">
                <button className="w-11 h-11 rounded-full bg-black flex items-center justify-center hover:opacity-80 transition-opacity">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </button>
                <button className="w-11 h-11 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
                <button className="w-11 h-11 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-80 transition-opacity">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button className="w-11 h-11 rounded-full bg-[#0A66C2] flex items-center justify-center hover:opacity-80 transition-opacity">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
                <button className="w-11 h-11 rounded-full bg-black flex items-center justify-center hover:opacity-80 transition-opacity">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Toggle between login/signup */}
          <div className="mt-8 text-sm">
            {activeTab === "login" ? (
              <p className="text-gray-500 dark:text-gray-400">
                Don't have a Qorpy account?{" "}
                <button
                  onClick={() => setActiveTab("signup")}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  Sign up now
                </button>
              </p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Right Panel - Illustration & Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 items-center justify-center p-12">
        <div className="max-w-md text-center">
          {/* Illustration */}
          <div className="mb-8">
            {renderIllustration(features[currentSlide].illustration)}
          </div>

          {/* Feature Text */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {features[currentSlide].title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {features[currentSlide].description}
          </p>

          {/* Learn More Button */}
          <button className="px-6 py-2 text-blue-600 dark:text-blue-400 font-medium border border-blue-600 dark:border-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
            Learn more
          </button>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-6 bg-blue-600 dark:bg-blue-400"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-4 left-0 right-0 text-center text-xs text-gray-400 dark:text-gray-500">
        © 2026, Qorpy Technologies Ltd. All Rights Reserved.
      </div>
    </div>
  );
}
