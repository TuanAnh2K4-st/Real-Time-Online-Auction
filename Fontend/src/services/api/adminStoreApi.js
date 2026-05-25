import axiosClient from "../axiosClient";

// ===== FILTER STORES =====
export const filterStoresApi = (data) => {
  return axiosClient.post(
    "/admin/stores/filter",
    data
  );
};

// ===== CREATE STORE =====
export const createStoreApi = (data) => {
  return axiosClient.post(
    "/admin/stores/create-store",
    data
  );
};

// ===== UPDATE STORE =====
export const updateStoreApi = (
  storeId,
  data
) => {
  return axiosClient.put(
    `/admin/stores/update-store/${storeId}`,
    data
  );
};