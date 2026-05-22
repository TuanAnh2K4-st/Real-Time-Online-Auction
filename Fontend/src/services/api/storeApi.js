import axiosClient from "../axiosClient";

// ===== GET ALL ACTIVE STORES =====
export const getActiveStoresApi = () => {
    return axiosClient.get(
        "/stores/list-stores/active"
    );
};

// ===== GET STORES BY PROVINCE =====
export const getStoresByProvinceApi = (
    provinceId
) => {
    return axiosClient.get(
        `/stores/by-province/${provinceId}`
    );
};