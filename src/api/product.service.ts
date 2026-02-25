import { MOCK_PRODUCTS_DB, PRODUCT_SPECS_DB } from "../shared/mocks/producto.mock";
import apiClient from "./apiClient";
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



// GET: Lista paginada con filtros avanzados
export async function listProductss(query?: any): Promise<any> {
  const response = await apiClient.get("/api/products", {
    params: {
      tenant_id: query?.tenant_id,
      branch_id: query?.branch_id,
      category_id: query?.category !== "all" ? query?.category : null,
      search: query?.search,
      marca: query?.marca,
      low_stock: query?.low_stock ? 1 : 0,
      per_page: query?.per_page || 20
    }
  });
  // El back devuelve { data: { data: [productos], current_page... } }
  return response.data;
}

/*

// POST: Crear producto (Genera movimiento de stock inicial 'in')
export async function createProduct(payload: any): Promise<any> {
  const backendBody = {
    tenant_id: payload.tenant_id,
    branch_id: payload.branch_id || null,
    category_id: payload.category_id,
    name: payload.name,
    description: payload.description,
    specifications: payload.specs, // Mandar el array de {nombre, valor}
    price: payload.price,
    iva: payload.iva || 21,
    stock: payload.stock,
    min_stock: payload.min_stock,
    barcode: payload.barcode,
    peso_dimensiones: payload.dimensions,
    marca: payload.marca
  };

  const response = await http.post("/api/products", backendBody);
  return response.data;
}

// GET: Detalle con imágenes y movimientos de stock
export async function getProductById(id: number | string): Promise<any> {
  const response = await http.get(`/api/products/${id}`);
  return response.data;
}

// PUT: Actualización (Genera movimiento 'adjustment' si cambia stock)
export async function updateProduct(id: number | string, patch: any): Promise<any> {
  const response = await http.put(`/api/products/${id}`, {
    ...patch,
    stock_reason: patch.reason || "Actualización desde panel"
  });
  return response.data;
}

// DELETE: Soft-delete (active = false)
export async function deactivateProduct(id: number | string): Promise<any> {
  const response = await http.delete(`/api/products/${id}`);
  return response.data;
}
  */

/* // IMÁGENES: Gestión individual
export async function addProductImage(productId: number, imageUrl: string, position: number = 0) {
  return (await http.post(`/api/products/${productId}/images`, { 
    url_imagen: imageUrl, 
    posicion: position 
  })).data;
}

export async function deleteProductImage(
  productId: number | string, 
  imageId: number | string
): Promise<any> {
  const response = await http.delete(`/api/products/${productId}/images/${imageId}`);
  return response.data;
}



export async function getStockMovements(
  productId: number | string, 
  page: number = 1
): Promise<any> {
  const response = await http.get(`/api/products/${productId}/stock-movements`, {
    params: { 
      per_page: 20,
      page: page 
    }
  });
  // El back incluye user.name para saber QUIÉN hizo el movimiento
  return response.data;
}


export async function stockIn(
  productId: number | string, 
  quantity: number, 
  reason: string
): Promise<any> {
  const response = await http.post(`/api/products/${productId}/stock-in`, {
    quantity, // ✅ Coincide con el back
    reason    // ✅ Coincide con el back
  });
  return response.data;
}


export async function stockOut(
  productId: number | string, 
  quantity: number, 
  reason: string
): Promise<any> {
  // Nota: El back puede devolver 422 si intentás sacar más de lo que hay
  const response = await http.post(`/api/products/${productId}/stock-out`, {
    quantity,
    reason
  });
  return response.data;
}
 */
