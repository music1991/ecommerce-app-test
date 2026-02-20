import React, { useEffect, useState } from "react";
import { Plus, Package } from "lucide-react";
import { Modal } from "../../../shared/modals/Modal";
import { ProductTable } from "../components/ProductTable";
import { ProductForm } from "../components/ProductForm";

import { listProducts, createProduct, updateProduct, deactivateProduct } from "../../../api/productApi";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { DesactiveConfirmModal } from "../components/DesactiveConfirmModal";

export const ProductsManagement = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await listProducts({ status: "all" });
      if (res.success && res.data) setProducts(res.data);
    })();
  }, []);

  const handleSave = async (payload: any) => {
    if (selectedProduct?.id) {
      const res = await updateProduct(selectedProduct.id, payload);
      if (!res.success || !res.data) return alert(res.message);
      setProducts((prev) => prev.map((p) => (p.id === res.data!.id ? res.data : p)));
    } else {
      const res = await createProduct(payload);
      if (!res.success || !res.data) return alert(res.message);
      setProducts((prev) => [res.data!, ...prev]);
    }
    setIsFormOpen(false);
  };

  const openForm = (product = null) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };


  const openDeleteConfirm = (product: any) => {
    if (product.active) {
      setSelectedProduct(product);
      setIsDeleteOpen(true);
    }
    
    return;
  };

  // 2. Crea la función que ejecuta la desactivación real
  const handleConfirmDeactivate = async () => {
    if (!selectedProduct) return;

    const res = await deactivateProduct(selectedProduct.id);
    if (!res.success) return alert(res.message);

    setProducts((prev) =>
      prev.map((p) => (p.id === selectedProduct.id ? { ...p, active: false } : p))
    );
    setIsDeleteOpen(false);
  };

  return (
    <div className="p-6 animate-in fade-in duration-500">
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

        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 px-6 py-3 !bg-blue-600 text-white rounded-xl font-bold hover:bg-black"
        >
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      <ProductTable
        data={products}
        onEdit={openForm}
        onDelete={openDeleteConfirm}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedProduct ? "Editar Producto" : "Nuevo Producto"}
      >
        <ProductForm
          initialData={
            selectedProduct || {
              name: "",
              description: "",
              price: 0,
              stock: 0,
              min_stock: 0,
              barcode: "",
              active: true,
              category: "Laptops",
              images: [],
              specs: {},
            }
          }
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
      <DesactiveConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        item={selectedProduct?.name}
        textConfirm="producto"
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  );
};