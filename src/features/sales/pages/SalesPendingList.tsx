import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Trash2, AlertCircle, ShoppingBag } from "lucide-react";

import { Modal } from "../../../shared/modals/Modal";
import { useSalesStore, type Sale, type SaleActorType } from "../store/useSalesStore";

export const SalesPendingList = () => {
  const navigate = useNavigate();

  const sales = useSalesStore((s) => s.sales);
  const createSale = useSalesStore((s) => s.createSale);
  const deleteSale = useSalesStore((s) => s.deleteSale);

  const [search, setSearch] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createData, setCreateData] = useState({
    actorType: "cliente" as SaleActorType,
    actorId: "",
    actorName: "",
  });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

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

  const pending = useMemo(() => {
    const q = search.trim().toLowerCase();

    // ✅ Pendientes incluyen derivado
    const onlyPending = sales.filter(
      (x) =>
        x.status === "cargando" ||
        x.status === "finalizar_en_local" ||
        x.status === "derivado"
    );

    if (!q) return onlyPending;

    return onlyPending.filter((x) => {
      const haystack =
        `${x.id} ${x.actorType} ${x.actorId} ${x.actorName ?? ""} ${x.status} ${
          x.assignedToEmployeeId ?? ""
        }`.toLowerCase();
      return haystack.includes(q);
    });
  }, [sales, search]);

  const openDelete = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedSale) return;
    deleteSale(selectedSale.id);
    setIsDeleteOpen(false);
    setSelectedSale(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const newSale = createSale({
      actorType: createData.actorType,
      actorId: createData.actorId.trim() || "sin-id",
      actorName: createData.actorName.trim() || undefined,
      createdAt: new Date().toISOString(),
      status: "cargando",
      assignedToEmployeeId: null,
      items: [],
      total: 0,
    });

    setIsCreateOpen(false);
    setCreateData({ actorType: "cliente", actorId: "", actorName: "" });

    // ✅ para que coincida con tu botón "Ver"
    navigate(`/admin/sales/detail/${newSale.id}`);
  };

  return (
    <div className="p-2 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">
            Ventas Pendientes
          </h1>
          <p className="text-slate-500 font-medium">
            Listado de ventas en <b>cargando</b>, <b>finalizar en local</b> o <b>derivado</b>.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-[#1e293b] text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
        >
          <Plus size={20} /> Crear Venta
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex gap-3">
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por ID, cliente, estado o asignado..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="button"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm border border-slate-200 bg-slate-50 hover:bg-slate-100"
              onClick={() => {}}
              title="El buscador filtra en vivo"
            >
              Buscar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest">
                  Venta
                </th>
                <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest">
                  Cliente / Actor
                </th>
                <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest text-center">
                  Estado
                </th>
                <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest text-right">
                  Total
                </th>
                <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest text-right">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {pending.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500">
                    No hay ventas pendientes.
                  </td>
                </tr>
              ) : (
                pending.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900">#{s.id}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(s.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">
                          {s.actorName || s.actorId}
                        </span>
                        <span className="text-xs text-slate-500">
                          {s.actorType} • {s.actorId}
                          {s.assignedToEmployeeId
                            ? ` • asignado: ${s.assignedToEmployeeId}`
                            : ""}
                        </span>
                      </div>
                    </td>

                    <td className="p-6 text-center">{statusPill(s.status)}</td>

                    <td className="p-6 text-right font-black text-slate-900">
                      {money(s.total)}
                    </td>

                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/sales/detail/${s.id}`)}
                          className="flex items-center gap-2 bg-[#1e293b] text-blue-400 px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#334155] transition-all shadow-sm"
                        >
                          <Eye size={14} /> Ver
                        </button>

                        <button
                          onClick={() => openDelete(s)}
                          className="flex items-center gap-2 bg-[#e11d48] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#be123c] transition-all shadow-sm"
                        >
                          <Trash2 size={14} /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Crear Venta"
      >
        <form onSubmit={handleCreate} className="space-y-6 max-w-3xl mx-auto">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <ShoppingBag className="text-slate-700 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-black text-slate-900">Nueva venta en estado “cargando”</p>
              <p className="text-sm text-slate-600">
                Podés agregar productos y luego pasarla a “finalizar en local”, “derivado” o “completada”.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Actor Type</label>
              <select
                value={createData.actorType}
                onChange={(e) =>
                  setCreateData((p) => ({
                    ...p,
                    actorType: e.target.value as SaleActorType,
                  }))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              >
                <option value="cliente">Cliente</option>
                <option value="empleado">Empleado</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Actor ID</label>
              <input
                value={createData.actorId}
                onChange={(e) => setCreateData((p) => ({ ...p, actorId: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Ej: client-001 / emp-003"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Nombre (opcional)</label>
              <input
                value={createData.actorName}
                onChange={(e) => setCreateData((p) => ({ ...p, actorName: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Ej: Juan Pérez"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-2 justify-end">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-5 py-3 rounded-xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-black transition-all shadow-md shadow-slate-900/20"
            >
              Crear Venta
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Eliminar Venta"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <AlertCircle className="text-rose-600 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-black text-rose-900">¿Seguro querés eliminar esta venta?</p>
              <p className="text-sm text-rose-700">
                #{selectedSale?.id} — {selectedSale?.actorName || selectedSale?.actorId} —{" "}
                {selectedSale?.status}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="px-5 py-3 rounded-xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={confirmDelete}
              className="px-5 py-3 rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-md shadow-rose-600/20"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
