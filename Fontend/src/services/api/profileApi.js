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