import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn token tự động
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // debug: log whether token is present
  // console.debug('axiosClient: token present=', !!token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Chuẩn hóa response
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // If backend returned an auth-related error, clear token and redirect to login
    try {
      const status = error.response?.status;
      const data = error.response?.data;
      const msg = data?.message || data || '';
      if (status === 401 || (status === 400 && /Authorization|token|invalid|expired/i.test(String(msg)))) {
        localStorage.removeItem('token');
        // redirect to login page to force re-authentication
        try { window.location.href = '/login'; } catch (e) { /* ignore in non-browser env */ }
      }
    } catch (e) {
      // ignore
    }
    return Promise.reject(error.response?.data);
  }
);

export default axiosClient;