import axiosClient from "../axiosClient";

// GET TOP 4 AUCTIONS NORMAL ĐANG ACTIVE MỚI NHẤT
export const getTop4ActiveNormalAuctionsApi = () => {
  return axiosClient.get("/auctions/home/top4-active-normal");
};