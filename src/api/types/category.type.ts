export interface Category {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export type CreateCategoryPayload = Omit<Category, 'id' | 'created_at'>;
export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export interface CategoryResponse {
  success: boolean;
  category?: Category;
  message: string;
}
