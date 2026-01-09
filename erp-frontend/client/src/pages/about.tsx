import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import qorpyLogo from "@assets/qorpy-logo.png";
import { 
  Target, 
  Users, 
  Lightbulb, 
  Award,
  ArrowRight,
  Menu,
  X,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center">
          {/* Logo removed */}
        </Link>

        <nav className="hidden md:flex items-center gap-6 flex-wrap">
          <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-features">
            Features
          </Link>
          <Link href="/about" className="text-sm font-medium text-foreground" data-testid="link-about">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contact">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3 flex-wrap">
          <Link href="/auth">
            <Button variant="ghost" data-testid="button-login">Log in</Button>
          </Link>
          <Link href="/auth">
            <Button data-testid="button-signup">Start Free Trial</Button>
          </Link>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <nav className="flex flex-col gap-4">
            <Link href="/features" className="text-sm font-medium">Features</Link>
            <Link href="/about" className="text-sm font-medium">About</Link>
            <Link href="/contact" className="text-sm font-medium">Contact</Link>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Link href="/auth">
                <Button variant="outline" className="w-full">Log in</Button>
              </Link>
              <Link href="/auth">
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              {/* Logo removed */}
            </div>
            <p className="text-sm text-sidebar-foreground/70">
              Enterprise Resource Planning built for Nigerian businesses.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link href="/features" className="hover:text-sidebar-foreground transition-colors">Features</Link></li>
              <li><Link href="/about" className="hover:text-sidebar-foreground transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-sidebar-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link href="/about" className="hover:text-sidebar-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-sidebar-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link href="/privacy" className="hover:text-sidebar-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-sidebar-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-sidebar-foreground/10 pt-8 text-center text-sm text-sidebar-foreground/50">
          <p>&copy; {new Date().getFullYear()} Qorpy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "We're on a mission to empower Nigerian businesses with world-class ERP solutions that are affordable, accessible, and tailored to local needs."
  },
  {
    icon: Users,
    title: "Customer-Centric",
    description: "Every feature we build starts with understanding our customers' challenges. Your success is our success."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We continuously innovate to bring you the latest in business technology, from AI-powered insights to seamless integrations."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in everything we do, from code quality to customer support. No shortcuts, no compromises."
  }
];

const milestones = [
  { year: "2020", title: "Founded", description: "Qorpy was founded with a vision to transform how Nigerian businesses operate." },
  { year: "2021", title: "First 100 Customers", description: "Reached our first 100 paying customers across Lagos and Abuja." },
  { year: "2022", title: "Payroll Launch", description: "Launched PAYE-compliant payroll module, serving over 500 businesses." },
  { year: "2023", title: "1000+ Businesses", description: "Crossed 1,000 active businesses using Qorpy for daily operations." },
  { year: "2024", title: "Multi-Industry Expansion", description: "Expanded to serve manufacturing, retail, healthcare, and professional services." },
  { year: "2025", title: "Pan-African Vision", description: "Expanding beyond Nigeria to serve businesses across Africa." }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 lg:py-28 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" data-testid="text-about-title">
                About Qorpy
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground" data-testid="text-about-subtitle">
                We're building the future of business management software for Nigerian enterprises. 
                Our mission is to help businesses streamline operations, make better decisions, and grow faster.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Qorpy was born from a simple observation: Nigerian businesses deserve world-class 
                    enterprise software that understands their unique challenges and regulatory requirements.
                  </p>
                  <p>
                    Founded by a team of Nigerian entrepreneurs and engineers, we set out to build an 
                    ERP solution that combines global best practices with deep local expertise. From VAT 
                    and WHT compliance to PAYE calculations, every feature is designed with Nigerian 
                    businesses in mind.
                  </p>
                  <p>
                    Today, we serve hundreds of businesses across Nigeria, from startups to established 
                    enterprises, helping them manage their operations efficiently and scale with confidence.
                  </p>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-8">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                    <div className="text-sm text-muted-foreground">Active Businesses</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
                    <div className="text-sm text-muted-foreground">Invoices Processed</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These core values guide everything we do at Qorpy
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Key milestones in our mission to transform Nigerian business operations
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {milestone.year.slice(-2)}
                      </div>
                      {index < milestones.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="pb-6">
                      <div className="text-sm text-muted-foreground mb-1">{milestone.year}</div>
                      <h3 className="font-semibold mb-1">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of Nigerian businesses already using Qorpy to streamline their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <Link href="/auth">
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
