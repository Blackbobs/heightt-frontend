import type { Metadata } from "next";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { NotificationsPage } from "@/components/dashboard/pages/NotificationsPage";

export const metadata: Metadata = {
  title: "Notifications — Heightt",
  description: "View and manage your notifications on Heightt.",
};

export default function Notifications() {
  return (
    <DashboardPageShell pageTitle="Notifications">
      <NotificationsPage />
    </DashboardPageShell>
  );
}