import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCartStore } from '../../cart/store/useCartStore'; 
import { ShoppingCart, Check, ArrowLeft, Truck, ShieldCheck, Star } from 'lucide-react';
import { MOCK_PRODUCTS } from '../services/products.mock';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const product = MOCK_PRODUCTS.find(p => p.id === id);

  if (!product) return (
    <div className="pt-32 text-center h-screen font-bold text-slate-500">
      Producto no encontrado
    </div>
  );

  const handleAddToCart = () => {
    useCartStore.getState().addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen pb-20 pt-28">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Botón Volver - Más sutil */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-10 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-wider">Volver a la tienda</span>
        </button>

        {/* Sección Principal: Imagen + Info Corta */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          
          {/* Contenedor Imagen - Ocupa 7 columnas */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 sticky top-32">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700" 
              />
            </div>
          </div>

          {/* Información de Compra - Ocupa 5 columnas */}
          <div className="lg:col-span-5 flex flex-col justify-center">
    {/*         <div className="inline-flex items-center gap-2 mb-4">
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                {product.catego || 'Premium Tech'}
              </span>
              <div className="flex text-amber-400"><Star size={14} fill="currentColor" /></div>
            </div> */}
            
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[0.9] mb-6 tracking-tighter">
              {product.name}
            </h1>
            
            <p className="text-lg text-slate-500 leading-relaxed mb-8 border-l-4 border-slate-100 pl-6">
              {product.description}
            </p>
            
            {/* Caja de Acción de Precio */}
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Inversión Total</p>
                  <p className="text-4xl font-black text-slate-900">${product.price.toLocaleString()}</p>
                </div>
                <div className="text-green-500 text-xs font-bold bg-green-50 px-3 py-1 rounded-lg">En Stock</div>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 text-lg font-black transition-all active:scale-95 shadow-xl shadow-slate-200 
                  ${isAdded ? '!bg-green-500 text-white' : '!bg-slate-900 text-white hover:bg-black'}`}
              >
                {isAdded ? (
                  <><Check size={22} strokeWidth={3} /> AGREGADO</>
                ) : (
                  <><ShoppingCart size={22} strokeWidth={3} /> COMPRAR AHORA</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sección de Detalle: Descripción Larga + Specs */}
        <section className="border-t border-slate-100 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">
                Análisis Detallado
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed mb-10">
                {product.longDescription || "Experiencia de usuario de alto nivel con los mejores estándares de calidad del mercado."}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-slate-50 border border-slate-100 text-slate-700 px-6 py-4 rounded-2xl flex items-center gap-3 font-bold hover:bg-white transition-colors">
                  <ShieldCheck className="text-blue-500" size={24} /> 
                  <div className="flex flex-col"><span className="text-[10px] uppercase opacity-50">Garantía</span><span>2 Años Oficial</span></div>
                </div>
                <div className="bg-slate-50 border border-slate-100 text-slate-700 px-6 py-4 rounded-2xl flex items-center gap-3 font-bold hover:bg-white transition-colors">
                  <Truck className="text-blue-500" size={24} /> 
                  <div className="flex flex-col"><span className="text-[10px] uppercase opacity-50">Envío</span><span>Gratis Express</span></div>
                </div>
              </div>
            </div>

            {/* Ficha Técnica */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><ShoppingCart size={80} /></div>
              <h3 className="text-blue-400 font-black uppercase tracking-widest text-[10px] mb-8 relative z-10">
                Especificaciones Técnicas
              </h3>
              <div className="space-y-6 relative z-10">
                {product.specs ? Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex flex-col border-b border-white/10 pb-4 last:border-0">
                    <span className="text-slate-500 text-[10px] font-black uppercase mb-1">{key}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                )) : (
                  <p className="text-slate-500 italic">Datos técnicos en proceso...</p>
                )}
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};
