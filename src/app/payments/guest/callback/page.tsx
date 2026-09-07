import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GuestPaymentCallbackView } from "@/components/payments/guest/GuestPaymentCallbackView";
import { HeighttLoader } from "@/components/ui/HeighttLoader";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Confirming Guest Payment — Heightt",
  description: "Confirming your guest payment status.",
  robots: { index: false, follow: false, noarchive: true },
};

function CallbackFallback() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <HeighttLoader label="Loading payment status" />
      <span className="text-sm font-medium text-slate-500">
        Loading payment status...
      </span>
    </div>
  );
}

export default function GuestPaymentCallbackPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#F8FAFC]">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <Logo className="[&_img]:h-12 sm:[&_img]:h-14" />
        <Link
          href="/payments/guest"
          className="rounded-xl border border-[#2563EB]/15 bg-white px-4 py-2 text-xs font-semibold text-[#2563EB] no-underline transition-colors hover:bg-blue-50"
        >
          Back to checkout
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-6">
        <Suspense fallback={<CallbackFallback />}>
          <GuestPaymentCallbackView />
        </Suspense>
      </main>

      <footer className="w-full border-t border-slate-200/60 py-6 text-center text-xs text-slate-400">
        <p>
          © {new Date().getFullYear()} Heightt. Secured Student Payment System.
        </p>
      </footer>
    </div>
  );
}