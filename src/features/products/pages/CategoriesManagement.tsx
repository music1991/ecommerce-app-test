import { useEffect, useState } from "react";
import { FolderTree, ListFilterPlus, Plus } from "lucide-react";
import { Modal } from "../../../shared/modals/Modal";

import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../../../api/category.service";
import { CategoryTable } from "../../admin/components/CategoryTable";
import { CategoryForm } from "../../admin/components/CategoryForm";

export const CategoriesManagement = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  // Carga inicial de datos desde el mock
  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Manejador para Guardar (Crear o Editar)
  const handleSave = async (payload: any) => {
    try {
      if (selectedCategory?.id) {
        await updateCategory(selectedCategory.id, payload);
      } else {
        await createCategory(payload);
      }
      await fetchCategories(); // Recargar lista
      setIsFormOpen(false);
    } catch (error) {
      alert("Error al procesar la categoría");
    }
  };

  // Manejador para Eliminar
  const handleDelete = async (cat: any) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${cat.name}"?`)) {
      await deleteCategory(cat.id);
      await fetchCategories();
    }
  };

  const openForm = (cat = null) => {
    setSelectedCategory(cat);
    setIsFormOpen(true);
  };

  return (
    <div className="p-6 animate-in fade-in duration-500">
      {/* HEADER DE LA SECCIÓN */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-600/20">
            <ListFilterPlus size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Categorías</h1>
            <p className="text-slate-500 font-medium">Gestiona los grupos de productos de tu catálogo.</p>
          </div>
        </div>

        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 px-6 py-3 !bg-blue-600 text-white rounded-xl font-bold hover:bg-slate-900 transition-all shadow-md"
        >
          <Plus size={20} /> Nueva Categoría
        </button>
      </div>

      {/* TABLA DE CATEGORÍAS */}
      <CategoryTable 
        data={categories} 
        onEdit={openForm} 
        onDelete={handleDelete} 
      />

      {/* MODAL PARA FORMULARIO */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedCategory ? "Editar Categoría" : "Nueva Categoría"}
      >
        <CategoryForm
          initialData={
            selectedCategory || {
              name: "",
              description: "",
              status: "active",
            }
          }
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
};
