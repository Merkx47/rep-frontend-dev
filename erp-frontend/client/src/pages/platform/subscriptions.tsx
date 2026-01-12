import { useState } from "react";
import { PlatformLayout } from "@/components/platform-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Users,
  TrendingUp,
  Star,
  Sparkles,
  Building2,
  MoreHorizontal,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock subscription plans data
const mockPlans = [
  {
    id: "1",
    name: "Starter",
    description: "Perfect for small businesses just getting started",
    monthlyPrice: 15000,
    yearlyPrice: 150000,
    isPopular: false,
    isActive: true,
    maxUsers: 5,
    maxApps: 3,
    subscribers: 42,
    mrr: 630000,
    features: [
      { name: "Up to 5 users", included: true },
      { name: "3 apps included", included: true },
      { name: "Basic reporting", included: true },
      { name: "Email support", included: true },
      { name: "API access", included: false },
      { name: "Custom branding", included: false },
      { name: "Priority support", included: false },
      { name: "Dedicated account manager", included: false },
    ],
  },
  {
    id: "2",
    name: "Professional",
    description: "For growing businesses that need more power",
    monthlyPrice: 45000,
    yearlyPrice: 450000,
    isPopular: true,
    isActive: true,
    maxUsers: 25,
    maxApps: 6,
    subscribers: 78,
    mrr: 3510000,
    features: [
      { name: "Up to 25 users", included: true },
      { name: "6 apps included", included: true },
      { name: "Advanced reporting", included: true },
      { name: "Email & chat support", included: true },
      { name: "API access", included: true },
      { name: "Custom branding", included: true },
      { name: "Priority support", included: false },
      { name: "Dedicated account manager", included: false },
    ],
  },
  {
    id: "3",
    name: "Enterprise",
    description: "Full-featured solution for large organizations",
    monthlyPrice: 125000,
    yearlyPrice: 1250000,
    isPopular: false,
    isActive: true,
    maxUsers: -1, // Unlimited
    maxApps: -1, // Unlimited
    subscribers: 22,
    mrr: 2750000,
    features: [
      { name: "Unlimited users", included: true },
      { name: "All apps included", included: true },
      { name: "Custom reporting", included: true },
      { name: "24/7 phone support", included: true },
      { name: "API access", included: true },
      { name: "Custom branding", included: true },
      { name: "Priority support", included: true },
      { name: "Dedicated account manager", included: true },
    ],
  },
];

// Add-ons
const mockAddons = [
  {
    id: "1",
    name: "Extra Users",
    description: "Add more users beyond your plan limit",
    price: 2000,
    unit: "per user/month",
    isActive: true,
  },
  {
    id: "2",
    name: "Additional Storage",
    description: "Expand your storage capacity",
    price: 5000,
    unit: "per 50GB/month",
    isActive: true,
  },
  {
    id: "3",
    name: "API Premium",
    description: "Higher API rate limits and priority access",
    price: 15000,
    unit: "per month",
    isActive: true,
  },
  {
    id: "4",
    name: "White Label",
    description: "Remove all Qorpy branding",
    price: 50000,
    unit: "per month",
    isActive: false,
  },
];

export default function AdminSubscriptions() {
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [isAddAddonOpen, setIsAddAddonOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<typeof mockPlans[0] | null>(null);
  const [editingAddon, setEditingAddon] = useState<typeof mockAddons[0] | null>(null);
  const { toast } = useToast();

  // Stats
  const stats = {
    totalPlans: mockPlans.filter((p) => p.isActive).length,
    totalSubscribers: mockPlans.reduce((sum, p) => sum + p.subscribers, 0),
    totalMrr: mockPlans.reduce((sum, p) => sum + p.mrr, 0),
    avgRevenuePerUser: Math.round(
      mockPlans.reduce((sum, p) => sum + p.mrr, 0) /
        mockPlans.reduce((sum, p) => sum + p.subscribers, 0)
    ),
  };

  const handleSavePlan = () => {
    toast({
      title: editingPlan ? "Plan Updated" : "Plan Created",
      description: editingPlan
        ? "Subscription plan has been updated successfully."
        : "New subscription plan has been created.",
    });
    setIsAddPlanOpen(false);
    setEditingPlan(null);
  };

  const handleSaveAddon = () => {
    toast({
      title: editingAddon ? "Add-on Updated" : "Add-on Created",
      description: editingAddon
        ? "Add-on has been updated successfully."
        : "New add-on has been created successfully.",
    });
    setIsAddAddonOpen(false);
    setEditingAddon(null);
  };

  const handleDeleteAddon = (addon: typeof mockAddons[0]) => {
    toast({
      title: "Add-on Deleted",
      description: `${addon.name} has been deleted.`,
      variant: "destructive",
    });
  };

  const handleDeletePlan = (plan: typeof mockPlans[0]) => {
    toast({
      title: "Plan Deleted",
      description: `${plan.name} plan has been deleted.`,
      variant: "destructive",
    });
  };

  const handleToggleAddon = (addon: typeof mockAddons[0]) => {
    toast({
      title: addon.isActive ? "Add-on Disabled" : "Add-on Enabled",
      description: `${addon.name} has been ${addon.isActive ? "disabled" : "enabled"}.`,
    });
  };

  return (
    <PlatformLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Subscription Plans
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage pricing plans and add-ons for your platform
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Active Plans</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalPlans}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Subscribers</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalSubscribers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">₦</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total MRR</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    ₦{(stats.totalMrr / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">ARPU</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    ₦{stats.avgRevenuePerUser.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="bg-slate-100 dark:bg-slate-800">
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="addons">Add-ons</TabsTrigger>
          </TabsList>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isAddPlanOpen || !!editingPlan} onOpenChange={(open) => {
                setIsAddPlanOpen(open);
                if (!open) setEditingPlan(null);
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingPlan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
                    <DialogDescription>
                      {editingPlan ? "Update the subscription plan details" : "Add a new subscription plan to your platform"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="planName">Plan Name</Label>
                        <Input
                          id="planName"
                          placeholder="e.g., Professional"
                          defaultValue={editingPlan?.name}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxUsers">Max Users</Label>
                        <Input
                          id="maxUsers"
                          type="number"
                          placeholder="e.g., 25 (-1 for unlimited)"
                          defaultValue={editingPlan?.maxUsers}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the plan..."
                        defaultValue={editingPlan?.description}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="monthlyPrice">Monthly Price (₦)</Label>
                        <Input
                          id="monthlyPrice"
                          type="number"
                          placeholder="45000"
                          defaultValue={editingPlan?.monthlyPrice}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearlyPrice">Yearly Price (₦)</Label>
                        <Input
                          id="yearlyPrice"
                          type="number"
                          placeholder="450000"
                          defaultValue={editingPlan?.yearlyPrice}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxApps">Max Apps</Label>
                        <Input
                          id="maxApps"
                          type="number"
                          placeholder="e.g., 6 (-1 for unlimited)"
                          defaultValue={editingPlan?.maxApps}
                        />
                      </div>
                      <div className="flex items-center gap-4 pt-6">
                        <div className="flex items-center space-x-2">
                          <Switch id="isPopular" defaultChecked={editingPlan?.isPopular} />
                          <Label htmlFor="isPopular">Mark as Popular</Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Features (one per line)</Label>
                      <Textarea
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                        className="min-h-[120px]"
                        defaultValue={editingPlan?.features.filter(f => f.included).map(f => f.name).join("\n")}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => {
                      setIsAddPlanOpen(false);
                      setEditingPlan(null);
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSavePlan} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      {editingPlan ? "Update Plan" : "Create Plan"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Plans Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {mockPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative border-2 bg-white dark:bg-slate-800 flex flex-col ${
                    plan.isPopular
                      ? "border-indigo-500 dark:border-indigo-400 shadow-lg shadow-indigo-500/10"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-indigo-600 text-white px-3">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
                          {plan.name}
                          {plan.name === "Enterprise" && (
                            <Sparkles className="w-5 h-5 text-amber-500" />
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">{plan.description}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingPlan(plan)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeletePlan(plan)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Plan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                          ₦{plan.monthlyPrice.toLocaleString()}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">/month</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        or ₦{plan.yearlyPrice.toLocaleString()}/year (save {Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100)}%)
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1 flex flex-col">
                    {/* Limits */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <Users className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {plan.maxUsers === -1 ? "Unlimited" : plan.maxUsers} users
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <Building2 className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {plan.maxApps === -1 ? "All" : plan.maxApps} apps
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 pt-4 border-t flex-1">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {feature.included ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <X className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                            </div>
                          )}
                          <span
                            className={
                              feature.included
                                ? "text-slate-700 dark:text-slate-300 text-sm"
                                : "text-slate-400 dark:text-slate-500 text-sm"
                            }
                          >
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                      <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Subscribers</p>
                        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mt-1">{plan.subscribers}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">MRR</p>
                        <p className="text-lg font-bold text-blue-700 dark:text-blue-300 mt-1">
                          ₦{(plan.mrr / 1000).toFixed(0)}K
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Add-ons Tab */}
          <TabsContent value="addons" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isAddAddonOpen || !!editingAddon} onOpenChange={(open) => {
                setIsAddAddonOpen(open);
                if (!open) setEditingAddon(null);
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Add-on
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingAddon ? "Edit Add-on" : "Create New Add-on"}</DialogTitle>
                    <DialogDescription>
                      {editingAddon ? "Update the add-on details" : "Add a new optional add-on for your subscription plans"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="addonName">Add-on Name</Label>
                      <Input
                        id="addonName"
                        placeholder="e.g., Extra Storage"
                        defaultValue={editingAddon?.name}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addonDesc">Description</Label>
                      <Textarea
                        id="addonDesc"
                        placeholder="Brief description..."
                        defaultValue={editingAddon?.description}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="addonPrice">Price (₦)</Label>
                        <Input
                          id="addonPrice"
                          type="number"
                          placeholder="5000"
                          defaultValue={editingAddon?.price}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addonUnit">Unit</Label>
                        <Input
                          id="addonUnit"
                          placeholder="per user/month"
                          defaultValue={editingAddon?.unit}
                        />
                      </div>
                    </div>
                    {editingAddon && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <div>
                          <Label>Status</Label>
                          <p className="text-xs text-slate-500">Enable or disable this add-on</p>
                        </div>
                        <Switch defaultChecked={editingAddon.isActive} />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => {
                      setIsAddAddonOpen(false);
                      setEditingAddon(null);
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveAddon} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      {editingAddon ? "Update Add-on" : "Create Add-on"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Add-ons Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {mockAddons.map((addon) => (
                <Card
                  key={addon.id}
                  className={`border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 ${
                    !addon.isActive ? "opacity-60" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {addon.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={
                              addon.isActive
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400"
                            }
                          >
                            {addon.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {addon.description}
                        </p>
                        <div className="mt-3">
                          <span className="text-lg font-bold text-slate-900 dark:text-white">
                            ₦{addon.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">
                            {addon.unit}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={addon.isActive}
                          onCheckedChange={() => handleToggleAddon(addon)}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingAddon(addon)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteAddon(addon)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PlatformLayout>
  );
}
