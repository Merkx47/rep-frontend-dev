import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useChartOfAccounts, useCreateAccount, useJournals, useCreateJournal } from "@/hooks/use-accounting";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertChartOfAccountSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { z } from "zod";
import { getModuleColor } from "@/contexts/module-context";

const createAccountSchema = insertChartOfAccountSchema.pick({
  name: true,
  code: true,
  type: true,
});
type CreateAccountForm = z.infer<typeof createAccountSchema>;

export default function AccountingPage() {
  const moduleColor = getModuleColor("accounting");
  const { data: accounts, isLoading: loadingAccounts } = useChartOfAccounts();
  const { data: journals, isLoading: loadingJournals } = useJournals();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const createAccount = useCreateAccount();

  const form = useForm<CreateAccountForm>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { name: "", code: "", type: "asset" },
  });

  const onSubmit = (data: CreateAccountForm) => {
    createAccount.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
      },
    });
  };

  return (
    <SidebarLayout moduleId="accounting">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight">Accounting</h2>
            <p className="text-muted-foreground mt-1">Manage your chart of accounts and journal entries.</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="text-white shadow-lg hover:opacity-90 border-0"
                  style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Chart of Account</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 1001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Cash in Hand" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="asset">Asset</SelectItem>
                              <SelectItem value="liability">Liability</SelectItem>
                              <SelectItem value="equity">Equity</SelectItem>
                              <SelectItem value="revenue">Revenue</SelectItem>
                              <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full text-white hover:opacity-90 border-0"
                      style={{ backgroundColor: moduleColor }}
                      disabled={createAccount.isPending}
                    >
                      {createAccount.isPending ? "Creating..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Chart of Accounts */}
          <Card className="border-border/60 shadow-md">
            <CardHeader>
              <CardTitle>Chart of Accounts</CardTitle>
              <CardDescription>Your financial structure</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAccounts ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
              ) : accounts?.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground text-sm">No accounts found. Create one to get started.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts?.map((acc) => (
                      <TableRow key={acc.id}>
                        <TableCell className="font-mono text-xs">{acc.code}</TableCell>
                        <TableCell className="font-medium">{acc.name}</TableCell>
                        <TableCell className="capitalize text-muted-foreground">{acc.type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Recent Journals */}
          <Card className="border-border/60 shadow-md">
            <CardHeader>
              <CardTitle>Recent Journals</CardTitle>
              <CardDescription>Latest financial entries</CardDescription>
            </CardHeader>
            <CardContent>
               {loadingJournals ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
              ) : journals?.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground text-sm">No journal entries found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Number</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {journals?.map((jrn) => (
                      <TableRow key={jrn.id}>
                        <TableCell>{new Date(jrn.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-mono text-xs">{jrn.number}</TableCell>
                        <TableCell className="text-right">₦{jrn.totalDebit}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            jrn.status === 'posted' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {jrn.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}
