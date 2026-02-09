import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../core/entities/Product';

// Estas interfaces son las que le faltan a tu archivo según la captura
interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  total: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      total: 0,
      addToCart: (product) => set((state) => {
        const existing = state.cart.find(item => item.id === product.id);
        const newCart = existing
          ? state.cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
          : [...state.cart, { ...product, quantity: 1 }];
        
        return { 
          cart: newCart, 
          total: newCart.reduce((acc, item) => acc + (item.price * item.quantity), 0) 
        };
      }),
      removeFromCart: (productId) => set((state) => {
        const newCart = state.cart.filter(item => item.id !== productId);
        return { 
          cart: newCart, 
          total: newCart.reduce((acc, item) => acc + (item.price * item.quantity), 0) 
        };
      }),
    }),
    { name: 'cart-storage' } // Esto evita que el carrito se vacíe al navegar
  )
);