import { Lock, AlertCircle, FileText } from "lucide-react";
import { Modal } from "../../../shared/modals/Modal";
import { useState } from "react";

interface CloseCashProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (notes: string) => void;
	currentAmount: number;
}

export const CloseCashModal = ({ isOpen, onClose, onConfirm, currentAmount }: CloseCashProps) => {
	const [notes, setNotes] = useState("");

	const handleConfirm = () => {
		onConfirm(notes);
		setNotes(""); // Limpiamos para la próxima
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Cierre de Turno / Arqueo" size="md">
			<div className="space-y-6">
				{/* Alerta de Resumen */}
				<div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 text-center">
					<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Efectivo a entregar</p>
					<h3 className="text-4xl font-black text-slate-800 tracking-tighter">
						${currentAmount.toLocaleString()}
					</h3>
				</div>

				{/* Advertencia */}
				<div className="flex items-start gap-4 p-4 rounded-2xl bg-orange-50 border border-orange-100">
					<AlertCircle className="text-orange-600 shrink-0" size={20} />
					<div>
						<h4 className="font-bold text-orange-900 text-sm">Información Importante</h4>
						<p className="text-xs text-orange-700 mt-1 leading-relaxed">
							Al cerrar la caja, se finalizará tu turno actual. Asegúrate de que el efectivo físico coincida con el saldo del sistema.
						</p>
					</div>
				</div>

				{/* Notas de Cierre */}
				<div className="space-y-2">
					<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
						Notas del Arqueo (Opcional)
					</label>
					<div className="relative">
						<FileText className="absolute left-4 top-4 text-slate-300" size={18} />
						<textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="Ej: Todo ok / Faltan $10 por cambio..."
							className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all min-h-[80px]"
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
						onClick={handleConfirm}
						className="flex-1 px-4 py-4 !bg-slate-900 text-white font-bold rounded-2xl hover:bg-black shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2"
					>
						<Lock size={18} /> Finalizar Turno
					</button>
				</div>
			</div>
		</Modal>
	);
};
