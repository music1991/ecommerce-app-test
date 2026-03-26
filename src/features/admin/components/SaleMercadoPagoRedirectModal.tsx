import { ArrowRightLeft, CreditCard, UserRound, BadgeDollarSign } from "lucide-react";
import { Modal } from "../../../shared/modals/Modal";

type SaleMercadoPagoRedirectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  customerName: string;
  employeeName: string;
  isLoading?: boolean;
  onContinue: () => void;
};

export const SaleMercadoPagoRedirectModal = ({
  isOpen,
  onClose,
  total,
  customerName,
  employeeName,
  isLoading = false,
  onContinue,
}: SaleMercadoPagoRedirectModalProps) => {
  const money = (n: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Continuar con Mercado Pago">
      <div className="space-y-6">

        <div className="rounded-[1.5rem] bg-slate-900 text-white p-5">
          <div className="flex items-center gap-2 mb-2">
            <BadgeDollarSign size={18} className="text-slate-300" />
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Total a pagar
            </p>
          </div>
          <p className="text-3xl font-black">{money(total)}</p>
        </div>

        <div className="rounded-2xl border-2 border-blue-200 !bg-blue-50 px-5 py-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl !bg-blue-600 text-white">
              <ArrowRightLeft size={18} />
            </div>

            <div>
              <p className="text-sm font-black text-blue-900">
                Serás redirigido a la pantalla de cobro con Mercado Pago
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Allí podrás continuar el proceso de pago y completar la venta.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-3 rounded-xl border border-slate-200 text-white font-bold !bg-red-400 hover:!bg-red-300 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onContinue}
            disabled={isLoading}
            className="px-5 py-3 rounded-xl font-bold text-white shadow-sm !bg-blue-600 hover:!bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Redirigiendo..." : "Continuar con Mercado Pago"}
          </button>
        </div>
      </div>
    </Modal>
  );
};