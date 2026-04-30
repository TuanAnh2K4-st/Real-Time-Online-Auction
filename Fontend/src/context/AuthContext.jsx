import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load lại user khi refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

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