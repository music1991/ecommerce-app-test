
// ========================================
// MOCK DATABASE (TEMPORAL)
// ========================================

import { MOCK_CUSTOMERS_AUTH_DB, type CustomerAuthUser } from "../shared/mocks/customersAuth.mock";
import apiClient from "./apiClient";
import type { CustomerRegisterPayload, CustomerRegisterResponse } from "./types/customer.types";

export async function listCustomers(params: { search?: string; tenant_id?: number; per_page?: number }) {

  let filtered = Object.values(MOCK_CUSTOMERS_AUTH_DB);

  // Lógica de búsqueda (Cortejo con el Back)
  if (params.search) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.dni.includes(q) || 
      c.email.toLowerCase().includes(q)
    );
  }

  // Limitamos resultados según per_page (def: 20)
  const limit = params.per_page || 20;
  const data = filtered.slice(0, limit);

  return {
    success: true,
    message: "Clientes obtenidos correctamente",
    data: {
      data: data, // El array real va dentro de data.data por la paginación del back
      current_page: 1,
      last_page: 1,
      total: filtered.length
    }
  };
}

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

function sleep() {
  throw new Error("Function not implemented.");
}


export async function registerCustomers(payload: any): Promise<any> {
  const backendBody = {
    tenant_id: "1", // Obligatorio del store
    name: payload.name,
    dni: payload.dni,
    phone: payload.phone,
    address: payload.address,
    email: payload.email,
    estado: payload.status || "activo" // Mapeamos status -> estado
  };

  const response = await apiClient.post("/api/customers", backendBody);
  return response.data;
}
/*
export async function listCustomers(params: { tenant_id: number; search?: string; estado?: string }) {
  const response = await http.get("/api/customers", { 
    params: {
      tenant_id: params.tenant_id,
      search: params.search,
      estado: params.estado,
      per_page: 20
    }
  });
  return response.data; // Viene paginado: res.data.data
}

export const getCustomerById = async (id: number | string) => {
  const res = await http.get(`/api/customers/${id}`);
  return res.data;
};

// PUT Editar: Campos opcionales
export const updateCustomer = async (id: number | string, patch: any) => {
  // Mapeamos status a estado si viene en el patch
  if (patch.status) {
    patch.estado = patch.status;
    delete patch.status;
  }
  const res = await http.put(`/api/customers/${id}`, patch);
  return res.data;
};

// DELETE: El back aclara que no lo borra físicamente, lo pasa a "inactivo"
export const deleteCustomer = async (id: number | string) => {
  const res = await http.delete(`/api/customers/${id}`);
  return res.data;
};
*/

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


