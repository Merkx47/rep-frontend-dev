import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { InsertProduct } from "@shared/schema";
import { useAuth } from "./use-auth";

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

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertProduct>) => {
      const res = await fetch(api.products.update.path.replace(':id', id.toString()), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update product");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
    },
  });
}
