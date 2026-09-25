"use client";

import Link from "next/link";
import { ArrowRight, FileText, Mail, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

const requestSteps = [
  {
    icon: FileText,
    title: "Submit your organization",
    description: "Tell us its name, type, scope, and campus relationship.",
  },
  {
    icon: ShieldCheck,
    title: "Platform review",
    description: "Heightt verifies the request before activating admin access.",
  },
  {
    icon: Mail,
    title: "Receive your access link",
    description: "Once approved, we email you the correct admin dashboard link.",
  },
];

export function CreateOrganizationSection() {
  const { isAuthenticated, user } = useAuthStore();
  const needsOnboarding = user ? !user.profile?.onboardingCompleted : false;
  const href = !isAuthenticated
    ? "/signup"
    : needsOnboarding
      ? "/onboarding"
      : "/organizations/create";
  const label = !isAuthenticated
    ? "Create an account to start"
    : needsOnboarding
      ? "Complete onboarding to start"
      : "Create an organization";

  return (
    <section id="for-executives" className="border-y border-slate-800 bg-[#0B1020] px-5 py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <div className="max-w-xl">
          <h2 className="text-3xl font-black leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl">
            Give your community a financial home.
          </h2>
          <p className="mt-6 text-base leading-7 text-slate-300 sm:text-lg">
            Start a club, association, sports group, fellowship, or special-interest organization on Heightt. Submit the details once and our platform team will review your request.
          </p>
          <Link href={href} className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]">
            {label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Your existing academic memberships remain unchanged.
          </p>
        </div>
        <div className="border-y border-slate-700 lg:border-l lg:border-y-0 lg:pl-12">
          <div className="flex items-end justify-between gap-4 border-b border-slate-800 py-5 lg:pt-0">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-400">Request process</p>
              <h3 className="mt-2 text-xl font-bold text-white">From request to admin access</h3>
            </div>
            <span className="hidden font-mono text-xs text-slate-500 sm:block">3 steps</span>
          </div>
          <ol>
            {requestSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="grid grid-cols-[2rem_2.5rem_1fr] gap-3 border-b border-slate-800 py-5 last:border-b-0">
                  <span className="pt-2 font-mono text-xs text-slate-600">0{index + 1}</span>
                  <span className="flex size-10 items-center justify-center rounded-lg border border-slate-700 bg-[#131B2E] text-blue-400">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <strong className="block text-sm font-semibold text-white">{step.title}</strong>
                    <span className="mt-1 block text-sm leading-6 text-slate-400">{step.description}</span>
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="flex items-start gap-3 border-t border-slate-700 py-5 text-xs leading-5 text-slate-400">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-hidden="true" />
            <p>
              Organizations stay private and admin access stays inactive until approval.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
