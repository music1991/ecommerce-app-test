import React from 'react';
import { ShoppingCart, Check } from "lucide-react";
import type { Product } from '../../../core/entities/Product';
import { useCartStore } from '../../cart/store/useCartStore';

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const [added, setAdded] = React.useState(false);

  const handleAdd = () => {
    useCartStore.getState().addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group flex flex-col rounded-[2rem] bg-white p-4 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-slate-50">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm">
            Tech
          </span>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="font-bold text-slate-900 line-clamp-1 text-lg leading-tight">{product.name}</h3>
        <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 h-8 leading-relaxed">{product.description}</p>
        
        <div className="mt-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Precio</span>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">
              ${product.price.toLocaleString()}
            </span>
          </div>

          <button 
            onClick={handleAdd}
            className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
              added 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 active:scale-90'
            }`}
          >
            {added ? <Check size={20} /> : <ShoppingCart size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};