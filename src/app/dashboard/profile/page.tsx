import type { Metadata } from 'next';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ProfilePage } from '@/components/dashboard/pages/ProfilePage';
import { useRouter } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Profile — Heightt',
  description: 'View and manage your profile on Heightt.',
};

export default function Profile() {

  const router = useRouter()
  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <DashboardHeader pageTitle="Profile" onNotificationClick={() => {
          // Custom notification click handler
          router.push("/notifications");
        }} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="max-w-2xl mx-auto px-5 lg:px-7 py-5">
            <ProfilePage />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
