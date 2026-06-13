import axiosClient from "../axiosClient";

// Lấy danh sách tất cả auctions với filter + phân trang (admin)
export const adminFilterAuctionsApi = (filterData, page = 0) => {
  return axiosClient.post(`/admin/auctions/filter?page=${page}`, filterData);
};

// Lấy danh sách products APPROVED sẵn sàng để tạo auction (admin)
export const adminGetProductsReadyApi = () => {
  return axiosClient.get("/admin/auctions/products-ready");
};

// Admin tạo auction NORMAL (không cần là chủ sản phẩm)
export const adminCreateNormalAuctionApi = (data) => {
  return axiosClient.post("/admin/auctions/create-normal", data);
};

// Admin cập nhật trạng thái auction
export const adminUpdateAuctionStatusApi = (auctionId, auctionStatus) => {
  return axiosClient.patch(`/admin/auctions/${auctionId}/status`, { auctionStatus });
};

// Admin xóa auction
export const adminDeleteAuctionApi = (auctionId) => {
  return axiosClient.delete(`/admin/auctions/${auctionId}`);
};

// Lấy thống kê nhanh
export const adminGetAuctionStatsApi = () => {
  return axiosClient.get("/admin/auctions/stats");
};
