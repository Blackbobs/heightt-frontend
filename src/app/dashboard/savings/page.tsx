import type { Metadata } from 'next';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SavingsPage } from '@/components/dashboard/pages/SavingsPage';

export const metadata: Metadata = {
  title: 'Savings · CampusPay — Heightt',
  description: 'Track and manage your savings goals for campus dues and events.',
};

export default function Savings() {
  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <DashboardHeader pageTitle="Savings" />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-5 lg:px-7 py-5">
            <SavingsPage />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
