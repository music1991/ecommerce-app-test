import React, { useState } from "react";
import { FormField } from "./FormField";

export const CategoryForm = ({ initialData, onSave, onCancel }: any) => {
  const isEdit = !!initialData?.id;
  const [formData, setFormData] = useState(initialData || {
    name: "",
    description: "",
    status: "active"
  });

  const canSubmit = !!formData.name.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <FormField
          label="Nombre de la Categoría"
          placeholder="Ej: Laptops, Smartphones..."
          value={formData.name}
          onChange={(v) => setFormData({ ...formData, name: v })}
          required
        />

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600 ml-1">Descripción</label>
          <textarea
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none h-24 resize-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Breve descripción de los productos en esta categoría..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-sm font-bold text-slate-600 flex-1">Estado de la categoría</span>
          <select 
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-sm font-bold outline-none"
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
       {/*  <button
          type="submit"
          disabled={!canSubmit}
          className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold disabled:opacity-50"
        >
          {isEdit ? "Actualizar Categoría" : "Crear Categoría"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold border border-slate-200"
        >
          Cancelar
        </button> */}
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
