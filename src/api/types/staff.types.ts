export type StaffRole = "admin" | "employee";
export type Status = "active" | "inactive" | "suspended";

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  password: string; // en mock existe
  role: StaffRole;
  status: Status;

  // opcionales si querés ir alineando con Laravel
  phone?: string;
  address?: string;
  dni?: string;

  // UI-only (por ahora)
  position?: string;
  startDate?: string;
};

export type CreateEmployeePayload = {
  name: string;
  email: string;
  password: string;
  status?: Status;

  phone?: string;
  address?: string;
  dni?: string;

  position?: string;  // UI-only
  startDate?: string; // UI-only
};

export type UpdateStaffPayload = Partial<Omit<CreateEmployeePayload, "password">> & {
  password?: string;
};

export type StaffResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};