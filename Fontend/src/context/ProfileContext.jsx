import { createContext, useState } from "react";
import { getMyProfile } from "../services/api/profileApi";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const loadProfile = async () => {
    const token = localStorage.getItem("token");

    // ❗ Không có token → không gọi API
    if (!token) {
      console.warn("Không có token → bỏ qua load profile");
      return;
    }

    try {
      const res = await getMyProfile(token);
      setProfile(res.data.data);
    } catch (err) {
      console.error("Lỗi load profile", err);

      // ❗ Nếu token hết hạn → logout luôn
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setProfile(null);
      }
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loadProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};