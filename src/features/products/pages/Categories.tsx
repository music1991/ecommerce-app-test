import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductCard } from '../../products/components/ProductCard';
import { ProductSkeleton } from '../../products/components/ProductSkeleton';
import { getProducts } from '../../products/services/products.mock';
import type { Product } from '../../../core/entities/Product';
import { LayoutGrid, Filter, ArrowLeft } from 'lucide-react';
import { MOCK_CATEGORIES_DB } from '../../../shared/mocks/catetory.mock';

export const Categories = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndFilter = async () => {
      setLoading(true);
      try {
        // 1. Obtener todas las categorías del Record y buscar la que coincida con el nombre de la URL
        const categoryData = Object.values(MOCK_CATEGORIES_DB).find(
          (cat) => cat.name.toLowerCase() === categoryName?.toLowerCase()
        );

        const allProducts = await getProducts();

        if (categoryData) {
          // 2. Filtrar productos usando el ID de la categoría encontrada
          const filtered = allProducts.filter(
            (p) => p.category === categoryData.id // Filtro por ID (cat-1, cat-2, etc)
          );
          setProducts(filtered);
        } else {
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilter();
  }, [categoryName]);

  return (
    <main className="min-h-screen bg-white">
      {/* Header de Categoría */}
      <header className="bg-slate-950 pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors mb-6 text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Volver al Inicio
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs">Explorar Colección</span>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mt-2 capitalize">
                {categoryName}
              </h1>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-sm font-medium border-l border-white/10 pl-6">
              <div className="flex flex-col">
                <span className="text-white text-xl font-black">{products.length}</span>
                <span>Productos Encontrados</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <section className="container mx-auto px-4 py-12">
        {/* Barra de utilidades */}
{/*         <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
                <LayoutGrid size={14} /> Cuadrícula
             </button>
             <button className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-xs font-bold uppercase tracking-wider transition-all">
                <Filter size={14} /> Filtros
             </button>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase">Orden: Destacados</p>
        </div>
 */}
        {/* Grid de Productos */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
              : products.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`} className="group">
                    <ProductCard product={product} />
                  </Link>
                ))
            }
          </div>
        ) : (
          !loading && (
            <div className="py-20 text-center">
              <div className="bg-slate-50 inline-flex p-6 rounded-full mb-6">
                <Filter size={40} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">No hay productos</h3>
              <p className="text-slate-500 mt-2">No encontramos artículos en la categoría {categoryName}.</p>
              <Link to="/" className="mt-8 inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-slate-900 transition-all">
                Ver todos los productos
              </Link>
            </div>
          )
        )}
      </section>
    </main>
  );
};
