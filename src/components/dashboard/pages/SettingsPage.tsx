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
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { useCurrentUser, useUpdateProfile } from '@/hooks/queries/useUser';

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
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.profile?.firstName || '');
    setLastName(user.profile?.lastName || '');
    setUsername(user.username || '');
    setPhone(user.profile?.phone || '');
    setBio(user.profile?.bio || '');
    setCountry(user.profile?.country || '');
    setState(user.profile?.state || '');
  }, [user]);

  const getInitials = () => {
    const f = firstName[0] || user?.profile?.firstName?.[0] || '';
    const l = lastName[0] || user?.profile?.lastName?.[0] || '';
    return `${f}${l}`.toUpperCase() || 'U';
  };

  const getStudentInfo = () => {
    const sp = user?.studentProfile;
    if (!sp) return 'Student';
    const level = sp.currentAcademicLevelId || '';
    const dept = sp.departmentId || '';
    if (level && dept) return `${level}L · ${dept}`;
    if (level) return `${level}L`;
    if (dept) return dept;
    return 'Student';
  };

  const handleSave = async () => {
    setSaveMessage(null);
    try {
      await updateProfile.mutateAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        phone: phone.trim() || undefined,
        bio: bio.trim() || undefined,
        country: country.trim() || undefined,
        state: state.trim() || undefined,
      });
      setSaveMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update profile. Please try again.';
      setSaveMessage({ type: 'error', text: message });
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

  const NavRow = ({ label, desc }: { label: string; desc?: string }) => (
    <div className="w-full flex items-center justify-between px-4 py-3.5">
      <div>
        <p className="text-[0.82rem] font-semibold text-[#1a1a2e]">{label}</p>
        {desc && <p className="text-[0.62rem] text-[#7a8ba3] mt-0.5">{desc}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-[#c8d0db]" />
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-[#1a5cff] animate-spin" />
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
          <p className="text-[0.68rem] text-[#7a8ba3]">{getStudentInfo()}</p>
          <p className="text-[0.65rem] text-[#1a5cff] mt-0.5 font-medium truncate">
            {user?.email}
          </p>
        </div>
      </div>

      {saveMessage && (
        <div
          className={cn(
            'rounded-xl px-4 py-3 text-sm font-medium flex items-start gap-2 border',
            saveMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700',
          )}
        >
          {saveMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          {saveMessage.text}
        </div>
      )}

      {/* Account — wired to PATCH /users/profile */}
      <Section title="Account" icon={User}>
        <Field label="First Name" value={firstName} onChange={setFirstName} placeholder="First name" />
        <Field label="Last Name" value={lastName} onChange={setLastName} placeholder="Last name" />
        <Field label="Username" value={username} onChange={setUsername} placeholder="Username" />
        <Field label="Email" value={user?.email || ''} onChange={() => {}} disabled />
        <Field label="Phone" value={phone} onChange={setPhone} placeholder="+234..." type="tel" />
        <Field label="Country" value={country} onChange={setCountry} placeholder="Country" />
        <Field label="State" value={state} onChange={setState} placeholder="State" />
        <div className="px-4 py-3.5">
          <label className="text-[0.62rem] text-[#7a8ba3] font-semibold uppercase tracking-wide">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a bit about yourself"
            rows={3}
            className="mt-1.5 w-full bg-transparent border-none outline-none text-[0.82rem] font-medium text-[#1a1a2e] placeholder-[#b0bac8] resize-none p-0"
          />
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
