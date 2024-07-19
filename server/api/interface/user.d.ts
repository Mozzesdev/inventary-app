export interface User {
  id: string;
  email: string;
  password: string;
  two_factor?: boolean;
  app_secret?: string;
  root_user?: boolean;
  role?: Role;
  role_id: string;
}

export interface Role {
  name: string;
  id: string;
  color: string;
  created_at: string;
}
