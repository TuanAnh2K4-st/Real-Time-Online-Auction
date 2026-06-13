import { Navigate } from "react-router-dom";

export default function SellerRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Đọc role từ object "user" (được lưu bởi AuthContext)
  // vì localStorage không có key "role" riêng lẻ
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = String(user?.role || "").toUpperCase();
    if (!role.includes("SELLER")) {
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to="/" replace />;
  }

  return children;
}