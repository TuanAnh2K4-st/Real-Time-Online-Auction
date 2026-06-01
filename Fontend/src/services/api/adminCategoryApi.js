import axiosClient from "../axiosClient";

//Lấy tất cả danh mục
export const getAllCategories = () => {
  return axiosClient.get("/admin/categories/all");
};

// Lấy chi tiết danh mục theo id
export const getCategoryById = (id) => {
  return axiosClient.get(`/admin/categories/get/${id}`);
};

// Lấy cây danh mục
export const filterCategories = (request) => {
  return axiosClient.post("/admin/categories/filter", request);
};

// Tạo mới danh mục
export const createCategory = (request) => {
  return axiosClient.post("/admin/categories/create", request);
};

// Cập nhật danh mục
export const updateCategory = (id, request) => {
  return axiosClient.put(
    `/admin/categories/update/${id}`,
    request
  );
};

// Xóa danh mục
export const deleteCategory = (id) => {
  return axiosClient.delete(
    `/admin/categories/delete/${id}`
  );
};