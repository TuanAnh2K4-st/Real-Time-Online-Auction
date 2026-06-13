import axiosClient from "../axiosClient";

// Lấy ra danh sách tỉnh
export const getProvinces = () => {
  return axiosClient.get("/provinces/all");
};

// Lấy ra danh sách phường theo provinceId
export const getWardsByProvince = (provinceId) => {
  return axiosClient.get(`/wards/all-to-province/${provinceId}`);
};