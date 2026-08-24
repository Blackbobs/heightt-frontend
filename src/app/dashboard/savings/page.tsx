import type { Metadata } from 'next';
import { DashboardPageShell } from '@/components/dashboard/DashboardPageShell';
import { SavingsPage } from '@/components/dashboard/pages/SavingsPage';

export const metadata: Metadata = {
  title: 'Savings — Heightt',
  description: 'Track and manage your savings goals for dues and events.',
};

export default function Savings() {
  return (
    <DashboardPageShell pageTitle="Savings">
      <SavingsPage />
    </DashboardPageShell>
  );
}