// ========================================
// STATUS / ROLE
// ========================================

export type CustomerStatus = "active" | "inactive" | "suspended";
export type UserRole = "customer";


// ========================================
// MODELO PÚBLICO (REUTILIZABLE)
// ========================================

export interface CustomerPublic {
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
}


// ========================================
// REGISTER
// ========================================

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
  customer: CustomerPublic;
  message: string;
}


// ========================================
// UPDATE (EDITAR)
// password es opcional
// ========================================

export type UpdateCustomerPayload = Partial<{
  name: string;
  email: string;
  password: string;

  dni: string;
  phone: string;
  address: string;

  initialDebt: number;
  status: CustomerStatus;
}>;

export interface UpdateCustomerResponse {
  success: boolean;
  customer?: CustomerPublic;
  message: string;
}


// ========================================
// DELETE
// ========================================

export interface DeleteCustomerResponse {
  success: boolean;
  message: string;
}


// ========================================
// LIST
// ========================================

export type ListCustomersResponse = CustomerPublic[];