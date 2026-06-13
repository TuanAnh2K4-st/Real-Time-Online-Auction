import axiosClient from "../axiosClient";

// SUBSCRIPTION PLAN

// Lấy tất cả gói subscription
export const getAllSubscriptionsApi = () => {
  return axiosClient.get("/admin/subscriptions/all");
};

// Tạo gói subscription mới
export const createSubscriptionApi = (data) => {
  return axiosClient.post("/admin/subscriptions/create", data);
};

// Xóa gói subscription
export const deleteSubscriptionApi = (id) => {
  return axiosClient.delete(`/admin/subscriptions/delete/${id}`);
};

// USER SUBSCRIPTION

// Lọc danh sách user subscriptions
export const filterUserSubscriptionsApi = (data) => {
  return axiosClient.post("/admin/user-subscriptions/filter", data);
};

// Hủy subscription của user
export const cancelUserSubscriptionApi = (id) => {
  return axiosClient.put(`/admin/user-subscriptions/cancel/${id}`);
};