import { createContext, useState } from "react";
import { getMyProfile } from "../services/api/profileApi";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const loadProfile = async () => {
    try {
      const res = await getMyProfile();
      setProfile(res.data);
    } catch (err) {
      console.error("Lỗi load profile", err);
      setProfile(null);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loadProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};