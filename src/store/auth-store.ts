import { axiosConfig, clearCsrfToken, getCsrfToken } from "@/utils/axios-config";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
  hasCompletedOnboarding: boolean;
  onboardingStep: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  register: (data: RegisterData) => Promise<any>;
  login: (identifier: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  verifyEmail: (token: string) => Promise<any>;
  resendVerification: (email: string) => Promise<any>;
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

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      clearUser: () => {
        set({ user: null, isAuthenticated: false });
        clearCsrfToken();
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          await getCsrfToken();
          const response = await axiosConfig.post("/auth/register", {
            email: data.email,
            username: data.username,
            password: data.password,
          });
          const user = response.data;
          set({ user, isAuthenticated: true, isLoading: false });
          return response.data;
        } catch (error: any) {
          set({ isLoading: false });
          throw error.response?.data || error;
        }
      },

      login: async (identifier: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await axiosConfig.post("/auth/login", {
            identifier,
            password,
          });
          const { user } = response.data;
          set({ user, isAuthenticated: true, isLoading: false });
          return response.data;
        } catch (error: any) {
          set({ isLoading: false });
          throw error.response?.data || error;
        }
      },

      logout: async () => {
        try {
          await axiosConfig.post("/auth/logout");
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({ user: null, isAuthenticated: false });
          clearCsrfToken();
        }
      },

      refreshToken: async () => {
        try {
          await axiosConfig.post("/auth/refresh");
        } catch (error) {
          set({ user: null, isAuthenticated: false });
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
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);