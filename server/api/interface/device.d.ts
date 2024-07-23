export interface Device {
  id?: string;
  name: string;
  location?: Location;
  location_id?: string;
  supplier_id?: string;
  serial_number: string;
  maintenance: boolean;
  brand: string;
  type: string;
  supplier?: Supplier;
  purchase_date?: string;
  production_date?: string;
  expiration_date?: string;
  note?: string;
  created_at?: string;
}
