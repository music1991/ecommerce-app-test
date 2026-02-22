import { BadgeDollarSign, Plus, Search, Lock, Wallet, UserCheck, UserPlus, Mail, Phone, Loader2 } from "lucide-react";
import { Modal } from "../../../shared/modals/Modal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { useNavigate } from "react-router-dom";
import { useSalesStore, type Sale } from "../../sales/store/useSalesStore";
import { useMemo, useState } from "react";
import { SaleTable } from "../components/SaleTable";
import type { SaleActorType } from "../../../api/types/sales.types";

// Servicios de API
import { getActiveCashRegister } from "../../../api/cash.service";
import { listCustomers } from "../../../api/customer.service";

export const Sales = () => {
  const navigate = useNavigate();
  const sales = useSalesStore((s) => s.sales);
  const createSale = useSalesStore((s) => s.createSale);
  const deleteSale = useSalesStore((s) => s.deleteSale);

  // --- ESTADOS DE UI Y BÚSQUEDA ---
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // --- ESTADOS DE CLIENTES (BUSCADOR INTERNO) ---
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerResults, setCustomerResults] = useState<any[]>([]);
  const [isSearchingCustomers, setIsSearchingCustomers] = useState(false);

  // --- ESTADO DE VALIDACIÓN DE CAJA ---
  const [isBoxOpen, setIsBoxOpen] = useState<boolean | null>(null);
  const [activeBox, setActiveBox] = useState<any | null>(null); 

  const [createData, setCreateData] = useState({
    actorType: "cliente" as SaleActorType,
    actorId: "",
    actorName: "",
    actorEmail: "",
  });

  // --- LÓGICA DE NEGOCIO ---

  const handleCustomerSearch = async (query: string) => {
    setCustomerSearch(query);
    if (query.trim().length < 2) {
      setCustomerResults([]);
      return;
    }

    setIsSearchingCustomers(true);
    try {
      const res = await listCustomers({ search: query, per_page: 5 });

      // --- ADAPTACIÓN FLEXIBLE ---
      // Si res es un array, lo usamos. Si es un objeto, buscamos en .data.data
      const results = Array.isArray(res)
        ? res
        : res?.data?.data || res?.data || [];

      setCustomerResults(results as any);

    } catch (err) {
      console.error("Error buscando clientes:", err);
    } finally {
      setIsSearchingCustomers(false);
    }
  };

  const onSelectCustomer = (c: any) => {
    setCreateData({
      actorType: "customer" as SaleActorType,
      actorId: c.dni || c.id.toString(),
      actorName: c.name,
      actorEmail: c.email || "",
    });
    setCustomerResults([]);
    setCustomerSearch("");
  };

 const validateBoxAndExecute = async (onSuccess: (boxId: number) => void) => {
  const res = await getActiveCashRegister();
  const isOpen = res.success && res.data !== null;

  setIsBoxOpen(isOpen); // Mantenés tu booleano actual

  if (isOpen && res.data) {
    onSuccess(res.data.id); // Pasamos el ID directamente
  } else {
    setIsCreateOpen(true);
  }
};
  const pendingSales = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return sales;
    return sales.filter(x =>
      `${x.id} ${x.actorName} ${x.actorEmail}`.toLowerCase().includes(q)
    );
  }, [sales, search]);

  const cashId = activeBox?.id; 

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
     const newSale = createSale({
    ...createData,
    actorId: createData.actorId || "anon",
    createdAt: new Date().toISOString(),
    status: "cargando",
    items: [],
    total: 0,
    // 👇 ASOCIACIÓN CON LA CAJA AQUÍ
    cash_register_id: cashId || null, 
  });
    setIsCreateOpen(false);
    navigate(`/admin/sales/detail/${newSale.id}`);
  };

  console.log(pendingSales)

  return (
    <div className="p-4 animate-in fade-in duration-500">
      <Header onAdd={() => validateBoxAndExecute(() => setIsCreateOpen(true))} />

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden mt-8">
        <SearchSection value={search} onChange={setSearch} />
        <SaleTable
          sales={pendingSales}
          onView={(id) => validateBoxAndExecute(() => navigate(`/admin/sales/detail/${id}`))}
          onDelete={(sale) => { setSelectedSale(sale); setIsDeleteOpen(true); }}
        />
      </div>

      {/* MODAL DINÁMICO: AVISO CAJA O FORMULARIO */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={isBoxOpen ? "Nueva Venta" : "Punto de Venta Bloqueado"}
        size="lg"
      >
        {isBoxOpen === false ? (
          /* ESCENARIO A: CAJA CERRADA */
          <div className="py-6 text-center space-y-6">
            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Lock size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-800 tracking-tight text-center uppercase">Caja Cerrada</h3>
              <p className="text-slate-500 text-sm leading-relaxed text-center px-6">
                No puedes gestionar ventas si no hay un turno de caja activo. Por favor, abre la caja para habilitar el sistema.
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/cash")}
              className="w-full flex items-center justify-center gap-2 p-4 !bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-900/20"
            >
              <Wallet size={18} /> Ir a Gestión de Caja
            </button>
          </div>
        ) : (
          /* ESCENARIO B: FORMULARIO + BUSCADOR (GUIADO POR LA IMAGEN) */
          <div className="space-y-8">
            <div className="space-y-4 relative"> {/* 'relative' es clave para que la tabla flote */}
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
                Directorio de Clientes
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={customerSearch}
                  onChange={(e) => handleCustomerSearch(e.target.value)}
                  placeholder="Buscar clientes por nombre, DNI o email..."
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:border-blue-500/50 transition-all shadow-sm"
                />
                {isSearchingCustomers && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" size={18} />
                )}
              </div>

              {/* TABLA DE RESULTADOS FLOTANTE */}
              {customerResults.length > 0 && (
                <div className="absolute z-[110] w-full mt-1 bg-white border border-slate-200 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="p-4 px-6">Cliente</th>
                        <th className="p-4">Contacto</th>
                        <th className="p-4 text-right pr-6">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {customerResults.map((c) => (
                        <tr
                          key={c.id}
                          onClick={() => onSelectCustomer(c)}
                          className="hover:bg-blue-50/80 cursor-pointer transition-colors group"
                        >
                          <td className="p-4 px-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{c.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold">ID: {c.dni || c.id}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1 text-[11px] text-slate-500">
                              <div className="flex items-center gap-2"><Mail size={12} /> {c.email}</div>
                              <div className="flex items-center gap-2"><Phone size={12} /> {c.phone || "S/N"}</div>
                            </div>
                          </td>
                          <td className="p-4 text-right pr-6">
                            <div className="inline-flex p-2 bg-blue-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                              <UserCheck size={16} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Carga Manual</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-xl text-blue-800 text-[10px] font-black uppercase tracking-widest text-center">
                {createData.actorName ? `Seleccionado: ${createData.actorName}` : "Nueva Venta"}
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
                  required
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
              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full !bg-slate-900 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20">
                  <UserPlus size={18} /> Comenzar Venta
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

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

const Header = ({ onAdd }: { onAdd: () => void }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-4">
      <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
        <BadgeDollarSign size={28} />
      </div>
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Ventas</h1>
        <p className="text-slate-500 font-medium tracking-tight">Ingresos y facturación en tiempo real.</p>
      </div>
    </div>
    <button onClick={onAdd} className="flex items-center gap-2 px-6 py-3 !bg-blue-600 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-blue-600/10">
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
        placeholder="Buscar por ID, cliente o email..."
        className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
      />
    </div>
  </div>
);
