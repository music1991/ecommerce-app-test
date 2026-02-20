export type Role = 'admin' | 'employee' | 'customer';

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
}