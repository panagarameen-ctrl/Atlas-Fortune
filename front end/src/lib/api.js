import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const TOKEN_KEY = "af_admin_token";

// Public axios instance
export const publicApi = axios.create({ baseURL: API });

// Admin axios instance - attaches passcode token header
export const adminApi = axios.create({ baseURL: API });
adminApi.interceptors.request.use((cfg) => {
  const t = localStorage.getItem(TOKEN_KEY);
  if (t) cfg.headers["X-Admin-Token"] = t;
  return cfg;
});

export function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
