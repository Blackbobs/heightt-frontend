import type { Metadata } from 'next';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PaymentsPage } from '@/components/dashboard/pages/PaymentsPage';

export const metadata: Metadata = {
  title: 'Payments · CampusPay — Heightt',
  description: 'Pay your campus dues, levies, and fees securely with CampusPay.',
};

export default function Payments() {
  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <DashboardHeader pageTitle="Payments" />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-5 lg:px-7 py-5">
            <PaymentsPage />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
