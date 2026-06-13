import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Khởi tạo user đồng bộ từ localStorage (lazy initializer)
  // Tránh trường hợp user = null → có giá trị, gây Header gọi API thừa
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (token && savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {
      // ignore parse error
    }
    // Nếu không có token hoặc user, clear hết để đảm bảo trạng thái sạch
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  });

  // LOGIN (map từ BE -> FE)
  const login = (data) => {
    // lưu token
    localStorage.setItem("token", data.token);

    // map lại user từ response BE
    const userData = {
      username: data.username,
      userId: data.userId,
      role: data.role,
    };

    // lưu user
    localStorage.setItem("user", JSON.stringify(userData));

    // set state
    setUser(userData);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};