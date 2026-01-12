import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Wallet,
} from "lucide-react";

// Mock invoices data
const mockInvoices = [
  {
    id: "INV-2024-001",
    date: "2024-01-01",
    dueDate: "2024-01-15",
    amount: 45000,
    status: "paid",
    description: "Professional Plan - January 2024",
  },
  {
    id: "INV-2023-012",
    date: "2023-12-01",
    dueDate: "2023-12-15",
    amount: 45000,
    status: "paid",
    description: "Professional Plan - December 2023",
  },
  {
    id: "INV-2023-011",
    date: "2023-11-01",
    dueDate: "2023-11-15",
    amount: 45000,
    status: "paid",
    description: "Professional Plan - November 2023",
  },
  {
    id: "INV-2023-010",
    date: "2023-10-01",
    dueDate: "2023-10-15",
    amount: 45000,
    status: "paid",
    description: "Professional Plan - October 2023",
  },
];

// Mock payment methods
const mockPaymentMethods = [
  {
    id: "1",
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: "2",
    type: "card",
    last4: "5555",
    brand: "Mastercard",
    expiryMonth: 6,
    expiryYear: 2026,
    isDefault: false,
  },
];

export default function AdminBillingPage() {
  const { toast } = useToast();
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Downloading Invoice",
      description: `Invoice ${invoiceId} is being downloaded.`,
    });
  };

  const handleSetDefault = (paymentId: string) => {
    toast({
      title: "Default Payment Updated",
      description: "Your default payment method has been updated.",
    });
  };

  const handleRemovePayment = (paymentId: string) => {
    toast({
      title: "Payment Method Removed",
      description: "The payment method has been removed.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
          <p className="text-sm text-muted-foreground">
            Manage your billing and payment methods
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-2xl font-bold text-emerald-600">₦0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Payment</p>
                  <p className="text-2xl font-bold">Feb 1, 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Amount</p>
                  <p className="text-2xl font-bold">₦45,000</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-xl font-bold text-amber-600">₦</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold">₦180,000</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </div>
            <Button onClick={() => setIsAddPaymentOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Method
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPaymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 rounded bg-gradient-to-r from-slate-700 to-slate-900 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {method.brand} •••• {method.last4}
                        </p>
                        {method.isDefault && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemovePayment(method.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoice History */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>View and download your past invoices</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell className="text-muted-foreground">{invoice.description}</TableCell>
                    <TableCell className="font-medium">₦{invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          invoice.status === "paid"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Payment Method Dialog */}
        <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a new card to your account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-8 rounded-lg border-2 border-dashed text-center">
                <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Payment integration coming soon. Contact support to add payment methods.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddPaymentOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
