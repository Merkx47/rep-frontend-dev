import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { InsertTenant } from "@shared/schema";

export function useCreateTenant() {
  return useMutation({
    mutationFn: async (data: InsertTenant) => {
      const res = await fetch(api.tenants.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create organization");
      return await res.json();
    },
  });
}
