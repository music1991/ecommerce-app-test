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

    position: payload.position,
    startDate: payload.startDate,
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

// import { http } from "./http"; // axios instance

/*
export async function listEmployees(): Promise<StaffResponse<StaffUser[]>> {
  const response = await http.get("/staff/employees", {
    headers: {
      "X-Tenant": "techstore",
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<StaffResponse<StaffUser>> {
  const response = await http.post("/staff/employees", payload, {
    headers: {
      "X-Tenant": "techstore",
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`,
    },
  });

  return response.data;
}

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

export async function updateStaffUser(id: string, patch: UpdateStaffPayload): Promise<StaffResponse<StaffUser>> {
  const res = await fetch(`${API_BASE}/staff/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant": "techstore",
      // "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(patch),
  });

  if (!res.ok) throw new Error("Error actualizando empleado");
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