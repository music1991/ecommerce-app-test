import { useMemo, useState } from "react";
import { Banknote, CreditCard, Wallet, ArrowRightLeft } from "lucide-react";
import { Modal } from "../../../shared/modals/Modal";

type PaymentMethod = "cash" | "mercado_pago";

type SalePaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  customerName: string;
  employeeName: string;
  isLoading?: boolean;
  onConfirmCash: (payload: { amountReceived: number; change: number }) => Promise<void> | void;
  onContinueMercadoPago: () => void;
};

export const SalePaymentModal = ({
  isOpen,
  onClose,
  total,
  customerName,
  employeeName,
  isLoading = false,
  onConfirmCash,
  onContinueMercadoPago,
}: SalePaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [amountReceived, setAmountReceived] = useState("");

  const money = (n: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

  const received = Number(amountReceived || 0);
  const change = useMemo(() => Math.max(received - total, 0), [received, total]);
  const missing = useMemo(() => Math.max(total - received, 0), [received, total]);

  const canConfirmCash = received >= total && total > 0;

  const handleClose = () => {
    if (isLoading) return;
    setPaymentMethod("cash");
    setAmountReceived("");
    onClose();
  };

  const handleConfirm = async () => {
    if (paymentMethod === "mercado_pago") {
      onContinueMercadoPago();
      return;
    }

    if (!canConfirmCash) return;

    await onConfirmCash({
      amountReceived: received,
      change,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Completar pago">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Cliente
            </p>
            <p className="text-sm font-black text-slate-900">{customerName}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Empleado
            </p>
            <p className="text-sm font-black text-slate-900">{employeeName}</p>
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-slate-900 text-white p-5">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
            Total a pagar
          </p>
          <p className="text-3xl font-black">{money(total)}</p>
        </div>

       <div>
  <p className="text-sm font-black text-slate-800 mb-3">Método de pago</p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {/* Opción Efectivo */}
    <button
      type="button"
      onClick={() => setPaymentMethod("cash")}
      className={`rounded-2xl border-2 p-4 text-left transition-all ${
        paymentMethod === "cash"
          ? "border-emerald-600 !bg-emerald-50 shadow-sm"
          : "border-slate-200 !bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-xl transition-colors ${
            paymentMethod === "cash" 
              ? "!bg-emerald-600 text-white" 
              : "!bg-slate-100 text-slate-400"
          }`}
        >
          <Banknote size={18} />
        </div>
        <div>
          <p className={`text-sm font-black ${paymentMethod === "cash" ? "text-emerald-900" : "text-slate-900"}`}>
            Efectivo
          </p>
          <p className="text-xs text-slate-500">Cobro inmediato en caja</p>
        </div>
      </div>
    </button>

    {/* Opción Mercado Pago */}
    <button
      type="button"
      onClick={() => setPaymentMethod("mercado_pago")}
      className={`rounded-2xl border-2 p-4 text-left transition-all ${
        paymentMethod === "mercado_pago"
          ? "border-blue-600 !bg-blue-50 shadow-sm"
          : "border-slate-200 !bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-xl transition-colors ${
            paymentMethod === "mercado_pago" 
              ? "!bg-blue-600 text-white" 
              : "!bg-slate-100 text-slate-400"
          }`}
        >
          <CreditCard size={18} />
        </div>
        <div>
          <p className={`text-sm font-black ${paymentMethod === "mercado_pago" ? "text-blue-900" : "text-slate-900"}`}>
            Mercado Pago
          </p>
          <p className="text-xs text-slate-500">Continuar en pantalla de cobro</p>
        </div>
      </div>
    </button>
  </div>
</div>


        {paymentMethod === "cash" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2">
                Monto recibido
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                placeholder="0"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Total
                </p>
                <p className="text-lg font-black text-slate-900">{money(total)}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Recibido
                </p>
                <p className="text-lg font-black text-slate-900">{money(received)}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Vuelto
                </p>
                <p className="text-lg font-black text-emerald-600">{money(change)}</p>
              </div>
            </div>

            {amountReceived !== "" && received < total && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-bold text-red-600">
                  Faltan {money(missing)} para completar el pago.
                </p>
              </div>
            )}
          </div>
        )}

        {paymentMethod === "mercado_pago" && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4">
            <div className="flex items-center gap-2">
              <ArrowRightLeft size={16} className="text-blue-600" />
              <p className="text-sm font-bold text-blue-700">
                Vas a continuar en la vista de cobro con Mercado Pago.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-5 py-3 rounded-xl border border-slate-200 text-white font-bold !bg-red-400 hover:!bg-red-300 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading || (paymentMethod === "cash" && !canConfirmCash)}
            className={`px-5 py-3 rounded-xl font-bold text-white shadow-sm disabled:opacity-50 ${
              paymentMethod === "cash"
                ? "!bg-green-500 hover:bg-green-700"
                : "!bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading
              ? "Procesando..."
              : paymentMethod === "cash"
              ? "Cobrar y completar"
              : "Continuar con Mercado Pago"}
          </button>
        </div>
      </div>
    </Modal>
  );
};