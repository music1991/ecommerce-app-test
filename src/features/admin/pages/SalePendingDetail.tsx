import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  ClipboardList,
  Plus,
  Trash2,
  UserRound,
  Store,
  CreditCard,
  Send,
} from "lucide-react";

import { useSalesStore, type Sale, type SaleItem } from "../../sales/store/useSalesStore";
import { MOCK_PRODUCTS } from "../../products/services/products.mock"; 
import type { SaleActorType } from "../../../api/types/sales.types";

export const SalePendingDetail = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const saleId = Number(params.id);

  const sale = useSalesStore((s) => s.getSaleById(saleId));
  const updateSale = useSalesStore((s) => s.updateSale);
  const markFinalizeInLocal = useSalesStore((s) => s.markFinalizeInLocal);
  const completeSale = useSalesStore((s) => s.completeSale);
  const assignSale = useSalesStore((s) => s.assignSale);
  const deriveSale = useSalesStore((s) => s.deriveSale);

  const [productSearch, setProductSearch] = useState("");
  const [assignEmployeeId, setAssignEmployeeId] = useState("");

  const money = (n: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

  const statusPill = (status: Sale["status"]) => {
    if (status === "cargando") {
      return (
        <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
          Cargando
        </span>
      );
    }
    if (status === "finalizar_en_local") {
      return (
        <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">
          Finalizar en local
        </span>
      );
    }
    if (status === "derivado") {
  return (
    <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800">
      Derivado
    </span>
  );
}
    return (
      <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700">
        Completada
      </span>
    );
  };

  const safeImage = (images?: string[]) =>
    images?.[0] ||
    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=600&auto=format&fit=crop";

  const recalcTotal = (items: SaleItem[]) =>
    items.reduce((acc, it) => acc + Number(it.price || 0) * Number(it.quantity || 0), 0);

  const setItems = (items: SaleItem[]) => {
    updateSale(saleId, { items, total: recalcTotal(items) });
  };

  const addProduct = (p: any) => {
    if (!sale) return;
    if (sale.status === "completada") return;

    const existing = sale.items.find((x) => x.id === p.id);
    const nextItems = existing
      ? sale.items.map((x) => (x.id === p.id ? { ...x, quantity: x.quantity + 1 } : x))
      : [
          ...sale.items,
          {
            id: p.id,
            name: p.name,
            price: p.price,
            quantity: 1,
            images: p.images,
          },
        ];

    setItems(nextItems);
  };

  const decQty = (id: string) => {
    if (!sale) return;
    const it = sale.items.find((x) => x.id === id);
    if (!it) return;

    if (it.quantity <= 1) {
      setItems(sale.items.filter((x) => x.id !== id));
      return;
    }

    setItems(sale.items.map((x) => (x.id === id ? { ...x, quantity: x.quantity - 1 } : x)));
  };

  const incQty = (id: string) => {
    if (!sale) return;
    setItems(sale.items.map((x) => (x.id === id ? { ...x, quantity: x.quantity + 1 } : x)));
  };

  const removeItem = (id: string) => {
    if (!sale) return;
    setItems(sale.items.filter((x) => x.id !== id));
  };

  const filteredCatalog = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return MOCK_PRODUCTS;

    return MOCK_PRODUCTS.filter((p) => {
      const hay = `${p.name} ${p.description} ${p.category}`.toLowerCase();
      return hay.includes(q);
    });
  }, [productSearch]);

  if (!sale) {
    return (
      <div className="p-10 text-slate-600">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
        >
          <ArrowLeft size={18} /> Volver
        </button>
        <p className="mt-6 font-bold">No se encontró la venta #{saleId}.</p>
      </div>
    );
  }

  const canEdit = sale.status !== "completada";

  return (
    <div className="p-2 animate-in fade-in duration-500">
      <div className="flex items-start justify-between gap-6 mb-10">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            title="Volver"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter">
              Venta #{sale.id}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              {statusPill(sale.status)}
              <p className="text-slate-500 font-medium">
                {sale.actorType} • {sale.actorName || sale.actorId} • {new Date(sale.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
{/*           <button
            onClick={() => markFinalizeInLocal(sale.id)}
            disabled={!canEdit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Store size={16} /> Finalizar en local
          </button> */}

          <button
            onClick={() => {
              completeSale(sale.id, {
                actorType: "employee" as SaleActorType,
                actorId: "emp-001",
                actorName: "Empleado (Mock)",
                actorEmail: ""
              })
            }}
            disabled={!canEdit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-emerald-600 text-green-500 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <CreditCard size={16} /> Completar
          </button>
          
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ClipboardList size={18} className="text-slate-700" />
                <p className="font-black text-slate-800 uppercase tracking-wider text-sm">
                  Productos en la venta
                </p>
              </div>
              <span className="text-sm font-bold text-slate-600">
                Total: <span className="text-slate-900">{money(sale.total)}</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest">
                      Producto
                    </th>
                    <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest text-center">
                      Cant.
                    </th>
                    <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest text-right">
                      Subtotal
                    </th>
                    <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {sale.items.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-slate-500">
                        No hay productos. Agregá desde el catálogo.
                      </td>
                    </tr>
                  ) : (
                    sale.items.map((it) => (
                      <tr key={it.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={safeImage(it.images)}
                              alt={it.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                            />
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{it.name}</span>
                              <span className="text-xs text-slate-500">{money(it.price)}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-6 text-center">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => decQty(it.id)}
                              disabled={!canEdit}
                              className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 font-black disabled:opacity-50"
                            >
                              −
                            </button>
                            <span className="min-w-[32px] text-center font-black text-slate-900">
                              {it.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => incQty(it.id)}
                              disabled={!canEdit}
                              className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 font-black disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="p-6 text-right font-black text-slate-900">
                          {money(Number(it.price) * Number(it.quantity))}
                        </td>

                        <td className="p-6 text-right">
                          <button
                            onClick={() => removeItem(it.id)}
                            disabled={!canEdit}
                            className="flex items-center gap-2 bg-[#e11d48] text-red-500 px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#be123c] transition-all shadow-sm disabled:opacity-50"
                          >
                            <Trash2 size={14} /> Quitar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Plus size={18} className="text-slate-700" />
                <p className="font-black text-slate-800 uppercase tracking-wider text-sm">
                  Agregar productos
                </p>
              </div>

              <input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Buscar producto por nombre/categoría..."
                className="w-full max-w-md bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCatalog.slice(0, 12).map((p: any) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addProduct(p)}
                  disabled={!canEdit}
                  className="text-left group rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all p-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={safeImage(p.images)}
                      alt={p.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-slate-900 truncate">{p.name}</p>
                      <p className="text-xs text-slate-500 truncate">{p.category}</p>
                      <p className="text-sm font-black text-blue-600 mt-1">{money(p.price)}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs font-bold text-slate-500">
                    Click para agregar
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center gap-3">
              <UserRound size={18} className="text-slate-700" />
              <p className="font-black text-slate-800 uppercase tracking-wider text-sm">Datos</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Actor</span>
                <span className="text-slate-900 font-black">
                  {sale.actorName || sale.actorId} ({sale.actorType})
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Asignado</span>
                <span className="text-slate-900 font-black">
                  {sale.assignedToEmployeeId || "—"}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Items</span>
                <span className="text-slate-900 font-black">{sale.items.length}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Total</span>
                <span className="text-slate-900 font-black">{money(sale.total)}</span>
              </div>

              {sale.paidAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-bold">Pagada</span>
                  <span className="text-slate-900 font-black">
                    {new Date(sale.paidAt).toLocaleString()}
                  </span>
                </div>
              )}

              {sale.completedBy && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <BadgeCheck size={18} className="text-emerald-700" />
                    <p className="font-black text-emerald-900">Completada por</p>
                  </div>
                  <p className="text-sm text-emerald-800 mt-1">
                    {sale.completedBy.actorName || sale.completedBy.actorId} ({sale.completedBy.actorType})
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center gap-3">
              <Send size={18} className="text-slate-700" />
              <p className="font-black text-slate-800 uppercase tracking-wider text-sm">Derivar</p>
            </div>

            <div className="p-6 space-y-4">
              <label className="text-sm font-bold text-slate-600 ml-1">
                ID del empleado (mock)
              </label>
              <input
                value={assignEmployeeId}
                onChange={(e) => setAssignEmployeeId(e.target.value)}
                placeholder="Ej: emp-001"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20"
                disabled={!canEdit}
              />

<button
  type="button"
  onClick={() => deriveSale(sale.id, assignEmployeeId.trim() || "emp-001")}
  disabled={!canEdit}
  className="w-full bg-slate-900 hover:bg-black text-yellow-500 font-black py-4 rounded-2xl transition-all disabled:opacity-50"
>
  Asignar / Derivar
</button>

              <p className="text-xs text-slate-500">
                Cuando está en “finalizar en local”, un empleado puede tomarla, derivarla o completarla.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
