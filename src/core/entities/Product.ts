// src/core/entities/Product.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string; // El "?" lo hace opcional
  price: number;
  category: string;
  images: string[];
  stock: number;
  isNew?: boolean;
  // Este es el campo para los detalles técnicos (clave: valor)
  specs?: Record<string, string>; 
}