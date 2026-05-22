import axiosClient from "../axiosClient";

// FILTER PRODUCTS
export const filterProductsApi = (data) => {
  return axiosClient.post("/admin/products/filter", data);
};

// NOTE STORE ITEM
export const noteStoreItemApi = (data) => {
  return axiosClient.post(
    "/admin/products/note",
    data
  );
};

// ===== CREATE PRODUCT BY ADMIN =====
export const createProductByAdminApi = (
    formData
) => {
    return axiosClient.post(
        "/admin/products/create",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );
};