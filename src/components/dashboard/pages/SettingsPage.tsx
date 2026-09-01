'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Smartphone,
  ChevronRight,
  LogOut,
  HelpCircle,
  Loader2,
  Share2,
} from 'lucide-react';

import { useAuthStore } from '@/store/auth-store';
import { useCurrentUser, useUpdateProfile } from '@/hooks/queries/useUser';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { toast } from 'sonner';
import { HeighttLoader } from '@/components/ui/HeighttLoader';

// Commented out — not needed for current release
// const NOTIFICATION_SETTINGS = [
//   { label: 'Payment Alerts', desc: 'Get notified for every payment', key: 'payment_alerts' },
//   { label: 'Savings Reminders', desc: 'Weekly reminders for your goals', key: 'savings_reminders' },
//   { label: 'Event Announcements', desc: 'Upcoming events near your campus', key: 'event_announcements' },
//   { label: 'Departmental Updates', desc: 'News from your department & faculty', key: 'dept_updates' },
// ];
//
// const SECURITY_SETTINGS = [
//   { label: 'Transaction PIN', desc: 'Require PIN for all payments', key: 'txn_pin' },
//   { label: 'Biometric Login', desc: 'Use fingerprint or Face ID', key: 'biometric' },
//   { label: 'Login Alerts', desc: 'Notify on new sign-in activity', key: 'login_alerts' },
// ];

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
    <div className="px-4 py-3.5">
      <label className="text-[0.62rem] text-[#7a8ba3] font-semibold uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="mt-1.5 w-full bg-transparent border-none outline-none text-[0.82rem] font-semibold text-[#1a1a2e] placeholder-[#b0bac8] disabled:text-[#7a8ba3] p-0"
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
          ? gender as 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
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
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-[8px] bg-[#eef3ff] flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-[#1a5cff]" />
        </div>
        <h3 className="text-[0.88rem] font-bold text-[#1a1a2e]">{title}</h3>
      </div>
      <div className="bg-white border border-[#e8ecf1] rounded-[16px] divide-y divide-[#f0f2f5] overflow-hidden">
        {children}
      </div>
    </div>
  );

  const NavRow = ({ label, desc, onClick }: { label: string; desc?: string; onClick?: () => void }) => (
    <div className="w-full flex items-center justify-between px-4 py-3.5">
      <div>
        <p className="text-[0.82rem] font-semibold text-[#1a1a2e]">{label}</p>
        {desc && <p className="text-[0.62rem] text-[#7a8ba3] mt-0.5">{desc}</p>}
      </div>
      {onClick ? (
        <button
          onClick={onClick}
          className="text-[0.62rem] font-semibold text-[#1a5cff] bg-[#eef3ff] px-2.5 py-1 rounded-lg border-none cursor-pointer"
        >
          Install
        </button>
      ) : (
        <ChevronRight className="w-4 h-4 text-[#c8d0db]" />
      )}
    </div>
  );

  function InstallAppRow() {
    const { canInstall, isIOS, isStandalone, triggerInstall } = usePWAInstall();

    // Already installed — don't show anything
    if (isStandalone) return null;

    // iOS: show persistent instructions banner
    if (isIOS) {
      return (
        <div className="px-4 py-4">
          <div className="rounded-xl bg-[#eef3ff] border border-[#c5d4ff] px-4 py-3.5 flex gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Share2 className="w-4 h-4 text-[#1a5cff]" />
            </div>
            <div className="min-w-0">
              <p className="text-[0.82rem] font-bold text-[#1a1a2e]">Add to Home Screen</p>
              <p className="text-[0.68rem] text-[#5b6d89] mt-0.5 leading-relaxed">
                Tap <span className="font-semibold text-[#1a5cff]">Share</span> in Safari → scroll down → tap{' '}
                <span className="font-semibold text-[#1a5cff]">Add to Home Screen</span> → tap{' '}
                <span className="font-semibold text-[#1a5cff]">Add</span>.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Android / Chrome: show install button
    if (!canInstall) return null;

    return (
      <NavRow
        label="Add to Home Screen"
        desc="Install Heightt for quick access"
        onClick={triggerInstall}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <HeighttLoader label="Loading settings" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Profile summary */}
      <div className="bg-white border border-[#e8ecf1] rounded-[20px] px-5 py-5 flex items-center gap-4">
        <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[#1a5cff] to-[#4a7aff] flex items-center justify-center text-white font-bold text-[1rem] flex-shrink-0">
          {getInitials()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[0.92rem] font-bold text-[#1a1a2e] truncate">
            {firstName || lastName
              ? `${firstName} ${lastName}`.trim()
              : user?.username || 'User'}
          </p>
          <p className="text-[0.65rem] text-[#1a5cff] mt-0.5 font-medium truncate">
            {user?.email}
          </p>
        </div>
      </div>


      {/* Account — wired to PATCH /users/profile */}
      <Section title="Account" icon={User}>
        <Field label="First Name" value={firstName} onChange={setFirstName} placeholder="First name" />
        <Field label="Last Name" value={lastName} onChange={setLastName} placeholder="Last name" />
        <Field label="Username" value={username} onChange={setUsername} placeholder="Username" />
        <Field label="Email" value={user?.email || ''} onChange={() => {}} disabled />
        <Field label="Country" value={country} onChange={setCountry} placeholder="Country" />
        <div className="px-4 py-3.5">
          <label className="text-[0.62rem] text-[#7a8ba3] font-semibold uppercase tracking-wide">
            Gender
          </label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1.5 w-full bg-transparent border-none outline-none text-[0.82rem] font-semibold text-[#1a1a2e] p-0">
            <option value="">Not specified</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
          </select>
        </div>
        <div className="px-4 py-4">
          <button
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="w-full py-3 rounded-xl bg-[#1a5cff] hover:bg-[#0f4ad0] text-white text-[0.82rem] font-bold border-none cursor-pointer disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
        {/* Commented out — not needed for current release */}
        {/* <NavRow label="Linked Bank Account" desc="Access Bank ••••7821" /> */}
        {/* <NavRow label="Linked Cards" desc="2 cards linked" /> */}
        {/* <NavRow label="Change Password" desc="Last changed 3 months ago" /> */}
      </Section>

      {/* Commented out — not needed for current release */}
      {/* <Section title="Notifications" icon={Bell}>
        {NOTIFICATION_SETTINGS.map((s) => (
          <ToggleRow key={s.key} label={s.label} desc={s.desc} settingKey={s.key} />
        ))}
      </Section> */}

      {/* <Section title="Security" icon={Shield}>
        {SECURITY_SETTINGS.map((s) => (
          <ToggleRow key={s.key} label={s.label} desc={s.desc} settingKey={s.key} />
        ))}
        <NavRow label="View Active Sessions" desc="1 device" />
      </Section> */}

      {/* <Section title="Payments & Cards" icon={CreditCard}>
        <NavRow label="Manage Virtual Card" desc="4258 •••• •••• 3847" />
        <NavRow label="Transaction Limits" desc="Max ₦200,000 / day" />
        <NavRow label="Auto-Save Rules" desc="3 active rules" />
      </Section> */}

      <Section title="App Preferences" icon={Smartphone}>
        <NavRow label="App Version" desc="v1.2.0" />
        <InstallAppRow />
      </Section>

      <Section title="Help & Support" icon={HelpCircle}>
        <NavRow label="Help Centre" desc="FAQs and guides" />
        <NavRow label="Contact Support" desc="We typically reply in 2h" />
      </Section>

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 bg-[#fde8e8] text-[#c05a5a] rounded-[14px] py-3.5 text-[0.85rem] font-bold border-none cursor-pointer hover:bg-[#fbd5d5] active:scale-[0.98] transition-all"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>

      <p className="text-center text-[0.62rem] text-[#b0bac8]">Heightt · v1.2.0</p>
    </div>
  );
}
