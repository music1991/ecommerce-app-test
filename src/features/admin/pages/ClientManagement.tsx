import { useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
import { ClientTable } from "../components/ClientTable";
import { CustomerForm } from "../components/CustomerForm";
import { Modal } from "../../../shared/modals/Modal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
//import { deleteCustomer, getCustomerById, listCustomers, updateCustomer } from "../../../api/customer.service";
//import { useAuthStore } from "../../auth/store/authStore";

export const ClientManagement = () => {
  const [clients, setClients] = useState([
    { id: "1", name: "Juan Pérez", email: "juan@example.com", phone: "11 2233-4455", status: "active" },
  ]);
  /*
    const { user } = useAuthStore(); // Necesitamos el tenant_id del usuario logueado
  
    const fetchClients = async () => {
      //setLoading(true);
      try {
        // 1. Cortejo con el Back: Enviamos el tenant_id que pide la doc
        const res = await listCustomers({ 
          tenant_id: user?.tenant_id,
          per_page: 20 
        });
  
        if (res.success) {
          // 2. IMPORTANTE: El back devuelve la lista en res.data.data (paginación)
          setClients(res.data.data); 
        }
      } catch (error) {
        console.error("Error cargando clientes", error);
      } finally {
      //  setLoading(false);
      }
    };
  
    useEffect(() => {
      if (user?.tenant_id) fetchClients();
    }, [user?.tenant_id]);
  */
 
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
/*
  const handleViewDetails = async (id: number) => {
  try {
    const res = await getCustomerById(id);
    if (res.success) {
      // El backend devuelve: { id, name, email, phone, address, ventas: [], deudas: [] }
      console.log("Datos del cliente:", res.data);
      // Aquí abrirías tu modal: setSelectedClient(res.data);
    }
  } catch (error) {
    alert("Error al obtener los detalles del cliente.");
  }
};

const handleUpdateClient = async (id: number, formData: any) => {
  try {
    // Adaptamos los nombres del Front al Back
    const updateData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      estado: formData.status // ✅ Mapeo de status -> estado
    };

    const res = await updateCustomer(id, updateData);
    
    if (res.success) {
      alert("Cliente actualizado con éxito");
      fetchClients(); // 🔄 Recargamos la lista para ver los cambios
    }
  } catch (error) {
    alert("No se pudo actualizar el cliente.");
  }
};

const handleDeleteClient = async (id: number) => {
  if (!window.confirm("¿Estás seguro de que deseas desactivar a este cliente?")) return;

  try {
    const res = await deleteCustomer(id);
    
    if (res.success) {
      alert("Cliente desactivado (estado: inactivo)");
      
      // Opción A: Recargar de la API
      fetchClients(); 
      
      // Opción B: Actualizar el estado local para no hacer otra petición
      setClients(prev => prev.map(c => 
        c.id === id ? { ...c, estado: 'inactivo' } : c
      ));
    }
  } catch (error) {
    alert("Error al intentar eliminar el cliente.");
  }
};
*/

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Clientes</h1>
            <p className="text-slate-500 font-medium">Gestiona el directorio de compradores y su historial.</p>
          </div>
        </div>
        <button
          onClick={() => { setSelectedClient(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 !bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
        >
          <Plus size={20} /> Nuevo Cliente
        </button>
      </div>

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
        item={selectedClient?.name}
        onConfirm={() => {
          setClients(prev => prev.filter(c => c.id !== selectedClient.id));
          setIsDeleteOpen(false);
        }}
        textConfirm="cliente"
      />
    </div>
  );
};