export interface Supplier {
  id?: string;
  name: string;
  contact: string;
  address: string;
  state: string;
  zip: string;
  street: string;
  phone_number: string;
  email: string;
  web_page?: string;
  note?: string;
  files: [];
}
