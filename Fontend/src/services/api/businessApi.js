import axiosClient from "../axiosClient";

// ===== BUSINESS =====
export const getMyBusiness = () => {
  return axiosClient.get("/business/me");
};

export const updateBusiness = (data) => {
  return axiosClient.put("/business/update", data);
};

export const updateLogo = (file) => {
  const formData = new FormData();
  formData.append("logo", file);

  return axiosClient.put("/business/logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ADDRESS (reuse)
export const getProvinces = () => {
  return axiosClient.get("/provinces/all");
};

export const getWardsByProvince = (provinceId) => {
  return axiosClient.get(`/wards/all-to-province/${provinceId}`);
};