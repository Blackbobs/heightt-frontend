import type { Metadata } from 'next';
import { DashboardPageShell } from '@/components/dashboard/DashboardPageShell';
import { WalletPage } from '@/components/dashboard/pages/WalletPage';

export const metadata: Metadata = {
  title: 'Wallet — Heightt',
  description: 'Manage your Heightt wallet — fund, withdraw, and track your balance.',
};

export default function Wallet() {
  return (
    <DashboardPageShell pageTitle="Wallet">
      <WalletPage />
    </DashboardPageShell>
  );
}