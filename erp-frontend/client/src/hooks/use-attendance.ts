import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useAuth } from "./use-auth";

export function useAttendance(date?: string) {
  const { user } = useAuth();
  const tenantId = user?.tenantId;
  const queryDate = date || new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: [api.attendanceRecords.list.path, tenantId, queryDate],
    enabled: !!tenantId,
    queryFn: async () => {
      const res = await fetch(`${api.attendanceRecords.list.path}?tenantId=${tenantId}&date=${queryDate}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch attendance");
      return await res.json();
    },
  });
}

export function useClockIn() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user?.tenantId || !user?.id) throw new Error("No user context");
      const now = new Date();
      const payload = {
        tenantId: user.tenantId,
        employeeId: user.id,
        date: now.toISOString().split('T')[0],
        clockIn: now.toISOString(),
        status: 'present',
      };
      const res = await fetch(api.attendanceRecords.clockIn.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to clock in");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.attendanceRecords.list.path] });
    },
  });
}

export function useClockOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attendanceId: number) => {
      const now = new Date();
      const res = await fetch(api.attendanceRecords.clockOut.path.replace(':id', attendanceId.toString()), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clockOut: now.toISOString() }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to clock out");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.attendanceRecords.list.path] });
    },
  });
}
