import React, { useState } from "react";
import { Briefcase, Plus } from "lucide-react";
import { EmployeeTable } from "../components/EmployeeTable";
import { EmployeeForm } from "../components/EmployeeForm";
import { Modal } from "../../../shared/modals/Modal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";

export const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([
    { id: "1", name: "Carlos Admin", role: "Administrador", startDate: "2023-01-15" },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const handleSave = (data: any) => {
    if (selectedEmployee) {
      setEmployees(prev => prev.map(e => e.id === selectedEmployee.id ? { ...data, id: e.id } : e));
    } else {
      setEmployees(prev => [{ ...data, id: Date.now().toString() }, ...prev]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter">RRHH</h1>
        <button 
          onClick={() => { setSelectedEmployee(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black"
        >
          <Plus size={20} /> Nuevo Empleado
        </button>
      </div>

      <EmployeeTable 
        data={employees} 
        onEdit={(e) => { setSelectedEmployee(e); setIsFormOpen(true); }} 
        onDelete={(e) => { setSelectedEmployee(e); setIsDeleteOpen(true); }} 
      />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Datos del Empleado">
        <EmployeeForm initialData={selectedEmployee} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      <DeleteConfirmModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        productName={selectedEmployee?.name} 
        onConfirm={() => {
          setEmployees(prev => prev.filter(e => e.id !== selectedEmployee.id));
          setIsDeleteOpen(false);
        }} 
      />
    </div>
  );
};