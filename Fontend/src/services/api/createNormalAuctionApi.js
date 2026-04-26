import axiosClient from "../axiosClient";

// Lấy danh sách product có thể tạo auction
export const getProductsForAuction = () => {
  return axiosClient.get("/auctions/products-ready");
};

// Tạo auction normal
export const createNormalAuction = (data) => {
  return axiosClient.post("/auctions/create-normal", data);
};

