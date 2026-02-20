import React, { useState } from "react";
import { Users, Plus } from "lucide-react";
import { ClientTable } from "../components/ClientTable";
import { CustomerForm } from "../components/CustomerForm";
import { Modal } from "../../../shared/modals/Modal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";

export const ClientManagement = () => {
  const [clients, setClients] = useState([
    { id: "1", name: "Juan Pérez", email: "juan@example.com", phone: "11 2233-4455", status: "active" },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const handleSave = (data: any) => {
    if (selectedClient) {
      setClients(prev => prev.map(c => c.id === selectedClient.id ? { ...data, id: c.id } : c));
    } else {
      setClients(prev => [{ ...data, id: Date.now().toString() }, ...prev]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Clientes</h1>
          <p className="text-slate-500">Administra tu base de contactos.</p>
        </div>
        <button 
          onClick={() => { setSelectedClient(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
        >
          <Plus size={20} /> Nuevo Cliente
        </button>
      </div>

      {/* Solo pasamos data y funciones de acción */}
      <ClientTable 
        data={clients} 
        onEdit={(c) => { setSelectedClient(c); setIsFormOpen(true); }} 
        onDelete={(c) => { setSelectedClient(c); setIsDeleteOpen(true); }} 
      />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedClient ? "Editar Cliente" : "Nuevo Cliente"}>
        <CustomerForm initialData={selectedClient} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      <DeleteConfirmModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        productName={selectedClient?.name} 
        onConfirm={() => {
          setClients(prev => prev.filter(c => c.id !== selectedClient.id));
          setIsDeleteOpen(false);
        }} 
      />
    </div>
  );
};