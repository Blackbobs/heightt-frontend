"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppPage =
    pathname === "/signup" ||
    pathname === "/signin" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/verify-email" ||
    pathname === "/verify-email-sent" ||
    pathname === "/onboarding" ||
    pathname.startsWith("/payment") ||
    pathname.startsWith("/payments/guest/callback") ||
    pathname.startsWith("/payments/guest/cancelled") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/dashboard");

  // Legal pages provide their own header, main content, and footer.
  const isLegalPage = pathname === "/privacy" || pathname === "/terms";

  if (isAppPage || isLegalPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
