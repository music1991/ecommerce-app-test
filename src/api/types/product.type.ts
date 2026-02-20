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

  // UI (tu catálogo actual)
  category?: string;
  images?: string[];
  isNew?: boolean;

  created_at: string;
  updated_at?: string;
};

export type ProductSpecs = Record<string, string>;

export type ProductWithDetails = ProductPublic & {
  longDescription?: string;
  specs?: ProductSpecs; // agregado desde la "tabla" specs
};

// Create/Update payloads
export type CreateProductPayload = {
  name: string;
  description?: string;
  price: number;

  stock: number;
  min_stock: number;

  barcode?: string;
  active?: boolean;

  // UI
  category?: string;
  images?: string[];
  isNew?: boolean;
  longDescription?: string;

  // specs separados
  specs?: ProductSpecs;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type ProductsQuery = {
  search?: string;
  status?: ProductStatusFilter; // active/inactive/all
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};