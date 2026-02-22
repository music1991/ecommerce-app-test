import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../../../core/entities/User";
import { useCartStore } from "../../cart/store/useCartStore";

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

        useCartStore.getState().adoptGuestCartIfUserEmpty();
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });

        useCartStore.getState().hydrate();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
); 

/*
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../../../core/entities/User";
import { useCartStore } from "../../cart/store/useCartStore";


interface Branch {
  id: number;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;    
  activeBranchId: number | null;  
  branches: Branch[];             
  isAuthenticated: boolean;
  

  login: (userData: User, token: string, branches: Branch[]) => void;
  setBranch: (branchId: number) => void; 
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      activeBranchId: null,
      branches: [],
      isAuthenticated: false,

      login: (userData, token, branches) => {

        const firstBranchId = branches.length > 0 ? branches[0].id : null; //revisar esto

        set({
          user: userData,
          token: token,
          branches: branches,
          activeBranchId: firstBranchId,
          isAuthenticated: true,
        });


        localStorage.setItem("token", token);

        useCartStore.getState().adoptGuestCartIfUserEmpty();
      },

      setBranch: (branchId) => set({ activeBranchId: branchId }),

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          activeBranchId: null, 
          branches: [], 
          isAuthenticated: false 
        });
        

        localStorage.removeItem("token");

        useCartStore.getState().hydrate();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
*/