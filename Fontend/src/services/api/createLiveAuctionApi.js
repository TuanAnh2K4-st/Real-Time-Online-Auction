import axiosClient from "../axiosClient";

export const getPublicLiveSessions = (limit = 4) => {
  return axiosClient.get("/live-auctions/public/sessions", { params: { limit } });
};

export const getLiveEligibility = () => {
  return axiosClient.get("/live-auctions/eligibility");
};

export const getMyLiveRooms = () => {
  return axiosClient.get("/live-auctions/rooms");
};

export const createLiveRoom = (roomName) => {
  return axiosClient.post("/live-auctions/rooms", { roomName });
};

export const getMyLiveSessions = () => {
  return axiosClient.get("/live-auctions/sessions");
};

export const createLiveSession = (payload) => {
  return axiosClient.post("/live-auctions/sessions", payload);
};
