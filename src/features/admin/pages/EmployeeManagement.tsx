import { useEffect, useState } from "react";
import { Plus, UserRoundCog } from "lucide-react";
import { EmployeeTable } from "../components/EmployeeTable";
import { EmployeeForm } from "../components/EmployeeForm";
import { Modal } from "../../../shared/modals/Modal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";

// Importamos las funciones de tu servicio de staff
import { 
  listEmployees, 
  createEmployee, 
  updateStaffUser, 
  deleteStaffUser 
} from "../../../api/staff.service"; 

export const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // 1. Carga inicial de datos desde el servicio
  const fetchEmployees = async () => {
    const data = await listEmployees();
    setEmployees(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 2. Manejo de Guardar y Editar
  const handleSave = async (payload: any) => {
    try {
      if (selectedEmployee?.id) {
        // Modo Edición
        const res = await updateStaffUser(selectedEmployee.id, payload);
        if (!res.success) return alert(res.message);
        
        setEmployees(prev => prev.map(e => e.id === selectedEmployee.id ? res.data! : e));
      } else {
        // Modo Creación
        const res = await createEmployee(payload);
        if (!res.success) return alert(res.message);
        
        setEmployees(prev => [res.data!, ...prev]);
      }
      setIsFormOpen(false);
    } catch (error) {
      alert("Error al procesar la operación");
    }
  };

  // 3. Manejo de Eliminación
  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;
    
    try {
      const res = await deleteStaffUser(selectedEmployee.id);
      if (!res.success) return alert(res.message);

      setEmployees(prev => prev.filter(e => e.id !== selectedEmployee.id));
      setIsDeleteOpen(false);
    } catch (error) {
      alert("Error al eliminar el empleado");
    }
  };

  const openForm = (emp = null) => {
    setSelectedEmployee(emp);
    setIsFormOpen(true);
  };

  const openDelete = (emp: any) => {
    setSelectedEmployee(emp);
    setIsDeleteOpen(true);
  };

  return (
    <div className="p-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {/* Color Naranja/Ambar para diferenciar Personal de otros módulos */}
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-orange-600/20">
            <UserRoundCog size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Empleados</h1>
            <p className="text-slate-500 font-medium">Control de personal y roles del equipo.</p>
          </div>
        </div>

        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 px-6 py-3 !bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md"
        >
          <Plus size={20} /> Nuevo Empleado
        </button>
      </div>

      <EmployeeTable
        data={employees}
        onEdit={openForm}
        onDelete={openDelete}
      />

      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={selectedEmployee ? "Editar Empleado" : "Registrar Nuevo Empleado"}
      >
        <EmployeeForm 
          initialData={selectedEmployee} 
          onSave={handleSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </Modal>

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        item={selectedEmployee?.name}
        textConfirm="empleado"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
