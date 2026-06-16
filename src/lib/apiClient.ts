import axios from "axios";

// Local: "/api" is proxied by Vite to http://localhost:5000 (same-origin, no CORS).
const LOCAL_API_BASE_URL = "/api";
const PROD_API_BASE_URL = "https://cop-companion.onrender.com/api";

const useLocal = import.meta.env.VITE_USE_LOCAL === "true";

const apiClient = axios.create({
  baseURL: useLocal ? LOCAL_API_BASE_URL : import.meta.env.VITE_API_URL || PROD_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request.
apiClient.interceptors.request.use((config) => {
  // If a caller accidentally uses "auth/login" (missing leading slash),
  // axios will concatenate it to "/api" => "/apiauth/login" and break the Vite proxy.
  if (
    typeof config.url === "string" &&
    !config.url.startsWith("/") &&
    !config.url.startsWith("http")
  ) {
    config.url = `/${config.url}`;
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Normalize payload: convert numeric ID strings to numbers for keys like 'Station_ID', 'Case_ID', 'Criminal_ID', 'Victim_ID', 'Officer_ID'
  try {
    const data = config.data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      Object.keys(data).forEach((k) => {
        const v = (data as any)[k];
        if (typeof v === "string" && (k.endsWith("ID") || k.endsWith("_ID"))) {
          // If string is numeric, convert to number
          if (/^-?\d+$/.test(v)) {
            (data as any)[k] = Number(v);
          }
        }
      });
    }
  } catch (err) {
    // silently ignore coercion errors
  }
  return config;
});

// On 401, clear auth and redirect to login.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const reqUrl = error.config?.url || "";

    // Do not force navigation on 401 for auth endpoints (login/signup)
    if (
      status === 401 &&
      !reqUrl.includes("/auth/login") &&
      !reqUrl.includes("/auth/signup")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
