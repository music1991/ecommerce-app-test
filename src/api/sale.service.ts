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
import axios from "axios";

export const http = axios.create({
  baseURL: "https://api.techstore.com", // La URL de tu backender
  headers: {
    "Content-Type": "application/json",
  },
});

// 1) INICIAR VENTA (POST)
export async function startSale(payload: any): Promise<any> {
  // El back espera IDs de productos y cantidades. El total lo calcula él.
  const backendBody = {
    tenant_id: payload.tenant_id,
    branch_id: payload.branch_id,
    cliente_id: payload.actorId !== "anon" ? payload.actorId : null,
    items: payload.items.map((it: any) => ({
      producto_id: it.id,
      cantidad: it.quantity,
      precio_unitario: it.price // Opcional si el back usa el precio actual
    })),
    metodo_pago: payload.paymentMethod || "efectivo",
    estado: "pendiente" 
  };

  const response = await http.post("/api/sales", backendBody);
  return response.data;
}

// 2) COMPLETAR VENTA (POST/PUT)
export async function completeSale(saleId: number, paymentData: any): Promise<any> {
  // El back registra el pago y descuenta stock definitivamente
  const response = await http.post(`/api/sales/${saleId}/complete`, {
    metodo_pago: paymentData.metodo_pago,
    monto_recibido: paymentData.monto_recibido
  });
  return response.data;
}

// 3) DERIVAR VENTA (PATCH)
export async function forwardSale(saleId: number, employeeId: number): Promise<any> {
  // Asigna la venta a otro empleado (ej: del vendedor al cajero)
  const response = await http.patch(`/api/sales/${saleId}/forward`, {
    empleado_id: employeeId
  });
  return response.data;
}

// 4) LISTAR VENTAS (GET)
export async function listSales(filters: any): Promise<any> {
  const response = await http.get("/api/sales", {
    params: {
      tenant_id: filters.tenant_id,
      branch_id: filters.branch_id,
      estado: filters.status, // pendiente, completada, cancelada
      fecha: filters.date
    }
  });
  return response.data; // Paginado: res.data.data
}
*/