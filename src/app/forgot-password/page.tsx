import type { Metadata } from 'next';
import { AuthPageLayout } from '@/components/auth/AuthPageLayout';
import { ForgotPasswordCard } from '@/components/auth/ForgotPasswordCard';

export const metadata: Metadata = {
  title: 'Forgot Password — Heightt',
  description: 'Request a secure password reset link for your Heightt account.',
};

export default function ForgotPasswordPage() {
  return <AuthPageLayout><ForgotPasswordCard /></AuthPageLayout>;
}
