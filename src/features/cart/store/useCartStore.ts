import { create } from "zustand";
import type { Product } from "../../../core/entities/Product";

import { CART_GUEST_KEY, cartUserKey } from "../../../shared/storage/cartKeys";
import { useAuthStore } from "../../auth/store/authStore";

export interface CartItem extends Product {
  quantity: number;
}

type CartDB = { cart: CartItem[] };

const calcTotal = (cart: CartItem[]) =>
  cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

const readKey = () => {
  const user = useAuthStore.getState().user;
  return user ? cartUserKey(user.id) : CART_GUEST_KEY;
};

const readCart = (key: string): CartItem[] => {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return (JSON.parse(raw) as CartDB).cart ?? [];
  } catch {
    return [];
  }
};

const writeCart = (key: string, cart: CartItem[]) => {
  localStorage.setItem(key, JSON.stringify({ cart } satisfies CartDB));
};

interface CartState {
  cart: CartItem[];
  total: number;

  hydrate: () => void;

  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  cancelCart: () => void;

  // ✅ AL LOGIN: adopta guest solo si user no tenía carrito previo
  adoptGuestCartIfUserEmpty: () => void;

  getCartCount: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: [],
  total: 0,

  hydrate: () => {
    const key = readKey();
    const cart = readCart(key);
    set({ cart, total: calcTotal(cart) });
  },

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((i) => i.id === product.id);
      const newCart = existing
        ? state.cart.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...state.cart, { ...product, quantity: 1 }];

      const key = readKey();
      writeCart(key, newCart);

      return { cart: newCart, total: calcTotal(newCart) };
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const newCart = state.cart.filter((i) => i.id !== productId);

      const key = readKey();
      writeCart(key, newCart);

      return { cart: newCart, total: calcTotal(newCart) };
    }),

  clearCart: () => {
    const key = readKey();
    writeCart(key, []);
    set({ cart: [], total: 0 });
  },

  cancelCart: () => {
    const user = useAuthStore.getState().user;

    // si hay user => borrar su carrito
    if (user) {
      localStorage.removeItem(cartUserKey(user.id));
      set({ cart: [], total: 0 });
      return;
    }

    // si es guest => borrar guest
    localStorage.removeItem(CART_GUEST_KEY);
    set({ cart: [], total: 0 });
  },

  adoptGuestCartIfUserEmpty: () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const userKey = cartUserKey(user.id);

    const userCart = readCart(userKey);
    const guestCart = readCart(CART_GUEST_KEY);

    // ✅ si el user ya tiene carrito, NO adoptar guest
    // ✅ igual borramos guest
    if (userCart.length > 0) {
      localStorage.removeItem(CART_GUEST_KEY);
      set({ cart: userCart, total: calcTotal(userCart) });
      return;
    }

    // ✅ user no tiene carrito: adoptamos guest si hay
    if (guestCart.length > 0) {
      writeCart(userKey, guestCart);
      set({ cart: guestCart, total: calcTotal(guestCart) });
    } else {
      set({ cart: [], total: 0 });
    }

    // ✅ siempre borrar guest al login
    localStorage.removeItem(CART_GUEST_KEY);
  },

  getCartCount: () => get().cart.reduce((acc, item) => acc + item.quantity, 0),
}));