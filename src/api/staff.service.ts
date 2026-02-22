import { MOCK_STAFF_DB, type StaffUser } from "../shared/mocks/staff.mock";
import type { CreateEmployeePayload, StaffResponse, UpdateStaffPayload } from "./types/staff.types";

const sleep = (ms = 250) => new Promise((r) => setTimeout(r, ms));
const normalizeEmail = (email: string) => email.toLowerCase().trim();

 export async function listEmployees(): Promise<StaffUser[]> {
  await sleep();
  return Object.values(MOCK_STAFF_DB).filter((u) => u.role === "employee");
}
 
export async function createEmployee(
  payload: CreateEmployeePayload
): Promise<StaffResponse<StaffUser>> {
  await sleep();

  const emailKey = normalizeEmail(payload.email);

  if (!payload.name?.trim()) return { success: false, message: "Nombre requerido" };
  if (!payload.email?.trim()) return { success: false, message: "Email requerido" };
  if (!payload.password?.trim()) return { success: false, message: "Password requerido" };

  if (MOCK_STAFF_DB[emailKey]) return { success: false, message: "Ese email ya está registrado." };

  const newUser: StaffUser = {
    id: crypto.randomUUID(),
    name: payload.name.trim(),
    email: emailKey,
    password: payload.password,
    role: "employee",
    status: payload.status ?? "active",

    phone: payload.phone?.trim() || undefined,
    address: payload.address?.trim() || undefined,
    dni: payload.dni?.trim() || undefined,

    position: payload.position, //no esta en el back
    startDate: payload.startDate, //no esta en el back
  };

  MOCK_STAFF_DB[emailKey] = newUser;

  return { success: true, message: "Empleado creado con éxito.", data: newUser };
}

export async function updateStaffUser(
  id: string,
  patch: UpdateStaffPayload
): Promise<StaffResponse<StaffUser>> {
  await sleep();

  const entry = Object.entries(MOCK_STAFF_DB).find(([, u]) => u.id === id);
  if (!entry) return { success: false, message: "Usuario no encontrado." };

  const [oldEmailKey, current] = entry;
  const nextEmail = patch.email ? normalizeEmail(patch.email) : current.email;
  const nextEmailKey = nextEmail;

  if (nextEmailKey !== oldEmailKey && MOCK_STAFF_DB[nextEmailKey]) {
    return { success: false, message: "Ese email ya está en uso." };
  }

  const updated: StaffUser = {
    ...current,
    name: patch.name ?? current.name,
    email: nextEmail,
    status: patch.status ?? current.status,

    // campos extra
    phone: patch.phone ?? current.phone,
    address: patch.address ?? current.address,
    dni: patch.dni ?? current.dni,

    position: patch.position ?? current.position,
    startDate: patch.startDate ?? current.startDate,

    // password opcional
    password: patch.password ? patch.password : current.password,
  };

  // re-key si cambió email
  if (nextEmailKey !== oldEmailKey) {
    delete MOCK_STAFF_DB[oldEmailKey];
    MOCK_STAFF_DB[nextEmailKey] = updated;
  } else {
    MOCK_STAFF_DB[oldEmailKey] = updated;
  }

  return { success: true, message: "Usuario actualizado.", data: updated };
}

export async function deleteStaffUser(id: string): Promise<StaffResponse<null>> {
  await sleep();

  const entry = Object.entries(MOCK_STAFF_DB).find(([, u]) => u.id === id);
  if (!entry) return { success: false, message: "Usuario no encontrado." };

  const [emailKey, user] = entry;

  // regla de seguridad: no borrar admin (o al menos no borrar el último admin)
  if (user.role === "admin") {
    return { success: false, message: "No se puede eliminar un admin desde el mock." };
  }

  delete MOCK_STAFF_DB[emailKey];
  return { success: true, message: "Empleado eliminado.", data: null };
}


// ========================================
// REAL IMPLEMENTATION (FUTURO - GATEWAY)
// ========================================
/*
import axios from "axios";

export const http = axios.create({
  baseURL: "https://api.techstore.com", // La URL de tu backender
  headers: {
    "Content-Type": "application/json",
  },
});
*/
// EN EL FRONT AUN NO HABILITE ESTO - solo por db
/* export async function createAdmin(payload: CreateEmployeePayload): Promise<StaffResponse<StaffUser>> {
  // Adaptamos el objeto a lo que pide el back
  const body = {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    rol: "employed",        // Cambiado de "employee" a "employed"
    tenant_id: 1,           // El back lo pide como int en el body
    phone: payload.phone,
    dni: payload.dni,
    // position y startDate NO están en la doc del back, 
    // podrías mandarlos pero quizás el back los ignore.
  };

  const response = await http.post("/api/register", body, {
    headers: {
      "Content-Type": "application/json",
      // Si el back usa tenant_id en el body, quizás el X-Tenant ya no sea necesario aquí
    },
  });

  return response.data;
} */
/*
export async function createEmployee(payload: any): Promise<any> {

  const [nombre, ...apellidoParts] = payload.name.trim().split(" ");
  const apellido = apellidoParts.join(" ") || "Sin Apellido";

  const backendBody = {
    tenant_id: payload.tenant_id, // Obligatorio CHECKEAR ESTO
    branch_id: payload.branch_id, // Obligatorio CHECKEAR ESTO
    email: payload.email,
    password: payload.password,
    nombre: nombre,
    apellido: apellido,
    dni: payload.dni,
    telefono: payload.phone,
    puesto: payload.position,
    direccion: payload.address,
    estado: payload.status || "activo"
  };

  const response = await http.post("/api/employees", backendBody);
  return response.data;
} */
/*
  export interface LoginPayload {
  email: string;  
  password: string;  
}

export async function selectBranch(branchId: number): Promise<StaffResponse<any>> {
  const response = await http.post("/api/select-branch", {
    branch_id: branchId
  });
  return response.data;
}

export async function login(payload: any): Promise<any> {
  const response = await http.post("/api/login", payload);
  return response.data;
}

  export async function loginAndSelectFirstBranch(credentials: LoginPayload) {
  // 1. Primer paso: Login
  const loginRes = await login(credentials);
  
  if (loginRes.success && loginRes.data.branches.length > 0) {
    const firstBranchId = loginRes.data.branches[0].id;
    
    // 2. Segundo paso: Selección automática
    await selectBranch(firstBranchId);
    
    // Guardamos la sucursal activa para saber dónde estamos parados
    localStorage.setItem("active_branch", firstBranchId.toString());
  }
  
  return loginRes;
}
*/
/*
export async function listEmployees(filters: { tenant_id?: number; branch_id?: number; search?: string }): Promise<any> {
  const response = await http.get("/api/employees", {
    params: {
      tenant_id: filters.tenant_id,
      branch_id: filters.branch_id,
      search: filters.search,
      per_page: 50 // Por ejemplo
    }
  });
  return response.data; // Nota: Esto devuelve un objeto de paginación de Laravel/similar
}
*/
/*
//ESTO NO LO ESTABA USANDO
export async function getEmployeeById(id: number | string): Promise<any> {
  // El backend usa la ruta /api/employees/{id}
  const response = await http.get(`/api/employees/${id}`);
  
  // La respuesta viene con datos enriquecidos (sucursal, empresa, etc.)
  return response.data; 
}
*/
/*

export async function updateStaffUser(id: number | string, patch: UpdateStaffPayload): Promise<any> {
  // 1. Mapeamos los campos del Front al lenguaje del Back (Español + snake_case)
  const backendPatch = {
    nombre: patch.name,
    email: patch.email,
    password: patch.password, // Solo si se envía para cambiarla
    estado: patch.status,     // 'activo' / 'suspendido' / 'inactivo'
    telefono: patch.phone,
    dni: patch.dni,
    puesto: patch.position,
    direccion: patch.address,
    // tenant_id y branch_id suelen ser fijos, pero el back los podría pedir
  };

  const response = await http.put(`/api/employees/${id}`, backendPatch);

  return response.data;
}
*/

// FALTA editar y eliminar
/*



export async function updateStaffUser(id: string, patch: UpdateStaffPayload): Promise<StaffResponse<StaffUser>> {
  const response = await http.put(`/staff/users/${id}`, patch, {
    headers: {
      "X-Tenant": "techstore",
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deleteStaffUser(id: string): Promise<StaffResponse<null>> {
  const response = await http.delete(`/staff/users/${id}`, {
    headers: {
      "X-Tenant": "techstore",
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`,
    },
  });

  return response.data;
}
*/




// ========================================
// FETCH VERSION (SIN AXIOS)
// ========================================

/*
const API_BASE = "https://api.techstore.com";

export async function listEmployees(): Promise<StaffResponse<StaffUser[]>> {
  const res = await fetch(`${API_BASE}/staff/employees`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant": "techstore",
      // "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error listando empleados");
  return await res.json();
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<StaffResponse<StaffUser>> {
  const res = await fetch(`${API_BASE}/staff/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant": "techstore",
      // "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error creando empleado");
  return await res.json();
}


export async function deleteStaffUser(id: string): Promise<StaffResponse<null>> {
  const res = await fetch(`${API_BASE}/staff/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant": "techstore",
      // "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error eliminando empleado");
  return await res.json();
}
*/

