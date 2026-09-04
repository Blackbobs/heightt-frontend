import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PaymentSuccessView } from "@/components/payments/PaymentSuccessView";
import { HeighttLoader } from "@/components/ui/HeighttLoader";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Payment Successful — Heightt",
  description: "Your payment was successfully processed and confirmed.",
};

function SuccessFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <HeighttLoader label="Loading payment confirmation" />
      <span className="text-sm font-medium text-slate-500">
        Loading payment confirmation...
      </span>
    </div>
  );
}

export default function StandalonePaymentSuccessPage() {
  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#F8FAFC]">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
      {/* Brand Header */}
      <header className="relative z-10 flex w-full items-center justify-between border-b border-slate-200/80 px-5 py-5 sm:px-8 lg:px-12">
        <Logo />
        <Link
          href="/dashboard"
          className="rounded-xl border border-[#2563EB]/15 bg-white px-4 py-2 text-xs font-semibold text-[#2563EB] no-underline transition-colors hover:bg-blue-50"
        >
          Go to Dashboard
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <Suspense fallback={<SuccessFallback />}>
          <PaymentSuccessView isEmbeddedInDashboard={false} />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-200/60 py-6 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">
        <p>© {new Date().getFullYear()} Heightt. Secured Student Payment System.</p>
      </footer>
    </div>
  );
}
