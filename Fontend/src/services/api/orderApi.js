import axiosClient from "../axiosClient";

// Lấy danh sách đơn hàng của user (trừ CART) - có thể lọc theo status
export const getMyOrders = (status = "") => {
  const params = status ? { status } : {};
  return axiosClient.get("/orders/my-orders", { params });
};
