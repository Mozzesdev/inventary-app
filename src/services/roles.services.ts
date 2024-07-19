import axiosInstance from "../interceptor";
import { ColumnTable } from "../interfaces/tables";

export const getRoles = async () => {
  return axiosInstance.get("/role");
};

export const createRole = async (role: any) => {
  return axiosInstance.post("/role", role);
};

export const editRole = async ({ id, ...role }: any) => {
  return axiosInstance.patch(`/role/${id}`, role);
};

export const deleteRole = async ({ id }: any) => {
  return axiosInstance.delete(`/role/${id}`);
};

export const defaultRoleData = {
  name: "",
  color: "#c92c2c",
};

export const getRoleColumns = (): ColumnTable[] => [
  {
    name: "Name",
    show: true,
    value: ["name"],
    index: false,
    isDate: false,
  },
  {
    name: "Color",
    show: true,
    value: ["color"],
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
