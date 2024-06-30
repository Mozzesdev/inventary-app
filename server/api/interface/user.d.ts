export interface User {
  id: string;
  email: string;
  password: string;
  two_factor?: boolean;
  app_secret?: string
}
