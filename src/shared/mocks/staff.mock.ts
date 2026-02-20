export type StaffRole = "admin" | "employee";
export type Status = "active" | "inactive" | "suspended";

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: StaffRole;
  status: Status;
};

export const MOCK_STAFF_DB: Record<string, StaffUser> = {
  "admin@techstore.com": {
    id: "1",
    name: "Boss",
    email: "admin@techstore.com",
    password: "Admin.123",
    role: "admin",
    status: "active",
  },
  "emp@techstore.com": {
    id: "2",
    name: "Ana",
    email: "emp@techstore.com",
    password: "Emp.1234",
    role: "employee",
    status: "active",
  },
};