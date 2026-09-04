'use client'
// import type { Metadata } from 'next';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

// export const metadata: Metadata = {
//   title: 'Onboarding — Height',
//   description: 'Complete your profile and set up your student preferences on Heightt.',
// };

export default function OnboardingPage() {
   const { user, isAuthenticated, checkOnboardingStatus } = useAuthStore();
  const router = useRouter();
  const checkedUserRef = useRef<string | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isAuthenticated || !user) {
        router.replace("/signin");
        return;
      }

      // Guard against redundant re-runs for the same user.
      // Prevents the onboarding status API from being called
      // repeatedly when the user object reference changes.
      if (checkedUserRef.current === user.id) {
        return;
      }
      checkedUserRef.current = user.id;

      try {
        const status = await checkOnboardingStatus();
        if (status.onboardingCompleted) {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Error checking onboarding:", error);
      }
    };

    checkOnboarding();
  }, [isAuthenticated, user, router, checkOnboardingStatus]);

  if (!isAuthenticated || !user) {
    return null;
  }
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#F8FAFC] px-0 py-0 sm:px-6 sm:py-10">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#2563EB]/8 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-2xl items-start justify-center sm:min-h-0">
        <OnboardingFlow />
      </div>
    </main>
  );
}
