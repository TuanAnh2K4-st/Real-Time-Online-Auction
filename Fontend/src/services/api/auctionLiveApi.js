import axiosClient from "../axiosClient";

export const getLiveSessionsApi = async (page = 0) => {
  return await axiosClient.get(
    `/live-auctions/public/sessions/all?page=${page}`
  );
};