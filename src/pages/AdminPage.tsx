import React, { useState } from 'react';
import { MOCK_PRODUCTS as INITIAL_PRODUCTS } from '../api/products.mock';
import type { Product } from "../core/entities/Product"; 
import { Plus, Trash2, Edit3, LayoutDashboard, X, Save } from 'lucide-react';

interface AdminProduct extends Product {
  longDescription?: string;
  specs?: Record<string, string>;
}

export const AdminPage = () => {
  // 1. Cargamos el mock en un estado para que sea mutable
  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_PRODUCTS as AdminProduct[]);
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    price: 0,
    category: 'Laptops',
    image: '',
    stock: 0
  });

  const [specs, setSpecs] = useState([{ key: '', value: '' }]);

  const handleEdit = (product: AdminProduct) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      longDescription: product.longDescription || '',
      price: product.price,
      category: product.category,
      image: product.images[0] || '',
      stock: product.stock
    });
    
    const specsArray = product.specs 
      ? Object.entries(product.specs).map(([key, value]) => ({ key, value: String(value) }))
      : [{ key: '', value: '' }];
    setSpecs(specsArray);
    setActiveTab('form');
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', longDescription: '', price: 0, category: 'Laptops', image: '', stock: 0 });
    setSpecs([{ key: '', value: '' }]);
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  // 2. LOGICA DE GUARDADO REAL
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convertimos el array de specs nuevamente a un objeto Record<string, string>
    const specsObject = specs.reduce((acc, curr) => {
      if (curr.key) acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    if (editingId) {
      // MODO EDICIÓN: Actualizamos el producto existente en el estado
      setProducts(prev => prev.map(p => 
        p.id === editingId 
          ? { 
              ...p, 
              ...formData, 
              images: [formData.image], 
              specs: specsObject,
              longDescription: formData.longDescription 
            } 
          : p
      ));
    } else {
      // MODO CREACIÓN: Añadimos uno nuevo
      const newProduct: AdminProduct = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        images: [formData.image],
        specs: specsObject,
        longDescription: formData.longDescription
      };
      setProducts(prev => [newProduct, ...prev]);
    }

    resetForm();
    setActiveTab('list');
  };

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-600/20">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Tech Dashboard</h1>
              <p className="text-slate-500 font-medium text-sm">Gestiona tu catálogo de productos</p>
            </div>
          </div>

          {/* SELECTOR DE PESTAÑAS - CORREGIDO */}
          <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <button 
              onClick={() => setActiveTab('list')}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                activeTab === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Inventario
            </button>
            <button 
              onClick={() => { if(activeTab !== 'form') resetForm(); setActiveTab('form'); }}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                activeTab === 'form' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              {editingId ? 'Editando Producto' : 'Cargar Nuevo'}
            </button>
          </div>
        </div>

        {activeTab === 'list' ? (
          /* TABLA DE INVENTARIO */
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Producto</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={product.images[0]} className="w-12 h-12 rounded-xl object-cover border border-slate-100" alt="" />
                        <div>
                           <p className="font-bold text-slate-900 text-sm">{product.name}</p>
                           <p className="text-blue-600 font-bold text-xs">${product.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <button onClick={() => handleEdit(product)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                        <Edit3 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* FORMULARIO UNIFICADO */
          <form onSubmit={handleSubmit} className="animate-in zoom-in-95 duration-300 max-w-3xl mx-auto space-y-8">
            
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px]">1</span>
                Información Básica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-2">Nombre</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-2">Precio ($)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none" />
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-2">Descripción</label>
                <textarea value={formData.longDescription} onChange={e => setFormData({...formData, longDescription: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none h-32 resize-none" />
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px]">2</span>
                  Especificaciones Técnicas
                </h2>
                <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="bg-blue-50 text-blue-600 p-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Plus size={20}/></button>
              </div>
              <div className="space-y-4">
                {specs.map((spec, i) => (
                  <div key={i} className="flex gap-4">
                    <input type="text" placeholder="Propiedad" value={spec.key} onChange={e => handleSpecChange(i, 'key', e.target.value)} className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none text-sm" />
                    <input type="text" placeholder="Valor" value={spec.value} onChange={e => handleSpecChange(i, 'value', e.target.value)} className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none text-sm" />
                    {specs.length > 1 && (
                      <button type="button" onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))} className="p-4 text-slate-300 hover:text-red-500"><Trash2 size={20} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-4">
              <button 
                type="submit" 
                style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '24px', borderRadius: '32px', fontWeight: '900', fontSize: '18px', width: '100%', border: 'none', cursor: 'pointer', boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.3)' }}
                className="hover:opacity-90 active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <Save size={22} /> {editingId ? 'Confirmar Edición' : 'Guardar Producto Nuevo'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { resetForm(); setActiveTab('list'); }} className="text-slate-400 font-bold text-sm flex items-center justify-center gap-2">
                   <X size={16} /> Cancelar edición
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};