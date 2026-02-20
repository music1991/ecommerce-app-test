import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Trash2, ShoppingBag, CreditCard, ArrowLeft, Store, XCircle } from "lucide-react";

import { useCartStore } from "../store/useCartStore";
import { useSalesStore } from "../../sales/store/useSalesStore";
import { useAuthStore } from "../../auth/store/authStore"; // <--- Importante

export const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore(); // Obtenemos el usuario real

  // Definimos el actor basándonos en si hay alguien logueado
  const currentActor = useMemo(() => {
    if (user) {
      return {
        id: user.id || user.email,
        name: user.name,
        email: user.email,
        type: user.role
      };
    }
    return { id: "guest", name: "Invitado", email: null, type: "cliente" };
  }, [user]);

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartTotal, setCartTotal] = useState(0);

  const { 
    getActiveSaleByActor, 
    createOrUpdateActiveSale, 
    deleteSale, 
    markFinalizeInLocal, 
    completeSale, 
    getSaleById 
  } = useSalesStore();

  const [saleId, setSaleId] = useState<number | null>(null);
  const sale = saleId ? getSaleById(saleId) : undefined;

  // Sincronización con el Carrito de Zustand
  useEffect(() => {
    setCartItems(useCartStore.getState().cart);
    setCartTotal(useCartStore.getState().total);
    return useCartStore.subscribe((s) => {
      setCartItems(s.cart);
      setCartTotal(s.total);
    });
  }, []);

  // Sincronización con SalesStore (La "Venta Activa")
  useEffect(() => {
    if (cartItems.length === 0) return;

    const active = getActiveSaleByActor(currentActor.type, currentActor.id);
    const updated = createOrUpdateActiveSale(currentActor.type, currentActor.id, {
      actorName: currentActor.name,
      actorEmail: currentActor.email,
      items: cartItems.map(i => ({
        id: i.id, name: i.name, price: i.price, quantity: i.quantity, images: i.images
      })),
      total: cartTotal,
      assignedToEmployeeId: active?.assignedToEmployeeId ?? null,
    });

    setSaleId(updated.id);
  }, [cartItems, cartTotal, currentActor]);

  const money = (n: number) => 
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

  const handleBuyOnline = () => {
    if (!saleId) return;
    completeSale(saleId, {
      actorType: currentActor.type,
      actorId: currentActor.id,
      actorName: currentActor.name,
      actorEmail: currentActor.email
    });
    useCartStore.getState().clearCart();
  };

  const handleFinalizeInLocal = () => {
    if (saleId) markFinalizeInLocal(saleId);
  };

  const handleCancel = () => {
    if (saleId) deleteSale(saleId);
    useCartStore.getState().clearCart();
    navigate("/");
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-40 text-center px-4">
        <ShoppingBag className="mx-auto text-slate-200 mb-4" size={60} />
        <h2 className="text-xl font-bold">Carrito vacío</h2>
        <button onClick={() => navigate("/")} className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">
          Ir a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 container mx-auto px-4">
       {/* HEADER */}
       <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black">Mi Carrito</h1>
            <p className="text-slate-500">{currentActor.name} • ID Venta: #{saleId}</p>
          </div>
          <button onClick={handleCancel} className="text-slate-400 hover:text-red-500 flex items-center gap-2">
            <XCircle size={20}/> Cancelar
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <img src={item.images?.[0]} className="w-20 h-20 object-cover rounded-xl bg-slate-50" />
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-blue-600 font-black">{money(item.price)} x {item.quantity}</p>
                </div>
                <button onClick={() => useCartStore.getState().removeFromCart(item.id)} className="p-2 text-slate-300 hover:text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* RESUMEN */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] sticky top-24">
              <div className="flex justify-between text-2xl font-black mb-8">
                <span>Total</span>
                <span className="text-blue-400">{money(cartTotal)}</span>
              </div>
              
              <div className="space-y-3">
                <button onClick={handleBuyOnline} className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-black flex items-center justify-center gap-2">
                  <CreditCard size={20}/> Comprar Online
                </button>
                <button onClick={handleFinalizeInLocal} className="w-full bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                  <Store size={18}/> Finalizar en Local
                </button>
              </div>

              {sale && (
                <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-400">
                  <p>Estado: <span className="text-white uppercase font-black">{sale.status}</span></p>
                  <p>Iniciada: {new Date(sale.createdAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
       </div>
    </div>
  );
};