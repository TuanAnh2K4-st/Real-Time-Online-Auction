import axiosClient from "../axiosClient";

const orderApi = {
  getCartOrders: () => {
    return axiosClient.get("/orders/cart");
  },
};

export default orderApi;