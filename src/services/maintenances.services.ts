import { AxiosResponse } from "axios";
import axiosInstance from "../interceptor";
import { ColumnTable } from "../interfaces/tables";
import { FetchDevicesProps } from "./devices.services";

export const manageMaintenanceDevice = async (
  id: string,
  body: any
): Promise<AxiosResponse<any>> => {
  return await axiosInstance.patch(`/devices/${id}`, body);
};

export const getMaintenanceDevices = async ({
  page = 1,
  perPage = 10,
  ...props
}: FetchDevicesProps) => {
  return await axiosInstance.get(
    `/devices/maintenances?page=${page}&perPage=${perPage}${
      props.query ? "&query=" + props.query : ""
    }`
  );
};

export const getMaintenanceDevicesColumns = (): ColumnTable[] => [
  {
    name: "Device",
    show: true,
    value: ["name"],
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
    name: "Maintenance supplier",
    show: true,
    value: ["maintenance_supplier", "name"],
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
    name: "Maintenance date",
    show: true,
    value: ["maintenance_date"],
    index: false,
    isDate: true,
  },
  {
    name: "Next maintenance",
    show: true,
    value: ["next_maintenance"],
    index: false,
    isDate: true,
  },
  {
    name: "Created at",
    show: true,
    value: ["created_at"],
    index: false,
    isDate: true,
  },
];
