import type { CreateSalePayload, CreateSaleResponse, Sale } from "./types/sales.types";

const sleep = (ms = 300) => new Promise((r) => setTimeout(r, ms));

let lastId = 200;
let sales: any[] = []; // Usamos any temporalmente para permitir los nuevos campos de actor

/**
 * Calcula el total real basado en el precio de los items.
 * Si el item no tiene precio, usamos 1000 como fallback.
 */
function calcTotal(items: any[]) {
  return items.reduce((acc, it) => acc + (it.quantity * (it.price || 1000)), 0);
}

// 1) START / CREATE
export async function startSale(payload: any): Promise<any> {
  await sleep();

  if (!payload.items?.length) {
    return { success: false, message: "Debe agregar al menos 1 item." };
  }

  const now = new Date().toISOString();
  
  // Mapeamos el payload a la estructura que vimos en tu consola (Imagen)
  const sale = {
    id: ++lastId,
    
    // Datos del Actor (Cliente/Empleado)
    actorType: payload.actorType || "cliente",
    actorId: payload.actorId || "anon",
    actorName: payload.actorName || "Cliente Online",
    actorEmail: payload.actorEmail || null, // ✅ AGREGADO

    // Estado y Tiempos
    status: payload.status || "cargando",
    createdAt: now,
    updatedAt: now,

    // Datos de Asignación (Staff)
    assignedToEmployeeId: payload.assignedToEmployeeId || null,
    assignedToEmployeeName: payload.assignedToEmployeeName || null,
    assignedToEmployeeEmail: payload.assignedToEmployeeEmail || null,

    // Contenido
    items: payload.items,
    total: calcTotal(payload.items),
    
    // Datos heredados de la estructura anterior (opcionales)
    tenant_id: "techstore",
    origin: payload.origin || "admin",
  };

  sales = [sale, ...sales];

  return { success: true, sale, message: "Venta iniciada correctamente" };
}

// 2) COMPLETE
export async function completeSale(
  saleId: number,
  patch: any
): Promise<any> {
  await sleep();

  const idx = sales.findIndex((s) => s.id === saleId);
  if (idx === -1) return { success: false, message: "Venta no encontrada." };

  // Actualizamos la venta con los datos de finalización
  sales[idx] = {
    ...sales[idx],
    ...patch,
    status: "completada",
    paidAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Snapshot de quién cerró la venta
    completedBy: patch.completedBy || {
      actorType: 'empleado',
      actorId: 'emp-001',
      actorName: 'Empleado de Turno'
    }
  };

  return { success: true, sale: sales[idx], message: "Venta completada con éxito" };
}

// 3) FORWARD / DERIVAR
export async function forwardSale(saleId: number, employeeData: any): Promise<any> {
  await sleep();

  const idx = sales.findIndex((s) => s.id === saleId);
  if (idx === -1) return { success: false, message: "Venta no encontrada." };

  sales[idx] = {
    ...sales[idx],
    status: "derivado",
    assignedToEmployeeId: employeeData.id,
    assignedToEmployeeName: employeeData.name,
    assignedToEmployeeEmail: employeeData.email,
    updatedAt: new Date().toISOString(),
  };

  return { success: true, sale: sales[idx], message: "Venta derivada al empleado" };
}

// Listar ventas
export async function listSales(): Promise<any[]> {
  await sleep();
  return sales;
}
// ========================================
// REAL IMPLEMENTATION (FUTURO - GATEWAY)
// ========================================

// import { http } from "./http"; // axios instance

/*
const TENANT_ID = "techstore";

export async function startSale(payload: CreateSalePayload): Promise<CreateSaleResponse> {
  const response = await http.post("/sales/start", payload, {
    headers: {
      "X-Tenant": TENANT_ID,
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function completeSale(
  saleId: number,
  patch: { payment_method: string; cash_received?: number | null; customer_id?: number | null }
): Promise<CreateSaleResponse> {
  const response = await http.post(`/sales/${saleId}/complete`, patch, {
    headers: {
      "X-Tenant": TENANT_ID,
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function forwardSale(
  saleId: number,
  forward_to_branch_id: number
): Promise<CreateSaleResponse> {
  const response = await http.post(`/sales/${saleId}/forward`, { forward_to_branch_id }, {
    headers: {
      "X-Tenant": TENANT_ID,
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function listSales(): Promise<Sale[]> {
  const response = await http.get("/sales", {
    headers: {
      "X-Tenant": TENANT_ID,
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`,
    },
  });
  return response.data;
}
*/


// ========================================
// FETCH VERSION (SIN AXIOS)
// ========================================

/*
const API_BASE = "https://api.techstore.com";
const TENANT_ID = "techstore";

export async function startSale(payload: CreateSalePayload): Promise<CreateSaleResponse> {
  const res = await fetch(`${API_BASE}/sales/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant": TENANT_ID,
      // "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error iniciando venta");
  return await res.json();
}

export async function completeSale(
  saleId: number,
  patch: { payment_method: string; cash_received?: number | null; customer_id?: number | null }
): Promise<CreateSaleResponse> {
  const res = await fetch(`${API_BASE}/sales/${saleId}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant": TENANT_ID,
      // "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(patch),
  });

  if (!res.ok) throw new Error("Error completando venta");
  return await res.json();
}

export async function forwardSale(saleId: number, forward_to_branch_id: number): Promise<CreateSaleResponse> {
  const res = await fetch(`${API_BASE}/sales/${saleId}/forward`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant": TENANT_ID,
      // "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ forward_to_branch_id }),
  });

  if (!res.ok) throw new Error("Error derivando venta");
  return await res.json();
}

export async function listSales(): Promise<Sale[]> {
  const res = await fetch(`${API_BASE}/sales`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant": TENANT_ID,
      // "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error listando ventas");
  return await res.json();
}
*/