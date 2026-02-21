export type ProductStatusFilter = "active" | "inactive" | "all";

export type ProductPublic = {
  id: string;
  tenant_id: string;

  name: string;
  description?: string;

  price: number;

  stock: number;
  min_stock: number;

  barcode: string;

  active: boolean;

  /** 
   * Referencia al ID de la categoría (ej: "cat-1") 
   * Vinculado al módulo de Catálogo > Categorías
   */
  category?: string; 
  
  images?: string[];
  isNew?: boolean;

  created_at: string;
  updated_at?: string;
};

export type ProductSpecs = Record<string, string>;

export type ProductWithDetails = ProductPublic & {
  longDescription?: string;
  specs?: ProductSpecs; // Agregado desde la "tabla" specs en el mock
};

// ========================================
// Create/Update Payloads
// ========================================

export type CreateProductPayload = {
  name: string;
  description?: string;
  price: number;

  stock: number;
  min_stock: number;

  barcode?: string;
  active?: boolean;

  // UI & Catálogo
  category?: string; // Se envía el ID de la categoría seleccionada
  images?: string[];
  isNew?: boolean;
  longDescription?: string;

  // Specs detallados
  specs?: ProductSpecs;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

// ========================================
// Query & API Response
// ========================================

export type ProductsQuery = {
  search?: string;
  category?: string; // ✅ Agregado: para filtrar por ID de categoría en el listado
  status?: ProductStatusFilter; // active/inactive/all
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};
