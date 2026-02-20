import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../../../core/entities/Product";
import type { Sale as SaleModel } from "./useSalesStore"; 

export type SaleStatus = "cargando" | "finalizar_en_local" | "derivado" | "completada";
export type SaleActorType = "cliente" | "empleado" | "admin";

export type SaleItem = Pick<Product, "id" | "name" | "price" | "images"> & {
  quantity: number;
};

export interface Sale {
  id: number;

  actorType: SaleActorType;
  actorId: string;
  actorName?: string;

  createdAt: string;
  status: SaleStatus;

  assignedToEmployeeId?: string | null;

  items: SaleItem[];
  total: number;

  paidAt?: string;
  completedBy?: {
    actorType: SaleActorType;
    actorId: string;
    actorName?: string;
  };
}

interface ActiveSaleData {
  actorName?: string;
  assignedToEmployeeId?: string | null;
  items: SaleItem[];
  total: number;
}

interface SalesState {
  lastId: number;
  sales: Sale[];

  getActiveSaleByActor: (actorType: SaleActorType, actorId: string) => Sale | undefined;

  createOrUpdateActiveSale: (
    actorType: SaleActorType,
    actorId: string,
    data: ActiveSaleData
  ) => Sale;
deriveSale: (saleId: number, employeeId: string) => void;
  createSale: (data: Omit<Sale, "id">) => Sale;
  updateSale: (saleId: number, patch: Partial<Omit<Sale, "id">>) => void;
  deleteSale: (saleId: number) => void;

  markFinalizeInLocal: (saleId: number) => void;
  completeSale: (saleId: number, completedBy?: Sale["completedBy"]) => void;

  assignSale: (saleId: number, employeeId: string) => void;

  getSaleById: (saleId: number) => Sale | undefined;
  getSalesByActor: (actorType: SaleActorType, actorId: string) => Sale[];
  getPendingSales: () => Sale[];
  getFinalizeInLocalSales: () => Sale[];
  
}

export const useSalesStore = create<SalesState>()(
  persist(
    (set, get) => ({
      lastId: 0,
      sales: [],

      getActiveSaleByActor: (actorType, actorId) =>
        get().sales.find(
          (s) =>
            s.actorType === actorType &&
            s.actorId === actorId &&
            (s.status === "cargando" || s.status === "finalizar_en_local")
        ),

      createOrUpdateActiveSale: (actorType, actorId, data) => {
        const active = get().sales.find(
          (s) =>
            s.actorType === actorType &&
            s.actorId === actorId &&
            (s.status === "cargando" || s.status === "finalizar_en_local")
        );

        if (active) {
          set((state) => ({
            sales: state.sales.map((x) =>
              x.id === active.id
                ? {
                    ...x,
                    actorName: data.actorName ?? x.actorName,
                    assignedToEmployeeId:
                      data.assignedToEmployeeId ?? x.assignedToEmployeeId ?? null,
                    items: data.items,
                    total: data.total,
                  }
                : x
            ),
          }));

          return {
            ...active,
            actorName: data.actorName ?? active.actorName,
            assignedToEmployeeId:
              data.assignedToEmployeeId ?? active.assignedToEmployeeId ?? null,
            items: data.items,
            total: data.total,
          };
        }

        const nextId = get().lastId + 1;

        const newSale: Sale = {
          id: nextId,
          actorType,
          actorId,
          actorName: data.actorName,
          createdAt: new Date().toISOString(),
          status: "cargando",
          assignedToEmployeeId: data.assignedToEmployeeId ?? null,
          items: data.items,
          total: data.total,
        };

        set((state) => ({
          lastId: nextId,
          sales: [newSale, ...state.sales],
        }));

        return newSale;
      },

      createSale: (data) => {
        const nextId = get().lastId + 1;
        const newSale: Sale = { id: nextId, ...data };
        set((s) => ({ lastId: nextId, sales: [newSale, ...s.sales] }));
        return newSale;
      },

      updateSale: (saleId, patch) => {
        set((s) => ({
          sales: s.sales.map((x) => (x.id === saleId ? { ...x, ...patch } : x)),
        }));
      },

      deleteSale: (saleId) => {
        set((s) => ({ sales: s.sales.filter((x) => x.id !== saleId) }));
      },

      markFinalizeInLocal: (saleId) => {
        set((s) => ({
          sales: s.sales.map((x) =>
            x.id === saleId ? { ...x, status: "finalizar_en_local" } : x
          ),
        }));
      },

      completeSale: (saleId, completedBy) => {
        set((s) => ({
          sales: s.sales.map((x) =>
            x.id === saleId
              ? {
                  ...x,
                  status: "completada",
                  paidAt: new Date().toISOString(),
                  completedBy: completedBy ?? x.completedBy,
                }
              : x
          ),
        }));
      },

      assignSale: (saleId, employeeId) => {
        set((s) => ({
          sales: s.sales.map((x) =>
            x.id === saleId ? { ...x, assignedToEmployeeId: employeeId } : x
          ),
        }));
      },

      getSaleById: (saleId) => get().sales.find((x) => x.id === saleId),

      getSalesByActor: (actorType, actorId) =>
        get().sales.filter((x) => x.actorType === actorType && x.actorId === actorId),

      getPendingSales: () =>
        get().sales.filter(
          (x) =>
            x.status === "cargando" ||
            x.status === "finalizar_en_local" ||
            x.status === "derivado"
        ),
      getFinalizeInLocalSales: () =>
        get().sales.filter((x) => x.status === "finalizar_en_local"),
      deriveSale: (saleId, employeeId) => {
  set((s) => ({
    sales: s.sales.map((x) =>
      x.id === saleId
        ? {
            ...x,
            assignedToEmployeeId: employeeId,
            status: "derivado",
          }
        : x
    ),
  }));
},
    }),
    { name: "sales-storage" }
  )
);
