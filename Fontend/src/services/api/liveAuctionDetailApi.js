import axiosClient from "../axiosClient";

export const getLiveRoomDetail = (roomCode) => {
  return axiosClient.get(`/live-auctions/rooms/${encodeURIComponent(roomCode)}/detail`);
};
