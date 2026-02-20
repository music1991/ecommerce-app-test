import React from "react";
import { AlertCircle } from "lucide-react";
import { Modal } from "../../../shared/modals/Modal";

interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName }: DeleteConfirmProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Eliminación">
    <div className="space-y-6">
      <div className="flex items-start gap-4 p-4 rounded-2xl bg-rose-50 border border-rose-100">
        <div className="bg-rose-100 p-2 rounded-xl text-rose-600">
          <AlertCircle size={24} />
        </div>
        <div>
          <h3 className="font-bold text-rose-900">¿Estás absolutamente seguro?</h3>
          <p className="text-sm text-rose-700 mt-1">
            Estás a punto de eliminar <strong>{productName}</strong>. Esta acción no se puede deshacer.
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-3 rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all"
        >
          Sí, eliminar producto
        </button>
      </div>
    </div>
  </Modal>
);