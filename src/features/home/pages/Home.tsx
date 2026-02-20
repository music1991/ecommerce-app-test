import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { ProductCard } from '../../products/components/ProductCard';

import { getProducts } from '../../products/services/products.mock';

import { useLanguage } from '../../../shared/context/LanguageContext';
import type { Product } from '../../../core/entities/Product';
import { ProductSkeleton } from '../../products/components/ProductSkeleton';

export const Home = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } finally {
        setLoading(false);
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
            ?
              Array.from({ length: 4 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            : 
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