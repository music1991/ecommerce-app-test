import React, { useMemo, useState } from "react";
import { Plus, Package } from "lucide-react";

import { Modal } from "../../../shared/modals/Modal";
import { ProductTable } from "../components/ProductTable";
import { ProductForm } from "../components/ProductForm";
import { MOCK_PRODUCTS } from "../../products/services/products.mock";

export const ProductsManagement = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleSave = (updatedProduct: any) => {
    if (selectedProduct) {
      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...updatedProduct, id: p.id } : p));
    } else {
      setProducts(prev => [{ ...updatedProduct, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
    }
    setIsFormOpen(false);
  };

  const openForm = (product = null) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  return (
    <div className="p-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-600/20">
            <Package size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Productos</h1>
            <p className="text-slate-500 font-medium">Gestión de inventario y catálogo.</p>
          </div>
        </div>
        <button onClick={() => openForm()} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all">
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      {/* Tabla (Componentizada) */}
      <ProductTable 
        data={products} 
        onEdit={openForm} 
        onDelete={(id) => setProducts(prev => prev.filter(p => p.id !== id))} 
      />

      {/* Modal Formulario */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedProduct ? "Editar Producto" : "Nuevo Producto"}>
        <ProductForm 
          initialData={selectedProduct || { name: "", price: 0, stock: 0, image: "", category: "Laptops" }} 
          onSave={handleSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </Modal>
    </div>
  );
};