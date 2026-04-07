import axios from "axios";

const API = "http://localhost:8080/api";

export const login = (data) => {
  return axios.post(`${API}/auth/login`, data);
};