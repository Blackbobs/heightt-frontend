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
 *
 * NEXT_PUBLIC_* variables are injected by Next.js at build time.
 *
 * Production:
 *   NEXT_PUBLIC_API_URL=https://heightt-backend.onrender.com/api/v1
 *
 * Development:
 *   NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
 *
 * The production fallback is useful if the Vercel environment
 * variable was accidentally omitted.
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

  /**
   * Required because authentication and CSRF protection use
   * cookies.
   */
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
 *
 * The backend should expose:
 *
 * GET /auth/csrf-token
 *
 * That endpoint should:
 *
 * 1. Generate/initialize the CSRF token.
 * 2. Set the CSRF cookie.
 * 3. Return the token in the response body.
 *
 * Example:
 *
 * {
 *   "csrfToken": "..."
 * }
 *
 * We keep the token in memory rather than localStorage.
 */

let csrfToken: string | null = null;

let csrfTokenFetching: Promise<string> | null = null;

/**
 * Endpoint used to obtain a CSRF token.
 */
const CSRF_ENDPOINT = "/auth/csrf-token";

/**
 * Fetch a fresh CSRF token from the backend.
 *
 * IMPORTANT:
 * We deliberately use axiosConfig here, but the request
 * interceptor explicitly skips this endpoint so that this
 * request does not recursively try to fetch another token.
 */
async function fetchCsrfToken(): Promise<string> {
  try {
    console.log("[CSRF] Fetching CSRF token...");

    const response = await axiosConfig.get(CSRF_ENDPOINT, {
      /**
       * Explicitly ensure cookies are included.
       */
      withCredentials: true,
    });

    const token = response.data?.csrfToken;

    if (!token) {
      console.error(
        "[CSRF] Backend responded without a csrfToken:",
        response.data,
      );

      throw new Error("No CSRF token received from server");
    }

    console.log("[CSRF] CSRF token received");

    return token;
  } catch (error) {
    console.error("[CSRF] Failed to fetch CSRF token:", error);

    throw error;
  }
}

/**
 * Get the current CSRF token.
 *
 * If we already have one in memory, reuse it.
 *
 * If another request is already fetching a token, wait for
 * that request instead of creating multiple simultaneous
 * CSRF requests.
 */
export async function getCsrfToken(): Promise<string> {
  /**
   * Existing token.
   */
  if (csrfToken) {
    return csrfToken;
  }

  /**
   * Another request is already fetching the token.
   */
  if (csrfTokenFetching) {
    return csrfTokenFetching;
  }

  /**
   * Start a new fetch.
   */
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

/**
 * Clear the in-memory token.
 *
 * This is useful when:
 *
 * - CSRF validation fails
 * - User logs out
 * - Session expires
 * - We need to obtain a fresh token
 */
export function clearCsrfToken(): void {
  csrfToken = null;
}

/**
 * ============================================================
 * REQUEST HELPERS
 * ============================================================
 */

/**
 * HTTP methods that don't normally mutate server state.
 *
 * CSRF protection is generally unnecessary for these methods.
 */
const SAFE_METHODS = ["get", "head", "options"];

/**
 * Requests that must NOT attempt to fetch a CSRF token.
 *
 * The CSRF endpoint itself is the important one here.
 *
 * Do NOT put /auth/login, /auth/register, /auth/logout,
 * or /auth/refresh here because those endpoints mutate
 * authentication state and your backend currently protects
 * them with CSRF.
 */
const CSRF_EXEMPT_ENDPOINTS = [CSRF_ENDPOINT];

/**
 * Check whether a request is the CSRF token endpoint.
 */
function isCsrfEndpoint(config: AxiosRequestConfig): boolean {
  if (!config.url) {
    return false;
  }

  return CSRF_EXEMPT_ENDPOINTS.some((url) =>
    config.url!.includes(url),
  );
}

/**
 * Check whether the request uses a safe HTTP method.
 */
function isSafeMethod(config: AxiosRequestConfig): boolean {
  const method = config.method?.toLowerCase() || "get";

  return SAFE_METHODS.includes(method);
}

/**
 * ============================================================
 * REQUEST INTERCEPTOR
 * ============================================================
 *
 * For every state-changing request:
 *
 * POST
 * PUT
 * PATCH
 * DELETE
 *
 * we obtain the CSRF token and attach:
 *
 * X-CSRF-Token: <token>
 */
axiosConfig.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    /**
     * Safe requests don't require CSRF.
     */
    if (isSafeMethod(config)) {
      return config;
    }

    /**
     * The CSRF endpoint itself doesn't require a CSRF token.
     *
     * Otherwise we'd have:
     *
     * POST login
     *   ↓
     * interceptor
     *   ↓
     * fetch CSRF
     *   ↓
     * interceptor
     *   ↓
     * fetch CSRF
     *   ↓
     * infinite recursion
     */
    if (isCsrfEndpoint(config)) {
      return config;
    }

    try {
      /**
       * Get the token.
       *
       * This will either:
       *
       * - return the cached token
       * - wait for an existing fetch
       * - fetch a new token
       */
      const token = await getCsrfToken();

      /**
       * Attach CSRF token.
       */
      config.headers.set("X-CSRF-Token", token);

      /**
       * Helpful debugging in development.
       */
      if (process.env.NODE_ENV !== "production") {
        console.log(
          `[CSRF] Added token to ${config.method?.toUpperCase()} ${config.url}`,
        );
      }
    } catch (error) {
      /**
       * IMPORTANT:
       *
       * Don't silently continue with a request that requires
       * CSRF if we couldn't obtain the token.
       *
       * Otherwise the backend will reject it anyway.
       */
      console.error(
        `[CSRF] Unable to obtain token for ${config.method?.toUpperCase()} ${config.url}`,
        error,
      );

      return Promise.reject(error);
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

/**
 * ============================================================
 * RESPONSE INTERCEPTOR
 * ============================================================
 *
 * Handles:
 *
 * 1. CSRF expiration/mismatch
 * 2. Authentication token/session expiration
 */
let isRefreshing = false;

type FailedRequest = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
};

let failedQueue: FailedRequest[] = [];

/**
 * Resolve/reject requests waiting for authentication refresh.
 */
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

/**
 * Determine whether an error is a CSRF validation error.
 */
function isCsrfError(error: AxiosError): boolean {
  const status = error.response?.status;

  if (status !== 403) {
    return false;
  }

  const responseData = error.response?.data as
    | {
        message?: string;
        error?: string;
      }
    | undefined;

  const message = String(
    responseData?.message ||
      responseData?.error ||
      "",
  ).toLowerCase();

  return (
    message.includes("csrf") ||
    message.includes("invalid csrf token") ||
    message.includes("csrf token mismatch") ||
    message.includes("ebadcsrftoken")
  );
}

/**
 * Determine whether the request is an authentication endpoint.
 */
function isAuthEndpoint(config: AxiosRequestConfig): boolean {
  const url = config.url || "";

  const authEndpoints = [
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
    "/auth/logout",
  ];

  return authEndpoints.some((endpoint) =>
    url.includes(endpoint),
  );
}

/**
 * ============================================================
 * RESPONSE INTERCEPTOR
 * ============================================================
 */

axiosConfig.interceptors.response.use(
  /**
   * Successful response.
   */
  (response) => {
    return response;
  },

  /**
   * Failed response.
   */
  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _csrfRetry?: boolean;
        _authRetry?: boolean;
      };

    /**
     * If Axios doesn't give us the original request,
     * just propagate the error.
     */
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    /**
     * ========================================================
     * CSRF ERROR
     * ========================================================
     *
     * The CSRF token may expire or become invalid.
     *
     * In that situation:
     *
     * 1. Clear cached token.
     * 2. Fetch a fresh token.
     * 3. Retry original request once.
     *
     * We MUST only retry once to avoid infinite loops.
     */
    if (
      isCsrfError(error) &&
      !originalRequest._csrfRetry &&
      !isCsrfEndpoint(originalRequest)
    ) {
      console.warn(
        "[CSRF] Server rejected CSRF token. Refreshing token...",
      );

      originalRequest._csrfRetry = true;

      /**
       * Remove cached token.
       */
      clearCsrfToken();

      try {
        /**
         * Fetch a fresh token.
         *
         * This also establishes/refreshes the CSRF cookie.
         */
        const newToken = await getCsrfToken();

        /**
         * Attach the new token.
         */
        originalRequest.headers.set(
          "X-CSRF-Token",
          newToken,
        );

        console.log(
          "[CSRF] Retrying original request with fresh token",
        );

        return axiosConfig(originalRequest);
      } catch (csrfError) {
        console.error(
          "[CSRF] Failed to refresh CSRF token:",
          csrfError,
        );

        return Promise.reject(csrfError);
      }
    }

    /**
     * ========================================================
     * AUTHENTICATION REFRESH
     * ========================================================
     *
     * Only handle 401 here.
     *
     * A 403 should NOT automatically trigger authentication
     * refresh because 403 normally means:
     *
     * - CSRF failure
     * - permission denied
     *
     * not expired authentication.
     */
    if (
      status === 401 &&
      !originalRequest._authRetry &&
      !isAuthEndpoint(originalRequest)
    ) {
      originalRequest._authRetry = true;

      /**
       * Another request is already refreshing.
       *
       * Queue this request.
       */
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
            config: originalRequest,
          });
        });
      }

      isRefreshing = true;

      try {
        /**
         * Refresh authentication session/token.
         *
         * IMPORTANT:
         * Because /auth/refresh is a POST endpoint and your
         * backend protects it with CSRF, the request interceptor
         * will automatically obtain and attach the CSRF token.
         */
        await axiosConfig.post("/auth/refresh");

        /**
         * Refresh succeeded.
         */
        processQueue(null);

        /**
         * Retry original request.
         */
        return axiosConfig(originalRequest);
      } catch (refreshError) {
        /**
         * Refresh failed.
         *
         * Reject all queued requests.
         */
        processQueue(refreshError);

        /**
         * Clear authentication state.
         */
        try {
          const { useAuthStore } =
            await import("@/store/auth-store");

          const state = useAuthStore.getState();

          state.clearUser();
        } catch (storeError) {
          console.error(
            "[Auth] Failed to clear auth store:",
            storeError,
          );
        }

        /**
         * Clear CSRF token as well.
         */
        clearCsrfToken();

        /**
         * Redirect browser to signin.
         */
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

    /**
     * Any other error is passed back to the caller.
     */
    return Promise.reject(error);
  },
);

/**
 * ============================================================
 * OPTIONAL INITIALIZATION
 * ============================================================
 *
 * You don't strictly need to call this on application startup.
 *
 * The first POST/PUT/PATCH/DELETE will automatically obtain
 * the CSRF token.
 *
 * If you want to eagerly initialize the token when the browser
 * loads, you can call:
 *
 *   initializeCsrf()
 *
 * from your client-side application.
 */
export async function initializeCsrf(): Promise<void> {
  try {
    await getCsrfToken();

    console.log("[CSRF] Initialization successful");
  } catch (error) {
    console.error(
      "[CSRF] Initialization failed:",
      error,
    );
  }
}

/**
 * ============================================================
 * DEFAULT EXPORT
 * ============================================================
 */

export default axiosConfig;