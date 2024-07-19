import { AxiosResponse } from "axios";
import axiosInstance from "../interceptor";

export const loginUser = (
  body: AuthValues
): Promise<AxiosResponse<LoginResponse>> => {
  return axiosInstance.post<LoginResponse>("/user/login", body);
};

export const logoutUser = () => {
  return axiosInstance.post("/user/logout");
};

export const changePassword = (body: PasswordBody) => {
  return axiosInstance.post(`/user/change-password/${body.id}`, body);
};

export const enable2fa = (body: { id: string }) => {
  return axiosInstance.post("/user/enable-2fa", body);
};

export const disable2fa = (body: any) => {
  return axiosInstance.patch(`/user/${body.id}`, body);
};

export const getUserById = (id: string) => {
  return axiosInstance.get(`/user/${id}`);
};

export const verify2fa = (body: VerifyBody) => {
  return axiosInstance.post("/user/verify-2fa", body);
};

interface AuthValues {
  email: string;
  password: string;
}

interface VerifyBody {
  id: string;
  token_2fa: string;
}


interface PasswordBody {
  new: string;
  current: string;
  confirm: string;
  id: string;
}

interface LoginResponse {
  data: {
    email: string;
    id: string;
    token: string;
    "2fa_required"?: boolean;
  };
  success: boolean;
  message: string;
}
