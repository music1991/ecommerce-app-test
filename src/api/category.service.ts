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
import { http } from "./http"; // tu instancia de axios configurada

export async function getCategories(): Promise<Category[]> {
  const response = await http.get("/admin/categories", {
    headers: { "X-Tenant": "techstore" }
  });
  return response.data;
}

export async function createCategory(payload: CreateCategoryPayload): Promise<CategoryResponse> {
  const response = await http.post("/admin/categories", payload, {
    headers: { "X-Tenant": "techstore" }
  });
  return response.data;
}

export async function updateCategory(id: string, payload: UpdateCategoryPayload): Promise<CategoryResponse> {
  const response = await http.put(`/admin/categories/${id}`, payload);
  return response.data;
}

export async function deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
  const response = await http.delete(`/admin/categories/${id}`);
  return response.data;
}
*/

// ========================================
// FETCH VERSION (SIN DEPENDENCIAS)
// ========================================

/*
export async function createCategory(payload: CreateCategoryPayload): Promise<CategoryResponse> {
  const res = await fetch("https://api.techstore.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant": "techstore",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error al procesar la categoría");
  return await res.json();
}
*/
