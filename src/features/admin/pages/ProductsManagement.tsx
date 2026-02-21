import { useEffect, useState } from "react";
import { Plus, Package } from "lucide-react";
import { Modal } from "../../../shared/modals/Modal";
import { ProductTable } from "../components/ProductTable";
import { ProductForm } from "../components/ProductForm";

import { listProducts, createProduct, updateProduct, deactivateProduct } from "../../../api/product.service";
import { DesactiveConfirmModal } from "../components/DesactiveConfirmModal";
import { ActivateConfirmModal } from "../components/ActiveConfirmModal";

export const ProductsManagement = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false); // 2. Estado para el modal de activación

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

  // 3. Lógica para decidir qué modal abrir (Activar o Desactivar)
  const handleToggleStatus = (product: any) => {
    setSelectedProduct(product);
    if (product.active) {
      setIsDeleteOpen(true);
    } else {
      setIsActivateOpen(true);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!selectedProduct) return;
    const res = await deactivateProduct(selectedProduct.id);
    if (!res.success) return alert(res.message);

    setProducts((prev) =>
      prev.map((p) => (p.id === selectedProduct.id ? { ...p, active: false } : p))
    );
    setIsDeleteOpen(false);
  };

  // 4. Nueva función para confirmar la reactivación
  const handleConfirmActivate = async () => {
    if (!selectedProduct) return;
    
    // Usamos updateProduct para volver a poner active en true
    const res = await updateProduct(selectedProduct.id, { active: true });
    if (!res.success || !res.data) return alert(res.message);

    setProducts((prev) =>
      prev.map((p) => (p.id === selectedProduct.id ? res.data! : p))
    );
    setIsActivateOpen(false);
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
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-black transition-all"
        >
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      <ProductTable
        data={products}
        onEdit={openForm}
        onDelete={handleToggleStatus} // Pasamos la nueva lógica de toggle
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
              category: "",
              images: [],
              specs: {},
            }
          }
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Modal de Desactivación */}
      <DesactiveConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        item={selectedProduct?.name}
        textConfirm="producto"
        onConfirm={handleConfirmDeactivate}
      />

      {/* 5. Añadimos el Modal de Activación al final */}
      <ActivateConfirmModal
        isOpen={isActivateOpen}
        onClose={() => setIsActivateOpen(false)}
        item={selectedProduct?.name}
        textConfirm="producto"
        onConfirm={handleConfirmActivate}
      />
    </div>
  );
};
