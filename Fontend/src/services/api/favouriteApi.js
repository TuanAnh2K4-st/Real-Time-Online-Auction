import axiosClient from "../axiosClient";

// ─── Generic watchlist functions ─────────────────────────────────────────────

// Lấy danh sách watchlist theo loại đấu giá
export const getMyWatchlist = (auctionType) => {
  return axiosClient.get("/watchlist", {
    params: { auctionType },
  });
};

// Thêm auction vào watchlist
export const addToWatchlist = (auctionId, auctionType) => {
  return axiosClient.post(`/watchlist/${auctionId}`, null, {
    params: { auctionType },
  });
};

// Xóa auction khỏi watchlist
export const removeFromWatchlist = (auctionId, auctionType) => {
  return axiosClient.delete(`/watchlist/${auctionId}`, {
    params: { auctionType },
  });
};

// ─── Convenience wrappers cho đấu giá NORMAL ─────────────────────────────────

// Thêm đấu giá thường vào yêu thích
export const addFavouriteNormalAuction = (auctionId) =>
  addToWatchlist(auctionId, "NORMAL");

// Bỏ đấu giá thường khỏi yêu thích
export const removeFavouriteNormalAuction = (auctionId) =>
  removeFromWatchlist(auctionId, "NORMAL");

// Kiểm tra xem đấu giá thường có trong watchlist chưa
export const checkFavouriteNormalAuction = (auctionId) => {
  return axiosClient.get(`/watchlist/check/${auctionId}`, {
    params: { auctionType: "NORMAL" },
  });
};

// ─── Convenience wrappers cho đấu giá LIVE ───────────────────────────────────

// Thêm đấu giá trực tiếp vào yêu thích
export const addFavouriteLiveAuction = (auctionId) =>
  addToWatchlist(auctionId, "LIVE");

// Bỏ đấu giá trực tiếp khỏi yêu thích
export const removeFavouriteLiveAuction = (auctionId) =>
  removeFromWatchlist(auctionId, "LIVE");

// Kiểm tra xem đấu giá trực tiếp có trong watchlist chưa
export const checkFavouriteLiveAuction = (auctionId) => {
  return axiosClient.get(`/watchlist/check/${auctionId}`, {
    params: { auctionType: "LIVE" },
  });
};