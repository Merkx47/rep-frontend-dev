import { useState, useMemo } from "react";
import { PlatformLayout } from "@/components/platform-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FolderTree,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  AppWindow,
  GripVertical,
  Palette,
  Check,
  Ban,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock categories data
const mockCategories = [
  {
    id: "1",
    name: "Finance",
    slug: "finance",
    description: "Financial management, accounting, and billing applications",
    color: "#4CAF50",
    icon: "DollarSign",
    appsCount: 4,
    sortOrder: 1,
    isActive: true,
    apps: ["Accounting", "Invoice", "Bank", "Fixed Assets"],
  },
  {
    id: "2",
    name: "Sales",
    slug: "sales",
    description: "Sales management, CRM, and customer relationship tools",
    color: "#2196F3",
    icon: "TrendingUp",
    appsCount: 1,
    sortOrder: 2,
    isActive: true,
    apps: ["Sales"],
  },
  {
    id: "3",
    name: "Human Resources",
    slug: "human-resources",
    description: "Employee management, payroll, and HR operations",
    color: "#E91E63",
    icon: "Users",
    appsCount: 1,
    sortOrder: 3,
    isActive: true,
    apps: ["HR"],
  },
  {
    id: "4",
    name: "Operations",
    slug: "operations",
    description: "Production, manufacturing, and operational management",
    color: "#607D8B",
    icon: "Factory",
    appsCount: 1,
    sortOrder: 4,
    isActive: true,
    apps: ["Production"],
  },
  {
    id: "5",
    name: "Compliance",
    slug: "compliance",
    description: "Tax compliance, e-invoicing, and regulatory tools",
    color: "#F44336",
    icon: "Shield",
    appsCount: 1,
    sortOrder: 5,
    isActive: true,
    apps: ["NRS E-Invoice"],
  },
  {
    id: "6",
    name: "Corporate",
    slug: "corporate",
    description: "Corporate cards, expense management, and company tools",
    color: "#FFC107",
    icon: "CreditCard",
    appsCount: 1,
    sortOrder: 6,
    isActive: true,
    apps: ["Corporate Cards"],
  },
];

// Exhaustive color palette for category selection organized by color family
const colorPalette = [
  // Reds
  { name: "Red 400", hex: "#F87171", group: "Red" },
  { name: "Red 500", hex: "#EF4444", group: "Red" },
  { name: "Red 600", hex: "#DC2626", group: "Red" },
  { name: "Red 700", hex: "#B91C1C", group: "Red" },
  // Roses
  { name: "Rose 400", hex: "#FB7185", group: "Rose" },
  { name: "Rose 500", hex: "#F43F5E", group: "Rose" },
  { name: "Rose 600", hex: "#E11D48", group: "Rose" },
  // Pinks
  { name: "Pink 400", hex: "#F472B6", group: "Pink" },
  { name: "Pink 500", hex: "#EC4899", group: "Pink" },
  { name: "Pink 600", hex: "#DB2777", group: "Pink" },
  { name: "Pink (Material)", hex: "#E91E63", group: "Pink" },
  // Fuchsias
  { name: "Fuchsia 400", hex: "#E879F9", group: "Fuchsia" },
  { name: "Fuchsia 500", hex: "#D946EF", group: "Fuchsia" },
  { name: "Fuchsia 600", hex: "#C026D3", group: "Fuchsia" },
  // Purples
  { name: "Purple 400", hex: "#C084FC", group: "Purple" },
  { name: "Purple 500", hex: "#A855F7", group: "Purple" },
  { name: "Purple 600", hex: "#9333EA", group: "Purple" },
  { name: "Purple (Material)", hex: "#9C27B0", group: "Purple" },
  // Violets
  { name: "Violet 400", hex: "#A78BFA", group: "Violet" },
  { name: "Violet 500", hex: "#8B5CF6", group: "Violet" },
  { name: "Violet 600", hex: "#7C3AED", group: "Violet" },
  // Indigos
  { name: "Indigo 400", hex: "#818CF8", group: "Indigo" },
  { name: "Indigo 500", hex: "#6366F1", group: "Indigo" },
  { name: "Indigo 600", hex: "#4F46E5", group: "Indigo" },
  { name: "Indigo (Material)", hex: "#3F51B5", group: "Indigo" },
  // Blues
  { name: "Blue 400", hex: "#60A5FA", group: "Blue" },
  { name: "Blue 500", hex: "#3B82F6", group: "Blue" },
  { name: "Blue 600", hex: "#2563EB", group: "Blue" },
  { name: "Blue (Material)", hex: "#2196F3", group: "Blue" },
  // Sky
  { name: "Sky 400", hex: "#38BDF8", group: "Sky" },
  { name: "Sky 500", hex: "#0EA5E9", group: "Sky" },
  { name: "Sky 600", hex: "#0284C7", group: "Sky" },
  // Cyans
  { name: "Cyan 400", hex: "#22D3EE", group: "Cyan" },
  { name: "Cyan 500", hex: "#06B6D4", group: "Cyan" },
  { name: "Cyan 600", hex: "#0891B2", group: "Cyan" },
  { name: "Cyan (Material)", hex: "#00BCD4", group: "Cyan" },
  // Teals
  { name: "Teal 400", hex: "#2DD4BF", group: "Teal" },
  { name: "Teal 500", hex: "#14B8A6", group: "Teal" },
  { name: "Teal 600", hex: "#0D9488", group: "Teal" },
  { name: "Teal (Material)", hex: "#009688", group: "Teal" },
  // Emeralds
  { name: "Emerald 400", hex: "#34D399", group: "Emerald" },
  { name: "Emerald 500", hex: "#10B981", group: "Emerald" },
  { name: "Emerald 600", hex: "#059669", group: "Emerald" },
  // Greens
  { name: "Green 400", hex: "#4ADE80", group: "Green" },
  { name: "Green 500", hex: "#22C55E", group: "Green" },
  { name: "Green 600", hex: "#16A34A", group: "Green" },
  { name: "Green (Material)", hex: "#4CAF50", group: "Green" },
  // Limes
  { name: "Lime 400", hex: "#A3E635", group: "Lime" },
  { name: "Lime 500", hex: "#84CC16", group: "Lime" },
  { name: "Lime 600", hex: "#65A30D", group: "Lime" },
  // Yellows
  { name: "Yellow 400", hex: "#FACC15", group: "Yellow" },
  { name: "Yellow 500", hex: "#EAB308", group: "Yellow" },
  { name: "Yellow 600", hex: "#CA8A04", group: "Yellow" },
  // Ambers
  { name: "Amber 400", hex: "#FBBF24", group: "Amber" },
  { name: "Amber 500", hex: "#F59E0B", group: "Amber" },
  { name: "Amber 600", hex: "#D97706", group: "Amber" },
  { name: "Amber (Material)", hex: "#FFC107", group: "Amber" },
  // Oranges
  { name: "Orange 400", hex: "#FB923C", group: "Orange" },
  { name: "Orange 500", hex: "#F97316", group: "Orange" },
  { name: "Orange 600", hex: "#EA580C", group: "Orange" },
  { name: "Orange (Material)", hex: "#FF9800", group: "Orange" },
  // Deep Orange
  { name: "Deep Orange", hex: "#FF5722", group: "Orange" },
  // Browns
  { name: "Brown 400", hex: "#A1887F", group: "Brown" },
  { name: "Brown 500", hex: "#795548", group: "Brown" },
  { name: "Brown 600", hex: "#6D4C41", group: "Brown" },
  // Slates
  { name: "Slate 400", hex: "#94A3B8", group: "Slate" },
  { name: "Slate 500", hex: "#64748B", group: "Slate" },
  { name: "Slate 600", hex: "#475569", group: "Slate" },
  { name: "Blue Grey (Material)", hex: "#607D8B", group: "Slate" },
  // Grays
  { name: "Gray 400", hex: "#9CA3AF", group: "Gray" },
  { name: "Gray 500", hex: "#6B7280", group: "Gray" },
  { name: "Gray 600", hex: "#4B5563", group: "Gray" },
  // Zincs
  { name: "Zinc 400", hex: "#A1A1AA", group: "Zinc" },
  { name: "Zinc 500", hex: "#71717A", group: "Zinc" },
  { name: "Zinc 600", hex: "#52525B", group: "Zinc" },
  // Stones
  { name: "Stone 400", hex: "#A8A29E", group: "Stone" },
  { name: "Stone 500", hex: "#78716C", group: "Stone" },
  { name: "Stone 600", hex: "#57534E", group: "Stone" },
];

export default function AdminCategories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<typeof mockCategories[0] | null>(null);
  const [selectedColor, setSelectedColor] = useState("#4CAF50");
  const [customColorInput, setCustomColorInput] = useState("");
  const { toast } = useToast();

  // Get all colors currently in use by categories
  const usedColors = useMemo(() => {
    return mockCategories
      .filter((cat) => editingCategory ? cat.id !== editingCategory.id : true)
      .map((cat) => cat.color.toUpperCase());
  }, [editingCategory]);

  // Check if a color is in use
  const isColorInUse = (hex: string) => {
    return usedColors.includes(hex.toUpperCase());
  };

  // Get the category name using a specific color
  const getCategoryUsingColor = (hex: string) => {
    const category = mockCategories.find(
      (cat) => cat.color.toUpperCase() === hex.toUpperCase() && (editingCategory ? cat.id !== editingCategory.id : true)
    );
    return category?.name;
  };

  // Group colors by their group name
  const groupedColors = useMemo(() => {
    const groups: { [key: string]: typeof colorPalette } = {};
    colorPalette.forEach((color) => {
      if (!groups[color.group]) {
        groups[color.group] = [];
      }
      groups[color.group].push(color);
    });
    return groups;
  }, []);

  // Filter categories
  const filteredCategories = useMemo(() => {
    return mockCategories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Handle custom color input
  const handleCustomColorApply = () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(customColorInput)) {
      setSelectedColor(customColorInput.toUpperCase());
      setCustomColorInput("");
    } else {
      toast({
        title: "Invalid Color",
        description: "Please enter a valid hex color (e.g., #FF5733)",
        variant: "destructive",
      });
    }
  };

  const handleSaveCategory = () => {
    toast({
      title: editingCategory ? "Category Updated" : "Category Created",
      description: editingCategory
        ? "App category has been updated successfully."
        : "New app category has been created.",
    });
    setIsAddDialogOpen(false);
    setEditingCategory(null);
    setSelectedColor("#4CAF50");
  };

  const handleDeleteCategory = (category: typeof mockCategories[0]) => {
    if (category.appsCount > 0) {
      toast({
        title: "Cannot Delete",
        description: `${category.name} has ${category.appsCount} apps. Move them first.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Category Deleted",
        description: `${category.name} has been deleted.`,
      });
    }
  };

  const openEditDialog = (category: typeof mockCategories[0]) => {
    setEditingCategory(category);
    setSelectedColor(category.color);
  };

  return (
    <PlatformLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              App Categories
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Organize your apps into logical categories
            </p>
          </div>
          <Dialog open={isAddDialogOpen || !!editingCategory} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              setEditingCategory(null);
              setSelectedColor("#4CAF50");
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Edit Category" : "Create New Category"}</DialogTitle>
                <DialogDescription>
                  {editingCategory ? "Update the category details" : "Add a new category to organize your apps"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      placeholder="e.g., Finance"
                      defaultValue={editingCategory?.name}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categorySlug">Slug</Label>
                    <Input
                      id="categorySlug"
                      placeholder="e.g., finance"
                      defaultValue={editingCategory?.slug}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryDesc">Description</Label>
                  <Textarea
                    id="categoryDesc"
                    placeholder="Brief description of this category..."
                    defaultValue={editingCategory?.description}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Category Color</Label>

                  {/* Selected Color Preview */}
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-white shadow-md"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <div>
                      <p className="font-mono text-sm font-medium text-slate-900 dark:text-white">
                        {selectedColor.toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-500">Selected color</p>
                    </div>
                  </div>

                  {/* Custom Color Input */}
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value.toUpperCase())}
                      className="w-12 h-10 rounded cursor-pointer border border-slate-200 dark:border-slate-700"
                    />
                    <Input
                      value={customColorInput}
                      onChange={(e) => setCustomColorInput(e.target.value)}
                      placeholder="Enter hex (e.g., #FF5733)"
                      className="font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCustomColorApply}
                      disabled={!customColorInput}
                    >
                      Apply
                    </Button>
                  </div>

                  {/* Color Palette */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto p-3 border rounded-lg bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-slate-500">Color Palette</Label>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Check className="w-3 h-3" /> Selected
                        </span>
                        <span className="flex items-center gap-1 text-amber-600">
                          <Ban className="w-3 h-3" /> In Use
                        </span>
                      </div>
                    </div>

                    <TooltipProvider>
                      {Object.entries(groupedColors).map(([groupName, colors]) => (
                        <div key={groupName} className="space-y-1">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
                            {groupName}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {colors.map((color) => {
                              const inUse = isColorInUse(color.hex);
                              const usingCategory = getCategoryUsingColor(color.hex);
                              const isSelected = selectedColor.toUpperCase() === color.hex.toUpperCase();

                              return (
                                <Tooltip key={color.hex}>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      onClick={() => !inUse && setSelectedColor(color.hex)}
                                      disabled={inUse}
                                      className={`relative w-7 h-7 rounded-md transition-all ${
                                        isSelected
                                          ? "ring-2 ring-offset-2 ring-indigo-500 scale-110"
                                          : inUse
                                          ? "opacity-50 cursor-not-allowed"
                                          : "hover:scale-110"
                                      }`}
                                      style={{ backgroundColor: color.hex }}
                                    >
                                      {isSelected && (
                                        <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-md" />
                                      )}
                                      {inUse && !isSelected && (
                                        <Ban className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-md" />
                                      )}
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="text-xs">
                                    <p className="font-medium">{color.name}</p>
                                    <p className="font-mono text-slate-400">{color.hex}</p>
                                    {inUse && (
                                      <p className="text-amber-400 mt-1">
                                        Used by: {usingCategory}
                                      </p>
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </TooltipProvider>
                  </div>

                  {/* Currently Used Colors Summary */}
                  {usedColors.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-2">
                        Colors already in use ({usedColors.length}):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {mockCategories
                          .filter((cat) => editingCategory ? cat.id !== editingCategory.id : true)
                          .map((cat) => (
                            <div
                              key={cat.id}
                              className="flex items-center gap-1.5 px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs"
                            >
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: cat.color }}
                              />
                              <span className="text-slate-600 dark:text-slate-300">{cat.name}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    placeholder="1"
                    defaultValue={editingCategory?.sortOrder || mockCategories.length + 1}
                  />
                  <p className="text-xs text-slate-500">Lower numbers appear first in the list</p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => {
                  setIsAddDialogOpen(false);
                  setEditingCategory(null);
                  setSelectedColor("#4CAF50");
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSaveCategory} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {editingCategory ? "Update Category" : "Create Category"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <FolderTree className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Categories</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {mockCategories.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <AppWindow className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Apps</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {mockCategories.reduce((sum, cat) => sum + cat.appsCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Palette className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Avg Apps/Category</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(mockCategories.reduce((sum, cat) => sum + cat.appsCount, 0) / mockCategories.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Table */}
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-slate-900 dark:text-white">All Categories</CardTitle>
                <CardDescription>Manage app categories and their order</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search categories..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Apps</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No categories found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <TableCell>
                        <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            <FolderTree className="w-5 h-5" style={{ color: category.color }} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{category.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">/{category.slug}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                          {category.description}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {category.appsCount}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {category.apps.slice(0, 2).join(", ")}
                            {category.apps.length > 2 && ` +${category.apps.length - 2}`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            category.isActive
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400"
                          }
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(category)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Category
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <AppWindow className="w-4 h-4 mr-2" />
                              View Apps
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCategory(category)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Category Cards Preview */}
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Category Preview</CardTitle>
            <CardDescription>How categories appear in the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              {mockCategories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer"
                  style={{ borderColor: category.color }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <FolderTree className="w-5 h-5" style={{ color: category.color }} />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                    {category.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {category.appsCount} {category.appsCount === 1 ? "app" : "apps"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PlatformLayout>
  );
}
