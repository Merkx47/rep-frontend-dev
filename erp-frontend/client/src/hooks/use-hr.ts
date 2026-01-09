import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { InsertEmployee, InsertGrade, InsertSalaryComponent, InsertLeaveRequest, InsertPayrollRun } from "@shared/schema";
import { useAuth } from "./use-auth";

export function useEmployees() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  return useQuery({
    queryKey: [api.employees.list.path, tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const res = await fetch(`${api.employees.list.path}?tenantId=${tenantId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch employees");
      return await res.json();
    },
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Omit<InsertEmployee, "tenantId" | "userId">) => {
      if (!user?.tenantId) throw new Error("No tenant context");
      // Note: In a real app, we might also create a user account for the employee here
      const payload = { ...data, tenantId: user.tenantId };
      const res = await fetch(api.employees.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create employee");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.employees.list.path] });
    },
  });
}

// Grades Hooks
export function useGrades() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  return useQuery({
    queryKey: [api.grades.list.path, tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const res = await fetch(`${api.grades.list.path}?tenantId=${tenantId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch grades");
      return await res.json();
    },
  });
}

export function useGrade(id: string | undefined) {
  return useQuery({
    queryKey: [api.grades.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      const res = await fetch(api.grades.get.path.replace(':id', id!), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch grade");
      return await res.json();
    },
  });
}

export function useCreateGrade() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Omit<InsertGrade, "tenantId">) => {
      if (!user?.tenantId) throw new Error("No tenant context");
      const payload = { ...data, tenantId: user.tenantId };
      const res = await fetch(api.grades.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create grade");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.grades.list.path] });
    },
  });
}

export function useUpdateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertGrade> }) => {
      const res = await fetch(api.grades.update.path.replace(':id', id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update grade");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.grades.list.path] });
    },
  });
}

export function useDeleteGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(api.grades.delete.path.replace(':id', id), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete grade");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.grades.list.path] });
    },
  });
}

// Salary Components Hooks
export function useSalaryComponents(gradeId?: string) {
  return useQuery({
    queryKey: [api.salaryComponents.listByGrade.path, gradeId],
    enabled: !!gradeId,
    queryFn: async () => {
      const res = await fetch(api.salaryComponents.listByGrade.path.replace(':gradeId', gradeId!), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch salary components");
      return await res.json();
    },
  });
}

export function useAllSalaryComponents() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  return useQuery({
    queryKey: [api.salaryComponents.list.path, tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const res = await fetch(`${api.salaryComponents.list.path}?tenantId=${tenantId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch salary components");
      return await res.json();
    },
  });
}

export function useCreateSalaryComponent() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Omit<InsertSalaryComponent, "tenantId">) => {
      if (!user?.tenantId) throw new Error("No tenant context");
      const payload = { ...data, tenantId: user.tenantId };
      const res = await fetch(api.salaryComponents.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create salary component");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.salaryComponents.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.salaryComponents.listByGrade.path] });
    },
  });
}

export function useUpdateSalaryComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertSalaryComponent> }) => {
      const res = await fetch(api.salaryComponents.update.path.replace(':id', id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update salary component");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.salaryComponents.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.salaryComponents.listByGrade.path] });
    },
  });
}

export function useDeleteSalaryComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(api.salaryComponents.delete.path.replace(':id', id), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete salary component");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.salaryComponents.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.salaryComponents.listByGrade.path] });
    },
  });
}

// Leave Requests Hooks
export function useLeaveRequests() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  return useQuery({
    queryKey: [api.leaveRequests.list.path, tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const res = await fetch(`${api.leaveRequests.list.path}?tenantId=${tenantId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch leave requests");
      return await res.json();
    },
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Omit<InsertLeaveRequest, "tenantId">) => {
      if (!user?.tenantId) throw new Error("No tenant context");
      const payload = { ...data, tenantId: user.tenantId };
      const res = await fetch(api.leaveRequests.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create leave request");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.leaveRequests.list.path] });
    },
  });
}

export function useApproveLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(api.leaveRequests.approve.path.replace(':id', id), {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to approve leave request");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.leaveRequests.list.path] });
    },
  });
}

export function useRejectLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(api.leaveRequests.reject.path.replace(':id', id), {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to reject leave request");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.leaveRequests.list.path] });
    },
  });
}

// Payroll Hooks
export function usePayrollRuns() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  return useQuery({
    queryKey: [api.payrollRuns.list.path, tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const res = await fetch(`${api.payrollRuns.list.path}?tenantId=${tenantId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch payroll runs");
      return await res.json();
    },
  });
}

export function usePayrollRun(id: string | undefined) {
  return useQuery({
    queryKey: [api.payrollRuns.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      const res = await fetch(api.payrollRuns.get.path.replace(':id', id!), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch payroll run");
      return await res.json();
    },
  });
}

export function useCreatePayrollRun() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Omit<InsertPayrollRun, "tenantId">) => {
      if (!user?.tenantId) throw new Error("No tenant context");
      const payload = { ...data, tenantId: user.tenantId };
      const res = await fetch(api.payrollRuns.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create payroll run");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.payrollRuns.list.path] });
    },
  });
}

export function useProcessPayrollRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(api.payrollRuns.process.path.replace(':id', id), {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to process payroll run");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.payrollRuns.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.payrollRecords.list.path] });
    },
  });
}

export function useApprovePayrollRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(api.payrollRuns.approve.path.replace(':id', id), {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to approve payroll run");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.payrollRuns.list.path] });
    },
  });
}

export function useMarkPayrollRunPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(api.payrollRuns.markPaid.path.replace(':id', id), {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to mark payroll run as paid");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.payrollRuns.list.path] });
    },
  });
}

// Payroll Records Hooks
export function usePayrollRecords(payrollRunId?: string) {
  return useQuery({
    queryKey: [api.payrollRecords.list.path, payrollRunId],
    enabled: !!payrollRunId,
    queryFn: async () => {
      const res = await fetch(`${api.payrollRecords.list.path}?payrollRunId=${payrollRunId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch payroll records");
      return await res.json();
    },
  });
}

export function useEmployeePayrollRecords(employeeId?: string) {
  return useQuery({
    queryKey: [api.payrollRecords.getByEmployee.path, employeeId],
    enabled: !!employeeId,
    queryFn: async () => {
      const res = await fetch(api.payrollRecords.getByEmployee.path.replace(':employeeId', employeeId!), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch employee payroll records");
      return await res.json();
    },
  });
}

export function usePayslip(recordId: string | undefined) {
  return useQuery({
    queryKey: [api.payrollRecords.getPayslip.path, recordId],
    enabled: !!recordId,
    queryFn: async () => {
      const res = await fetch(api.payrollRecords.getPayslip.path.replace(':id', recordId!), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch payslip");
      return await res.json();
    },
  });
}
