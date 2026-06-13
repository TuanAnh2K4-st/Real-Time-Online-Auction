import axiosClient from "../axiosClient";

// FILTER USERS
export const filterUsersApi = (data) => {
  return axiosClient.post("/admin/users/filter", data);
};

// CHANGE STATUS
export const changeUserStatusApi = (userId) => {
  return axiosClient.put(`/admin/users/change-status/${userId}`);
};

// CHANGE ROLE
export const changeUserRoleApi = (userId, role) => {
  return axiosClient.put(`/admin/users/${userId}/role`, {
    userRole: role,
  });
};

// CREATE USER
export const createUserApi = (data) => {
  return axiosClient.post("/admin/users/create-user", data);
};