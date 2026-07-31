import type { Metadata } from 'next';
import { AppLayout } from '@/components/layout/AppLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Heightt — Student Finance Platform',
  description: 'Student Finance Made Simple. Save towards your dues, pay securely, buy event tickets, and stay connected with your student community — all in one place.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}