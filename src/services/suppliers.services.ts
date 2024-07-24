import { AxiosResponse } from "axios";
import { ColumnTable } from "../interfaces/tables";
import axiosInstance from "../interceptor";
import { Supplier } from "../interfaces/suppliers";
import { Pagination } from "../components/Pagination";

export const getSuppliers = async ({
  page = 1,
  perPage = 10,
  ...props
}: FetchSuppliersProps = {}): Promise<AxiosResponse<FetchSuppliers>> => {
  return await axiosInstance.get<FetchSuppliers>(
    `/suppliers?page=${page}&perPage=${perPage}${
      props.query ? "&query=" + props.query : ""
    }`
  );
};

export const createSupplier = async (
  data: Supplier
): Promise<AxiosResponse<any>> => {
  return await axiosInstance.post("/suppliers", data);
};

export const editSupplier = async (
  data: Supplier
): Promise<AxiosResponse<any>> => {
  return await axiosInstance.patch(`/suppliers/${data.id}`, data);
};

export const deleteSupplier = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await axiosInstance.delete(`/suppliers/${id}`);
};

export const deleteSupplierFile = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await axiosInstance.delete(`/suppliers/files/${id}`);
};

export const addSupplierFiles = async (
  body: any
): Promise<AxiosResponse<any>> => {
  return await axiosInstance.post(`/suppliers/files`, body);
};

export const getSuppliersColumns = (): ColumnTable[] => [
  {
    name: "Name",
    show: true,
    value: ["name"],
    index: false,
    isDate: false,
  },
  {
    name: "Contact",
    show: true,
    value: ["contact"],
    index: false,
    isDate: false,
  },
  {
    name: "Email",
    show: true,
    value: ["email"],
    index: false,
    isDate: false,
  },
  {
    name: "Address",
    show: true,
    value: ["address"],
    index: false,
    isDate: false,
  },
  {
    name: "State",
    show: true,
    value: ["state"],
    index: false,
    isDate: false,
  },
  {
    name: "Street",
    show: true,
    value: ["street"],
    index: false,
    isDate: false,
  },
  {
    name: "Zip code",
    show: true,
    value: ["zip"],
    index: false,
    isDate: false,
  },
  {
    name: "Phone number",
    show: true,
    value: ["phone_number"],
    index: false,
    isDate: false,
  },
  {
    name: "Web page",
    show: true,
    value: ["web_page"],
    index: false,
    isDate: false,
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

export interface FetchSuppliers {
  data: Supplier[];
  pagination: Pagination;
  success: boolean;
}

export interface FetchSuppliersProps {
  page?: number;
  perPage?: number;
  query?: string;
}

export const defaultSuppliersValues: Supplier = {
  address: "",
  email: "",
  name: "",
  contact: "",
  phone_number: "",
  state: "",
  street: "",
  zip: "",
  web_page: "",
  note: "",
  files: []
};
