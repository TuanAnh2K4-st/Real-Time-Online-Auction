import axiosClient from "../axiosClient";

// LOGIN
export const loginApi = (data) => {
  return axiosClient.post("/auth/login", data);
};

// REGISTER USER
export const registerUserApi = (data) => {
  return axiosClient.post("/auth/register-user", data);
};

// REGISTER SELLER
export const registerSellerApi = (data) => {
  return axiosClient.post("/auth/register-seller", data);
};

// GET CURRENT USER (ME)
export const getMeApi = () => {
  return axiosClient.get("/auth/me");
};