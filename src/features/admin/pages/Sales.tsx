import { Plus, Search } from "lucide-react";
import { Modal } from "../../../shared/modals/Modal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { useNavigate } from "react-router-dom";
import { useSalesStore, type Sale } from "../../sales/store/useSalesStore";
import { useMemo, useState } from "react";
import { SaleTable } from "../components/SaleTable";
import type { SaleActorType } from "../../../api/types/sales.types";

export const Sales = () => {
  const navigate = useNavigate();
  const sales = useSalesStore((s) => s.sales);
  const createSale = useSalesStore((s) => s.createSale);
  const deleteSale = useSalesStore((s) => s.deleteSale);

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const [createData, setCreateData] = useState({
    actorType: "customer" as SaleActorType,
    actorId: "",
    actorName: "",
    actorEmail: "", // Nuevo campo
  });

  const pendingSales = useMemo(() => {
    const q = search.toLowerCase().trim();
    const onlyPending = sales;

    if (!q) return onlyPending;
    return onlyPending.filter(x =>
      `${x.id} ${x.actorName} ${x.actorEmail} ${x.actorId}`.toLowerCase().includes(q)
    );
  }, [sales, search]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newSale = createSale({
      ...createData,
      actorId: createData.actorId || "anon",
      createdAt: new Date().toISOString(),
      status: "cargando",
      items: [],
      total: 0,
    });
    setIsCreateOpen(false);
    navigate(`/admin/sales/detail/${newSale.id}`);
  };

  return (
    <div className="p-4 animate-in fade-in duration-500">
      <Header onAdd={() => setIsCreateOpen(true)} />

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden mt-8">
        <SearchSection value={search} onChange={setSearch} />

        <SaleTable
          sales={pendingSales}
          onView={(id) => navigate(`/admin/sales/detail/${id}`)}
          onDelete={(sale) => { setSelectedSale(sale); setIsDeleteOpen(true); }}
        />
      </div>

      {/* MODAL CREAR */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nueva Venta">
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 bg-blue-50 p-4 rounded-xl text-blue-800 text-sm font-medium">
            Iniciando venta en modo edición (Cargando).
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 ml-1">Tipo</label>
            <select
              value={createData.actorType}
              onChange={e => setCreateData({ ...createData, actorType: e.target.value as any })}
              className="bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none"
            >
              <option value="cliente">Cliente</option>
              <option value="empleado">Venta Interna</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 ml-1">ID / DNI</label>
            <input
              placeholder="Opcional..."
              value={createData.actorId}
              onChange={e => setCreateData({ ...createData, actorId: e.target.value })}
              className="bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 ml-1">Nombre Completo</label>
            <input
              placeholder="Juan Perez..."
              value={createData.actorName}
              onChange={e => setCreateData({ ...createData, actorName: e.target.value })}
              className="bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 ml-1">Email</label>
            <input
              placeholder="juan@gmail.com..."
              value={createData.actorEmail}
              onChange={e => setCreateData({ ...createData, actorEmail: e.target.value })}
              className="bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none"
            />
          </div>
          <div className="md:col-span-2 pt-4 flex gap-3">
            <button type="submit" className="flex-1 bg-slate-900 text-white p-4 rounded-xl font-bold">Comenzar Carga</button>
          </div>
        </form>
      </Modal>

      {/* MODAL ELIMINAR */}
      <DeleteConfirmModal
        textConfirm="venta"
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        item={`Venta #${selectedSale?.id}`}
        onConfirm={() => { deleteSale(selectedSale!.id); setIsDeleteOpen(false); }}
      />
    </div>
  );
};

// Pequeños componentes auxiliares para no ensuciar el render principal
const Header = ({ onAdd }: { onAdd: () => void }) => (
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Ventas</h1>
      <p className="text-slate-500 font-medium">Gestión de carritos y derivaciones activas.</p>
    </div>
    <button onClick={onAdd} className="flex items-center gap-2 px-6 py-3 !bg-blue-600 text-white rounded-xl font-bold hover:bg-black">
      <Plus size={20} /> Crear Venta
    </button>
  </div>
);

const SearchSection = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
  <div className="p-6 border-b border-slate-200 bg-slate-50/30">
    <div className="relative">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por ID, nombre de cliente o email..."
        className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
      />
    </div>
  </div>
);