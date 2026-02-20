/* export type Role = 'admin' | 'employee' | 'customer'; */

import type { AuthRole } from "../../api/types/sales.types";

export interface User {
  id: string;
  email: string;
  role: AuthRole;
  name: string;
}