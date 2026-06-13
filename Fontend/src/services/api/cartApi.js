import axiosClient from "../axiosClient";

// Lấy danh sách đơn hàng trong giỏ hàng
export const getCartOrders = () => {
  return axiosClient.get("/orders/cart");
};

// Thanh toán bằng ví điện tử
export const payOrder = (data) => {
  return axiosClient.post("/payments/wallet",data);
};

// Address
export const getProvinces = () => {
  return axiosClient.get("/provinces/all");
};

export const getWardsByProvince = (provinceId) => {
  return axiosClient.get(`/wards/all-to-province/${provinceId}`);
};

