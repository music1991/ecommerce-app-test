// El uso de 'as const' es vital para que TS trate a los strings como valores literales y no como 'string' genérico.
export const AuthRoles = {
  Customer: "customer",
  Employee: "employee",
  Admin: "admin",
} as const;

export const SaleRoles = {
  Cliente: "customer",
  Empleado: "employee",
  Admin: "admin",
} as const;

// 2. TIPOS DINÁMICOS (Para usar en definiciones de interfaces)
// Estas líneas extraen los valores exactos ("customer" | "employee" | "admin") de los objetos.
export type AuthRole = typeof AuthRoles[keyof typeof AuthRoles];
export type SaleActorType = typeof SaleRoles[keyof typeof SaleRoles];

// 3. DEFINICIÓN DE MODELOS DE AUTH
// Aquí aplicamos lo que necesitabas: establecer el rol fijo usando el objeto.
export type CustomerAuthUser = {
  password: string;
  role: typeof AuthRoles.Customer; // Esto obliga a que sea exactamente "customer"
};

export type EmployeeAuthUser = {
  password: string;
  role: typeof AuthRoles.Employee; // Esto obliga a que sea exactamente "employee"
};

// 4. OTROS TIPOS DE DOMINIO
export type PaymentMethod = "cash" | "card" | "transfer" | "fiado";
export type SaleStatus = "started" | "completed" | "forwarded";
export type SaleOrigin = AuthRole;
export type SaleItemPayload = {
  product_id: number;
  quantity: number;
};

export type CreateSalePayload = {
  items: SaleItemPayload[];

  payment_method?: PaymentMethod;
  cash_received?: number | null;
  customer_id?: number | null;

  origin: SaleOrigin;                 // customer | employee
  status: SaleStatus;                 // started (al crear)
  origin_branch_id?: number | null;   // si se inicia en sucursal
  forward_to_branch_id?: number | null; // si se deriva
};

export type Sale = {
  id: number;

  tenant_id: string;

  origin: SaleOrigin;
  status: SaleStatus;

  origin_branch_id?: number | null;
  forward_to_branch_id?: number | null;

  payment_method?: PaymentMethod | null;
  cash_received?: number | null;
  customer_id?: number | null;

  total: number;

  created_at: string;
  updated_at: string;
};

export type CreateSaleResponse =
  | { success: true; sale: Sale; message: string; warning?: string | null }
  | { success: false; message: string };