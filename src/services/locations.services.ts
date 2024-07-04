import { AxiosResponse } from "axios";
import { Location } from "../interfaces/location";
import { ColumnTable } from "../interfaces/tables";
import axiosInstance from "../interceptor";
import { Pagination } from "../components/Pagination";

export const getLocations = async ({
  page = 1,
  perPage = 10,
  ...props
}: FetchLocationProps = {}): Promise<AxiosResponse<FetchLocation>> => {
  return await axiosInstance.get<FetchLocation>(
    `/location?page=${page}&perPage=${perPage}${
      props.query ? "&query=" + props.query : ""
    }`
  );
};

export const createLocation = async (
  data: Location
): Promise<AxiosResponse<any>> => {
  return await axiosInstance.post("/location", data);
};

export const editLocation = async (
  data: Location
): Promise<AxiosResponse<any>> => {
  return await axiosInstance.patch(`/location/${data.id}`, data);
};

export const deleteLocation = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await axiosInstance.delete(`/location/${id}`);
};

export const getLocationColumns = (): ColumnTable[] => [
  {
    name: "Location Name",
    show: true,
    value: ["name"],
    index: false,
    isDate: false,
  },
  {
    name: "Manager",
    show: true,
    value: ["manager"],
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
    name: "Zip Code",
    show: true,
    value: ["zip"],
    index: false,
    isDate: false,
  },
  {
    name: "Phone Number",
    show: true,
    value: ["phone_number"],
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

export interface FetchLocation {
  data: Location[];
  pagination: Pagination;
  success: boolean;
}

export interface FetchLocationProps {
  page?: number;
  perPage?: number;
  query?: string;
}

export const defaultLocationValues: Location = {
  address: "",
  email: "",
  name: "",
  manager: "",
  phone_number: "",
  state: "",
  street: "",
  zip: "",
  note: "",
  files: [],
};
