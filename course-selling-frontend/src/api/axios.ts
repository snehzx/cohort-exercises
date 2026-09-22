import axios from "axios";

// One shared axios instance for the whole app.
//
// baseURL is empty on purpose: in dev, Vite's proxy (see vite.config.ts)
// forwards requests like "/auth/login" straight to the Express server on
// port 3000. In production you'd point this at your real API URL, e.g.
// baseURL: import.meta.env.VITE_API_URL
export const api = axios.create({
  baseURL: "",
});

// Request interceptor: runs before every request leaves the browser.
// If we have a JWT saved from login, attach it as "Authorization: Bearer <token>".
// This is exactly what auth.middleware.ts on the backend expects to find.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
