import type { Metadata } from 'next';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ReceiptsPage } from '@/components/dashboard/pages/ReceiptsPage';

export const metadata: Metadata = {
  title: 'Receipts — Heightt',
  description: 'View and download your payment receipts and transaction history on Heightt.',
};

export default function Receipts() {
  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <DashboardHeader pageTitle="Receipts" />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="max-w-2xl mx-auto px-5 lg:px-7 py-5">
            <ReceiptsPage />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
