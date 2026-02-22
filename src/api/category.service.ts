// ========================================
// MOCK DATABASE (TEMPORAL)
// ========================================
import { MOCK_CATEGORIES_DB } from "../shared/mocks/catetory.mock";
import type { 
  Category, 
  CategoryResponse, 
  CreateCategoryPayload, 
  UpdateCategoryPayload 
} from "./types/category.type";

// ========================================
// CRUD IMPLEMENTATION (MOCK)
// ========================================

export async function getCategories(): Promise<Category[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return Object.values(MOCK_CATEGORIES_DB);
}

export async function createCategory(
  payload: CreateCategoryPayload
): Promise<CategoryResponse> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const id = crypto.randomUUID();
  
  const newCategory: Category = {
    id,
    name: payload.name,
    description: payload.description,
    status: payload.status ?? "active",
    created_at: new Date().toISOString(),
  };

  MOCK_CATEGORIES_DB[id] = newCategory;

  return {
    success: true,
    category: newCategory,
    message: "Categoría creada correctamente",
  };
}

export async function updateCategory(
  id: string, 
  payload: UpdateCategoryPayload
): Promise<CategoryResponse> {
  await new Promise(resolve => setTimeout(resolve, 500));

  if (!MOCK_CATEGORIES_DB[id]) {
    throw new Error("La categoría no existe");
  }

  const updatedCategory = {
    ...MOCK_CATEGORIES_DB[id],
    ...payload,
  };

  MOCK_CATEGORIES_DB[id] = updatedCategory;

  return {
    success: true,
    category: updatedCategory,
    message: "Categoría actualizada correctamente",
  };
}

export async function deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!MOCK_CATEGORIES_DB[id]) {
    throw new Error("La categoría no existe");
  }
  
  delete MOCK_CATEGORIES_DB[id];
  
  return { 
    success: true, 
    message: "Categoría eliminada correctamente" 
  };
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

// GET: Lista categorías (con filtro opcional de activas)
export async function getCategories(tenantId: number, onlyActive: boolean = true): Promise<any> {
  const response = await http.get("/api/categories", {
    params: { 
      tenant_id: tenantId, 
      activas: onlyActive ? 1 : 0 
    }
  });
  // El back incluye products_count en cada categoría
  return response.data; 
}

// POST: Crear categoría
export async function createCategory(payload: any): Promise<any> {
  const backendBody = {
    tenant_id: payload.tenant_id,
    nombre_categoria: payload.name, // 🔄 Cambio: name -> nombre_categoria
    descripcion: payload.description
  };

  const response = await http.post("/api/categories", backendBody);
  return response.data;
}

// PUT: Actualizar categoría
export async function updateCategory(id: number | string, payload: any): Promise<any> {
  const backendBody = {
    nombre_categoria: payload.name,
    descripcion: payload.description,
    estado: payload.status === "active" // 🔄 Cambio: "active" -> true (boolean)
  };

  const response = await http.put(`/api/categories/${id}`, backendBody);
  return response.data;
}

// DELETE: Desactivar (estado = false)
export async function deleteCategory(id: number | string): Promise<any> {
  const response = await http.delete(`/api/categories/${id}`);
  return response.data;
}
*/