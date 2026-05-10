import axiosClient from "../axiosClient";

// Top 4 card home auction normal
export const getTop4ActiveNormalAuctionsApi = () => {
  return axiosClient.get("/auctions/home/top4-active-normal");
};

// Danh sách card của ListNormalAuction
export const filterNormalAuctionsApi = async (filterData, page = 0) => {
  return await axiosClient.post(
    `/auctions/normal/filter?page=${page}`,
    filterData
  );
};