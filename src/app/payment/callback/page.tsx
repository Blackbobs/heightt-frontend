import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { PaymentCallbackView } from "@/components/payments/PaymentCallbackView";
import { HeighttLoader } from "@/components/ui/HeighttLoader";

export const metadata: Metadata = {
  title: "Confirming Payment — Heightt",
  description: "Confirming your payment status.",
};

function CallbackFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <HeighttLoader label="Loading payment status" />
      <span className="text-sm font-medium text-slate-500">
        Loading payment status...
      </span>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col justify-between">
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-2xl text-[#1a1a2e] no-underline"
        >
          <Building2 className="w-7 h-7 text-[#1a5cff]" strokeWidth={1.8} />
          <span>Heightt</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <Suspense fallback={<CallbackFallback />}>
          <PaymentCallbackView />
        </Suspense>
      </main>

      <footer className="w-full text-center py-6 text-xs text-slate-400 border-t border-slate-200/60">
        <p>
          © {new Date().getFullYear()} Heightt. Secured Student Payment System.
        </p>
      </footer>
    </div>
  );
}
