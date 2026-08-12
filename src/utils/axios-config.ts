import { useAuthStore } from "@/store/auth-store";
import axios from "axios";

export const axiosConfig = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
// CSRF TOKEN MANAGEMENT
// ============================================

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

// ============================================
// REQUEST INTERCEPTOR - Add CSRF Token
// ============================================

axiosConfig.interceptors.request.use(
  async (config) => {
    const skipMethods = ["get", "head", "options"];
    const method = config.method?.toLowerCase() || "";

    const skipUrls = ["/auth/login", "/auth/register", "/auth/csrf-token"];
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

// ============================================
// RESPONSE INTERCEPTOR - Handle Token Refresh
// ============================================

axiosConfig.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const message = error.response?.data?.message;

    // Handle CSRF token errors
    if (status === 403 && message === "invalid csrf token") {
      clearCsrfToken();
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await getCsrfToken();
          return axiosConfig(originalRequest);
        } catch (refreshErr) {
          return Promise.reject(refreshErr);
        }
      }
    }

    // Handle token refresh for 401 errors
    const refreshableMessages = [
      "Access token expired",
      "No access token provided",
      "Invalid access token",
    ];

    if (
      status === 401 &&
      message &&
      refreshableMessages.includes(message) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await axiosConfig.post("/auth/refresh");
        return axiosConfig(originalRequest);
      } catch (refreshErr) {
        const { clearUser } = useAuthStore.getState();
        clearUser();
        clearCsrfToken();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosConfig;
