import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { InsertCustomer, InsertProduct, InsertInvoice, InsertSalesLead } from "@shared/schema";
import { useAuth } from "./use-auth";

export function useCustomers() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  return useQuery({
    queryKey: [api.customers.list.path, tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const res = await fetch(`${api.customers.list.path}?tenantId=${tenantId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch customers");
      return await res.json();
    },
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Omit<InsertCustomer, "tenantId">) => {
      if (!user?.tenantId) throw new Error("No tenant context");
      const payload = { ...data, tenantId: user.tenantId };
      const res = await fetch(api.customers.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create customer");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.customers.list.path] });
    },
  });
}

export function useProducts() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  return useQuery({
    queryKey: [api.products.list.path, tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const res = await fetch(`${api.products.list.path}?tenantId=${tenantId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      return await res.json();
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Omit<InsertProduct, "tenantId">) => {
      if (!user?.tenantId) throw new Error("No tenant context");
      const payload = { ...data, tenantId: user.tenantId };
      const res = await fetch(api.products.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create product");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
    },
  });
}

export function useInvoices() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  return useQuery({
    queryKey: [api.invoices.list.path, tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const res = await fetch(`${api.invoices.list.path}?tenantId=${tenantId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch invoices");
      return await res.json();
    },
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Omit<InsertInvoice, "tenantId" | "number">) => {
      if (!user?.tenantId) throw new Error("No tenant context");
      const payload = {
        ...data,
        tenantId: user.tenantId,
        number: `INV-${Date.now().toString().slice(-6)}` // Simple mock generator
      };
      const res = await fetch(api.invoices.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create invoice");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.invoices.list.path] });
    },
  });
}

// Sales Leads Hooks
export function useSalesLeads() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  return useQuery({
    queryKey: [api.salesLeads.list.path, tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const res = await fetch(`${api.salesLeads.list.path}?tenantId=${tenantId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sales leads");
      return await res.json();
    },
  });
}

export function useSalesLead(id: string | undefined) {
  return useQuery({
    queryKey: [api.salesLeads.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      const res = await fetch(api.salesLeads.get.path.replace(':id', id!), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sales lead");
      return await res.json();
    },
  });
}

export function useCreateSalesLead() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Omit<InsertSalesLead, "tenantId">) => {
      if (!user?.tenantId) throw new Error("No tenant context");
      const payload = { ...data, tenantId: user.tenantId };
      const res = await fetch(api.salesLeads.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create sales lead");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.salesLeads.list.path] });
    },
  });
}

export function useUpdateSalesLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertSalesLead> }) => {
      const res = await fetch(api.salesLeads.update.path.replace(':id', id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update sales lead");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.salesLeads.list.path] });
    },
  });
}

export function useDeleteSalesLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(api.salesLeads.delete.path.replace(':id', id), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete sales lead");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.salesLeads.list.path] });
    },
  });
}

export function useConvertLeadToCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(api.salesLeads.convertToCustomer.path.replace(':id', id), {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to convert lead to customer");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.salesLeads.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.customers.list.path] });
    },
  });
}
