export type CustomerStatus = "active" | "inactive" | "suspended";
export type UserRole = "customer"

export interface CustomerRegisterPayload {
  name: string;
  email: string;
  password: string;

  dni?: string;
  phone?: string;
  address?: string;

  initialDebt?: number;

  status?: CustomerStatus;
}

export interface CustomerRegisterResponse {
  success: boolean;

  customer: {
    id: string;
    tenant_id: string;

    name: string;
    email: string;

    dni?: string;
    phone?: string;
    address?: string;

    status: CustomerStatus;

    initialDebt: number;

    created_at: string;
  };

  message: string;
}