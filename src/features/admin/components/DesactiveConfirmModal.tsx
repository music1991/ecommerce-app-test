import { AlertCircle } from "lucide-react";
import { Modal } from "../../../shared/modals/Modal";

interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: string;
  textConfirm: string;
}

export const DesactiveConfirmModal = ({ isOpen, onClose, onConfirm, item, textConfirm }: DeleteConfirmProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Eliminación">
    <div className="space-y-6">
      <div className="flex items-start gap-4 p-4 rounded-2xl bg-rose-50 border border-rose-100">
        <div>
          <h3 className="font-bold text-rose-900">¿Estás seguro?</h3>
          <p className="text-sm text-rose-700 mt-1">
            Estás a punto de desactivar <strong>{item}</strong>.
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-3 !bg-slate-100 !text-slate-700 font-bold rounded-xl border border-slate-200 hover:!bg-slate-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-3 rounded-xl font-bold !bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all"
        >
          Sí, desactivar {textConfirm}
        </button>
      </div>
    </div>
  </Modal>
);