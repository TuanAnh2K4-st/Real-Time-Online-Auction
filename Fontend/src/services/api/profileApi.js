import axios from "axios";

const API_URL = "http://localhost:8080/api/profile";

// Lấy profile của user hiện tại
export const getMyProfile = async (token) => {
  return axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};