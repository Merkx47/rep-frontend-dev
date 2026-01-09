import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { InsertChartOfAccount, InsertJournal } from "@shared/schema";
import { useAuth } from "./use-auth";

export function useChartOfAccounts() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  return useQuery({
    queryKey: [api.chartOfAccounts.list.path, tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const res = await fetch(`${api.chartOfAccounts.list.path}?tenantId=${tenantId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch accounts");
      return await res.json();
    },
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Omit<InsertChartOfAccount, "tenantId">) => {
      if (!user?.tenantId) throw new Error("No tenant context");
      const payload = { ...data, tenantId: user.tenantId };
      const res = await fetch(api.chartOfAccounts.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create account");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.chartOfAccounts.list.path] });
    },
  });
}

export function useJournals() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  return useQuery({
    queryKey: [api.journals.list.path, tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const res = await fetch(`${api.journals.list.path}?tenantId=${tenantId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch journals");
      return await res.json();
    },
  });
}

export function useCreateJournal() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Omit<InsertJournal, "tenantId" | "number">) => {
      if (!user?.tenantId) throw new Error("No tenant context");
      const payload = { ...data, tenantId: user.tenantId, number: `JRN-${Date.now()}` }; // Mock number generation
      const res = await fetch(api.journals.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create journal");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.journals.list.path] });
    },
  });
}
