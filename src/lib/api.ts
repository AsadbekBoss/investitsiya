import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — token qo'shish
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — 401 kelsa faqat login sahifasida bo'lmasa redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status: number | undefined = error.response?.status;
    if ((status === 401 || status === 403) && typeof window !== "undefined") {
      const isLoginPage = window.location.pathname === "/login";
      if (!isLoginPage) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
