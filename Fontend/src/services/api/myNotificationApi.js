import axiosClient from "../axiosClient";

// lấy danh sách notification
export const getMyNotifications = () => {
  return axiosClient.get("/notifications/me");
};

// đánh dấu đã đọc
export const markAsRead = (notificationId) => {
  return axiosClient.put("/notifications/read", {
    notificationId,
  });
};

// đánh dấu tất cả đã đọc
export const markAllAsRead = () => {
  return axiosClient.put("/notifications/read-all");
};

// xóa notification
export const deleteNotification = (notificationId) => {
  return axiosClient.delete(`/notifications/${notificationId}`);
};