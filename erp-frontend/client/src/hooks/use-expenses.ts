import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { InsertExpense, InsertExpenseCategory } from "@shared/schema";
import { useAuth } from "./use-auth";

export function useExpenseCategories() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  return useQuery({
    queryKey: [api.expenseCategories.list.path, tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const res = await fetch(`${api.expenseCategories.list.path}?tenantId=${tenantId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch expense categories");
      return await res.json();
    },
  });
}

export function useExpenses() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  return useQuery({
    queryKey: [api.expenses.list.path, tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const res = await fetch(`${api.expenses.list.path}?tenantId=${tenantId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch expenses");
      return await res.json();
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      description: string;
      amount: string;
      categoryId: string;
      date: string;
      notes?: string | null;
    }) => {
      if (!user?.tenantId || !user?.id) throw new Error("No tenant context");
      const payload = {
        tenantId: user.tenantId,
        submittedBy: user.id,
        categoryId: data.categoryId,
        description: data.description,
        amount: data.amount,
        totalAmount: data.amount,
        date: data.date,
        status: 'pending',
      };
      const res = await fetch(api.expenses.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create expense");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.expenses.list.path] });
    },
  });
}

export function useApproveExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseId: string) => {
      const res = await fetch(api.expenses.approve.path.replace(':id', expenseId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to approve expense");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.expenses.list.path] });
    },
  });
}

export function useRejectExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseId: string) => {
      const res = await fetch(api.expenses.reject.path.replace(':id', expenseId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to reject expense");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.expenses.list.path] });
    },
  });
}

export function useCreateExpenseCategory() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Omit<InsertExpenseCategory, "tenantId">) => {
      if (!user?.tenantId) throw new Error("No tenant context");
      const payload = { ...data, tenantId: user.tenantId };
      const res = await fetch(api.expenseCategories.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create expense category");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.expenseCategories.list.path] });
    },
  });
}

export function useBudgets() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  return useQuery({
    queryKey: [api.budgets.list.path, tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const res = await fetch(`${api.budgets.list.path}?tenantId=${tenantId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch budgets");
      return await res.json();
    },
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: { categoryId: string; year: number; month: number; amount: number }) => {
      if (!user?.tenantId) throw new Error("No tenant context");
      const payload = { ...data, tenantId: user.tenantId, spent: 0 };
      const res = await fetch(api.budgets.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create budget");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.budgets.list.path] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; categoryId?: string; year?: number; month?: number; amount?: number }) => {
      const res = await fetch(api.budgets.update.path.replace(':id', id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update budget");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.budgets.list.path] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetId: string) => {
      const res = await fetch(api.budgets.delete.path.replace(':id', budgetId), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete budget");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.budgets.list.path] });
    },
  });
}
