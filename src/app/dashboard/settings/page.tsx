import type { Metadata } from 'next';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SettingsPage } from '@/components/dashboard/pages/SettingsPage';

export const metadata: Metadata = {
  title: 'Settings · CampusPay — Heightt',
  description: 'Manage your CampusPay account settings, notifications, and security.',
};

export default function Settings() {
  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <DashboardHeader pageTitle="Settings" />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-5 lg:px-7 py-5">
            <SettingsPage />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
