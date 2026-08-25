import type { Metadata } from 'next';
import { DashboardPageShell } from '@/components/dashboard/DashboardPageShell';
import { ReceiptsPage } from '@/components/dashboard/pages/ReceiptsPage';

export const metadata: Metadata = {
  title: 'Receipts — Heightt',
  description: 'View and download your payment receipts and transaction history on Heightt.',
};

export default function Receipts() {
  return (
    <DashboardPageShell pageTitle="Receipts">
      <ReceiptsPage />
    </DashboardPageShell>
  );
}