import type { Metadata } from 'next';
import { DashboardPageShell } from '@/components/dashboard/DashboardPageShell';
import { ProfilePage } from '@/components/dashboard/pages/ProfilePage';

export const metadata: Metadata = {
  title: 'Profile — Heightt',
  description: 'View and manage your profile on Heightt.',
};

export default function Profile() {
  return (
    <DashboardPageShell pageTitle="Profile">
      <ProfilePage />
    </DashboardPageShell>
  );
}