import { createContext, useContext } from "react";

// Module theme colors - can be imported directly by pages
export const moduleColors: Record<string, string> = {
  accounting: "#4CAF50",      // Green
  hr: "#E91E63",              // Pink
  production: "#607D8B",      // Blue-grey
  products: "#FF9800",        // Orange
  sales: "#2196F3",           // Blue
  services: "#9C27B0",        // Purple
  "corporate-cards": "#FFC107", // Amber
  "nrs-einvoice": "#F44336",  // Red
  invoice: "#3F51B5",         // Indigo
  bank: "#00BCD4",            // Cyan
  "fixed-assets": "#009688",  // Teal
  "tenant-admin": "#6366F1",  // Indigo (admin)
};

// Helper function to get module color by ID
export function getModuleColor(moduleId: string): string {
  return moduleColors[moduleId] || "#4B6BF5";
}

interface ModuleContextType {
  moduleId: string;
  moduleColor: string;
}

const ModuleContext = createContext<ModuleContextType | null>(null);

export function ModuleProvider({
  children,
  moduleId,
  moduleColor,
}: {
  children: React.ReactNode;
  moduleId: string;
  moduleColor: string;
}) {
  return (
    <ModuleContext.Provider value={{ moduleId, moduleColor }}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModuleColor(): string {
  const context = useContext(ModuleContext);
  if (!context) {
    // Return default blue if not within a module context
    return "#4B6BF5";
  }
  return context.moduleColor;
}

export function useModule(): ModuleContextType | null {
  return useContext(ModuleContext);
}
