import React, { useMemo, useState, useEffect } from "react";
import { FormField } from "./FormField";
import { SpecsEditor } from "./SpecsEditor";
import { getCategories } from "../../../api/category.service";


export const ProductForm = ({ initialData, onSave, onCancel }: any) => {
  const isEdit = !!initialData?.id;
  
  // Estado para las categorías del dropdown
  const [categories, setCategories] = useState([]);

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const normalizedInitial = useMemo(() => {
    const images = initialData?.images?.length
      ? initialData.images
      : initialData?.image
        ? [initialData.image]
        : [];
    return {
      ...initialData,
      images,
      active: initialData?.active ?? true,
      min_stock: initialData?.min_stock ?? 0,
      barcode: initialData?.barcode ?? "",
      category: initialData?.category ?? "", // Aquí guardaremos el ID (cat-1, etc)
    };
  }, [initialData]);

  const [formData, setFormData] = useState(normalizedInitial);
  const [specs, setSpecs] = useState(
    formData.specs
      ? Object.entries(formData.specs).map(([key, value]) => ({
        key,
        value: String(value),
      }))
      : [{ key: "", value: "" }]
  );

  const canSubmit =
    !!String(formData.name ?? "").trim() &&
    !!formData.category && // Validamos que tenga categoría seleccionada
    Number(formData.price ?? 0) >= 0 &&
    Number(formData.stock ?? 0) >= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const specsObject = specs.reduce((acc: any, curr) => {
      if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
      return acc;
    }, {});

    const payload = {
      ...formData,
      images: formData.images,
      specs: specsObject,
    };

    onSave(payload);
  };

  const previewImg =
    formData.images?.[0] ||
    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=600";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">

        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <img
              src={previewImg}
              className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-sm"
              alt="preview"
            />
            <div className="flex-1">
              <FormField
                label="URL de Imagen"
                value={formData.images?.[0] ?? ""}
                onChange={(v) => setFormData({ ...formData, images: [v] })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Nombre del Producto"
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
              required
            />
            
            {/* --- REEMPLAZO DE CATEGORÍA POR DROPDOWN --- */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Categoría</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 h-[50px]"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Seleccionar categoría...</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {/* ------------------------------------------- */}

            <FormField
              label="Precio"
              type="number"
              value={formData.price}
              onChange={(v) => setFormData({ ...formData, price: Number(v) })}
              required
            />
            <FormField
              label="Stock Actual"
              type="number"
              value={formData.stock}
              onChange={(v) => setFormData({ ...formData, stock: Number(v) })}
              required
            />
            <FormField
              label="Stock Mínimo"
              type="number"
              value={formData.min_stock}
              onChange={(v) => setFormData({ ...formData, min_stock: Number(v) })}
            />
            <FormField
              label="Código de Barras"
              value={formData.barcode}
              onChange={(v) => setFormData({ ...formData, barcode: v })}
            />
          </div>

          <label className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-sm font-bold text-blue-700 cursor-pointer">
            <input
              type="checkbox"
              checked={!!formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-5 h-5 accent-blue-600"
            />
            Producto disponible para la venta
          </label>
        </div>

        <div className="flex-1 space-y-6 border-l border-slate-100 md:pl-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">
              Descripción detallada
            </label>
            <textarea
              placeholder="Escribe aquí las características principales..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none h-32 resize-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={formData.longDescription ?? ""}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
            />
          </div>

          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4 px-1">Especificaciones Técnicas</h3>
            <SpecsEditor specs={specs} onChange={setSpecs} />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-8 mt-8 border-t border-slate-100">
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-1/2 py-4 !bg-slate-900 text-white rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEdit ? "Guardar cambios" : "Registrar producto"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-1/2 px-4 py-3 !bg-slate-100 !text-slate-700 font-bold rounded-xl border border-slate-200 hover:!bg-slate-200 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
