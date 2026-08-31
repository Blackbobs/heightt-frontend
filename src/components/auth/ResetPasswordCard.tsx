'use client';

import { type FormEvent, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { getPasswordResetError, resetPassword } from '@/lib/api/password-reset';

export function ResetPasswordCard() {
  const token = useSearchParams().get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!token) return setError('This password reset link is invalid. Request a new link.');
    if (newPassword.length < 8) return setError('Password must be at least 8 characters long.');
    if (newPassword.length > 128) return setError('Password must not exceed 128 characters.');
    if (newPassword !== confirmPassword) return setError('The passwords do not match.');

    setSubmitting(true);
    try {
      await resetPassword(token, newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(true);
      window.history.replaceState({}, '', '/reset-password');
    } catch (requestError) {
      setError(getPasswordResetError(requestError, 'This reset link is invalid or has expired.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full bg-white sm:bg-transparent p-6 sm:p-0 rounded-3xl sm:rounded-none border border-slate-200/90 sm:border-none shadow-xl shadow-slate-900/5 sm:shadow-none" role="main" aria-labelledby="reset-password-heading">
      <div className="hidden sm:block mb-6"><Logo /></div>
      <h1 id="reset-password-heading" className="text-2xl sm:text-[1.6rem] font-bold text-[#0b1a33] tracking-tight mb-1.5">{success ? 'Password updated' : 'Create a new password'}</h1>
      <p className="text-[0.92rem] text-[#5b6d89] mb-6 leading-relaxed">{success ? 'Your password was changed and your existing sessions were signed out.' : 'Choose a new password for your Heightt account.'}</p>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">{error}</div>}

      {success ? (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm leading-relaxed flex gap-2.5" role="status"><CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /><span>Your password was reset successfully. Sign in again using your new password.</span></div>
          <Link href="/signin" className="flex w-full items-center justify-center rounded-[40px] px-5 py-3.5 text-base font-semibold text-white bg-[#1a5cff] hover:bg-[#0f4ad0] no-underline">Sign in</Link>
        </div>
      ) : token ? (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <PasswordField id="newPassword" label="New password" value={newPassword} setValue={setNewPassword} visible={showPassword} setVisible={setShowPassword} />
          <PasswordField id="confirmPassword" label="Confirm new password" value={confirmPassword} setValue={setConfirmPassword} visible={showPassword} setVisible={setShowPassword} />
          <p className="text-xs text-[#64748b]">Use between 8 and 128 characters.</p>
          <button type="submit" disabled={submitting} className="w-full border-none rounded-[40px] px-5 py-3.5 sm:py-4 text-base font-semibold text-white bg-[#1a5cff] hover:bg-[#0f4ad0] shadow-[0_8px_24px_rgba(26,92,255,0.25)] disabled:opacity-70 flex items-center justify-center gap-2">
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}{submitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">This password reset link is missing its token or is invalid.</div>
          <Link href="/forgot-password" className="flex w-full items-center justify-center rounded-[40px] px-5 py-3.5 text-base font-semibold text-white bg-[#1a5cff] hover:bg-[#0f4ad0] no-underline">Request a new link</Link>
        </div>
      )}
    </div>
  );
}

function PasswordField({ id, label, value, setValue, visible, setVisible }: { id: string; label: string; value: string; setValue: (value: string) => void; visible: boolean; setVisible: (value: boolean) => void }) {
  return (
    <div>
      <label htmlFor={id} className="text-[0.75rem] font-bold text-[#1f2a44] tracking-wide uppercase opacity-80">{label}</label>
      <div className="relative mt-1.5">
        <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input id={id} name={id} type={visible ? 'text' : 'password'} autoComplete="new-password" required minLength={8} maxLength={128} value={value} onChange={(event) => setValue(event.target.value)} className="w-full bg-white sm:bg-[#f8faff] border-[1.5px] border-[#cbd5e1] rounded-[14px] pl-10 pr-11 py-3 text-[0.95rem] font-medium text-[#0b1a33] outline-none focus:border-[#1a5cff] focus:bg-white focus:ring-4 focus:ring-[#1a5cff]/10" />
        <button type="button" onClick={() => setVisible(!visible)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600" aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
      </div>
    </div>
  );
}
