import type { Metadata } from 'next';
import { AuthPageLayout } from '@/components/auth/AuthPageLayout';
import { SigninCard } from '@/components/auth/SigninCard';

export const metadata: Metadata = {
  title: 'CampusPay · Sign In — Heightt',
  description:
    'Sign in to Heightt / CampusPay to manage payments, save, and access campus services.',
};

export default function SigninPage() {
  return (
    <AuthPageLayout>
      <SigninCard borderless />
    </AuthPageLayout>
  );
}
