import { AxiosResponse } from "axios";
import { ColumnTable } from "../interfaces/tables";
import axiosInstance from "../interceptor";
import { Pagination } from "../components/Pagination";
import { Device } from "../interfaces/device";

export const getDevices = async ({
  page = 1,
  perPage = 10,
  ...props
}: FetchDevicesProps): Promise<AxiosResponse<FetchDevices>> => {
  return await axiosInstance.get<FetchDevices>(
    `/devices?page=${page}&perPage=${perPage}${
      props.query ? "&query=" + props.query : ""
    }`
  );
};

export const createDevice = async (
  data: Device
): Promise<AxiosResponse<any>> => {
  return await axiosInstance.post("/devices", data);
};

export const editDevice = async (data: Device): Promise<AxiosResponse<any>> => {
  return await axiosInstance.patch(`/devices/${data.id}`, data);
};

export const deleteDevice = async (id: string): Promise<AxiosResponse<any>> => {
  return await axiosInstance.delete(`/devices/${id}`);
};

export const getDevicesColumns = (): ColumnTable[] => [
  {
    name: "Device",
    show: true,
    value: ["device"],
    index: false,
    isDate: false,
  },
  {
    name: "Location",
    show: true,
    value: ["location", "name"],
    index: false,
    isDate: false,
  },
  {
    name: "Supplier",
    show: true,
    value: ["supplier", "name"],
    index: false,
    isDate: false,
  },
  {
    name: "Serial number",
    show: true,
    value: ["serial_number"],
    index: false,
    isDate: false,
  },
  {
    name: "Maintenance",
    show: true,
    value: ["maintenance"],
    index: false,
    isDate: false,
    isBoolean: true,
    placeholder: {
      true: "Requires",
      false: "Does not require"
    }
  },
  {
    name: "Brand",
    show: true,
    value: ["brand"],
    index: false,
    isDate: false,
  },
  {
    name: "Device type",
    show: true,
    value: ["type"],
    index: false,
    isDate: false,
  },
  {
    name: "Purchase date",
    show: true,
    value: ["purchase_date"],
    index: false,
    isDate: true,
  },
  {
    name: "Production date",
    show: true,
    value: ["production_date"],
    index: false,
    isDate: true,
  },
  {
    name: "Expiration date",
    show: true,
    value: ["expiration_date"],
    index: false,
    isDate: true,
  },
  {
    name: "Notes",
    show: false,
    value: ["note"],
    index: false,
    isDate: false,
  },
  {
    name: "Created at",
    show: true,
    value: ["created_at"],
    index: false,
    isDate: true,
  },
];

export interface FetchDevices {
  data: Device[];
  pagination: Pagination;
  success: boolean;
}

export interface FetchDevicesProps {
  page?: number;
  perPage?: number;
  query?: string;
}

export const defaultDevicesValues: Device = {
  note: "",
  device: "",
  type: "",
  brand: "",
  location_id: "",
  supplier_id: "",
  maintenance: false,
  serial_number: "",
  expiration_date: "",
  production_date: "",
  purchase_date: "",
  files: [],
};
