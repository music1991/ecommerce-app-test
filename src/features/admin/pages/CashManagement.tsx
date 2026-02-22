import { useEffect, useState, useMemo } from "react";
import { 
  Wallet, 
  Lock, 
  Unlock, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  History, 
  ReceiptText 
} from "lucide-react";

// Componentes y UI
import { Modal } from "../../../shared/modals/Modal";
import { OpenCashForm } from "../components/OpenCashForm";
import { CloseCashModal } from "../components/CloseCashModal";
import { CashMovementModal } from "../components/CashMovementModal";

// Servicios y Stores
import { 
  closeCashRegister, 
  getActiveCashRegister, 
  openCashRegister, 
  addCashMovement 
} from "../../../api/cash.service";
import { useSalesStore } from "../../sales/store/useSalesStore";

export const CashManagement = () => {
  // --- ESTADOS DE CAJA ---
  const [activeBox, setActiveBox] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [manualMovements, setManualMovements] = useState<any[]>([]); // Para ingresos/egresos manuales
  
  // --- ESTADOS DE MODALES ---
  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');

  // --- DATOS DE VENTAS (ZUSTAND) ---
  const sales = useSalesStore((state) => state.sales);

  // --- LÓGICA DE MOVIMIENTOS COMBINADOS (VENTAS + MANUALES) ---
  const allMovements = useMemo(() => {
    if (!activeBox) return [];

    // 1. Transformamos ventas completadas de esta caja
    const saleMovements = sales
      .filter((s) => s.cash_register_id === activeBox.id && s.status === "completada")
      .map((s) => ({
        id: `sale-${s.id}`,
        type: 'in' as const,
        amount: s.total,
        description: `Venta #${s.id}`,
        time: s.paidAt || s.createdAt,
        actor: s.actorName || "Consumidor Final",
        isSale: true
      }));

    // 2. Combinamos con movimientos manuales del estado local
    const combined = [...saleMovements, ...manualMovements];

    // 3. Ordenamos por fecha (más reciente primero)
    return combined.sort((a, b) => 
      new Date(b.time).getTime() - new Date(a.time).getTime()
    );
  }, [sales, activeBox, manualMovements]);

  const totalVentas = allMovements
    .filter(m => m.isSale)
    .reduce((acc, m) => acc + m.amount, 0);

  // --- EFECTOS Y CARGA ---
  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await getActiveCashRegister();
      if (res.success && res.data) {
        setActiveBox(res.data);
      }
    } catch (error) {
      console.error("Error al obtener estado de caja", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  // --- MANEJADORES DE EVENTOS ---
  const handleConfirmOpen = async (payload: any) => {
    const res = await openCashRegister(payload);
    if (res.success) {
      setActiveBox(res.data);
      setManualMovements([]); // Limpiamos movimientos locales al abrir nueva caja
      setIsOpenModalOpen(false);
    }
  };

  const handleConfirmClose = async (notes: string) => {
    const res = await closeCashRegister({ notes });
    if (res.success) {
      setActiveBox(null);
      setManualMovements([]);
      setIsCloseModalOpen(false);
    }
  };

  const handleConfirmMovement = async (data: any) => {
    const res = await addCashMovement(activeBox.id, data);
    if (res.success) {
      // Actualizamos saldo de la caja
      setActiveBox((prev: any) => ({
        ...prev,
        current_amount: data.type === 'in' 
          ? prev.current_amount + data.amount 
          : prev.current_amount - data.amount
      }));

      // Agregamos al historial local para visualización inmediata
      setManualMovements(prev => [{
        id: `manual-${Math.random()}`,
        type: data.type,
        amount: data.amount,
        description: data.description || (data.type === 'in' ? 'Ingreso Manual' : 'Egreso Manual'),
        time: new Date().toISOString(),
        actor: "Admin",
        isSale: false
      }, ...prev]);

      setIsMovementModalOpen(false);
    }
  };

  const openMovement = (type: 'in' | 'out') => {
    setMovementType(type);
    setIsMovementModalOpen(true);
  };

  if (loading) return (
    <div className="p-20 text-center animate-pulse text-slate-400 font-black uppercase tracking-widest">
      Sincronizando Caja...
    </div>
  );

  console.log(allMovements)

  return (
    <div className="p-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-600/20">
            <Wallet size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Caja y POS</h1>
            <p className="text-slate-500 font-medium tracking-tight">Control de efectivo por turno.</p>
          </div>
        </div>

        {activeBox ? (
          <button 
            onClick={() => setIsCloseModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 !bg-red-50 text-red-600 border-2 border-red-100 rounded-2xl font-black hover:bg-red-100 transition-all active:scale-95"
          >
            <Lock size={20} /> Finalizar Turno
          </button>
        ) : (
          <button 
            onClick={() => setIsOpenModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 !bg-blue-600 text-white rounded-2xl font-black hover:bg-slate-900 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <Unlock size={20} /> Abrir Nueva Caja
          </button>
        )}
      </div>

      {activeBox ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CARD DE SALDO ACTUAL */}
          <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 text-blue-600">
              <Wallet size={120} />
            </div>
            
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mb-4">Efectivo en Caja</p>
            <h2 className="text-6xl font-black text-slate-800 tracking-tighter">
              ${activeBox.current_amount.toLocaleString()}
            </h2>

            <div className="mt-10 space-y-3">
              <div className="flex justify-between text-sm font-bold text-slate-500 border-b border-slate-50 pb-2">
                <span>Monto Inicial:</span>
                <span className="text-slate-800">${activeBox.initial_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Abierta desde:</span>
                <span className="text-slate-800">{new Date(activeBox.opened_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} hs</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
              <button onClick={() => openMovement('in')} className="flex flex-col items-center gap-2 p-5 bg-emerald-50 text-emerald-700 rounded-[2rem] hover:bg-emerald-100 transition-all group border border-emerald-100">
                <ArrowUpCircle className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Ingreso</span>
              </button>
              <button onClick={() => openMovement('out')} className="flex flex-col items-center gap-2 p-5 bg-orange-50 text-orange-700 rounded-[2rem] hover:bg-orange-100 transition-all group border border-orange-100">
                <ArrowDownCircle className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Egreso</span>
              </button>
            </div>
          </div>

          {/* HISTORIAL DE MOVIMIENTOS */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 p-10 flex flex-col min-h-[450px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <ReceiptText className="text-blue-600" size={24} />
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Movimientos del Turno</h3>
              </div>
              <span className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Ventas: ${totalVentas.toLocaleString()}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
              {allMovements.length > 0 ? (
                <div className="space-y-4">
                  {allMovements.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${m.type === 'in' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                          {m.isSale ? <ReceiptText size={20} /> : (m.type === 'in' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{m.description}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                            {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs • {m.actor}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-lg ${m.type === 'in' ? 'text-emerald-600' : 'text-orange-600'}`}>
                          {m.type === 'in' ? '+' : '-'} ${m.amount.toLocaleString()}
                        </p>
                        <span className="text-[9px] font-black uppercase opacity-40">{m.isSale ? 'Venta POS' : 'Ajuste'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 min-h-[300px]">
                  <History size={48} className="mb-4 opacity-20" />
                  <p className="font-bold uppercase text-xs tracking-widest">Sin actividad en este turno</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50/50 border-4 border-dashed border-slate-100 rounded-[4rem] py-32 text-center">
          <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-slate-200/50 text-slate-300">
            <Lock size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-400 tracking-tighter uppercase">Caja Cerrada</h2>
          <p className="text-slate-400 font-medium max-w-sm mx-auto mt-4">Debes iniciar un nuevo turno de trabajo para operar.</p>
        </div>
      )}

      {/* MODALES */}
      <Modal isOpen={isOpenModalOpen} onClose={() => setIsOpenModalOpen(false)} title="Apertura de Caja">
        <OpenCashForm onSave={handleConfirmOpen} onCancel={() => setIsOpenModalOpen(false)} />
      </Modal>

      <CloseCashModal isOpen={isCloseModalOpen} onClose={() => setIsCloseModalOpen(false)} onConfirm={handleConfirmClose} currentAmount={activeBox?.current_amount || 0} />
      
      <CashMovementModal isOpen={isMovementModalOpen} onClose={() => setIsMovementModalOpen(false)} onConfirm={handleConfirmMovement} type={movementType} />
    </div>
  );
};
