import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getModuleColor } from "@/contexts/module-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  FileText,
  Pencil,
  Trash2,
  Copy,
  Star,
  Check,
} from "lucide-react";

interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  type: "standard" | "professional" | "minimal" | "detailed";
  isDefault: boolean;
  lastModified: string;
  preview: string;
}

// Mock data
const mockTemplates: InvoiceTemplate[] = [
  { id: "1", name: "Standard Invoice", description: "Clean and professional layout with company branding", type: "standard", isDefault: true, lastModified: "2024-01-15", preview: "standard" },
  { id: "2", name: "Professional Plus", description: "Premium design with detailed breakdowns and payment terms", type: "professional", isDefault: false, lastModified: "2024-01-10", preview: "professional" },
  { id: "3", name: "Minimal", description: "Simple and clean design for quick invoices", type: "minimal", isDefault: false, lastModified: "2024-01-08", preview: "minimal" },
  { id: "4", name: "Detailed Report", description: "Comprehensive invoice with itemized services and hours", type: "detailed", isDefault: false, lastModified: "2024-01-05", preview: "detailed" },
];

export default function InvoiceTemplatesPage() {
  const moduleColor = getModuleColor("invoice");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: any) => {
    toast({
      title: "Template Created",
      description: `${data.name} has been created.`,
    });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleSetDefault = (template: InvoiceTemplate) => {
    toast({
      title: "Default Template Updated",
      description: `${template.name} is now the default template.`,
    });
  };

  const handleDuplicate = (template: InvoiceTemplate) => {
    toast({
      title: "Template Duplicated",
      description: `Copy of ${template.name} has been created.`,
    });
  };

  const filteredTemplates = mockTemplates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "standard":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Standard</Badge>;
      case "professional":
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">Professional</Badge>;
      case "minimal":
        return <Badge variant="outline">Minimal</Badge>;
      case "detailed":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Detailed</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getPreviewStyle = (type: string) => {
    switch (type) {
      case "standard":
        return "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900";
      case "professional":
        return "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900";
      case "minimal":
        return "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900";
      case "detailed":
        return "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900";
      default:
        return "bg-muted";
    }
  };

  return (
    <SidebarLayout moduleId="invoice">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Invoice Templates</h1>
            <p className="text-muted-foreground mt-1">Customize and manage your invoice designs</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Templates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTemplates.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Default</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">
                {mockTemplates.find((t) => t.isDefault)?.name || "None"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Custom</CardTitle>
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">System</CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Invoice Template</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Template name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Custom Professional" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe your template..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    Create Template
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              {/* Preview Area */}
              <div className={`h-40 ${getPreviewStyle(template.type)} flex items-center justify-center relative`}>
                <div className="w-24 h-32 bg-white dark:bg-gray-800 rounded shadow-lg flex flex-col p-2">
                  <div className="h-2 w-12 bg-primary/20 rounded mb-1"></div>
                  <div className="h-1 w-8 bg-muted rounded mb-2"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-1 w-full bg-muted rounded"></div>
                    <div className="h-1 w-full bg-muted rounded"></div>
                    <div className="h-1 w-3/4 bg-muted rounded"></div>
                  </div>
                  <div className="h-2 w-10 bg-primary/30 rounded mt-2 ml-auto"></div>
                </div>
                {template.isDefault && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Default
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">{template.description}</CardDescription>
                  </div>
                  {getTypeBadge(template.type)}
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Last modified: {template.lastModified}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Pencil className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(template)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  {!template.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(template)}
                    >
                      <Star className="w-3 h-3" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No templates found</h3>
            <p className="text-muted-foreground">Create a new template to get started.</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
