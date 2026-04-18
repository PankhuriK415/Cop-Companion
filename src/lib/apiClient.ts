import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request.
apiClient.interceptors.request.use((config) => {
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
