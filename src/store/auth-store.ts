// src/store/auth-store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  organizationsApi,
  OrganizationMembership,
} from "@/lib/api/organizations";
import {
  axiosConfig,
  clearCsrfToken,
  getCsrfToken,
} from "@/utils/axios-config";

export interface UserProfile {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  avatar?: string;
  gender?: string;
  dateOfBirth?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  bio?: string;
  onboardingStep: string;
  onboardingCompleted: boolean;
  verificationStatus: string;
}

export interface StudentProfile {
  institutionId: string;
  facultyId: string;
  departmentId: string;
  currentAcademicLevelId?: string;
  matricNumber?: string;
  academicStatus: string;
  onboardingCompleted: boolean;
  verificationStatus: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
  status: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
  studentProfile?: StudentProfile;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  token: string | null;
  userOrganizations: OrganizationMembership[];
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setUserOrganizations: (orgs: OrganizationMembership[]) => void;
  fetchUserOrganizations: () => Promise<void>;
  register: (data: RegisterData) => Promise<any>;
  login: (identifier: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  verifyEmail: (token: string) => Promise<any>;
  resendVerification: (email: string) => Promise<any>;
  checkOnboardingStatus: () => Promise<{
    needsOnboarding: boolean;
    onboardingCompleted: boolean;
    onboardingStep: string;
    redirectTo: string;
  }>;
  updateUserOnboardingStatus: (completed: boolean, step: string) => void;
  initialize: () => void;
  getToken: () => string | null;
  fetchCurrentUser: () => Promise<User | null>;
  setToken: (token: string | null) => void;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      token: null,
      userOrganizations: [],

      initialize: () => {
        set({ isInitialized: true });
      },

      getToken: () => {
        return get().token;
      },

      setToken: (token) => {
        set({ token });
        if (token) {
          axiosConfig.defaults.headers.common["Authorization"] =
            `Bearer ${token}`;
        } else {
          delete axiosConfig.defaults.headers.common["Authorization"];
        }
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      clearUser: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          userOrganizations: [],
        });
        clearCsrfToken();
        delete axiosConfig.defaults.headers.common["Authorization"];
        localStorage.removeItem("auth-storage");
      },

      setUserOrganizations: (orgs) => {
        set({ userOrganizations: orgs });
      },

      fetchUserOrganizations: async () => {
        try {
          const response = await organizationsApi.getUserOrganizations();
          set({ userOrganizations: response || [] });
        } catch (error) {
          console.error("Failed to fetch user organizations:", error);
        }
      },

      fetchCurrentUser: async () => {
        try {
          console.log("fetchCurrentUser - Making API call to /auth/me...");
          const response = await axiosConfig.get("/auth/me");
          console.log(
            "fetchCurrentUser - Full user data received:",
            response.data,
          );

          // Store the complete user data including studentProfile
          set({
            user: response.data,
            isAuthenticated: true,
          });

          return response.data;
        } catch (error) {
          console.error("fetchCurrentUser - Error:", error);
          // If unauthorized, clear the user
          if ((error as any)?.response?.status === 401) {
            set({
              user: null,
              isAuthenticated: false,
              token: null,
              userOrganizations: [],
            });
            delete axiosConfig.defaults.headers.common["Authorization"];
            clearCsrfToken();
          }
          return null;
        }
      },

      // ============================================
      // REGISTER - NO AUTO-LOGIN
      // ============================================
      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          await getCsrfToken();
          const response = await axiosConfig.post("/auth/register", {
            email: data.email,
            username: data.username,
            password: data.password,
          });

          console.log("Registration response:", response.data);

          set({ isLoading: false });
          return response.data;
        } catch (error: any) {
          console.error("Registration error:", error);
          set({ isLoading: false });
          throw error.response?.data || error;
        }
      },

      // ============================================
      // LOGIN - Sets HTTP-only cookies AND stores token
      // ============================================
      login: async (identifier: string, password: string) => {
        set({ isLoading: true });
        try {
          console.log("[Auth] Login started for:", identifier);

          // CRITICAL: Get CSRF token before login
          console.log("[Auth] 🔄 Getting CSRF token before login...");
          let csrfToken: string;
          try {
            csrfToken = await getCsrfToken();
            console.log(
              "[Auth] ✅ CSRF token obtained:",
              csrfToken.substring(0, 10) + "...",
            );
          } catch (csrfError) {
            console.error("[Auth] ❌ Failed to get CSRF token:", csrfError);
            // Try one more time with a delay
            await new Promise((resolve) => setTimeout(resolve, 500));
            csrfToken = await getCsrfToken();
            console.log(
              "[Auth] ✅ CSRF token on retry:",
              csrfToken.substring(0, 10) + "...",
            );
          }

          console.log("[Auth] 📤 Making login request...");
          const response = await axiosConfig.post("/auth/login", {
            identifier,
            password,
          });

          console.log("[Auth] ✅ Login response received");
          console.log("[Auth] Response status:", response.status);

          // Get user data and access token from response
          const { accessToken, ...userData } = response.data;

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            token: accessToken || null,
          });

          if (accessToken) {
            axiosConfig.defaults.headers.common["Authorization"] =
              `Bearer ${accessToken}`;
          }

          await get().fetchUserOrganizations();

          console.log(
            "[Auth] ✅ Login successful for:",
            userData.email || userData.username,
          );
          return response.data;
        } catch (error: any) {
          console.error("[Auth] ❌ Login error:", error);
          console.error("[Auth] Error response:", error.response?.data);
          set({ isLoading: false });
          throw error.response?.data || error;
        }
      },

      // ============================================
      // LOGOUT
      // ============================================
      logout: async () => {
        console.log("logout - Starting logout process...");

        try {
          console.log("logout - Calling /auth/logout");
          await axiosConfig.post("/auth/logout");
          console.log("logout - Logout API call successful");
        } catch (error: any) {
          console.error("logout - API error:", error);
        } finally {
          console.log("logout - Clearing local state...");

          set({
            user: null,
            isAuthenticated: false,
            token: null,
            userOrganizations: [],
          });

          delete axiosConfig.defaults.headers.common["Authorization"];
          clearCsrfToken();
          localStorage.removeItem("auth-storage");

          console.log("logout - State cleared successfully");
        }
      },

      refreshToken: async () => {
        try {
          await axiosConfig.post("/auth/refresh");
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            token: null,
            userOrganizations: [],
          });
          delete axiosConfig.defaults.headers.common["Authorization"];
          clearCsrfToken();
          throw error;
        }
      },

      verifyEmail: async (token: string) => {
        try {
          const response = await axiosConfig.post("/auth/verify-email", {
            token,
          });
          return response.data;
        } catch (error: any) {
          throw error.response?.data || error;
        }
      },

      resendVerification: async (email: string) => {
        try {
          const response = await axiosConfig.post("/auth/resend-verification", {
            email,
          });
          return response.data;
        } catch (error: any) {
          throw error.response?.data || error;
        }
      },

      checkOnboardingStatus: async () => {
        const { user, isAuthenticated } = get();

        if (!isAuthenticated || !user) {
          return {
            needsOnboarding: true,
            onboardingCompleted: false,
            onboardingStep: "PERSONAL_INFO",
            redirectTo: "/signin",
          };
        }

        const hasOnboardingCompleted =
          user.profile?.onboardingCompleted || false;
        const onboardingStep = user.profile?.onboardingStep || "PERSONAL_INFO";

        if (hasOnboardingCompleted) {
          return {
            needsOnboarding: false,
            onboardingCompleted: true,
            onboardingStep: "COMPLETED",
            redirectTo: "/dashboard",
          };
        }

        try {
          const response = await axiosConfig.get("/onboarding/status");
          const status = response.data;

          if (user.profile) {
            const newOnboardingStep = status.onboardingStep || onboardingStep;
            const newOnboardingCompleted =
              status.onboardingCompleted || hasOnboardingCompleted;

            // Only update the store if values actually changed.
            // Creating a new user object reference on every call
            // triggers useEffect dependencies (user) in AuthGuard,
            // OnboardingPage, and AuthInitializer, causing an infinite loop.
            if (
              newOnboardingStep !== user.profile.onboardingStep ||
              newOnboardingCompleted !== user.profile.onboardingCompleted
            ) {
              set({
                user: {
                  ...user,
                  profile: {
                    ...user.profile,
                    onboardingStep: newOnboardingStep,
                    onboardingCompleted: newOnboardingCompleted,
                  },
                },
              });
            }
          }

          return {
            needsOnboarding: !status.onboardingCompleted,
            onboardingCompleted: status.onboardingCompleted || false,
            onboardingStep: status.onboardingStep || onboardingStep,
            redirectTo: status.onboardingCompleted
              ? "/dashboard"
              : "/onboarding",
          };
        } catch (error: unknown) {
          const status = (error as { response?: { status?: number } })?.response
            ?.status;
          if (status === 404) {
            console.warn(
              "Onboarding status endpoint not found, using profile data",
            );
          } else {
            console.error("Failed to check onboarding status:", error);
          }

          return {
            needsOnboarding: !hasOnboardingCompleted,
            onboardingCompleted: hasOnboardingCompleted,
            onboardingStep: onboardingStep,
            redirectTo: hasOnboardingCompleted ? "/dashboard" : "/onboarding",
          };
        }
      },

      updateUserOnboardingStatus: (completed: boolean, step: string) => {
        const { user } = get();
        if (!user) return;

        set({
          user: {
            ...user,
            profile: {
              ...user.profile,
              onboardingStep: step,
              onboardingCompleted: completed,
            },
          },
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    },
  ),
);
