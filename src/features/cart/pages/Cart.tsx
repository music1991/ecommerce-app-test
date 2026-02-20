import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Trash2, ShoppingBag, CreditCard, ArrowLeft, Store, XCircle } from "lucide-react";

import { useCartStore } from "../store/useCartStore";
import { useSalesStore } from "../../sales/store/useSalesStore";

export const Cart = () => {
  const navigate = useNavigate();

  const currentUser = useMemo(
    () => ({ id: "client-001", name: "Cliente Online", type: "cliente" as const }),
    []
  );

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartTotal, setCartTotal] = useState(0);

  const getActiveSaleByActor = useSalesStore((s) => s.getActiveSaleByActor);
  const createOrUpdateActiveSale = useSalesStore((s) => s.createOrUpdateActiveSale);
  const deleteSale = useSalesStore((s) => s.deleteSale);
  const markFinalizeInLocal = useSalesStore((s) => s.markFinalizeInLocal);
  const completeSale = useSalesStore((s) => s.completeSale);
  const getSaleById = useSalesStore((s) => s.getSaleById);

  const [saleId, setSaleId] = useState<number | null>(null);
  const sale = saleId ? getSaleById(saleId) : undefined;

  useEffect(() => {
    const state = useCartStore.getState();
    setCartItems(state.cart);
    setCartTotal(state.total);

    const unsub = useCartStore.subscribe((state) => {
      setCartItems(state.cart);
      setCartTotal(state.total);
    });

    return unsub;
  }, []);

  const money = (n: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

  useEffect(() => {
    if (cartItems.length === 0) return;

    const active = getActiveSaleByActor(currentUser.type, currentUser.id);

    const updated = createOrUpdateActiveSale(currentUser.type, currentUser.id, {
      actorName: currentUser.name,
      assignedToEmployeeId: active?.assignedToEmployeeId ?? null,
      items: cartItems.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        images: i.images,
      })),
      total: cartTotal,
    });

    setSaleId(updated.id);
  }, [cartItems, cartTotal]);

  const handleRemove = (id: string) => {
    useCartStore.getState().removeFromCart(id);
  };

  const handleCancel = () => {
    const active = getActiveSaleByActor(currentUser.type, currentUser.id);
    if (active && active.status !== "completada") deleteSale(active.id);

    setSaleId(null);
    useCartStore.getState().clearCart();
    navigate("/");
  };

  const handleFinalizeInLocal = () => {
    if (!saleId) return;
    const s = getSaleById(saleId);
    if (!s || s.status === "completada") return;

    markFinalizeInLocal(saleId);
  };

  const handleBuyOnline = () => {
    if (!saleId) return;
    const s = getSaleById(saleId);
    if (!s || s.status === "completada") return;

    completeSale(saleId, {
      actorType: currentUser.type,
      actorId: currentUser.id,
      actorName: currentUser.name,
    });

    useCartStore.getState().clearCart();
  };

  const statusPill = useMemo(() => {
    if (!sale) return null;

    if (sale.status === "cargando") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
          Cargando
        </span>
      );
    }
    if (sale.status === "finalizar_en_local") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">
          Finalizar en local
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700">
        Completada
      </span>
    );
  }, [sale]);

  if (cartItems.length === 0) {
    return (
      <div className="pt-40 text-center pb-20 px-4">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="text-slate-300" size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Tu carrito está vacío</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700"
        >
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 container mx-auto px-4">
      <div className="flex items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Mi Carrito</h1>
            <div className="mt-2 flex items-center gap-3">
              <p className="text-slate-500 font-medium">
                Compra online • {currentUser.name} {saleId ? `• ID #${saleId}` : ""}
              </p>
              {statusPill}
            </div>
          </div>
        </div>

        <button
          onClick={handleCancel}
          className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
          title="Cancelar y volver a la tienda"
        >
          <XCircle size={18} />
          Cancelar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                <img src={item.images?.[0]} className="w-full h-full object-cover" alt={item.name} />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-slate-900 leading-tight">{item.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-blue-600 font-black">{money(item.price)}</span>
                  <span className="text-xs text-slate-400 font-medium bg-blue-50 px-2 py-0.5 rounded-md">
                    Cant: {item.quantity}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleRemove(item.id)}
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl"
                title="Quitar del carrito"
                disabled={sale?.status === "completada"}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] sticky top-24">
            <h2 className="text-2xl font-bold mb-8">Resumen</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>{money(cartTotal)}</span>
              </div>
              <div className="h-[1px] bg-slate-800 my-4"></div>
              <div className="flex justify-between text-2xl font-black">
                <span>Total</span>
                <span className="text-blue-400">{money(cartTotal)}</span>
              </div>

              {sale && (
                <div className="mt-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-black">Estado</p>
                  <p className="mt-2 font-bold">
                    {sale.status === "cargando" && "Cargando (sin confirmar)"}
                    {sale.status === "finalizar_en_local" && "Finalizar en el local"}
                    {sale.status === "completada" && "Completada (pagada)"}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Creada: {new Date(sale.createdAt).toLocaleString()}
                  </p>
                  {sale.paidAt && (
                    <p className="text-sm text-slate-400 mt-1">
                      Pagada: {new Date(sale.paidAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>

            {sale?.status === "completada" ? (
              <button
                onClick={() => navigate("/")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all"
              >
                <CreditCard size={22} /> Compra completada
              </button>
            ) : (
              <>
                <button
                  onClick={handleBuyOnline}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all"
                >
                  <CreditCard size={22} /> Comprar online
                </button>

                <button
                  onClick={handleFinalizeInLocal}
                  className="mt-4 w-full bg-white/10 hover:bg-white/15 border border-slate-700 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Store size={18} /> Finalizar en local
                </button>

                <button
                  onClick={handleCancel}
                  className="mt-4 w-full bg-rose-600 hover:bg-rose-700 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all md:hidden"
                >
                  <XCircle size={18} /> Cancelar
                </button>
              </>
            )}

            <p className="mt-5 text-xs text-slate-400">
              Si dejás el carrito, queda en <b>Cargando</b>. Si tocás <b>Finalizar en local</b>, queda listo para que un
              empleado lo complete en el local o lo derive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
