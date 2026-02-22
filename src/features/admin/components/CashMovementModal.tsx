import { useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, DollarSign, FileText } from "lucide-react";
import { Modal } from "../../../shared/modals/Modal";

interface CashMovementProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { type: 'in' | 'out', amount: number, description: string }) => void;
    type: 'in' | 'out';
}

export const CashMovementModal = ({ isOpen, onClose, onConfirm, type }: CashMovementProps) => {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const isIngreso = type === 'in';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({
            type,
            amount: Number(amount),
            description: description.trim()
        });
        // Resetear estados
        setAmount("");
        setDescription("");
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isIngreso ? "Registrar Ingreso Manual" : "Registrar Egreso / Gasto"}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Indicador de Tipo */}
                <div className={`p-4 rounded-2xl flex items-center gap-4 ${isIngreso ? 'bg-emerald-50 border border-emerald-100' : 'bg-orange-50 border border-orange-100'}`}>
                    {isIngreso ? <ArrowUpCircle className="text-emerald-600" /> : <ArrowDownCircle className="text-orange-600" />}
                    <p className={`text-xs font-black uppercase tracking-widest ${isIngreso ? 'text-emerald-700' : 'text-orange-700'}`}>
                        Movimiento de {isIngreso ? 'Entrada' : 'Salida'}
                    </p>
                </div>

                {/* Campo Monto */}
                <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                        Monto del movimiento ($)
                    </label>
                    <div className="relative">
                        <DollarSign className={`absolute left-4 top-1/2 -translate-y-1/2 ${isIngreso ? 'text-emerald-400' : 'text-orange-400'}`} size={20} />
                        <input
                            type="number"
                            required
                            autoFocus
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-slate-800 font-black text-xl focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Campo Descripción */}
                <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                        Concepto / Descripción
                    </label>
                    <div className="relative">
                        <FileText className="absolute left-4 top-4 text-slate-300" size={18} />
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={isIngreso ? "Ej: Cobro de deuda pendiente..." : "Ej: Pago de flete / Compra de artículos limpieza..."}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all min-h-[100px]"
                        />
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-1/2 px-4 py-3 !bg-slate-100 !text-slate-700 font-bold rounded-xl border border-slate-200 hover:!bg-slate-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={`flex-1 px-4 py-4 text-white font-bold rounded-2xl shadow-xl transition-all ${isIngreso ? '!bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : '!bg-orange-600 hover:bg-orange-700 shadow-orange-600/20'}`}
                    >
                        Confirmar {isIngreso ? 'Ingreso' : 'Egreso'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
