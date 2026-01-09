import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import qorpyLogo from "@assets/qorpy-logo.png";
import {
  Check,
  ChevronRight,
  BarChart3,
  Users,
  FileText,
  Building2,
  Clock,
  Package,
  Laptop,
  Shield,
  Zap,
  Globe,
  Star,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Receipt,
  Sun,
  Moon
} from "lucide-react";
import { useState } from "react";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Get the actual theme being applied (considering system preference)
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center">
          {/* Logo removed */}
        </Link>

        <nav className="hidden md:flex items-center gap-6 flex-wrap">
          <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-features">
            Features
          </Link>
                    <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-about">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contact">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3 flex-wrap">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Link href="/auth">
            <Button variant="ghost" data-testid="button-login">Log in</Button>
          </Link>
          <Link href="/auth">
            <Button data-testid="button-signup">Start Free Trial</Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle-mobile"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <nav className="flex flex-col gap-4">
            <Link href="/features" className="text-sm font-medium" data-testid="link-features-mobile">Features</Link>
                        <Link href="/about" className="text-sm font-medium" data-testid="link-about-mobile">About</Link>
            <Link href="/contact" className="text-sm font-medium" data-testid="link-contact-mobile">Contact</Link>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Link href="/auth">
                <Button variant="outline" className="w-full" data-testid="button-login-mobile">Log in</Button>
              </Link>
              <Link href="/auth">
                <Button className="w-full" data-testid="button-signup-mobile">Start Free Trial</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6" data-testid="badge-announcement">
            All-in-One Business Solution
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6" data-testid="text-hero-title">
            Enterprise Resource Planning Made Simple
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Manage accounting, sales, HR, inventory, and more in one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link href="/auth">
              <Button size="lg" className="gap-2" data-testid="button-cta-primary">
                Start 14-Day Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" data-testid="button-cta-demo">
                Request Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      title: "Accounting & Finance",
      description: "Chart of Accounts, General Ledger, Financial Reports (P&L, Balance Sheet, Cash Flow, Trial Balance)"
    },
    {
      icon: FileText,
      title: "Sales & Invoicing",
      description: "Customer management, professional invoicing, payment tracking, and quotations"
    },
    {
      icon: Users,
      title: "HR Management",
      description: "Employee records, departments, grades, leave management, and payroll processing"
    },
    {
      icon: Receipt,
      title: "Expense Management",
      description: "Track expenses, manage budgets, approval workflows, and variance analysis"
    },
    {
      icon: Building2,
      title: "Asset Management",
      description: "Fixed asset register, depreciation schedules, assignments, and maintenance tracking"
    },
    {
      icon: Package,
      title: "Inventory Control",
      description: "Stock tracking, adjustments, low-stock alerts, and product management"
    },
    {
      icon: Clock,
      title: "Time & Attendance",
      description: "Clock in/out, work schedules, attendance reports, and overtime tracking"
    },
    {
      icon: Laptop,
      title: "Multi-Tenant SaaS",
      description: "Secure data isolation, role-based access control, and subscription management"
    }
  ];

  return (
    <section className="py-20 bg-muted/30" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-features-title">
            Everything Your Business Needs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive suite of modules designed to streamline operations and boost productivity.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Qorpy ERP transformed how we manage our finances. Everything is now in one place and our team is more productive.",
      author: "Adaobi Okonkwo",
      role: "CFO, TechVentures Nigeria",
      rating: 5
    },
    {
      quote: "The HR and payroll module is incredibly easy to use. Our team can now focus on growing the business.",
      author: "Emeka Nwachukwu",
      role: "CEO, Greenfield Manufacturing",
      rating: 5
    },
    {
      quote: "Finally, an ERP that understands Nigerian business needs. The invoicing and expense tracking is a game-changer.",
      author: "Funke Adeyemi",
      role: "Operations Director, Lagos Retail Co",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-testimonials-title">
            Trusted by Nigerian Businesses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our customers have to say about Qorpy ERP.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} data-testid={`card-testimonial-${index}`}>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: "Is Qorpy ERP suitable for Nigerian businesses?",
      answer: "Yes, Qorpy ERP is built specifically for Nigerian businesses. It supports Naira currency, local business workflows, and is designed to handle the unique needs of companies operating in Nigeria."
    },
    {
      question: "Can I migrate my existing data to Qorpy ERP?",
      answer: "Absolutely! We provide data migration support for all plans. Our team will help you import your existing customers, products, employees, and financial data from your current system."
    },
    {
      question: "Is my data secure?",
      answer: "Security is our top priority. We use bank-grade encryption, secure data centers, regular backups, and role-based access control to ensure your business data is always protected."
    },
    {
      question: "What happens after my free trial ends?",
      answer: "After your 14-day free trial, you can choose to subscribe to any of our plans. Your data will be preserved, and you can continue where you left off. No pressure - you can also export your data if you decide not to continue."
    },
    {
      question: "Do you offer training and support?",
      answer: "Yes! All plans include email support. Professional and Enterprise plans include priority support and dedicated training sessions to help your team get up to speed quickly."
    },
    {
      question: "Can I customize the system for my industry?",
      answer: "Qorpy ERP is designed to be flexible. You can customize chart of accounts, expense categories, departments, and more to match your specific industry requirements."
    }
  ];

  return (
    <section className="py-20" id="faq">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-faq-title">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card 
              key={index} 
              className="hover-elevate cursor-pointer" 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              data-testid={`card-faq-${index}`}
            >
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-medium">{faq.question}</h3>
                  <ChevronDown 
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
                {openIndex === index && (
                  <p className="mt-4 text-muted-foreground text-sm">{faq.answer}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-cta-title">
          Ready to Transform Your Business?
        </h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of Nigerian businesses already using Qorpy ERP to streamline their operations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
          <Link href="/auth">
            <Button size="lg" variant="secondary" className="gap-2" data-testid="button-cta-footer-signup">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" data-testid="button-cta-footer-demo">
              Schedule Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            {/* Logo removed */}
            <p className="text-sm text-sidebar-foreground/70">
              Enterprise Resource Planning built for Nigerian businesses.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link href="/features" className="hover:text-sidebar-foreground">Features</Link></li>
              <li><Link href="/demo" className="hover:text-sidebar-foreground">Request Demo</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link href="/about" className="hover:text-sidebar-foreground">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-sidebar-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link href="/privacy" className="hover:text-sidebar-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-sidebar-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-sidebar-border pt-8 text-center">
          <p className="text-sm text-sidebar-foreground/70">
            2026 Qorpy Technologies Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
                <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
