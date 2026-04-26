import axiosClient from "../axiosClient";

// Lấy danh sách product sẵn sàng tạo auction (status APPROVED)
export const getProductsForAuction = () => {
  return axiosClient.get("/auctions/products-ready");
};

// Tạo auction normal
export const createNormalAuction = (data) => {
  return axiosClient.post("/auctions/create-normal", data);
};

// Lấy danh sách auction NORMAL đang chạy của user hiện tại
export const getMyNormalAuctions = () => {
  return axiosClient.get("/auctions/mine/normal");
};

// Kết thúc phiên đấu giá sớm
export const endAuctionEarlyApi = (auctionId) => {
  return axiosClient.patch(`/auctions/${auctionId}/end-early`);
};

