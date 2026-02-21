import { CheckCircle2 } from "lucide-react";
import { Modal } from "../../../shared/modals/Modal";

interface ActivateConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: string;
  textConfirm: string;
}

export const ActivateConfirmModal = ({ isOpen, onClose, onConfirm, item, textConfirm }: ActivateConfirmProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Activación">
    <div className="space-y-6">
      {/* Contenedor con estilo Emerald para acciones positivas */}
      <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
        <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
          <CheckCircle2 size={24} />
        </div>
        <div>
          <h3 className="font-bold text-emerald-900">¿Reactivar elemento?</h3>
          <p className="text-sm text-emerald-700 mt-1">
            Estás a punto de volver a activar <strong>{item}</strong>.
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-3 rounded-xl font-bold !bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all"
        >
          Sí, activar {textConfirm}
        </button>
      </div>
    </div>
  </Modal>
);
