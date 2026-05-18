import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

<<<<<<< HEAD
// Tự động gắn JWT token vào mọi request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
=======
API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
>>>>>>> 6fc3a67 (Complete blockchain identity system frontend and backend)
