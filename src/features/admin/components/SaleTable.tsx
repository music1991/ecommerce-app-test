import { Eye, FilePenLine, Trash2, Printer } from "lucide-react"; // Añadimos Printer
import { useNavigate } from "react-router-dom"; // Importamos navigate
import type { Sale } from "../../sales/store/useSalesStore";

interface Props {
  sales: Sale[];
  onView: (id: string) => void;
  onDelete: (sale: Sale) => void;
}

export const SaleTable = ({ sales, onView, onDelete }: Props) => {
  const navigate = useNavigate(); // Hook para la redirección directa

  const money = (n: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(n || 0);

  const StatusPill = ({ status }: { status: Sale["status"] }) => {
    const configs = {
      cargando: "bg-slate-100 text-slate-700",
      finalizar_en_local: "bg-amber-100 text-amber-800",
      derivado: "bg-indigo-100 text-indigo-800",
      completada: "bg-emerald-100 text-emerald-700",
    };
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${configs[status] || configs.cargando}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-200">
            <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest">Venta</th>
            <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest">Cliente / Email</th>
            <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest text-center">Estado</th>
            <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest text-right">Total</th>
            <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sales.length === 0 ? (
            <tr><td colSpan={5} className="p-10 text-center text-slate-500">No hay ventas registradas.</td></tr>
          ) : (
            sales.map((s) => {
              const isCompleted = s.status === "completada";

              return (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900">#{s.id}</span>
                      <span className="text-xs text-slate-500">{new Date(s.createdAt).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{s.actorName || "Consumidor Final"}</span>
                      <span className="text-xs text-blue-600 font-medium">
                        {s.actorEmail || s.actorId}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-center"><StatusPill status={s.status} /></td>
                  <td className="p-6 text-right font-black text-slate-900">{money(s.total)}</td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      
                      {/* BOTÓN DINÁMICO */}
                      {isCompleted ? (
                        <button 
                          onClick={() => navigate(`/admin/sales/bill/${s.id}`)} 
                          className="flex items-center gap-2 !bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10"
                        >
                          <Printer size={14} /> Factura
                        </button>
                      ) : (
                        <button 
                          onClick={() => onView(s.id.toString())} 
                          className="flex items-center gap-2 bg-slate-900 text-blue-400 px-4 py-2 rounded-lg font-bold text-xs hover:bg-slate-800 transition-all"
                        >
                          <FilePenLine size={14} /> Gestionar
                        </button>
                      )}

                      <button onClick={() => onDelete(s)} className="p-2 text-rose-600 hover:!bg-rose-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
