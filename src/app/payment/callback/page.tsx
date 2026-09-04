import { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentCallbackView } from "@/components/payments/PaymentCallbackView";
import { HeighttLoader } from "@/components/ui/HeighttLoader";
import { Logo } from "@/components/ui/Logo";

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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Logo className="[&_img]:h-12 sm:[&_img]:h-14" />
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
