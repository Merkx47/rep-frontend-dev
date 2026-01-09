import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Users, CreditCard, AlertTriangle, Scale, Ban, RefreshCw, Gavel } from "lucide-react";

export default function TermsPage() {
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
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully before using Qucoon ERP. By using our service, you agree to be bound by these terms.
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
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
              </div>
              <div className="pl-9 space-y-4 text-muted-foreground">
                <p>By accessing or using Qucoon ERP ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.</p>
                <p>These Terms apply to all users of the Service, including users who are administrators, employees, or other personnel of an organization ("Tenant") that has subscribed to the Service.</p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">2. Account Registration</h2>
              </div>
              <div className="pl-9 space-y-4 text-muted-foreground">
                <p>To use Qucoon ERP, you must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be at least 18 years old or have legal capacity to enter into contracts</li>
                  <li>Provide accurate, complete, and current registration information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Be responsible for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized access or security breach</li>
                </ul>
                <p>You may not use another person's account without permission. We reserve the right to suspend or terminate accounts that violate these Terms.</p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">3. Subscription & Payment</h2>
              </div>
              <div className="pl-9 space-y-4 text-muted-foreground">
                <p><strong>3.1 Subscription Plans:</strong> We offer various subscription plans with different features and pricing. Plan details are available on our pricing page.</p>
                <p><strong>3.2 Free Trial:</strong> New accounts may be eligible for a free trial period. At the end of the trial, you must subscribe to a paid plan to continue using the Service.</p>
                <p><strong>3.3 Payment:</strong> All fees are quoted in Nigerian Naira (NGN) and are due in advance. We accept bank transfers, card payments, and other payment methods as indicated.</p>
                <p><strong>3.4 Price Changes:</strong> We may change our prices with 30 days' notice. Price changes will take effect at the start of your next billing cycle.</p>
                <p><strong>3.5 Taxes:</strong> All prices exclude applicable taxes (VAT, WHT) which will be added where required by Nigerian law.</p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Scale className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">4. Acceptable Use</h2>
              </div>
              <div className="pl-9 space-y-4 text-muted-foreground">
                <p>You agree to use the Service only for lawful purposes. You shall not:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any applicable Nigerian laws or regulations</li>
                  <li>Infringe upon intellectual property rights of others</li>
                  <li>Upload malicious code, viruses, or harmful software</li>
                  <li>Attempt to gain unauthorized access to other accounts or systems</li>
                  <li>Use the Service for money laundering or fraudulent activities</li>
                  <li>Resell or redistribute the Service without authorization</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Use automated systems to access the Service without permission</li>
                </ul>
              </div>
            </div>

            {/* Section 5 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">5. Your Data</h2>
              </div>
              <div className="pl-9 space-y-4 text-muted-foreground">
                <p><strong>5.1 Ownership:</strong> You retain all rights to the data you enter into Qucoon ERP. We do not claim ownership of your business data.</p>
                <p><strong>5.2 License:</strong> You grant us a limited license to use your data solely to provide and improve the Service.</p>
                <p><strong>5.3 Data Accuracy:</strong> You are responsible for the accuracy and legality of the data you enter. We are not liable for errors in your data.</p>
                <p><strong>5.4 Data Export:</strong> You may export your data at any time using our export features. We will assist with data migration upon reasonable request.</p>
                <p><strong>5.5 Data Retention:</strong> Upon account termination, we will retain your data for 90 days before deletion, unless required by law to retain it longer.</p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">6. Limitation of Liability</h2>
              </div>
              <div className="pl-9 space-y-4 text-muted-foreground">
                <p>To the maximum extent permitted by Nigerian law:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The Service is provided "as is" without warranties of any kind</li>
                  <li>We do not guarantee uninterrupted or error-free service</li>
                  <li>We are not liable for indirect, incidental, or consequential damages</li>
                  <li>Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim</li>
                  <li>We are not liable for data loss due to your actions or third-party services</li>
                </ul>
                <p>These limitations do not affect your statutory rights as a consumer under Nigerian law.</p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Ban className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">7. Termination</h2>
              </div>
              <div className="pl-9 space-y-4 text-muted-foreground">
                <p><strong>7.1 By You:</strong> You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of the current billing period.</p>
                <p><strong>7.2 By Us:</strong> We may suspend or terminate your account if you:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate these Terms of Service</li>
                  <li>Fail to pay fees when due</li>
                  <li>Engage in fraudulent or illegal activities</li>
                  <li>Pose a security risk to the Service or other users</li>
                </ul>
                <p><strong>7.3 Effect of Termination:</strong> Upon termination, your right to use the Service ends immediately. We will retain your data for 90 days, after which it will be deleted.</p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">8. Changes to Terms</h2>
              </div>
              <div className="pl-9 space-y-4 text-muted-foreground">
                <p>We reserve the right to modify these Terms at any time. We will notify you of material changes by:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Posting the updated Terms on our website</li>
                  <li>Sending an email notification to your registered email address</li>
                  <li>Displaying a notice within the Service</li>
                </ul>
                <p>Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
              </div>
            </div>

            {/* Section 9 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Gavel className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">9. Governing Law & Disputes</h2>
              </div>
              <div className="pl-9 space-y-4 text-muted-foreground">
                <p><strong>9.1 Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.</p>
                <p><strong>9.2 Dispute Resolution:</strong> Any disputes arising from these Terms shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be submitted to arbitration in Lagos, Nigeria under the Arbitration and Conciliation Act.</p>
                <p><strong>9.3 Jurisdiction:</strong> The courts of Lagos, Nigeria shall have exclusive jurisdiction over any matters not subject to arbitration.</p>
              </div>
            </div>

            {/* Section 10 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">10. Contact Information</h2>
              <div className="text-muted-foreground">
                <p>For questions about these Terms, please contact us:</p>
                <div className="bg-muted/50 rounded-lg p-6 mt-4 space-y-2">
                  <p><strong>Qucoon Limited</strong></p>
                  <p>3rd Floor, Churchgate Tower, Victoria Island</p>
                  <p>Lagos, Nigeria</p>
                  <p>Email: legal@qucoon.com</p>
                  <p>Phone: +234 803 123 4567</p>
                </div>
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
            <Link href="/privacy">
              <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
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
