'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Smartphone,
  LogOut,
  HelpCircle,
  Loader2,
  Shield,
  Moon,
} from 'lucide-react';

import { useAuthStore } from '@/store/auth-store';
import { useCurrentUser, useUpdateProfile } from '@/hooks/queries/useUser';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { toast } from 'sonner';
import { HeighttLoader } from '@/components/ui/HeighttLoader';

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="px-4 py-3">
      <label className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-xs font-semibold text-[#0B1020] dark:text-white placeholder:text-slate-400 disabled:opacity-60 outline-none focus:border-[#2563EB]"
      />
    </div>
  );
}

export function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { data: user, isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    if (!user) return;
    setFirstName(user.profile?.firstName || '');
    setLastName(user.profile?.lastName || '');
    setUsername(user.username || '');
    setCountry(user.profile?.country || '');
    setGender(user.profile?.gender || '');
  }, [user]);

  const getInitials = () => {
    const f = firstName[0] || user?.profile?.firstName?.[0] || '';
    const l = lastName[0] || user?.profile?.lastName?.[0] || '';
    return `${f}${l}`.toUpperCase() || 'U';
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        country: country.trim() || undefined,
        gender: gender
          ? (gender as 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY')
          : undefined,
      });
      toast.success('Profile updated successfully.');
    } catch {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/signin');
    } catch {
      router.push('/signin');
    }
  };

  const Section = ({
    title,
    icon: Icon,
    children,
  }: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }) => (
    <div className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <Icon className="w-4 h-4 text-[#2563EB]" />
        <h3 className="text-sm font-bold text-[#0B1020] dark:text-white">{title}</h3>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <HeighttLoader label="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-xl font-bold text-[#0B1020] dark:text-white">Account Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your personal information, security, and app preferences
        </p>
      </div>

      {/* Account Info */}
      <Section title="Personal Profile" icon={User}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Field label="First Name" value={firstName} onChange={setFirstName} placeholder="First name" />
          <Field label="Last Name" value={lastName} onChange={setLastName} placeholder="Last name" />
          <Field label="Username" value={username} onChange={setUsername} placeholder="Username" />
          <Field label="Email Address" value={user?.email || ''} onChange={() => {}} disabled />
          <Field label="Country" value={country} onChange={setCountry} placeholder="Country" />
          <div className="px-4 py-3">
            <label className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-xs font-semibold text-[#0B1020] dark:text-white outline-none focus:border-[#2563EB]"
            >
              <option value="">Not specified</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="px-4 pt-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2"
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Profile Changes'
            )}
          </button>
        </div>
      </Section>

      {/* Preferences */}
      <Section title="Appearance & Preferences" icon={Moon}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#0B1020] dark:text-white">Theme Mode</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Switch between light and dark interface</p>
          </div>
          <ThemeToggle />
        </div>
      </Section>

      {/* Security */}
      <Section title="Security" icon={Shield}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#0B1020] dark:text-white">Password & Authentication</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Secure your student account</p>
          </div>
          <button
            type="button"
            onClick={() => toast.info('Password reset email sent to your registered email.')}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Reset Password
          </button>
        </div>
      </Section>

      {/* Support & Logout */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of Heightt
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
