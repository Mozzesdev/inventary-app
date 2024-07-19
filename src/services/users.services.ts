import axiosInstance from "../interceptor";
import { ColumnTable } from "../interfaces/tables";

export const getUsers = async () => {
  return axiosInstance.get("/user");
};

export const createUser = async (role: any) => {
  return axiosInstance.post("/user/register", role);
};

export const editUser = async ({ id, ...role }: any) => {
  return axiosInstance.patch(`/user/${id}`, role);
};

export const deleteUser = async ({ id }: any) => {
  return axiosInstance.delete(`/user/${id}`);
};

export const defaultUserData = {
  email: "",
  password: "",
  confirm: "",
  role_id: "",
  root_user: false,
};

export const getUsersColumns = (): ColumnTable[] => [
  {
    name: "Email",
    show: true,
    value: ["email"],
    index: false,
    isDate: false,
  },
  {
    name: "Role",
    show: true,
    value: ["role", "name"],
    index: false,
    isDate: false,
  },
  {
    name: "Two factor",
    show: true,
    value: ["two_factor"],
    index: false,
    isDate: false,
    isBoolean: true,
    placeholder: {
      true: "Enabled",
      false: "Disabled",
    },
  },
  {
    name: "Created at",
    show: true,
    value: ["created_at"],
    index: false,
    isDate: true,
  },
];
