// frontend/src/services/api.js
import axios from "axios";

const AUTH_KEY = "auth";

/** Đọc auth từ localStorage */
export function getAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return { token: "", user: null };
    const parsed = JSON.parse(raw);
    return {
      token: parsed?.token || "",
      user: parsed?.user || null,
    };
  } catch {
    return { token: "", user: null };
  }
}

/** Lưu auth + bắn event để Navbar cập nhật ngay */
export function setAuth({ token, user }) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }));
  window.dispatchEvent(new Event("auth-changed"));
}

/** Xoá auth + bắn event để Navbar cập nhật ngay */
export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event("auth-changed"));
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080/api",
});

/** Tự gắn Bearer token vào mọi request */
api.interceptors.request.use((config) => {
  const { token } = getAuth();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
