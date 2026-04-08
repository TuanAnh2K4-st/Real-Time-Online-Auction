import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (gửi đi)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (nhận về)
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // { message, data }
  },
  (error) => {
    return Promise.reject(error.response?.data);
  }
);

export default axiosClient;