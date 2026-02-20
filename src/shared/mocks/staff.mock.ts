export type StaffRole = "admin" | "employee";
export type Status = "active" | "inactive" | "suspended";

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: StaffRole;
  status: Status;
  phone: string;
  address: string;
  dni: string,
  position: string;
  startDate: string;
};

export const MOCK_STAFF_DB: Record<string, StaffUser> = {
  "admin@techstore.com": {
    id: "1",
    name: "Boss",
    email: "admin@techstore.com",
    password: "Admin.123",
    role: "admin",
    status: "active",
    phone: "42525",
    address: "aa",
    dni: "333",
    position: "aa",
    startDate: "20/10/2025",
  },
  "emp@techstore.com": {
    id: "2",
    name: "Ana",
    email: "emp@techstore.com",
    password: "Emp.1234",
    role: "employee",
    status: "active",
    phone: "42525",
    address: "aa",
    dni: "2",
        position: "aa",
    startDate: "20/10/2025",
  },
};