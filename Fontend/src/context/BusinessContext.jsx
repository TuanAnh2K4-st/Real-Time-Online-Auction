import { createContext, useState } from "react";
import { getMyBusiness } from "../services/api/businessApi";

export const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [business, setBusiness] = useState(null);

  const loadBusiness = async () => {
    try {
      const res = await getMyBusiness();
      setBusiness(res.data);
    } catch (err) {
      console.error("Lỗi load business", err);
      setBusiness(null);
    }
  };

  return (
    <BusinessContext.Provider value={{ business, setBusiness, loadBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
};