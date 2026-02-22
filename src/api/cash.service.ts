import axios from "axios";

// Instancia real (preparada para el futuro)
export const http = axios.create({
  baseURL: "https://api.techstore.com",
  headers: { "Content-Type": "application/json" },
});

// ========================================
// MOCK DATABASE (ESTADO LOCAL)
// ========================================
let activeRegister: any = null; // Representa la caja abierta del usuario
let movements: any[] = [];
let lastId = 500;

const sleep = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// ========================================
// PETICIONES MOCKEADAS
// ========================================

export const getActiveCashRegister = async () => {
  await sleep();
  // El back devuelve { success: true, data: CashRegister | null }
  return { 
    success: true, 
    data: activeRegister 
  };
};

export const openCashRegister = async (payload: { initial_amount: number; notes?: string }) => {
  await sleep();
  
  if (activeRegister) {
    return { success: false, message: "Ya tienes una caja abierta." };
  }

  activeRegister = {
    id: ++lastId,
    status: "open",
    initial_amount: payload.initial_amount,
    current_amount: payload.initial_amount,
    opened_at: new Date().toISOString(),
    notes: payload.notes || "Apertura de turno",
  };

  return { success: true, data: activeRegister, message: "Caja abierta con éxito" };
};

export const closeCashRegister = async (payload: { notes?: string }) => {
  await sleep();

  if (!activeRegister) {
    return { success: false, message: "No hay ninguna caja abierta para cerrar." };
  }

  const closedData = { 
    ...activeRegister, 
    status: "closed", 
    closed_at: new Date().toISOString(),
    notes_closure: payload.notes 
  };
  
  activeRegister = null; // Limpiamos el estado global
  movements = []; // Opcional: limpiar movimientos del turno

  return { success: true, data: closedData, message: "Caja cerrada correctamente" };
};

export const addCashMovement = async (id: number, payload: { type: 'in'|'out'; amount: number; description: string }) => {
  await sleep();

  if (!activeRegister || activeRegister.id !== id) {
    return { success: false, message: "Caja no encontrada o cerrada." };
  }

  const newMovement = {
    id: Math.random() * 1000,
    ...payload,
    created_at: new Date().toISOString()
  };

  movements.push(newMovement);

  // Actualizamos el saldo de la caja mockeada
  if (payload.type === 'in') activeRegister.current_amount += payload.amount;
  if (payload.type === 'out') activeRegister.current_amount -= payload.amount;

  return { success: true, data: newMovement, message: "Movimiento registrado" };
};

//falta EP para ver movimientos de la caja
/*

export const getActiveCashRegister = async () => {
  const res = await http.get("/api/cash-registers/active");
  return res.data;
};

export const openCashRegister = async (payload: { initial_amount: number; notes?: string }) => {
  const res = await http.post("/api/cash-registers/open", payload);
  return res.data;
};

export const closeCashRegister = async (payload: { notes?: string }) => {
  const res = await http.post("/api/cash-registers/close", payload);
  return res.data;
};

export const addCashMovement = async (id: number, payload: { type: 'in'|'out'; amount: number; description: string }) => {
  const res = await http.post(`/api/cash-registers/${id}/movements`, payload);
  return res.data;
};
*/