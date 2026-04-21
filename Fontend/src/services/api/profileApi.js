import axiosClient from "../axiosClient";

// PROFILE
export const getMyProfile = () => {
  return axiosClient.get("/profile/me");
};

export const updateProfile = (data) => {
  return axiosClient.put("/profile/update", data);
};

export const updateAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return axiosClient.put("/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ADDRESS
export const getProvinces = () => {
  return axiosClient.get("/provinces/all");
};
export const getWardsByProvince = (provinceId) => {
  return axiosClient.get(`/wards/all-to-province/${provinceId}`);
};

// ChangePassWord
export const changePassword = (data) => {
  return axiosClient.put("/auth/change-password", data);
};

// CreateProduct
export const createProduct = (data) => {
  return axiosClient.post("/products/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// lấy category cha
export const getRootCategories = () => {
  return axiosClient.get("/categories/root");
};

// lấy category con theo parent
export const getChildCategories = (parentId) => {
  return axiosClient.get(`/categories/parent/${parentId}`);
};

// lấy store theo provide
export const getStoresByProvince = (provinceId) => {
  return axiosClient.get(`/stores/by-province/${provinceId}`);
};

// Danh sách sản phẩm theo Filter
export const filterProducts = (data) => {
  return axiosClient.post("/products/filter", data);
};

// Lấy danh sách product có thể tạo auction
export const getProductsForAuction = () => {
  return axiosClient.get("/auctions/products-ready");
};

// Tạo auction normal
export const createNormalAuction = (data) => {
  return axiosClient.post("/auctions/create-normal", data);
};