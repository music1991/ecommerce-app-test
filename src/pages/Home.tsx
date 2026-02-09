import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/sections/Hero';
import { Features } from '../components/sections/Features';
import { ProductCard } from '../components/products/ProductCard';

import { getProducts } from '../api/products.mock';

import { useLanguage } from '../context/LanguageContext';
import type { Product } from '../core/entities/Product';
import { ProductSkeleton } from '../components/skeletons/ProductSkeleton';

export const Home = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Estado inicial de carga

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } finally {
        setLoading(false); // Se apaga tras los 800ms del mock
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Hero />
      <Features />
      
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-black mb-10 text-slate-900">
          {t('featured')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? // Renderiza 4 o 8 esqueletos mientras carga
              Array.from({ length: 4 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            : // Renderiza los productos reales
              products.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <ProductCard product={product} />
                </Link>
              ))
          }
        </div>
      </section>
    </>
  );
};