import type { CreateSalePayload, CreateSaleResponse, Sale } from "./types/sales.types";

// ========================================
// MOCK DATABASE & UTILS
// ========================================
const sleep = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const TENANT_ID = "techstore";

let lastId = 200;
let sales: any[] = []; 

/**
 * Calcula el total real basado en los items.
 * Se asegura de que quantity y price sean números válidos.
 */
function calcTotal(items: any[]) {
  return items.reduce((acc, it) => {
    const qty = Number(it.quantity) || 0;
    const price = Number(it.price) || 0;
    return acc + (qty * price);
  }, 0);
}

// ========================================
// CRUD IMPLEMENTATION (MOCK)
// ========================================

// 1) START / CREATE
export async function startSale(payload: any): Promise<any> {
  await sleep();

  if (!payload.items?.length) {
    return { success: false, message: "Debe agregar al menos 1 item para iniciar la venta." };
  }

  const now = new Date().toISOString();
  
  const sale = {
    id: ++lastId,
    tenant_id: TENANT_ID,
    
    // Datos del Actor (Cliente/Empleado/Invitado)
    actorType: payload.actorType || "cliente",
    actorId: payload.actorId || "anon",
    actorName: payload.actorName || "Consumidor Final",
    actorEmail: payload.actorEmail || null,

    // Estado y Tiempos
    status: payload.status || "pendiente", // pendiente | derivado | completada | cancelada
    createdAt: now,
    updatedAt: now,

    // Datos de Asignación (Staff que atiende)
    assignedToEmployeeId: payload.assignedToEmployeeId || null,
    assignedToEmployeeName: payload.assignedToEmployeeName || null,
    assignedToEmployeeEmail: payload.assignedToEmployeeEmail || null,

    // Contenido
    items: payload.items.map((it: any) => ({
      ...it,
      price: Number(it.price) || 0,
      quantity: Number(it.quantity) || 0
    })),
    total: calcTotal(payload.items),
    
    origin: payload.origin || "admin_panel",
  };

  sales = [sale, ...sales];

  return { success: true, sale, message: "Venta iniciada correctamente" };
}

// 2) COMPLETE
export async function completeSale(saleId: number, patch: any): Promise<any> {
  await sleep();

  const idx = sales.findIndex((s) => s.id === saleId);
  if (idx === -1) return { success: false, message: "Venta no encontrada." };

  sales[idx] = {
    ...sales[idx],
    ...patch,
    status: "completada",
    paidAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Registro de quién finalizó el cobro
    completedBy: patch.completedBy || {
      actorId: 'system',
      actorName: 'Cajero Automático'
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

  return { success: true, sale: sales[idx], message: "Venta derivada correctamente" };
}

// 4) LIST
export async function listSales(): Promise<any[]> {
  await sleep();
  return sales;
}

// ========================================
// REAL IMPLEMENTATION (FUTURO - GATEWAY / AXIOS)
// ========================================

/*
import { http } from "./http";

export async function startSale(payload: CreateSalePayload): Promise<CreateSaleResponse> {
  const response = await http.post("/admin/sales/start", payload, {
    headers: { "X-Tenant": TENANT_ID }
  });
  return response.data;
}

export async function completeSale(saleId: number, patch: any): Promise<CreateSaleResponse> {
  const response = await http.post(`/admin/sales/${saleId}/complete`, patch, {
    headers: { "X-Tenant": TENANT_ID }
  });
  return response.data;
}

export async function forwardSale(saleId: number, employeeId: string): Promise<CreateSaleResponse> {
  const response = await http.post(`/admin/sales/${saleId}/forward`, { employeeId }, {
    headers: { "X-Tenant": TENANT_ID }
  });
  return response.data;
}

export async function listSales(): Promise<Sale[]> {
  const response = await http.get("/admin/sales", {
    headers: { "X-Tenant": TENANT_ID }
  });
  return response.data;
}
*/

// ========================================
// FETCH VERSION (SIN AXIOS)
// ========================================

/*
export async function listSales(): Promise<Sale[]> {
  const res = await fetch("https://api.techstore.com", {
    method: "GET",
    headers: {
      "X-Tenant": TENANT_ID,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Error obteniendo ventas");
  return await res.json();
}
*/
