import type { Metadata } from 'next';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { WalletPage } from '@/components/dashboard/pages/WalletPage';

export const metadata: Metadata = {
  title: 'Wallet · CampusPay — Heightt',
  description: 'Manage your campus wallet — fund, withdraw, and track your balance.',
};

export default function Wallet() {
  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <DashboardHeader pageTitle="Wallet" />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-5 lg:px-7 py-5">
            <WalletPage />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
