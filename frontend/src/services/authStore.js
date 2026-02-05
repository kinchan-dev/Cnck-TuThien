const AUTH_KEY = "auth";

export function getAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return { token: "", user: null };
    const parsed = JSON.parse(raw);
    return { token: parsed?.token || "", user: parsed?.user || null };
  } catch {
    return { token: "", user: null };
  }
}

export function setAuth({ token, user }) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }));
  // để Navbar cập nhật ngay trong cùng tab
  window.dispatchEvent(new Event("auth-changed"));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event("auth-changed"));
}
