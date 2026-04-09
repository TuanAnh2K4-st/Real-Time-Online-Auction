import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getMeApi } from "../services/api/authApi"; // gọi /api/auth/me

export default function OAuth2Success() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      // Lưu token trước
      localStorage.setItem("token", token);

      // Gọi /me để lấy user info
      getMeApi(token)
        .then((res) => {
          login({
            token,
            username: res.username,
            userId: res.id,
            role: res.role,
          });
          navigate("/"); // redirect về trang chính
        })
        .catch(() => {
          // Nếu lỗi, quay về login
          localStorage.removeItem("token");
          navigate("/login");
        });

    } else {
      navigate("/login"); // nếu không có token
    }
  }, [navigate, login]);

  return <div>Đang đăng nhập...</div>;
}