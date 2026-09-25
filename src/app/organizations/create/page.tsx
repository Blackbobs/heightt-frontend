import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Building2, ShieldCheck } from "lucide-react";
import { OrganizationRequestForm } from "@/components/organizations/OrganizationRequestForm";

export const metadata: Metadata = {
  title: "Create an organization",
  description: "Submit a community organization for review on Heightt.",
  robots: { index: false, follow: false },
};

export default function CreateOrganizationPage() {
  return (
    <main className="bg-[#F8FAFC] px-5 py-12 sm:py-16 dark:bg-[#0B1020]">
      <div className="mx-auto max-w-4xl">
        <Link href="/dashboard/organizations" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2563EB] dark:text-slate-300">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to organizations
        </Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <div className="flex size-11 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#2563EB] dark:border-blue-900 dark:bg-blue-950/30">
              <Building2 className="size-5" aria-hidden="true" />
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-[#0B1020] sm:text-4xl dark:text-white">Create your organization</h1>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Request a club, association, sports group, religious community, or special-interest organization. Your existing academic memberships stay unchanged.
            </p>
            <div className="mt-6 flex items-start gap-3 border-t border-slate-200 pt-5 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#2563EB]" aria-hidden="true" />
              <p>Every request is reviewed before it appears in Heightt or receives organization-admin access.</p>
            </div>
          </div>
          <OrganizationRequestForm />
        </div>
      </div>
    </main>
  );
}
