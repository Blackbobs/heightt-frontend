"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  ArrowRight,
  Sparkles,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HeighttLoader } from "@/components/ui/HeighttLoader";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail, resendVerification } = useAuthStore();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (emailParam) {
      setEmail(emailParam);
    }

    if (!token) {
      setStatus("error");
      setMessage("No verification token found. Please check your email link.");
      return;
    }

    verifyEmail(token)
      .then((data) => {
        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
        if (data.email) {
          setEmail(data.email);
        }

        // Redirect to signin after 4 seconds
        setTimeout(() => {
          router.push("/signin?verified=true");
        }, 4000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Verification failed. Please try again.");
      });
  }, [searchParams, verifyEmail, router]);

  const handleResend = async () => {
    if (!email || isResending) return;

    setIsResending(true);
    setResendMessage(null);

    try {
      await resendVerification(email);
      setResendMessage({
        type: "success",
        text: "✅ Verification email resent successfully!",
      });
    } catch (error: any) {
      setResendMessage({
        type: "error",
        text: error.message || "Failed to resend verification email.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-[520px] transition-shadow duration-200">
      {/* Icon Badge */}
      <div className="flex justify-center mb-6">
        <div
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-500",
            status === "loading" && "bg-gradient-to-br from-[#eef4ff] to-[#dbeafe]",
            status === "success" && "bg-gradient-to-br from-green-50 to-emerald-100",
            status === "error" && "bg-gradient-to-br from-red-50 to-rose-100"
          )}
        >
          {status === "loading" && (
            <HeighttLoader label="Verifying your email" />
          )}
          {status === "success" && (
            <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-bounce" />
          )}
          {status === "error" && (
            <XCircle className="w-10 h-10 text-red-500" />
          )}
        </div>
      </div>

      {/* Title */}
      <h1
        className="text-2xl sm:text-[1.6rem] font-bold text-[#0b1a33] tracking-tight text-center mb-2"
      >
        {status === "loading" && "Verifying your email..."}
        {status === "success" && "Email Verified! ✅"}
        {status === "error" && "Verification Failed"}
      </h1>

      {/* Message */}
      <p
        className={cn(
          "text-[0.95rem] text-center mb-6 font-normal leading-snug",
          status === "loading" && "text-[#5b6d89]",
          status === "success" && "text-emerald-600",
          status === "error" && "text-red-600"
        )}
      >
        {status === "loading" && "Please wait while we verify your email address."}
        {status === "success" && message}
        {status === "error" && message}
      </p>

      {/* Success Card */}
      {status === "success" && (
        <div className="bg-emerald-50 rounded-xl p-5 mb-6 border border-emerald-200">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[0.9rem] font-semibold text-emerald-800">
                Your email has been verified!
              </p>
              <p className="text-[0.85rem] text-emerald-700 mt-1">
                You can now sign in to your Heightt account and start managing your finances.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[0.8rem] text-emerald-600">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Redirecting to sign in...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Card */}
      {status === "error" && (
        <div className="bg-red-50 rounded-xl p-5 mb-6 border border-red-200">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            </div>
            <div>
              <p className="text-[0.9rem] font-semibold text-red-800">
                Verification Failed
              </p>
              <p className="text-[0.85rem] text-red-700 mt-1">
                {message.includes("expired") 
                  ? "Your verification link has expired. Please request a new one."
                  : message.includes("already") 
                  ? "This email has already been verified."
                  : "There was an issue verifying your email. Please try again."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions - Only show for error or after success redirect */}
      {(status === "error" || status === "success") && (
        <div className="flex flex-col gap-3">
          {/* Resend Button (only for error) */}
          {status === "error" && (
            <>
              <button
                onClick={handleResend}
                disabled={isResending || !email}
                className={cn(
                  "w-full rounded-[40px] px-5 py-3.5 font-semibold text-[0.95rem] flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]",
                  isResending || !email
                    ? "bg-[#e8edf5] text-[#7a8ba3] cursor-not-allowed"
                    : "bg-[#1a5cff] text-white hover:bg-[#0f4ad0] hover:shadow-[0_8px_24px_rgba(26,92,255,0.25)] cursor-pointer"
                )}
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Resend Verification Email</span>
                  </>
                )}
              </button>

              {resendMessage && (
                <div
                  className={cn(
                    "p-2.5 rounded-lg text-sm text-center",
                    resendMessage.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  )}
                >
                  {resendMessage.text}
                </div>
              )}
            </>
          )}

          {/* Sign In Button */}
          <Link
            href="/signin"
            className="w-full rounded-[40px] px-5 py-3.5 bg-[#f0f4fc] text-[#1a5cff] font-semibold text-[0.95rem] flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#e2eaf6] active:scale-[0.98] border border-[#d6e2f0]"
          >
            <span>
              {status === "success" ? "Sign In Now" : "Back to Sign In"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Loading State */}
      {status === "loading" && (
        <div className="flex flex-col gap-3">
          <div className="bg-[#f8faff] rounded-xl p-5 border border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#e8edf5] animate-pulse" />
              <div className="flex-1">
                <div className="h-3 bg-[#e8edf5] rounded w-3/4 animate-pulse mb-2" />
                <div className="h-2 bg-[#e8edf5] rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-[0.85rem] text-[#5b6d89]">
            <Mail className="w-4 h-4" />
            <span>Checking verification...</span>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 text-[0.7rem] text-[#7a8ba3] text-center border-t border-[#edf2f7] pt-4 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>
          {status === "success" 
            ? "You're all set! Redirecting to sign in..."
            : status === "error"
            ? "Having trouble? Check your email or request a new link."
            : "This may take a few seconds..."}
        </span>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#f8faff] flex items-center justify-center p-4">
      <div className="w-full max-w-[520px] bg-white p-7 sm:p-9 md:p-10 rounded-[28px] sm:rounded-[32px] shadow-[0_20px_60px_rgba(0,20,40,0.08),0_8px_24px_rgba(0,0,0,0.02)] border border-slate-100">
        <Suspense 
          fallback={
            <div className="flex flex-col items-center justify-center py-12">
              <HeighttLoader className="mb-4" label="Loading email verification" />
              <p className="text-[#5b6d89]">Loading...</p>
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
