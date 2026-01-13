import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Check,
  X,
  Star,
  Sparkles,
  Users,
  AppWindow,
  Calendar,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";

// Subscription plans
const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small businesses",
    monthlyPrice: 15000,
    yearlyPrice: 150000,
    maxUsers: 5,
    maxApps: 3,
    features: [
      { name: "Up to 5 users", included: true },
      { name: "3 apps included", included: true },
      { name: "Basic reporting", included: true },
      { name: "Email support", included: true },
      { name: "API access", included: false },
      { name: "Custom branding", included: false },
      { name: "Priority support", included: false },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing businesses",
    monthlyPrice: 45000,
    yearlyPrice: 450000,
    maxUsers: 25,
    maxApps: 6,
    isPopular: true,
    isCurrent: true,
    features: [
      { name: "Up to 25 users", included: true },
      { name: "6 apps included", included: true },
      { name: "Advanced reporting", included: true },
      { name: "Email & chat support", included: true },
      { name: "API access", included: true },
      { name: "Custom branding", included: true },
      { name: "Priority support", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    monthlyPrice: 125000,
    yearlyPrice: 1250000,
    maxUsers: -1,
    maxApps: -1,
    features: [
      { name: "Unlimited users", included: true },
      { name: "All apps included", included: true },
      { name: "Custom reporting", included: true },
      { name: "24/7 phone support", included: true },
      { name: "API access", included: true },
      { name: "Custom branding", included: true },
      { name: "Priority support", included: true },
    ],
  },
];

export default function SubscriptionPage() {
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);

  const currentPlan = plans.find((p) => p.isCurrent);

  const handleUpgrade = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setIsUpgradeDialogOpen(true);
  };

  const confirmUpgrade = () => {
    toast({
      title: "Upgrade Request Submitted",
      description: `Your upgrade to ${selectedPlan?.name} plan has been submitted. We'll contact you shortly.`,
    });
    setIsUpgradeDialogOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="h-full px-4 lg:px-8 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Subscription</h1>
            <p className="text-xs text-muted-foreground">Manage your subscription plan</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Current Plan Summary */}
        <Card className="border-2 border-primary">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Star className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">{currentPlan?.name} Plan</h2>
                    <Badge className="bg-primary text-white">Current Plan</Badge>
                  </div>
                  <p className="text-muted-foreground">{currentPlan?.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Monthly Cost</p>
                  <p className="text-2xl font-bold">₦{currentPlan?.monthlyPrice.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Next Billing</p>
                  <p className="text-lg font-semibold">Feb 1, 2024</p>
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Users</p>
                  <p className="font-semibold">12 / {currentPlan?.maxUsers}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AppWindow className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Apps</p>
                  <p className="font-semibold">5 / {currentPlan?.maxApps}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Billing Cycle</p>
                  <p className="font-semibold">Monthly</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <p className="font-semibold">Visa ••4242</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center">
          <div className="bg-muted p-1 rounded-lg inline-flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === "yearly"
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <Badge variant="secondary" className="ml-2 text-xs bg-emerald-100 text-emerald-700">
                Save 17%
              </Badge>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.isPopular
                  ? "border-2 border-primary shadow-lg"
                  : "border"
              } ${plan.isCurrent ? "bg-primary/5" : ""}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white px-3">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.isCurrent && (
                    <Badge variant="outline">Current</Badge>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    ₦{(billingCycle === "yearly" ? plan.yearlyPrice / 12 : plan.monthlyPrice).toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                  {billingCycle === "yearly" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Billed ₦{plan.yearlyPrice.toLocaleString()}/year
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/30" />
                      )}
                      <span
                        className={
                          feature.included
                            ? "text-sm"
                            : "text-sm text-muted-foreground/50"
                        }
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.isPopular ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan)}
                  >
                    {plan.monthlyPrice > (currentPlan?.monthlyPrice || 0) ? (
                      <>
                        Upgrade
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      "Downgrade"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upgrade Dialog */}
        <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedPlan && selectedPlan.monthlyPrice > (currentPlan?.monthlyPrice || 0)
                  ? "Upgrade to"
                  : "Downgrade to"}{" "}
                {selectedPlan?.name}
              </DialogTitle>
              <DialogDescription>
                {selectedPlan && selectedPlan.monthlyPrice > (currentPlan?.monthlyPrice || 0)
                  ? "You'll get access to more features and higher limits."
                  : "You may lose access to some features with this plan."}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-muted">
                <div className="flex justify-between items-center">
                  <span className="text-sm">New Monthly Cost</span>
                  <span className="text-lg font-bold">
                    ₦{selectedPlan?.monthlyPrice.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Your plan will be updated immediately. Charges will be prorated for the current billing period.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsUpgradeDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmUpgrade}>
                Confirm {selectedPlan && selectedPlan.monthlyPrice > (currentPlan?.monthlyPrice || 0) ? "Upgrade" : "Downgrade"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
