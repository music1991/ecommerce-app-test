import { useSearchParams } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../api/products.mock';

import { Search } from 'lucide-react';
import { ProductCard } from '../components/products/ProductCard';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || "";

  // Lógica de filtrado: busca en nombre, descripción o categoría
  const results = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.description.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <div className="flex items-center gap-4 text-slate-400 mb-2">
            <Search size={20} />
            <span className="uppercase tracking-widest text-xs font-bold">Resultados de búsqueda</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900">
            Mostrando resultados para: <span className="text-blue-600">"{query}"</span>
          </h1>
          <p className="text-slate-500 mt-2">{results.length} productos encontrados</p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-xl text-slate-400 font-medium">No encontramos nada que coincida con tu búsqueda.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};