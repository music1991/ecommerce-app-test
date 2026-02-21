import { MOCK_PRODUCTS_DB, PRODUCT_SPECS_DB } from "../shared/mocks/producto.mock";
import type {
  ApiResponse,
  CreateProductPayload,
  ProductWithDetails,
  ProductsQuery,
  UpdateProductPayload,
  ProductPublic,
} from "./types/product.type";

const sleep = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const TENANT_ID = "techstore";

// ========================================
// UTILS & HELPERS
// ========================================

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function generateBarcode() {
  const n = Math.floor(1000000 + Math.random() * 9000000);
  return `SYS-${TENANT_ID}-${n}`;
}

function ensureUniqueBarcode(barcode?: string) {
  let code = barcode?.trim() || "";
  if (!code) code = generateBarcode();
  const exists = (b: string) => MOCK_PRODUCTS_DB.some((p) => p.tenant_id === TENANT_ID && p.barcode === b);
  while (exists(code)) code = generateBarcode();
  return code;
}

function attachDetails(p: ProductPublic): ProductWithDetails {
  return {
    ...p,
    specs: PRODUCT_SPECS_DB[p.id] ?? {},
  };
}

// ========================================
// CRUD IMPLEMENTATION (MOCK)
// ========================================

export async function listProducts(query?: ProductsQuery): Promise<ApiResponse<ProductWithDetails[]>> {
  await sleep();

  let rows = [...MOCK_PRODUCTS_DB].filter((p) => p.tenant_id === TENANT_ID);

  // Búsqueda por nombre o código
  if (query?.search?.trim()) {
    const s = normalize(query.search);
    rows = rows.filter((p) => normalize(p.name).includes(s) || normalize(p.barcode).includes(s));
  }

  // Filtro por Categoría (Usa el ID: cat-1, cat-2, etc.)
  if (query?.category && query.category !== "all") {
    rows = rows.filter((p) => p.category === query.category);
  }

  // Filtro por Estado
  if (query?.status && query.status !== "all") {
    rows = rows.filter((p) => (query.status === "active" ? p.active : !p.active));
  }

  rows.sort((a, b) => (b.created_at > a.created_at ? 1 : -1));

  return { success: true, message: "OK", data: rows.map(attachDetails) };
}

export async function createProduct(payload: CreateProductPayload): Promise<ApiResponse<ProductWithDetails>> {
  await sleep();

  // Validaciones
  if (!payload.name?.trim()) return { success: false, message: "Nombre requerido" };
  if (!payload.category) return { success: false, message: "La categoría es obligatoria" };
  if (payload.price == null || payload.price < 0) return { success: false, message: "Precio inválido" };

  const barcode = ensureUniqueBarcode(payload.barcode);

  const newRow: ProductPublic = {
    id: crypto.randomUUID(),
    tenant_id: TENANT_ID,
    name: payload.name.trim(),
    description: payload.description?.trim() || undefined,
    price: Number(payload.price),
    stock: Math.floor(Number(payload.stock || 0)),
    min_stock: Math.floor(Number(payload.min_stock || 0)),
    barcode,
    active: payload.active ?? true,
    category: payload.category, // Almacena ID de categoría
    images: payload.images ?? [],
    isNew: payload.isNew ?? false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  MOCK_PRODUCTS_DB.unshift(newRow);
  if (payload.specs) PRODUCT_SPECS_DB[newRow.id] = payload.specs;

  return { success: true, message: "Producto creado exitosamente en el catálogo.", data: attachDetails(newRow) };
}

export async function updateProduct(id: string, patch: UpdateProductPayload): Promise<ApiResponse<ProductWithDetails>> {
  await sleep();

  const idx = MOCK_PRODUCTS_DB.findIndex((p) => p.id === id && p.tenant_id === TENANT_ID);
  if (idx === -1) return { success: false, message: "Producto no encontrado" };

  const current = MOCK_PRODUCTS_DB[idx];
  const nextBarcode = patch.barcode !== undefined ? ensureUniqueBarcode(patch.barcode) : current.barcode;

  const updated: ProductPublic = {
    ...current,
    ...patch,
    name: patch.name !== undefined ? patch.name.trim() : current.name,
    barcode: nextBarcode,
    updated_at: new Date().toISOString(),
  };

  MOCK_PRODUCTS_DB[idx] = updated;
  if (patch.specs !== undefined) PRODUCT_SPECS_DB[id] = patch.specs ?? {};

  return { success: true, message: "Producto actualizado correctamente.", data: attachDetails(updated) };
}

export async function deactivateProduct(id: string): Promise<ApiResponse<null>> {
  await sleep();
  const idx = MOCK_PRODUCTS_DB.findIndex((p) => p.id === id && p.tenant_id === TENANT_ID);
  if (idx === -1) return { success: false, message: "Producto no encontrado" };

  MOCK_PRODUCTS_DB[idx] = { ...MOCK_PRODUCTS_DB[idx], active: false, updated_at: new Date().toISOString() };
  return { success: true, message: "Producto desactivado del catálogo exitosamente.", data: null };
}

// ========================================
// REAL IMPLEMENTATION (FUTURO - GATEWAY / AXIOS)
// ========================================

/*
import { http } from "./http"; // instancia de axios configurada

const TENANT_ID = "techstore";

export async function listProducts(query?: ProductsQuery): Promise<ApiResponse<ProductWithDetails[]>> {
  const response = await http.get("/admin/products", {
    params: query,
    headers: {
      "X-Tenant": TENANT_ID,
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`, // cuando exista auth real
    },
  });
  return response.data;
}

export async function createProduct(payload: CreateProductPayload): Promise<ApiResponse<ProductWithDetails>> {
  const response = await http.post("/admin/products", payload, {
    headers: {
      "X-Tenant": TENANT_ID,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function updateProduct(id: string, patch: UpdateProductPayload): Promise<ApiResponse<ProductWithDetails>> {
  const response = await http.put(`/admin/products/${id}`, patch, {
    headers: {
      "X-Tenant": TENANT_ID,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

// Soft delete (Laravel): active=false en el back
export async function deactivateProduct(id: string): Promise<ApiResponse<null>> {
  const response = await http.delete(`/admin/products/${id}`, {
    headers: {
      "X-Tenant": TENANT_ID,
      "Content-Type": "application/json",
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

export async function listProducts(query?: ProductsQuery): Promise<ApiResponse<ProductWithDetails[]>> {
  const params = new URLSearchParams();

  if (query?.search) params.set("search", query.search);
  if (query?.category) params.set("category", query.category); // ✅ Filtro por ID de categoría
  if (query?.status && query.status !== "all") params.set("status", query.status);

  const res = await fetch(`${API_BASE}/admin/products?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant": TENANT_ID,
    },
  });

  if (!res.ok) throw new Error("Error listando productos del catálogo");
  return await res.json();
}

export async function createProduct(payload: CreateProductPayload): Promise<ApiResponse<ProductWithDetails>> {
  const res = await fetch(`${API_BASE}/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant": TENANT_ID,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error creando producto");
  return await res.json();
}

export async function updateProduct(id: string, patch: UpdateProductPayload): Promise<ApiResponse<ProductWithDetails>> {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant": TENANT_ID,
    },
    body: JSON.stringify(patch),
  });

  if (!res.ok) throw new Error("Error actualizando producto");
  return await res.json();
}

export async function deactivateProduct(id: string): Promise<ApiResponse<null>> {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant": TENANT_ID,
    },
  });

  if (!res.ok) throw new Error("Error desactivando producto");
  return await res.json();
}
*/
