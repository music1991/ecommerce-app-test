import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { Trash2, ShoppingBag, CreditCard, ArrowLeft } from 'lucide-react';

export const Cart = () => {
  const navigate = useNavigate();
  
  // Estados locales para evitar el crash del hook directo
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    // Sincronización inicial
    const state = useCartStore.getState();
    setCartItems(state.cart);
    setCartTotal(state.total);

    // Suscripción a cambios (por si borras algo estando en la página)
    const unsub = useCartStore.subscribe((state) => {
      setCartItems(state.cart);
      setCartTotal(state.total);
    });

    return unsub;
  }, []);

  // Función para borrar que llama directamente a la acción del store
  const handleRemove = (id: string) => {
    useCartStore.getState().removeFromCart(id);
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-40 text-center pb-20 px-4">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="text-slate-300" size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Tu carrito está vacío</h2>
        <button 
          onClick={() => navigate('/')} 
          className="mt-6 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700"
        >
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 container mx-auto px-4">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Mi Carrito</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                <img src={item.images[0]} className="w-full h-full object-cover" alt={item.name} />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 leading-tight">{item.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                   <span className="text-blue-600 font-black">${item.price.toLocaleString()}</span>
                   <span className="text-xs text-slate-400 font-medium bg-blue-50 px-2 py-0.5 rounded-md">
                    Cant: {item.quantity}
                   </span>
                </div>
              </div>

              <button 
                onClick={() => handleRemove(item.id)} 
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl"
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
                <span>${cartTotal.toLocaleString()}</span>
              </div>
              <div className="h-[1px] bg-slate-800 my-4"></div>
              <div className="flex justify-between text-2xl font-black">
                <span>Total</span>
                <span className="text-blue-400">${cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button className="w-full bg-blue-600 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3">
              <CreditCard size={22} /> Confirmar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};