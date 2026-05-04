import axiosClient from "../axiosClient";

const normalAuctionDetailApi = {
  getAuctionDetail: (auctionId) => {
    return axiosClient.get(`/auctions/${auctionId}/detail`);
  },

  placeAuctionDeposit: (auctionId) => {
    return axiosClient.post(`/auctions/${auctionId}/deposit`);
  },
};

export default normalAuctionDetailApi;
