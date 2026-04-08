import axiosClient from "../axiosClient";

export const loginApi = (data) => {
  return axiosClient.post("/auth/login", data);
};

export const registerUserApi = (data) => {
  return axiosClient.post("/auth/register-user", data);
};

export const registerSellerApi = (data) => {
  return axiosClient.post("/auth/register-seller", data);
};