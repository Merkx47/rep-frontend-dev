import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Database, Bell, UserCheck, Globe, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-xl font-display font-bold text-primary cursor-pointer">Qucoon ERP</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how Qucoon ERP collects, uses, and protects your information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">Last updated: January 7, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12">
            {/* Section 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
              </div>
              <div className="pl-9 space-y-4 text-muted-foreground">
                <p>We collect information you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, phone number, company name, and password when you create an account.</li>
                  <li><strong>Business Data:</strong> Financial records, customer information, employee data, and other business information you enter into our platform.</li>
                  <li><strong>Payment Information:</strong> Billing address and payment method details processed through our secure payment providers.</li>
                  <li><strong>Communications:</strong> Information you provide when contacting our support team or participating in surveys.</li>
                  <li><strong>Usage Data:</strong> Information about how you interact with our services, including access times, pages viewed, and features used.</li>
                </ul>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
              </div>
              <div className="pl-9 space-y-4 text-muted-foreground">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, security alerts, and support messages</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
                  <li>Comply with Nigerian tax laws and financial regulations</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">3. Data Security</h2>
              </div>
              <div className="pl-9 space-y-4 text-muted-foreground">
                <p>We implement robust security measures to protect your data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256).</li>
                  <li><strong>Access Controls:</strong> Role-based access control ensures only authorized personnel can access sensitive data.</li>
                  <li><strong>Multi-Tenancy Isolation:</strong> Each organization's data is logically separated using row-level security.</li>
                  <li><strong>Regular Audits:</strong> We conduct regular security audits and penetration testing.</li>
                  <li><strong>Data Backups:</strong> Automated daily backups with point-in-time recovery capabilities.</li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">4. Data Sharing & Disclosure</h2>
              </div>
              <div className="pl-9 space-y-4 text-muted-foreground">
                <p>We do not sell your personal information. We may share information in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information.</li>
                  <li><strong>Service Providers:</strong> With vendors who assist in providing our services (payment processors, hosting providers).</li>
                  <li><strong>Legal Requirements:</strong> When required by Nigerian law or to comply with legal processes.</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
                </ul>
              </div>
            </div>

            {/* Section 5 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">5. Your Rights</h2>
              </div>
              <div className="pl-9 space-y-4 text-muted-foreground">
                <p>Under Nigerian Data Protection Regulation (NDPR), you have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data we hold.</li>
                  <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
                  <li><strong>Erasure:</strong> Request deletion of your data (subject to legal retention requirements).</li>
                  <li><strong>Data Portability:</strong> Receive your data in a structured, machine-readable format.</li>
                  <li><strong>Object:</strong> Object to processing of your data for certain purposes.</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent.</li>
                </ul>
              </div>
            </div>

            {/* Section 6 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">6. Data Retention</h2>
              </div>
              <div className="pl-9 space-y-4 text-muted-foreground">
                <p>We retain your information for as long as your account is active or as needed to provide services. We also retain data as necessary to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Comply with Nigerian tax and accounting regulations (minimum 6 years for financial records)</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Meet legal and regulatory requirements</li>
                </ul>
                <p>When you close your account, we will delete or anonymize your data within 90 days, except where retention is required by law.</p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">7. Contact Us</h2>
              </div>
              <div className="pl-9 space-y-4 text-muted-foreground">
                <p>If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:</p>
                <div className="bg-muted/50 rounded-lg p-6 space-y-2">
                  <p><strong>Qucoon Limited</strong></p>
                  <p>Data Protection Officer</p>
                  <p>3rd Floor, Churchgate Tower, Victoria Island</p>
                  <p>Lagos, Nigeria</p>
                  <p>Email: privacy@qucoon.com</p>
                  <p>Phone: +234 803 123 4567</p>
                </div>
              </div>
            </div>

            {/* Section 8 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Changes to This Policy</h2>
              <div className="text-muted-foreground">
                <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Qucoon Limited. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link href="/terms">
              <span className="hover:text-primary cursor-pointer">Terms of Service</span>
            </Link>
            <span>|</span>
            <Link href="/contact">
              <span className="hover:text-primary cursor-pointer">Contact Us</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
