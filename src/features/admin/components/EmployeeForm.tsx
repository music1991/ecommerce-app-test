import React, { useState } from "react";
import { FormField } from "./FormField";

export const EmployeeForm = ({ initialData, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState(initialData || {
    name: "",
    role: "Vendedor",
    startDate: new Date().toISOString().split('T')[0]
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
      <FormField label="Nombre Completo" value={formData.name} onChange={v => setFormData({...formData, name: v})} required />
      <div className="grid grid-cols-2 gap-6">
        <FormField label="Puesto" value={formData.role} onChange={v => setFormData({...formData, role: v})} />
        <FormField label="Fecha Ingreso" type="date" value={formData.startDate} onChange={v => setFormData({...formData, startDate: v})} />
      </div>
      <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">Registrar Empleado</button>
    </form>
  );
};