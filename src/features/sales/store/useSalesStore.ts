import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../../../core/entities/Product";

// 👇 Ajustá estos imports a tu estructura real:
import { MOCK_CUSTOMERS_AUTH_DB } from "../../../shared/mocks/customersAuth.mock";
import { MOCK_STAFF_DB } from "../../../shared/mocks/staff.mock";
import type { SaleActorType } from "../../../api/types/sales.types";

export type SaleStatus = "cargando" | "finalizar_en_local" | "derivado" | "completada";


export type SaleItem = Pick<Product, "id" | "name" | "price" | "images"> & {
  quantity: number;
};

type CompletedBySnapshot = {
  actorType: SaleActorType;
  actorId: string;
  actorName: string;
  actorEmail: string;
};

export interface Sale {
  id: number;
  actorType: SaleActorType;
  actorId: string;
  actorName?: string;
  actorEmail?: string;
  createdAt: string;
  status: SaleStatus;
  assignedToEmployeeId?: string | null;
  assignedToEmployeeName?: string | null;
  assignedToEmployeeEmail?: string | null;
  items: SaleItem[];
  total: number;
  paidAt?: string;
  completedBy?: CompletedBySnapshot;
  cash_register_id: number | null,
}

interface ActiveSaleData {
  actorName?: string;
  actorEmail?: string;
  assignedToEmployeeId?: string | null;
  assignedToEmployeeName?: string | null;
  assignedToEmployeeEmail?: string | null;
  items: SaleItem[];
  total: number;
  cash_register_id: number | null,
}

interface SalesState {
  lastId: number;
  sales: Sale[];
   setSaleCashRegister: (saleId: number, cashRegisterId: number) => void;
  getActiveSaleByActor: (actorType: SaleActorType, actorId: string) => Sale | undefined;
  createOrUpdateActiveSale: (actorType: SaleActorType, actorId: string, data: ActiveSaleData) => Sale;
  createSale: (data: Omit<Sale, "id">) => Sale;
  updateSale: (saleId: number, patch: Partial<Omit<Sale, "id">>) => void;
  deleteSale: (saleId: number) => void;
  markFinalizeInLocal: (saleId: number) => void;
  completeSale: (saleId: number, completedBy?: Sale["completedBy"]) => void;
  assignSale: (saleId: number, employeeId: string) => void;
  deriveSale: (saleId: number, employeeId: string) => void;
  hydrateSaleActors: (saleId: number) => void;
  hydrateAllSalesActors: () => void;
  getSaleById: (saleId: number) => Sale | undefined;
  getSalesByActor: (actorType: SaleActorType, actorId: string) => Sale[];
  getPendingSales: () => Sale[];
  getFinalizeInLocalSales: () => Sale[];
}

// ----------------------------
// Helpers de resolución mejorados
// ----------------------------
const norm = (v: string) => v.toLowerCase().trim();

function resolveCustomer(actorIdOrEmail: string) {
  const key = norm(actorIdOrEmail);
  const byEmail = (MOCK_CUSTOMERS_AUTH_DB as any)[key];
  if (byEmail) return byEmail;
  return Object.values(MOCK_CUSTOMERS_AUTH_DB).find((c: any) => c.id === actorIdOrEmail);
}

function resolveStaff(actorIdOrEmail: string) {
  const key = norm(actorIdOrEmail);
  const byEmail = (MOCK_STAFF_DB as any)[key];
  if (byEmail) return byEmail;
  return Object.values(MOCK_STAFF_DB).find((u: any) => u.id === actorIdOrEmail);
}

function resolveActorSnapshot(actorType: SaleActorType, actorId: string) {
  if (actorType === "customer") {
    const c: any = resolveCustomer(actorId);
    if (!c) return { actorName: "Cliente Online", actorEmail: actorId };
    return { actorName: c.name || c.displayName, actorEmail: c.email };
  }
  const u: any = resolveStaff(actorId);
  if (!u) return { actorName: "Staff", actorEmail: undefined };
  return { actorName: u.name, actorEmail: u.email };
}

function resolveEmployeeSnapshot(employeeId: string) {
  const u: any = resolveStaff(employeeId);
  if (!u) return { assignedToEmployeeName: null, assignedToEmployeeEmail: null };
  return { assignedToEmployeeName: u.name, assignedToEmployeeEmail: u.email };
}

// ----------------------------
// Store Implementation
// ----------------------------
export const useSalesStore = create<SalesState>()(
  persist(
    (set, get) => ({
      lastId: 200, // Iniciamos en 200 para no chocar con IDs bajos
      sales: [],
   setSaleCashRegister: (saleId, cashRegisterId) => {
        get().updateSale(saleId, { cash_register_id: cashRegisterId });
      },
      getActiveSaleByActor: (actorType, actorId) =>
        get().sales.find(
          (s) =>
            s.actorType === actorType &&
            s.actorId === actorId &&
            (s.status === "cargando" || s.status === "finalizar_en_local")
        ),

      createOrUpdateActiveSale: (actorType, actorId, data) => {
        const active = get().getActiveSaleByActor(actorType, actorId);
        const snap = resolveActorSnapshot(actorType, actorId);

        if (active) {
          const next: Sale = {
            ...active,
            actorName: data.actorName || snap.actorName || active.actorName,
            actorEmail: data.actorEmail || snap.actorEmail || active.actorEmail,
            items: data.items,
            total: data.total,
            // Mantenemos la caja original o actualizamos si viene una nueva
            cash_register_id: data.cash_register_id ?? active.cash_register_id,
          };
          set((state) => ({
            sales: state.sales.map((x) => (x.id === active.id ? next : x)),
          }));
          return next;
        }

        const nextId = get().lastId + 1;
        const newSale: Sale = {
          id: nextId,
          actorType,
          actorId,
          actorName: data.actorName || snap.actorName,
          actorEmail: data.actorEmail || snap.actorEmail,
          createdAt: new Date().toISOString(),
          status: "cargando",
          items: data.items,
          total: data.total,
          assignedToEmployeeId: data.assignedToEmployeeId ?? null,
          // Vinculamos la venta a la caja proporcionada
          cash_register_id: data.cash_register_id || null,
        };

        set((state) => ({ lastId: nextId, sales: [newSale, ...state.sales] }));
        return newSale;
      },

      createSale: (data) => {
        const nextId = get().lastId + 1;
        const snap = resolveActorSnapshot(data.actorType, data.actorId);

        const newSale: Sale = {
          ...data,
          id: nextId,
          actorName: data.actorName || snap.actorName,
          actorEmail: data.actorEmail || snap.actorEmail,
          createdAt: data.createdAt || new Date().toISOString(),
        };

        set((s) => ({ lastId: nextId, sales: [newSale, ...s.sales] }));
        return newSale;
      },

      updateSale: (saleId, patch) => {
        set((s) => ({
          sales: s.sales.map((x) => {
            if (x.id !== saleId) return x;
            return { ...x, ...patch };
          }),
        }));
      },

      deleteSale: (saleId) => {
        set((s) => ({ sales: s.sales.filter((x) => x.id !== saleId) }));
      },

      markFinalizeInLocal: (saleId) => {
        get().updateSale(saleId, { status: "finalizar_en_local" });
      },

completeSale: (saleId, completedBy) => {
  const sale = get().getSaleById(saleId);
  if (!sale) return;

  // 1. Resolvemos quién completa la venta (Snapshot para el historial)
  const cbSnap = completedBy
    ? { ...completedBy, ...resolveActorSnapshot(completedBy.actorType, completedBy.actorId) }
    : undefined;

  // 2. CALCULAMOS EL TOTAL REAL (Sumatoria de items)
  // Esto asegura que el monto no sea 0 si hay productos cargados
  const calculatedTotal = sale.items.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0), 
    0
  );

  // 3. Actualizamos la venta con el estado final y el monto real
  get().updateSale(saleId, {
    status: "completada",
    paidAt: new Date().toISOString(),
    completedBy: cbSnap || sale.completedBy,
    
    // IMPORTANTE: Seteamos el total aquí para que impacte en la caja
    total: calculatedTotal, 
    
    // Sincronizamos el nombre del actor para que aparezca "JUAN" en la lista
    actorName: cbSnap?.actorName || sale.actorName 
  });
},

      assignSale: (saleId, employeeId) => {
        const emp = resolveEmployeeSnapshot(employeeId);
        get().updateSale(saleId, {
          assignedToEmployeeId: employeeId,
          assignedToEmployeeName: emp.assignedToEmployeeName,
          assignedToEmployeeEmail: emp.assignedToEmployeeEmail,
        });
      },

      deriveSale: (saleId, employeeId) => {
        const emp = resolveEmployeeSnapshot(employeeId);
        get().updateSale(saleId, {
          status: "derivado",
          assignedToEmployeeId: employeeId,
          assignedToEmployeeName: emp.assignedToEmployeeName,
          assignedToEmployeeEmail: emp.assignedToEmployeeEmail,
        });
      },

      hydrateSaleActors: (saleId) => {
        const sale = get().getSaleById(saleId);
        if (!sale) return;
        const actor = resolveActorSnapshot(sale.actorType, sale.actorId);
        get().updateSale(saleId, { actorName: actor.actorName, actorEmail: actor.actorEmail });
      },

      hydrateAllSalesActors: () => {
        get().sales.forEach((x) => get().hydrateSaleActors(x.id));
      },

      getSaleById: (saleId) => get().sales.find((x) => x.id === saleId),
      getSalesByActor: (actorType, actorId) =>
        get().sales.filter((x) => x.actorType === actorType && x.actorId === actorId),
      getPendingSales: () =>
        get().sales.filter((x) => ["cargando", "finalizar_en_local", "derivado"].includes(x.status)),
      getFinalizeInLocalSales: () => get().sales.filter((x) => x.status === "finalizar_en_local"),
    }),
    { name: "sales-storage" }
  )
);