import React, { useState } from "react";
import { Save } from "lucide-react";
import { FormField } from "./FormField";
import { SpecsEditor } from "./SpecsEditor";

export const ProductForm = ({ initialData, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState(initialData);
  const [specs, setSpecs] = useState(
    initialData.specs ? Object.entries(initialData.specs).map(([key, value]) => ({ key, value: String(value) })) : [{ key: "", value: "" }]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specsObject = specs.reduce((acc: any, curr) => {
      if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
      return acc;
    }, {});
    onSave({ ...formData, specs: specsObject });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-start gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <img src={formData.image || "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=600"} className="w-28 h-28 rounded-2xl object-cover border border-slate-200 shadow-sm" alt="preview" />
        <FormField label="Imagen (URL)" value={formData.image} onChange={(v) => setFormData({ ...formData, image: v })} className="flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Nombre" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
        <FormField label="Categoría" value={formData.category} onChange={(v) => setFormData({ ...formData, category: v })} />
        <FormField label="Precio" type="number" value={formData.price} onChange={(v) => setFormData({ ...formData, price: Number(v) })} required />
        <FormField label="Stock" type="number" value={formData.stock} onChange={(v) => setFormData({ ...formData, stock: Number(v) })} required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-600 ml-1">Descripción larga</label>
        <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none h-28 resize-none focus:ring-2 focus:ring-blue-500/20" value={formData.longDescription} onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })} />
      </div>

      <SpecsEditor specs={specs} onChange={setSpecs} />

      <div className="flex gap-4 pt-6">
        <button type="submit" className="flex-[2] flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg">
          <Save size={18} /> Guardar Producto
        </button>
        <button type="button" onClick={onCancel} className="flex-1 py-4 bg-white border border-amber-200 text-amber-700 rounded-2xl font-bold hover:bg-amber-50 transition-all">
          Cancelar
        </button>
      </div>
    </form>
  );
};