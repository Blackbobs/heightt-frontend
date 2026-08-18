// src/app/dashboard/page.tsx

"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MainDashboardView } from "@/components/dashboard/MainDashboardView";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, isAuthenticated, token, fetchCurrentUser, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  console.log("DashboardPage - isAuthenticated:", isAuthenticated);
  console.log("DashboardPage - user from store:", user);
  console.log("DashboardPage - token:", !!token);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // If not authenticated, redirect to signin
    if (!isAuthenticated && !authLoading) {
      console.log("DashboardPage - Not authenticated, redirecting to signin");
      router.replace("/signin");
      return;
    }

    // If we have a token but no user, try to fetch the user
    if (token && !user && !authLoading) {
      console.log("Token exists but no user, fetching...");
      fetchCurrentUser();
    }
  }, [isAuthenticated, token, user, router, fetchCurrentUser, authLoading]);

  // Show loading state while checking auth or fetching user
  if (authLoading || (!user && token)) {
    return (
      <div className="flex h-screen bg-[#f0f2f5] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#1a5cff] animate-spin" />
          <span className="text-sm text-[#5b6d89] font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render (should redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <DashboardHeader pageTitle="Dashboard" user={user} />
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