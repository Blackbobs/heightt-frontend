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
let csrfTokenInitialized = false;
const CSRF_ENDPOINT = "/auth/csrf-token";

/**
 * Helper to get CSRF token from cookie
 * This is the primary source of truth for the CSRF token
 */
export function getCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") {
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
 * This will set the _csrf cookie which we'll read from.
 */
async function fetchCsrfToken(): Promise<string> {
  console.log("[CSRF] Fetching CSRF token from:", CSRF_ENDPOINT);

  try {
    // First check if token already exists in cookie
    const existingToken = getCsrfTokenFromCookie();
    if (existingToken) {
      console.log("[CSRF] Using existing token from cookie");
      csrfToken = existingToken;
      csrfTokenInitialized = true;
      return existingToken;
    }

    // Make the request to get a fresh token
    // This will set the _csrf cookie
    const response = await axiosConfig.get(CSRF_ENDPOINT, {
      withCredentials: true,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    console.log("[CSRF] Response status:", response.status);
    console.log("[CSRF] Response data:", response.data);

    // Read the token from the cookie that was set
    const cookieToken = getCsrfTokenFromCookie();

    if (cookieToken) {
      console.log(
        "[CSRF] Token received via cookie:",
        cookieToken.substring(0, 10) + "...",
      );
      csrfToken = cookieToken;
      csrfTokenInitialized = true;
      return cookieToken;
    }

    // If cookie wasn't set, use the response body as fallback
    const bodyToken = response.data?.csrfToken || response.data?.token;
    if (bodyToken) {
      console.log(
        "[CSRF] Token received via response body:",
        bodyToken.substring(0, 10) + "...",
      );
      // Try to set it as a cookie
      try {
        document.cookie = `_csrf=${bodyToken}; path=/; SameSite=Strict; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`;
        console.log("[CSRF] Token stored in cookie");
      } catch (cookieError) {
        console.warn("[CSRF] Could not set cookie:", cookieError);
      }
      csrfToken = bodyToken;
      csrfTokenInitialized = true;
      return bodyToken;
    }

    console.error("[CSRF] No token received");
    throw new Error("No CSRF token received from server");
  } catch (error: any) {
    console.error("[CSRF] Failed to fetch token:", error.message);
    console.error("[CSRF] Error details:", error.response?.data || error);

    // Try to get token from cookie as fallback
    const cookieToken = getCsrfTokenFromCookie();
    if (cookieToken) {
      console.log("[CSRF] Using fallback token from cookie");
      csrfToken = cookieToken;
      csrfTokenInitialized = true;
      return cookieToken;
    }

    throw error;
  }
}

/**
 * Get the current CSRF token.
 * Always reads from the cookie first.
 */
export async function getCsrfToken(): Promise<string> {
  // ALWAYS check the cookie first - this is the source of truth
  const cookieToken = getCsrfTokenFromCookie();
  if (cookieToken) {
    // Update memory cache
    if (!csrfToken || csrfToken !== cookieToken) {
      console.log("[CSRF] Updated token from cookie");
      csrfToken = cookieToken;
    }
    csrfTokenInitialized = true;
    return cookieToken;
  }

  // If no cookie token, use memory token as fallback
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
      csrfTokenInitialized = true;
      console.log("[CSRF] Token stored in memory");
      return token;
    })
    .catch((error) => {
      console.error("[CSRF] Fetch failed:", error);
      // Last attempt - check cookie one more time
      const finalCookieToken = getCsrfTokenFromCookie();
      if (finalCookieToken) {
        console.log("[CSRF] Using final fallback from cookie");
        csrfToken = finalCookieToken;
        csrfTokenInitialized = true;
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
  csrfTokenInitialized = false;
}

/**
 * Initialize CSRF token proactively.
 */
export async function initializeCsrf(): Promise<void> {
  console.log("[CSRF] Initializing...");

  // First check if we already have a token in cookie
  const cookieToken = getCsrfTokenFromCookie();
  if (cookieToken) {
    console.log(
      "[CSRF] Already have token in cookie:",
      cookieToken.substring(0, 10) + "...",
    );
    csrfToken = cookieToken;
    csrfTokenInitialized = true;
    return;
  }

  try {
    const token = await getCsrfToken();
    console.log(
      "[CSRF] Initialization successful:",
      token ? "Token obtained: " + token.substring(0, 10) + "..." : "No token",
    );
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

    // Skip CSRF for the CSRF token endpoint itself
    if (isCsrfEndpoint(config)) {
      console.log(`[Axios] Skipping CSRF for CSRF endpoint: ${config.url}`);
      return config;
    }

    console.log(
      `[Axios] CSRF required for: ${config.method?.toUpperCase()} ${config.url}`,
    );

    try {
      // Get the token - ALWAYS from cookie
      const token = await getCsrfToken();

      if (token) {
        // CRITICAL: Set the token in the header
        // The token MUST match what's in the _csrf cookie
        config.headers.set("X-CSRF-Token", token);
        console.log(
          `[Axios] ✅ CSRF token attached to ${config.method?.toUpperCase()} ${config.url}: ${token.substring(0, 10)}...`,
        );
      } else {
        console.error(`[Axios] ❌ No CSRF token available for ${config.url}`);
        return Promise.reject(new Error("CSRF token not available"));
      }
    } catch (error) {
      console.error(
        `[Axios] ❌ Failed to get CSRF token for ${config.url}:`,
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

// ... rest of the interceptors remain the same ...

/**
 * ============================================================
 * AUTO-INITIALIZATION
 * ============================================================
 */

if (typeof window !== "undefined") {
  console.log("[CSRF] 🌐 Browser detected, auto-initializing...");

  // Immediate initialization - this will fetch the token
  initializeCsrf().catch((error) => {
    console.error("[CSRF] Auto-initialization failed:", error);
  });

  // Also initialize after a delay as fallback
  setTimeout(() => {
    if (!csrfToken) {
      console.log("[CSRF] ⏰ Delayed initialization fallback...");
      initializeCsrf().catch(console.error);
    }
  }, 1000);

  // Log token status after 2 seconds
  setTimeout(() => {
    const token = getCsrfTokenFromCookie();
    console.log(
      "[CSRF] 📋 Token status after 2s:",
      token ? "✅ Token found in cookie" : "❌ No token in cookie",
    );
    if (csrfToken) {
      console.log(
        "[CSRF] 📋 Memory token:",
        csrfToken.substring(0, 10) + "...",
      );
    }
  }, 2000);
}

console.log("[Axios] Module loaded successfully");

export default axiosConfig;
