import axiosClient from "../axiosClient";

// lấy category cha
export const getRootCategories = () => {
  return axiosClient.get("/categories/root");
};

// lấy category con theo parentId
export const getChildCategories = (parentId) => {
  return axiosClient.get(`/categories/parent/${parentId}`);
};