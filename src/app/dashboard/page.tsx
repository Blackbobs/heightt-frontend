"use client";

import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { MainDashboardView } from "@/components/dashboard/MainDashboardView";
import { HeighttLoader } from "@/components/ui/HeighttLoader";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
  const { user, isAuthenticated, isInitialized } = useAuthStore();

  // Show loading state while checking auth or fetching user
  if (!isInitialized || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F6F7F9] dark:bg-[#111315]">
        <div className="flex flex-col items-center gap-3">
          <HeighttLoader label="Loading dashboard" />
          <span className="text-sm text-slate-500 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // AuthGuard owns redirects for protected routes.
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <DashboardPageShell pageTitle="Overview">
      <MainDashboardView />
    </DashboardPageShell>
  );
}
