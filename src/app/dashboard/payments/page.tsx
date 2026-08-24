import type { Metadata } from "next";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { PaymentsPage } from "@/components/dashboard/pages/PaymentsPage";

export const metadata: Metadata = {
  title: "Payments — Heightt",
  description: "Pay your dues, levies, and fees securely with Heightt.",
};

export default function Payments() {
  return (
    <DashboardPageShell pageTitle="Payments">
      <PaymentsPage />
    </DashboardPageShell>
  );
}