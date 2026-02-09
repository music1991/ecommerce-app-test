import React, { useMemo } from 'react';

import { MOCK_PRODUCTS } from '../api/products.mock';
import { Laptop, Filter, ChevronRight } from 'lucide-react';
import { ProductCard } from '../components/products/ProductCard';

interface Props {
  categoryName: string; // "Laptops", "Monitors", etc.
}

export const CategoryPage = ({ categoryName }: Props) => {
  // Filtramos los productos según la categoría
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    );
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-20">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumbs Sutiles */}
        <nav className="flex items-center gap-2 text-slate-400 text-sm mb-6 font-medium">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Tienda</span>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-bold">{categoryName}</span>
        </nav>

        {/* Header de Categoría */}
        <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 mb-16 shadow-2xl shadow-blue-900/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 text-blue-400 mb-4">
                <Laptop size={24} />
                <span className="font-black uppercase tracking-widest text-sm">Categoría Premium</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                {categoryName}
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed">
                Potencia y portabilidad sin compromisos. Descubre nuestra selección de {categoryName.toLowerCase()} diseñadas para el rendimiento extremo.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 text-center">
              <p className="text-white text-4xl font-black">{filteredProducts.length}</p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Modelos Disponibles</p>
            </div>
          </div>
          
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full -mr-20 -mt-20"></div>
        </div>

        {/* Barra de Filtros Rápida */}
        <div className="flex items-center justify-between mb-10 border-b border-slate-200 pb-6">
          <button className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:border-blue-600 transition-all shadow-sm">
            <Filter size={18} /> Filtrar
          </button>
          <p className="text-slate-500 font-medium">Mostrando {filteredProducts.length} resultados</p>
        </div>

        {/* Grid de Productos */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center">
            <h2 className="text-2xl font-bold text-slate-400">No encontramos productos en esta categoría.</h2>
          </div>
        )}
      </div>
    </div>
  );
};