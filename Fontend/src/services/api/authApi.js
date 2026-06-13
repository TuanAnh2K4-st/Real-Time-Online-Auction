import axiosClient from "../axiosClient";

// LOGIN
export const loginApi = (data) => {
  return axiosClient.post("/auth/login", data);
};

// REGISTER USER (Bước 1: gửi OTP, chưa tạo tài khoản)
export const registerUserApi = (data) => {
  return axiosClient.post("/auth/register-user", data);
};

// REGISTER SELLER (Bước 1: gửi OTP, chưa tạo tài khoản)
export const registerSellerApi = (data) => {
  return axiosClient.post("/auth/register-seller", data);
};

// VERIFY OTP (Bước 2: xác nhận OTP → tạo tài khoản)
export const verifyOtpApi = (data) => {
  return axiosClient.post("/auth/verify-otp", data);
};

// RESEND OTP (Gửi lại OTP mới)
export const resendOtpApi = (data) => {
  return axiosClient.post("/auth/resend-otp", data);
};

// GET CURRENT USER (ME)
export const getMeApi = () => {
  return axiosClient.get("/auth/me");
};

// ChangePassWord
export const changePassword = (data) => {
  return axiosClient.put("/auth/change-password", data);
};