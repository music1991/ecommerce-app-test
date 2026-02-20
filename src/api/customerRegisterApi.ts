
// ========================================
// MOCK DATABASE (TEMPORAL)
// ========================================

import { MOCK_CUSTOMERS_AUTH_DB, type CustomerAuthUser } from "../shared/mocks/customersAuth.mock";
import type { CustomerRegisterPayload, CustomerRegisterResponse } from "./types/customer.types";


export async function registerCustomer(
  payload: CustomerRegisterPayload
): Promise<CustomerRegisterResponse> {

  await new Promise(resolve => setTimeout(resolve, 500));

  const emailKey = payload.email.toLowerCase().trim();

  if (MOCK_CUSTOMERS_AUTH_DB[emailKey]) {
    throw new Error("Ese email ya está registrado.");
  }

  const newCustomer: CustomerAuthUser = {
    id: crypto.randomUUID(),

    tenant_id: "techstore",

    name: payload.name,
    email: emailKey,

    password: payload.password,
    role: "customer",

    status: payload.status ?? "active",

    dni: payload.dni,
    phone: payload.phone,
    address: payload.address,

    initialDebt: payload.initialDebt ?? 0,

    created_at: new Date().toISOString(),
  };

  MOCK_CUSTOMERS_AUTH_DB[emailKey] = newCustomer;

  return {
    success: true,
    customer: {
      id: newCustomer.id,
      tenant_id: newCustomer.tenant_id,

      name: newCustomer.name,
      email: newCustomer.email,

      dni: newCustomer.dni,
      phone: newCustomer.phone,
      address: newCustomer.address,

      status: newCustomer.status,
      initialDebt: newCustomer.initialDebt,

      created_at: newCustomer.created_at,
    },
    message: "Cliente registrado correctamente",
  };
}

// ========================================
// REAL IMPLEMENTATION (FUTURO - GATEWAY)
// ========================================

// import { http } from "./http"; // axios instance

/*
export async function registerCustomer(
  payload: CustomerRegisterPayload
): Promise<CustomerRegisterResponse> {

  const response = await http.post(
    "/public/customers/register",
    payload,
    {
      headers: {
        "X-Tenant": "techstore", // o dinámico
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
*/


// ========================================
// FETCH VERSION (SIN AXIOS)
// ========================================

/*
export async function registerCustomer(
  payload: CustomerRegisterPayload
): Promise<CustomerRegisterResponse> {

  const res = await fetch(
    "https://api.techstore.com/public/customers/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant": "techstore",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error("Error registrando cliente");
  }

  return await res.json();
}
*/