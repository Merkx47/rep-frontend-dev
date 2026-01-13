import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sun, Moon, Shield, Lock, Users, BarChart3 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Feature slides for the right panel
const features = [
  {
    title: "Complete Platform Control",
    description: "Manage tenants, subscriptions, and apps from a centralized dashboard designed for platform administrators.",
    illustration: "control",
  },
  {
    title: "Real-time Analytics",
    description: "Monitor MRR, tenant growth, and platform health with comprehensive analytics and reports.",
    illustration: "analytics",
  },
  {
    title: "Secure Administration",
    description: "Role-based access control with audit logs and enterprise-grade security for platform management.",
    illustration: "security",
  },
];

// Illustrated SVG components
const ControlIllustration = () => (
  <svg viewBox="0 0 300 200" className="w-full h-48">
    {/* Central control panel */}
    <rect x="75" y="50" width="150" height="100" rx="8" fill="#1E1B4B" />
    <rect x="85" y="60" width="130" height="80" rx="4" fill="#312E81" />
    {/* Screen content - grid of controls */}
    <rect x="95" y="70" width="35" height="25" rx="3" fill="#6366F1" />
    <rect x="138" y="70" width="35" height="25" rx="3" fill="#8B5CF6" />
    <rect x="95" y="102" width="35" height="25" rx="3" fill="#A78BFA" />
    <rect x="138" y="102" width="35" height="25" rx="3" fill="#C4B5FD" />
    {/* Status indicators */}
    <circle cx="190" cy="82" r="8" fill="#22C55E" />
    <circle cx="190" cy="114" r="8" fill="#F59E0B" />
    {/* Floating tenant cards */}
    <rect x="30" y="70" width="35" height="45" rx="4" fill="#DCFCE7" />
    <circle cx="47" cy="82" r="8" fill="#22C55E" />
    <rect x="37" y="95" width="21" height="3" rx="1" fill="#22C55E" />
    <rect x="37" y="102" width="15" height="3" rx="1" fill="#86EFAC" />
    <rect x="235" y="60" width="35" height="45" rx="4" fill="#FEF3C7" />
    <circle cx="252" cy="72" r="8" fill="#F59E0B" />
    <rect x="242" y="85" width="21" height="3" rx="1" fill="#F59E0B" />
    <rect x="242" y="92" width="15" height="3" rx="1" fill="#FCD34D" />
    <rect x="235" y="115" width="35" height="45" rx="4" fill="#E0E7FF" />
    <circle cx="252" cy="127" r="8" fill="#6366F1" />
    <rect x="242" y="140" width="21" height="3" rx="1" fill="#6366F1" />
    <rect x="242" y="147" width="15" height="3" rx="1" fill="#A5B4FC" />
    {/* Connection lines */}
    <path d="M65 92 L85 92" stroke="#6366F1" strokeWidth="2" strokeDasharray="4 2" />
    <path d="M225 82 L235 82" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 2" />
    <path d="M225 137 L235 137" stroke="#6366F1" strokeWidth="2" strokeDasharray="4 2" />
  </svg>
);

const AnalyticsIllustration = () => (
  <svg viewBox="0 0 300 200" className="w-full h-48">
    {/* Background chart area */}
    <rect x="50" y="40" width="200" height="120" rx="8" fill="#1E1B4B" />
    {/* Bar chart */}
    <rect x="70" y="100" width="25" height="50" rx="3" fill="#6366F1" />
    <rect x="105" y="80" width="25" height="70" rx="3" fill="#8B5CF6" />
    <rect x="140" y="60" width="25" height="90" rx="3" fill="#A78BFA" />
    <rect x="175" y="90" width="25" height="60" rx="3" fill="#C4B5FD" />
    <rect x="210" y="70" width="25" height="80" rx="3" fill="#DDD6FE" />
    {/* Trend line */}
    <path d="M80 95 L117 75 L152 55 L187 85 L222 65" stroke="#22C55E" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="80" cy="95" r="4" fill="#22C55E" />
    <circle cx="117" cy="75" r="4" fill="#22C55E" />
    <circle cx="152" cy="55" r="4" fill="#22C55E" />
    <circle cx="187" cy="85" r="4" fill="#22C55E" />
    <circle cx="222" cy="65" r="4" fill="#22C55E" />
    {/* Floating elements */}
    <rect x="30" y="30" width="50" height="30" rx="6" fill="#DCFCE7" />
    <text x="55" y="50" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#22C55E">+127%</text>
    <rect x="220" y="20" width="60" height="25" rx="6" fill="#E0E7FF" />
    <text x="250" y="38" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6366F1">$45.2K</text>
    {/* MRR indicator */}
    <rect x="30" y="140" width="70" height="35" rx="6" fill="#312E81" />
    <text x="65" y="155" textAnchor="middle" fontSize="8" fill="#A5B4FC">MRR</text>
    <text x="65" y="168" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">$125K</text>
  </svg>
);

const SecurityIllustration = () => (
  <svg viewBox="0 0 300 200" className="w-full h-48">
    {/* Shield */}
    <path d="M150 20 C150 20 200 30 200 30 L200 90 C200 130 150 160 150 160 C150 160 100 130 100 90 L100 30 C100 30 150 20 150 20" fill="#312E81" stroke="#6366F1" strokeWidth="3" />
    <path d="M130 85 L145 100 L175 70" stroke="#22C55E" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* Admin badge */}
    <rect x="40" y="90" width="45" height="55" rx="4" fill="#1E1B4B" />
    <circle cx="62" cy="108" r="12" fill="#6366F1" />
    <rect x="50" y="125" width="25" height="4" rx="1" fill="#A5B4FC" />
    <rect x="53" y="133" width="18" height="4" rx="1" fill="#C4B5FD" />
    {/* Key */}
    <circle cx="250" cy="80" r="15" stroke="#F59E0B" strokeWidth="3" fill="#FEF3C7" />
    <rect x="250" y="90" width="6" height="30" rx="2" fill="#F59E0B" />
    <rect x="256" y="105" width="10" height="4" rx="1" fill="#F59E0B" />
    <rect x="256" y="112" width="8" height="4" rx="1" fill="#F59E0B" />
    {/* Role badges */}
    <rect x="210" y="140" width="70" height="20" rx="10" fill="#DCFCE7" />
    <text x="245" y="154" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#22C55E">Super Admin</text>
    <rect x="210" y="165" width="70" height="20" rx="10" fill="#FEF3C7" />
    <text x="245" y="179" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#F59E0B">Admin</text>
    {/* Stars/sparkles */}
    <path d="M80 50 L82 56 L88 56 L83 60 L85 66 L80 62 L75 66 L77 60 L72 56 L78 56 Z" fill="#A78BFA" />
    <path d="M230 40 L231 44 L235 44 L232 47 L233 51 L230 48 L227 51 L228 47 L225 44 L229 44 Z" fill="#A78BFA" />
  </svg>
);

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const onLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    // Mock login - accept any credentials
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store admin session in localStorage
    localStorage.setItem("adminAuth", JSON.stringify({
      email: data.email,
      role: "super_admin",
      name: "Platform Admin",
    }));

    toast({
      title: "Welcome back!",
      description: "Successfully signed in to Admin Portal.",
    });

    setIsLoading(false);
    setLocation("/platform/dashboard");
  };

  const renderIllustration = (type: string) => {
    switch (type) {
      case "control":
        return <ControlIllustration />;
      case "analytics":
        return <AnalyticsIllustration />;
      case "security":
        return <SecurityIllustration />;
      default:
        return <ControlIllustration />;
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
          {/* Admin Badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">ADMIN PORTAL</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Platform Management</p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-0.5">
            Welcome back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Sign in to access the admin dashboard
          </p>

          {/* Login Form */}
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Admin email address"
                        className="h-12 text-base border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:border-indigo-500 focus:ring-indigo-500"
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
                        className="h-12 text-base border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:border-indigo-500 focus:ring-indigo-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  Remember me
                </label>
                <button type="button" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Sign in to Admin Portal
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Quick Stats Preview */}
          <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">Quick Access</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50">
                <Users className="w-5 h-5 mx-auto text-indigo-600 dark:text-indigo-400 mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-300">Tenants</p>
              </div>
              <div className="text-center p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50">
                <BarChart3 className="w-5 h-5 mx-auto text-purple-600 dark:text-purple-400 mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-300">Analytics</p>
              </div>
              <div className="text-center p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50">
                <Shield className="w-5 h-5 mx-auto text-green-600 dark:text-green-400 mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-300">Security</p>
              </div>
            </div>
          </div>

          {/* Platform Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Platform administration access only
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Illustration & Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #6366F1 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, #8B5CF6 0%, transparent 50%)`,
          }} />
        </div>

        <div className="max-w-md text-center relative z-10">
          {/* Illustration */}
          <div className="mb-8">
            {renderIllustration(features[currentSlide].illustration)}
          </div>

          {/* Feature Text */}
          <h2 className="text-xl font-semibold text-white mb-3">
            {features[currentSlide].title}
          </h2>
          <p className="text-indigo-200 mb-8">
            {features[currentSlide].description}
          </p>

          {/* Learn More Button */}
          <button className="px-6 py-2 text-white font-medium border border-indigo-400 rounded-full hover:bg-indigo-800/50 transition-colors">
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
                    ? "w-6 bg-indigo-400"
                    : "bg-indigo-700 hover:bg-indigo-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-4 left-0 right-0 text-center text-xs text-gray-400 dark:text-gray-500">
        © 2026, Qorpy Technologies Ltd. Admin Portal v1.0
      </div>
    </div>
  );
}
