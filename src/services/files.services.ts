import axiosInstance from "../interceptor";

export const uploadFile = async (form) => {
  return axiosInstance.post("/files", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
