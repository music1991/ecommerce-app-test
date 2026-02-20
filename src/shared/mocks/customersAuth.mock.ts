import type { CustomerPublic } from "../../api/types/customer.types";
import type { AuthRoles } from "../../api/types/sales.types";

export type CustomerAuthUser = CustomerPublic & {
  password: string;
  role: typeof AuthRoles.Customer; 
};


// ========================================
// MOCK DATABASE
// key = email normalizado
// ========================================

export const MOCK_CUSTOMERS_AUTH_DB: Record<string, CustomerAuthUser> = {

  "user@techstore.com": {
    id: "3",

    tenant_id: "techstore",

    name: "Juan",
    email: "user@techstore.com",

    password: "User.1234",
    role: "customer",

    status: "active",

    dni: undefined,
    phone: undefined,
    address: undefined,

    initialDebt: 0,

    created_at: new Date().toISOString(),
  },

};