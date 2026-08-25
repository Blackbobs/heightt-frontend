// src/components/auth/AuthInitializer.tsx

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initialize, fetchCurrentUser, token, user, isInitialized } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      console.log("AuthInitializer - Initializing auth...");
      initialize();

      // If we have a token but no user, fetch the user
      if (token && !user) {
        console.log("AuthInitializer - Token exists, fetching user...");
        await fetchCurrentUser();
      }

      console.log("AuthInitializer - Auth initialized");
    };

    initAuth();
    // Only run once on mount. Including `user` in the deps causes
    // re-runs whenever the user object reference changes (e.g. after
    // fetchCurrentUser or checkOnboardingStatus updates the store),
    // which can contribute to render loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialize, token, fetchCurrentUser]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#1a5cff] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[#5b6d89] font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}