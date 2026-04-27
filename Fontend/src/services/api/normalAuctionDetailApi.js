import axiosClient from "../axiosClient";

const normalAuctionDetailApi = {
  // Lấy chi tiết auction theo ID
  getAuctionDetail: (auctionId) => {
    return axiosClient.get(`/auctions/${auctionId}/detail`);
  },
};

export default normalAuctionDetailApi;
