import type { Category } from "../../api/types/category.type";

export const MOCK_CATEGORIES_DB: Record<string, Category> = {
  "cat-1": {
    id: "cat-1",
    name: "Laptops",
    description: "Equipos portátiles de alto rendimiento",
    status: "active",
    created_at: new Date().toISOString(),
  },
  "cat-2": {
    id: "cat-2",
    name: "Smartphones",
    description: "Última tecnología en móviles y tablets",
    status: "active",
    created_at: new Date().toISOString(),
  },
  "cat-3": {
    id: "cat-3",
    name: "Componentes",
    description: "Hardware, placas de video y procesadores",
    status: "active",
    created_at: new Date().toISOString(),
  }
};