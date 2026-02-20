import React, { useState } from "react";
import { FormField } from "./FormField";
import { Save } from "lucide-react";

export const CustomerForm = ({ initialData, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState(initialData || {
    name: "",
    email: "",
    phone: "",
    status: "active"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Nombre" value={formData.name} onChange={v => setFormData({...formData, name: v})} required />
        <FormField label="Email" type="email" value={formData.email} onChange={v => setFormData({...formData, email: v})} required />
        <FormField label="Teléfono" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600 ml-1">Estado</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none"
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value})}
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </div>
      <div className="flex gap-4">
        <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold">Guardar Cliente</button>
        <button type="button" onClick={onCancel} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Cancelar</button>
      </div>
    </form>
  );
};