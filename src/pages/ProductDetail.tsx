import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore'; 
import { ShoppingCart, Check, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';
import { MOCK_PRODUCTS } from '../api/products.mock';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);

  // Forzamos el scroll al inicio al entrar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const product = MOCK_PRODUCTS.find(p => p.id === id);

  if (!product) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Producto no encontrado</div>;

  const handleAddToCart = () => {
    // Usamos getState para evitar errores de renderizado circular
    useCartStore.getState().addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <div className="container mx-auto px-4">
        
        {/* Botón Volver */}
        <button 
          onClick={() => navigate(-1)} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer', marginBottom: '40px' }}
        >
          <ArrowLeft size={20} /> Volver a la tienda
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Contenedor Imagen */}
          <div style={{ borderRadius: '32px', overflow: 'hidden', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}>
            <img 
              src={product.images[0]} 
              alt={product.name} 
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} 
            />
          </div>

          {/* Contenedor Información */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#2563eb', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px', marginBottom: '12px' }}>
              {product.category || 'Premium Tech'}
            </span>
            
            <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', lineHeight: '1', marginBottom: '24px', letterSpacing: '-2px' }}>
              {product.name}
            </h1>
            
            <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.6', marginBottom: '40px' }}>
              {product.description}
            </p>
            
            {/* CAJA DE COMPRA FORZADA - ESTO ES LO QUE NO SE VEÍA */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '24px', 
              paddingTop: '32px', 
              borderTop: '2px solid #f1f5f9',
              marginTop: 'auto'
            }}>
              <div style={{ flexShrink: 0 }}>
                <p style={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '12px', margin: 0, textTransform: 'uppercase' }}>Precio Total</p>
                <p style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                  ${product.price.toLocaleString()}
                </p>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={isAdded}
                style={{
                  flex: 1,
                  height: '70px',
                  backgroundColor: isAdded ? '#22c55e' : '#000000', // NEGRO PURO PARA QUE SE VEA SI O SI
                  color: '#ffffff', // TEXTO BLANCO PURO
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '20px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  opacity: 1, // Forzamos visibilidad
                  visibility: 'visible' // Forzamos visibilidad
                }}
              >
                {isAdded ? (
                  <>
                    <Check size={24} strokeWidth={3} />
                    ¡AGREGADO!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={24} strokeWidth={3} />
                    COMPRAR AHORA
                  </>
                )}
              </button>
            </div>
          </div>
          <section className="mt-20 border-t border-slate-100 pt-16">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
    
    {/* Columna de Texto Largo */}
    <div className="lg:col-span-2">
      <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">
        Descripción del Producto
      </h2>
      <p className="text-xl text-slate-500 leading-relaxed mb-8">
        {product.longDescription || "No hay una descripción detallada para este producto."}
      </p>
      
      {/* Iconos de confianza */}
      <div className="flex flex-wrap gap-4 mt-12">
        <div className="bg-blue-50 text-blue-700 px-6 py-4 rounded-2xl flex items-center gap-3 font-bold">
           <ShieldCheck size={20} /> Garantía Premium
        </div>
        <div className="bg-slate-50 text-slate-700 px-6 py-4 rounded-2xl flex items-center gap-3 font-bold">
           <Truck size={20} /> Envío Express
        </div>
      </div>
    </div>

    {/* Columna de Specs (Tabla Negra) */}
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl">
      <h3 className="text-blue-400 font-black uppercase tracking-widest text-xs mb-8">
        Ficha Técnica
      </h3>
      <div className="space-y-6">
        {product.specs ? Object.entries(product.specs).map(([key, value]) => (
          <div key={key} className="flex flex-col border-b border-white/10 pb-4 last:border-0">
            <span className="text-slate-500 text-[10px] font-black uppercase mb-1">{key}</span>
            <span className="text-white font-medium">{value}</span>
          </div>
        )) : (
          <p className="text-slate-500 italic">Especificaciones no disponibles</p>
        )}
      </div>
    </div>

  </div>
</section>
        </div>
      </div>
    </div>
  );
};