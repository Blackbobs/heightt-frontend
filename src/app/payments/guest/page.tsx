import type { Metadata } from "next";
import { GuestCheckoutPage } from "@/components/payments/guest/GuestCheckoutPage";

export const metadata: Metadata = {
  title: "Pay as a Guest — Heightt",
  description:
    "Pay your student due as a guest without creating an account. Find your institution, select your due, and pay securely.",
  alternates: { canonical: "/payments/guest" },
};

export default function GuestPaymentsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020]">
      <div className="hero-grid pointer-events-none absolute inset-x-0 top-0 h-72 opacity-30" aria-hidden="true" />
      <GuestCheckoutPage />
    </div>
  );
}