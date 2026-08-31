import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthPageLayout } from '@/components/auth/AuthPageLayout';
import { ResetPasswordCard } from '@/components/auth/ResetPasswordCard';

export const metadata: Metadata = {
  title: 'Reset Password — Heightt',
  description: 'Create a new password for your Heightt account.',
};

export default function ResetPasswordPage() {
  return (
    <AuthPageLayout>
      <Suspense fallback={<div className="min-h-64 flex items-center justify-center text-sm text-slate-500">Loading secure reset form…</div>}>
        <ResetPasswordCard />
      </Suspense>
    </AuthPageLayout>
  );
}
