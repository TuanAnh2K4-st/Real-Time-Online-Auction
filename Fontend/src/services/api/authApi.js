import axiosClient from "../axiosClient";

export const loginApi = (data) => {
  return axiosClient.post("/auth/login", data);
};

export const registerUserApi = (data) => {
  return axiosClient.post("/auth/register-user", data);
};

export const registerSellerApi = (data) => {
  return axiosClient.post("/auth/register-seller", data);
};
export async function getMeApi(token) {
  const res = await fetch("http://localhost:8080/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Không thể lấy thông tin user");
  }

  return await res.json(); // res phải trả về { id, username, email, role, status }
}