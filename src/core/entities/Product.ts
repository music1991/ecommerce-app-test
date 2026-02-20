export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  isNew?: boolean;
  specs?: Record<string, string>; 
}