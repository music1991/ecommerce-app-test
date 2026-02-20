import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../../../core/entities/User";
import { useCartStore } from "../../cart/store/useCartStore";

// 👇 IMPORTANTE: importar el cart store


interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
        });

        // ✅ al login: si user ya tenía carrito, se usa ese y se borra guest
        // ✅ si user no tenía carrito, se adopta guest y se borra guest
        useCartStore.getState().adoptGuestCartIfUserEmpty();
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });

        // ✅ al logout volvés a modo invitado => leer cart:guest
        useCartStore.getState().hydrate();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);