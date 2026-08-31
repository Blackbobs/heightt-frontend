'use client';

import { type FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { getPasswordResetError, requestPasswordReset } from '@/lib/api/password-reset';

export function ForgotPasswordCard() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Enter your email address.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await requestPasswordReset(email);
      setMessage(result.message || 'If an account exists for that email, a password reset link has been sent.');
      setEmail('');
    } catch (requestError) {
      setError(getPasswordResetError(requestError, 'Unable to process your request. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full bg-white sm:bg-transparent p-6 sm:p-0 rounded-3xl sm:rounded-none border border-slate-200/90 sm:border-none shadow-xl shadow-slate-900/5 sm:shadow-none" role="main" aria-labelledby="forgot-password-heading">
      <div className="hidden sm:block mb-6"><Logo /></div>
      <h1 id="forgot-password-heading" className="text-2xl sm:text-[1.6rem] font-bold text-[#0b1a33] tracking-tight mb-1.5">Reset your password</h1>
      <p className="text-[0.92rem] text-[#5b6d89] mb-6 leading-relaxed">Enter your account email and we’ll send you a secure reset link.</p>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">{error}</div>}

      {message ? (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm leading-relaxed flex gap-2.5" role="status">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
          <button type="button" onClick={() => setMessage('')} className="w-full rounded-[40px] px-5 py-3.5 text-sm font-semibold text-[#1a5cff] bg-[#eef3ff] hover:bg-[#dce8ff] transition-colors">Send another link</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="resetEmail" className="text-[0.75rem] font-bold text-[#1f2a44] tracking-wide uppercase opacity-80">Email address</label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input id="resetEmail" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={255} value={email} onChange={(event) => setEmail(event.target.value)} disabled={submitting} placeholder="you@example.com" className="w-full bg-white sm:bg-[#f8faff] border-[1.5px] border-[#cbd5e1] rounded-[14px] pl-10 pr-3.5 py-3 text-[0.95rem] font-medium text-[#0b1a33] outline-none focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10 disabled:opacity-60" />
          </div>
          <button type="submit" disabled={submitting} className="mt-5 w-full border-none rounded-[40px] px-5 py-3.5 sm:py-4 text-base font-semibold text-white bg-[#1a5cff] hover:bg-[#0f4ad0] shadow-[0_8px_24px_rgba(26,92,255,0.25)] disabled:opacity-70 flex items-center justify-center gap-2">
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}

      <div className="mt-6 pt-5 border-t border-[#edf2f7] text-center">
        <Link href="/signin" className="inline-flex items-center gap-1.5 text-sm text-[#1a5cff] font-semibold hover:underline"><ArrowLeft className="w-4 h-4" /> Back to sign in</Link>
      </div>
    </div>
  );
}
