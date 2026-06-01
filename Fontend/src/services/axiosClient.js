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
    // Nếu backend trả về lỗi liên quan đến xác thực, chỉ xóa token.
    // Việc redirect sang /login sẽ do ProtectedRoute đảm nhiệm,
    // tránh redirect bắt buộc ngay cả khi đang ở trang public.
    try {
      const status = error.response?.status;
      const data = error.response?.data;
      const msg = data?.message || data || '';
      if (status === 401 || (status === 400 && /Authorization|token|invalid|expired/i.test(String(msg)))) {
        localStorage.removeItem('token');
        // Không redirect ở đây — để ProtectedRoute hoặc component tự xử lý
      }
    } catch (e) {
      // ignore
    }
    return Promise.reject(error.response?.data);
  }
);

export default axiosClient;