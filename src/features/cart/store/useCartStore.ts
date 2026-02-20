import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../../../core/entities/Product";

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  total: number;

  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      total: 0,

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);

          const newCart = existing
            ? state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            : [...state.cart, { ...product, quantity: 1 }];

          const newTotal = newCart.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          );

          return { cart: newCart, total: newTotal };
        }),

      removeFromCart: (productId) =>
        set((state) => {
          const newCart = state.cart.filter((item) => item.id !== productId);

          const newTotal = newCart.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          );

          return { cart: newCart, total: newTotal };
        }),

      clearCart: () => set({ cart: [], total: 0 }),

      getCartCount: () => get().cart.reduce((acc, item) => acc + item.quantity, 0),
    }),
    { name: "cart-storage" }
  )
);
