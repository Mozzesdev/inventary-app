export interface Location {
  id?: string;
  name: string;
  manager: string;
  address: string;
  state: string;
  zip: string;
  street: string;
  phone_number: string;
  email: string;
  note?: string;
  files: [];
}
