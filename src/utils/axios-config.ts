// src/utils/axios-config.ts

import axios from "axios";

// NEXT_PUBLIC_ env vars are inlined by Next.js AT BUILD TIME. The local .env is
// gitignored and may not exist in the production build environment, so if the
// platform doesn't set NEXT_PUBLIC_API_URL, `process.env.NEXT_PUBLIC_API_URL`
// will be undefined here. To avoid silently hitting `localhost` in production
// (which makes the CSRF endpoint "disappear"), default to the real backend URL
// when running a production build; keep localhost only for local dev.
const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://heightt-backend.onrender.com/api/v1"
    : "http://localhost:3000/api/v1");

console.log("Axios baseURL:", baseURL);

export const axiosConfig = axios.create({
  baseURL,
  withCredentials: true, // CRITICAL: Enables cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// CSRF Token Management
let csrfToken: string | null = null;
let csrfTokenFetching: Promise<string> | null = null;

async function fetchCsrfToken(): Promise<string> {
  try {
    const response = await axiosConfig.get("/auth/csrf-token");
    const token = response.data.csrfToken;
    if (!token) {
      throw new Error("No CSRF token received");
    }
    return token;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    throw error;
  }
}

export async function getCsrfToken(): Promise<string> {
  if (csrfToken) {
    return csrfToken;
  }

  if (csrfTokenFetching) {
    return csrfTokenFetching;
  }

  csrfTokenFetching = fetchCsrfToken()
    .then((token) => {
      csrfToken = token;
      return token;
    })
    .finally(() => {
      csrfTokenFetching = null;
    });

  return csrfTokenFetching;
}

export function clearCsrfToken() {
  csrfToken = null;
  csrfTokenFetching = null;
}

// Request Interceptor
axiosConfig.interceptors.request.use(
  async (config) => {
    const skipMethods = ["get", "head", "options"];
    const method = config.method?.toLowerCase() || "";

    const skipUrls = [
      "/auth/login",
      "/auth/register",
      "/auth/csrf-token",
      "/auth/refresh",
    ];
    const isAuthEndpoint = skipUrls.some((url) => config.url?.includes(url));

    if (skipMethods.includes(method) || isAuthEndpoint) {
      return config;
    }

    try {
      const token = await getCsrfToken();
      config.headers["X-CSRF-Token"] = token;
    } catch (error) {
      console.warn("Failed to add CSRF token to request:", error);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: any;
}> = [];

const processQueue = (error: unknown | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(axiosConfig(prom.config));
    }
  });
  failedQueue = [];
};

axiosConfig.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const message = error.response?.data?.message || "";

    // Handle CSRF token errors
    if (
      status === 403 &&
      (message === "invalid csrf token" || message === "CSRF token mismatch")
    ) {
      clearCsrfToken();
      originalRequest._retry = true;
      try {
        await getCsrfToken();
        return axiosConfig(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    // Handle token refresh for 401 errors
    if (status === 401 && !originalRequest._retry) {
      const skipRefreshUrls = [
        "/auth/login",
        "/auth/register",
        "/auth/refresh",
        "/auth/csrf-token",
      ];
      const isSkipUrl = skipRefreshUrls.some((url) =>
        originalRequest.url?.includes(url),
      );

      if (!isSkipUrl) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest });
          });
        }

        isRefreshing = true;

        try {
          await axiosConfig.post("/auth/refresh");
          processQueue(null);
          return axiosConfig(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);

          // Fix: Use the Zustand store's clearUser method
          try {
            const { useAuthStore } = await import("@/store/auth-store");
            const state = useAuthStore.getState();
            state.clearUser();
          } catch (e) {
            console.error("Failed to clear user:", e);
          }

          clearCsrfToken();
          if (typeof window !== "undefined") {
            window.location.href = "/signin";
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosConfig;
