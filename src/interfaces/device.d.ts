import { Location } from "./location";
import { Supplier } from "./suppliers";

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
  maintenance_supplier_id?: string;
  maintenance_date?: string;
  next_maintenance?: string;
  maintenance_comment?: string;
  maintenance_supplier?: { id: string; name: string };
  expiration_date?: string;
  note?: string;
  created_at?: string;
  files: [];
}
