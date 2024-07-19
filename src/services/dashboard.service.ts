import { AxiosResponse } from "axios";
import axiosInstance from "../interceptor";
import { ColumnTable } from "../interfaces/tables";

export const getVergeExpireDevices = async (): Promise<AxiosResponse<any>> => {
  return await axiosInstance.get("/dashboard/devices");
};

export const getCounters = async (): Promise<AxiosResponse<any>> => {
  return await axiosInstance.get("/dashboard/counters");
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
      false: "Does not require",
    },
  },
  {
    name: "Expiration date",
    show: true,
    value: ["expiration_date"],
    index: false,
    isDate: true,
  },
];
