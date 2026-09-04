"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

interface DashboardPageShellProps {
  pageTitle: string;
  children: ReactNode;
}

export function DashboardPageShell({
  pageTitle,
  children,
}: DashboardPageShellProps) {
  const router = useRouter();

  return (
    <div className="dashboard-shell flex h-screen overflow-hidden bg-[#F8FAFC] text-[#0B1020] transition-colors dark:bg-[#0B1020] dark:text-[#F8FAFC]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <DashboardHeader
          pageTitle={pageTitle}
          onNotificationClick={() => {
            router.push("/dashboard/notifications");
          }}
        />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
