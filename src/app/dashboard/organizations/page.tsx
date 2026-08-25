import type { Metadata } from "next";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { OrganizationsPage } from "@/components/dashboard/pages/OrganizationsPage";

export const metadata: Metadata = {
  title: "Organizations — Heightt",
  description: "Browse and join organizations on your campus.",
};

export default function Organizations() {
  return (
    <DashboardPageShell pageTitle="Organizations">
      <OrganizationsPage />
    </DashboardPageShell>
  );
}