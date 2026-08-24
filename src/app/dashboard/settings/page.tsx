import type { Metadata } from 'next';
import { DashboardPageShell } from '@/components/dashboard/DashboardPageShell';
import { SettingsPage } from '@/components/dashboard/pages/SettingsPage';

export const metadata: Metadata = {
  title: 'Settings — Heightt',
  description: 'Manage your Heightt account settings, notifications, and security.',
};

export default function Settings() {
  return (
    <DashboardPageShell pageTitle="Settings">
      <SettingsPage />
    </DashboardPageShell>
  );
}