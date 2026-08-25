import type { Metadata } from "next";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { TransactionsPage } from "@/components/dashboard/pages/TransactionsPage";

export const metadata: Metadata = {
  title: "Transactions — Heightt",
  description: "View your full transaction history on Heightt.",
};

export default function Transactions() {
  return (
    <DashboardPageShell pageTitle="Transactions">
      <TransactionsPage />
    </DashboardPageShell>
  );
}