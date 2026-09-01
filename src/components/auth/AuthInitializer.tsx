// src/components/auth/AuthInitializer.tsx

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { HeighttLoader } from "@/components/ui/HeighttLoader";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initialize, restoreSession, isInitialized } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      console.log("AuthInitializer - Initializing auth...");

      try {
        await restoreSession();
      } finally {
        initialize();
      }

      console.log("AuthInitializer - Auth initialized");
    };

    initAuth();
    // Only run once on mount. Including `user` in the deps causes
    // re-runs whenever the user object reference changes (e.g. after
    // fetchCurrentUser or checkOnboardingStatus updates the store),
    // which can contribute to render loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialize, restoreSession]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <HeighttLoader label="Loading Heightt" />
          <span className="text-sm text-[#5b6d89] font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
