import axiosClient from "../axiosClient";

// FILTER PRODUCTS
export const filterProductsApi = (data) => {
  return axiosClient.post("/admin/products/filter", data);
};