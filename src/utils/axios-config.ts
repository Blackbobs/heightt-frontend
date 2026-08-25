// src/utils/axios-config.ts

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

/**
 * ============================================================
 * API BASE URL
 * ============================================================
 */
const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://heightt-backend.onrender.com/api/v1"
    : "http://localhost:3000/api/v1");

console.log("[Axios] Base URL:", baseURL);

/**
 * ============================================================
 * AXIOS INSTANCE
 * ============================================================
 */

export const axiosConfig: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30_000,
});

// Log when axios instance is created
console.log("[Axios] Instance created with withCredentials: true");

/**
 * ============================================================
 * CSRF TOKEN MANAGEMENT
 * ============================================================
 */

let csrfToken: string | null = null;
let csrfTokenFetching: Promise<string> | null = null;
let csrfInitAttempts = 0;
const MAX_CSRF_ATTEMPTS = 3;

const CSRF_ENDPOINT = "/auth/csrf-token";

/**
 * Helper to get CSRF token from cookie
 */
function getCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") {
    console.log("[CSRF] Not in browser, cannot read cookie");
    return null;
  }

  try {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "_csrf") {
        const decoded = decodeURIComponent(value);
        console.log(
          "[CSRF] Found token in cookie:",
          decoded.substring(0, 10) + "...",
        );
        return decoded;
      }
    }
    console.log("[CSRF] No _csrf cookie found");
    return null;
  } catch (error) {
    console.error("[CSRF] Error reading cookie:", error);
    return null;
  }
}

/**
 * Fetch a fresh CSRF token from the backend.
 */
async function fetchCsrfToken(): Promise<string> {
  console.log("[CSRF] Fetching CSRF token from:", CSRF_ENDPOINT);
  console.log("[CSRF] Environment:", process.env.NODE_ENV);
  console.log("[CSRF] Base URL:", baseURL);

  try {
    // First check if token exists in cookie
    const cookieToken = getCsrfTokenFromCookie();
    if (cookieToken) {
      console.log("[CSRF] Using token from cookie");
      return cookieToken;
    }

    // Make the request
    const fullUrl = `${baseURL}${CSRF_ENDPOINT}`;
    console.log("[CSRF] Full URL:", fullUrl);

    const response = await axiosConfig.get(CSRF_ENDPOINT, {
      withCredentials: true,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    console.log("[CSRF] Response status:", response.status);
    console.log("[CSRF] Response headers:", response.headers);
    console.log("[CSRF] Response data:", response.data);

    const token = response.data?.csrfToken || response.data?.token;

    if (!token) {
      console.error("[CSRF] No token in response:", response.data);
      throw new Error("No CSRF token received from server");
    }

    console.log(
      "[CSRF] Token received successfully:",
      token.substring(0, 10) + "...",
    );
    csrfInitAttempts = 0;
    return token;
  } catch (error: any) {
    console.error("[CSRF] Failed to fetch token:", error.message);
    console.error("[CSRF] Error details:", error.response?.data || error);

    // Try to get token from cookie as fallback
    const cookieToken = getCsrfTokenFromCookie();
    if (cookieToken) {
      console.log("[CSRF] Using fallback token from cookie");
      return cookieToken;
    }

    throw error;
  }
}

/**
 * Get the current CSRF token.
 */
export async function getCsrfToken(): Promise<string> {
  // Check cookie first (most reliable)
  const cookieToken = getCsrfTokenFromCookie();
  if (cookieToken) {
    // If we have a cookie token but no memory token, store it
    if (!csrfToken) {
      csrfToken = cookieToken;
      console.log("[CSRF] Stored cookie token in memory");
    }
    return cookieToken;
  }

  // Return cached token if available
  if (csrfToken) {
    console.log(
      "[CSRF] Using cached token:",
      csrfToken.substring(0, 10) + "...",
    );
    return csrfToken;
  }

  // If already fetching, wait for it
  if (csrfTokenFetching) {
    console.log("[CSRF] Waiting for existing fetch...");
    return csrfTokenFetching;
  }

  // Start new fetch
  console.log("[CSRF] Starting new token fetch...");
  csrfTokenFetching = fetchCsrfToken()
    .then((token) => {
      csrfToken = token;
      console.log("[CSRF] Token stored in memory");
      return token;
    })
    .catch((error) => {
      console.error("[CSRF] Fetch failed:", error);
      // Try one more time from cookie
      const finalCookieToken = getCsrfTokenFromCookie();
      if (finalCookieToken) {
        console.log("[CSRF] Using final fallback from cookie");
        csrfToken = finalCookieToken;
        return finalCookieToken;
      }
      throw error;
    })
    .finally(() => {
      csrfTokenFetching = null;
    });

  return csrfTokenFetching;
}

/**
 * Clear the in-memory token.
 */
export function clearCsrfToken(): void {
  console.log("[CSRF] Clearing token");
  csrfToken = null;
  csrfTokenFetching = null;
  csrfInitAttempts = 0;
}

/**
 * Initialize CSRF token proactively.
 */
export async function initializeCsrf(): Promise<void> {
  console.log("[CSRF] Initializing...");
  try {
    const token = await getCsrfToken();
    console.log(
      "[CSRF] Initialization successful:",
      token ? "Token obtained" : "No token",
    );
  } catch (error) {
    console.error("[CSRF] Initialization failed:", error);
    // Don't throw - allow app to continue
  }
}

/**
 * ============================================================
 * REQUEST HELPERS
 * ============================================================
 */

const SAFE_METHODS = ["get", "head", "options"];
const CSRF_EXEMPT_ENDPOINTS = [
  CSRF_ENDPOINT,
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
];

function isCsrfEndpoint(config: AxiosRequestConfig): boolean {
  if (!config.url) return false;
  return CSRF_EXEMPT_ENDPOINTS.some((url) => config.url!.includes(url));
}

function isSafeMethod(config: AxiosRequestConfig): boolean {
  const method = config.method?.toLowerCase() || "get";
  return SAFE_METHODS.includes(method);
}

/**
 * ============================================================
 * REQUEST INTERCEPTOR
 * ============================================================
 */

axiosConfig.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    console.log(
      `[Axios] Request: ${config.method?.toUpperCase()} ${config.url}`,
    );

    // Skip CSRF for safe methods
    if (isSafeMethod(config)) {
      console.log(
        `[Axios] Skipping CSRF for safe method: ${config.method?.toUpperCase()} ${config.url}`,
      );
      return config;
    }

    // Skip CSRF for exempt endpoints
    if (isCsrfEndpoint(config)) {
      console.log(`[Axios] Skipping CSRF for exempt endpoint: ${config.url}`);
      return config;
    }

    console.log(
      `[Axios] CSRF required for: ${config.method?.toUpperCase()} ${config.url}`,
    );

    try {
      // Get the token
      const token = await getCsrfToken();

      if (token) {
        // Set the token in headers
        config.headers.set("X-CSRF-Token", token);
        console.log(
          `[Axios] CSRF token attached to ${config.method?.toUpperCase()} ${config.url}`,
        );
      } else {
        console.error(`[Axios] No CSRF token available for ${config.url}`);
        // In production, try to get from cookie one more time
        const cookieToken = getCsrfTokenFromCookie();
        if (cookieToken) {
          config.headers.set("X-CSRF-Token", cookieToken);
          console.log(
            `[Axios] Using cookie token as fallback for ${config.url}`,
          );
        } else {
          // We'll let the request proceed and handle 403 in response interceptor
          console.warn(
            `[Axios] Proceeding without CSRF token for ${config.url}`,
          );
        }
      }
    } catch (error) {
      console.error(
        `[Axios] Failed to get CSRF token for ${config.url}:`,
        error,
      );
      // In production, try cookie as fallback
      if (process.env.NODE_ENV === "production") {
        const cookieToken = getCsrfTokenFromCookie();
        if (cookieToken) {
          config.headers.set("X-CSRF-Token", cookieToken);
          console.log(
            `[Axios] Using cookie token as emergency fallback for ${config.url}`,
          );
          return config;
        }
      }
      // Reject to prevent request without CSRF token
      return Promise.reject(error);
    }

    return config;
  },
  (error) => {
    console.error("[Axios] Request interceptor error:", error);
    return Promise.reject(error);
  },
);

/**
 * ============================================================
 * RESPONSE INTERCEPTOR
 * ============================================================
 */

let isRefreshing = false;
type FailedRequest = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
};
let failedQueue: FailedRequest[] = [];

function processQueue(error: unknown | null): void {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(axiosConfig(request.config));
    }
  });
  failedQueue = [];
}

function isCsrfError(error: AxiosError): boolean {
  const status = error.response?.status;
  if (status !== 403) return false;

  const responseData = error.response?.data as
    | { message?: string; error?: string }
    | undefined;
  const message = String(
    responseData?.message || responseData?.error || "",
  ).toLowerCase();

  return (
    message.includes("csrf") ||
    message.includes("invalid csrf token") ||
    message.includes("csrf token mismatch") ||
    message.includes("ebadcsrftoken")
  );
}

function isAuthEndpoint(config: AxiosRequestConfig): boolean {
  const url = config.url || "";
  return [
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
    "/auth/logout",
  ].some((endpoint) => url.includes(endpoint));
}

axiosConfig.interceptors.response.use(
  (response) => {
    console.log(
      `[Axios] Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`,
    );
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _csrfRetry?: boolean;
      _authRetry?: boolean;
    };

    if (!originalRequest) {
      console.error("[Axios] No original request in error:", error);
      return Promise.reject(error);
    }

    const status = error.response?.status;
    console.log(
      `[Axios] Error: ${status} - ${error.message} for ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`,
    );

    /**
     * ========================================================
     * CSRF ERROR HANDLING
     * ========================================================
     */
    if (
      isCsrfError(error) &&
      !originalRequest._csrfRetry &&
      !isCsrfEndpoint(originalRequest)
    ) {
      console.warn("[CSRF] Token rejected, refreshing...");

      originalRequest._csrfRetry = true;
      clearCsrfToken();

      try {
        const newToken = await getCsrfToken();
        originalRequest.headers.set("X-CSRF-Token", newToken);
        console.log("[CSRF] Retrying with new token");
        return axiosConfig(originalRequest);
      } catch (csrfError) {
        console.error("[CSRF] Failed to refresh:", csrfError);
        return Promise.reject(csrfError);
      }
    }

    /**
     * ========================================================
     * AUTHENTICATION REFRESH
     * ========================================================
     */
    if (
      status === 401 &&
      !originalRequest._authRetry &&
      !isAuthEndpoint(originalRequest)
    ) {
      originalRequest._authRetry = true;

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

        try {
          const { useAuthStore } = await import("@/store/auth-store");
          useAuthStore.getState().clearUser();
        } catch (storeError) {
          console.error("[Auth] Failed to clear store:", storeError);
        }

        clearCsrfToken();

        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/signin"
        ) {
          window.location.href = "/signin";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

/**
 * ============================================================
 * AUTO-INITIALIZATION
 * ============================================================
 */

// Initialize CSRF immediately when this module loads in the browser
if (typeof window !== "undefined") {
  console.log("[CSRF] Browser detected, auto-initializing...");

  // Immediate initialization
  initializeCsrf().catch((error) => {
    console.error("[CSRF] Auto-initialization failed:", error);
  });

  // Also initialize after a delay as fallback
  setTimeout(() => {
    if (!csrfToken) {
      console.log("[CSRF] Delayed initialization fallback...");
      initializeCsrf().catch(console.error);
    }
  }, 1000);

  // Check again when tab becomes visible
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !csrfToken) {
      console.log("[CSRF] Tab visible, checking token...");
      initializeCsrf().catch(console.error);
    }
  });

  // Log cookie status
  setTimeout(() => {
    const cookieToken = getCsrfTokenFromCookie();
    console.log(
      "[CSRF] Cookie check after 2s:",
      cookieToken ? "Token found" : "No token",
    );
  }, 2000);
}

console.log("[Axios] Module loaded successfully");

export default axiosConfig;
