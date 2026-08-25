// src/utils/axios-config.ts

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://heightt-backend.onrender.com/api/v1"
    : "http://localhost:3000/api/v1");

console.log("[Axios] Base URL:", baseURL);

type CsrfRetryConfig = InternalAxiosRequestConfig & {
  _csrfRetry?: boolean;
};

export const axiosConfig: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30_000,
});

/**
 * ============================================================
 * CSRF TOKEN MANAGEMENT
 * ============================================================
 */

let csrfToken: string | null = null;
let csrfTokenFetching: Promise<string> | null = null;
const CSRF_ENDPOINT = "/auth/csrf-token";
const CSRF_HEADER = "X-CSRF-Token";

/**
 * Helper to get CSRF token from a non-HttpOnly cookie, when the backend
 * exposes one. The JSON response body remains the primary source of truth.
 */
export function getCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  try {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, ...valueParts] = cookie.trim().split("=");
      if (name === "_csrf") {
        const decoded = decodeURIComponent(valueParts.join("="));
        return decoded;
      }
    }
    return null;
  } catch (error) {
    console.error("[CSRF] Error reading cookie:", error);
    return null;
  }
}

/**
 * Fetch a fresh CSRF token from the backend.
 * The backend returns csrfToken in JSON and may also set cookies.
 */
async function fetchCsrfToken(forceRefresh = false): Promise<string> {
  try {
    if (!forceRefresh) {
      const existingToken = csrfToken || getCsrfTokenFromCookie();
      if (existingToken) {
        csrfToken = existingToken;
        return existingToken;
      }
    }

    const response = await axiosConfig.get(CSRF_ENDPOINT, {
      withCredentials: true,
    });

    const bodyToken = response.data?.csrfToken || response.data?.token;
    if (bodyToken) {
      csrfToken = bodyToken;
      return bodyToken;
    }

    const cookieToken = getCsrfTokenFromCookie();
    if (cookieToken) {
      csrfToken = cookieToken;
      return cookieToken;
    }

    throw new Error("No CSRF token received from server");
  } catch (error: any) {
    console.error("[CSRF] Failed to fetch token:", error.response?.data || error);
    throw error;
  }
}

/**
 * Get the current CSRF token.
 */
export async function getCsrfToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh && csrfToken) {
    return csrfToken;
  }

  const cookieToken = !forceRefresh ? getCsrfTokenFromCookie() : null;
  if (cookieToken) {
    csrfToken = cookieToken;
    return cookieToken;
  }

  if (!forceRefresh && csrfTokenFetching) {
    return csrfTokenFetching;
  }

  csrfTokenFetching = fetchCsrfToken(forceRefresh)
    .then((token) => {
      csrfToken = token;
      return token;
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
  csrfToken = null;
  csrfTokenFetching = null;
}

/**
 * Initialize CSRF token proactively.
 */
export async function initializeCsrf(): Promise<void> {
  try {
    await getCsrfToken();
  } catch (error) {
    console.error("[CSRF] Initialization failed:", error);
  }
}

/**
 * ============================================================
 * REQUEST HELPERS
 * ============================================================
 */

const SAFE_METHODS = ["get", "head", "options"];
const CSRF_EXEMPT_ENDPOINTS = [CSRF_ENDPOINT];

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
    config.withCredentials = true;

    if (isSafeMethod(config)) {
      return config;
    }

    if (isCsrfEndpoint(config)) {
      return config;
    }

    try {
      const token = await getCsrfToken();
      config.headers.set(CSRF_HEADER, token);
    } catch (error) {
      console.error(
        `[Axios] Failed to get CSRF token for ${config.url}:`,
        error,
      );
      return Promise.reject(error);
    }

    return config;
  },
  (error) => {
    console.error("[Axios] Request interceptor error:", error);
    return Promise.reject(error);
  },
);

axiosConfig.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CsrfRetryConfig | undefined;
    const data = error.response?.data as
      | { code?: string; error?: string; message?: string }
      | undefined;
    const csrfInvalid =
      data?.code === "CSRF_TOKEN_INVALID" ||
      data?.error === "CSRF_TOKEN_INVALID" ||
      data?.message === "CSRF_TOKEN_INVALID";

    if (
      csrfInvalid &&
      originalRequest &&
      !originalRequest._csrfRetry &&
      !isSafeMethod(originalRequest) &&
      !isCsrfEndpoint(originalRequest)
    ) {
      originalRequest._csrfRetry = true;
      clearCsrfToken();
      const freshToken = await getCsrfToken(true);
      originalRequest.withCredentials = true;
      originalRequest.headers.set(CSRF_HEADER, freshToken);
      return axiosConfig(originalRequest);
    }

    return Promise.reject(error);
  },
);

/**
 * ============================================================
 * AUTO-INITIALIZATION
 * ============================================================
 */

if (typeof window !== "undefined") {
  initializeCsrf().catch((error) => {
    console.error("[CSRF] Auto-initialization failed:", error);
  });
}

console.log("[Axios] Module loaded successfully");

export default axiosConfig;
