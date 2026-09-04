// src/app/dashboard/page.tsx

"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MainDashboardView } from "@/components/dashboard/MainDashboardView";
import { HeighttLoader } from "@/components/ui/HeighttLoader";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();

  // Show loading state while checking auth or fetching user
  if (!isInitialized || !user) {
    return (
      <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0B1020] items-center justify-center">
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
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0B1020] text-[#0B1020] dark:text-[#F8FAFC] overflow-hidden transition-colors">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <DashboardHeader pageTitle="Dashboard" user={user} onNotificationClick={() => {
          router.push("/dashboard/notifications");
        }} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <MainDashboardView />
            <div className="h-6 lg:h-0" />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
