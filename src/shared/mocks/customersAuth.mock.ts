export type CustomerAuthUser = {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  password: string;  
  role: "customer";   
  status: "active" | "inactive" | "suspended";
  dni?: string;
  phone?: string;
  address?: string;
  initialDebt: number;
  created_at: string;
};

export const MOCK_CUSTOMERS_AUTH_DB: Record<string, CustomerAuthUser> = {
  "user@techstore.com": {
    id: "3",
    tenant_id: "techstore",
    name: "Juan",
    email: "user@techstore.com",
    password: "User.1234",
    role: "customer",
    status: "active",
    initialDebt: 0,
    created_at: new Date().toISOString(),
  },
};