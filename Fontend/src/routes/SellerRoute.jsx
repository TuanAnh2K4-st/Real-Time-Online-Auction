import { Navigate } from "react-router-dom";

export default function SellerRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "SELLER") {
    return <Navigate to="/" replace />;
  }

  return children;
}