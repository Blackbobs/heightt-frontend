'use client';

import React, { useState } from 'react';
import {
  User, Bell, Shield, CreditCard, Smartphone, Moon, Sun,
  ChevronRight, LogOut, HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToggleSetting {
  label: string;
  desc: string;
  key: string;
}

const NOTIFICATION_SETTINGS: ToggleSetting[] = [
  { label: 'Payment Alerts',        desc: 'Get notified for every payment',       key: 'payment_alerts' },
  { label: 'Savings Reminders',     desc: 'Weekly reminders for your goals',      key: 'savings_reminders' },
  { label: 'Event Announcements',   desc: 'Upcoming events near your campus',     key: 'event_announcements' },
  { label: 'Departmental Updates',  desc: 'News from your department & faculty',  key: 'dept_updates' },
];

const SECURITY_SETTINGS: ToggleSetting[] = [
  { label: 'Transaction PIN',  desc: 'Require PIN for all payments',     key: 'txn_pin' },
  { label: 'Biometric Login',  desc: 'Use fingerprint or Face ID',       key: 'biometric' },
  { label: 'Login Alerts',     desc: 'Notify on new sign-in activity',   key: 'login_alerts' },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={cn(
        'relative inline-flex w-10 h-[22px] rounded-full transition-colors duration-200 border-none cursor-pointer flex-shrink-0',
        on ? 'bg-[#1a5cff]' : 'bg-[#c8d0db]'
      )}
    >
      <span
        className={cn(
          'absolute top-[3px] left-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200',
          on ? 'translate-x-[18px]' : 'translate-x-0'
        )}
      />
    </button>
  );
}

export function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    payment_alerts: true,
    savings_reminders: true,
    event_announcements: false,
    dept_updates: true,
    txn_pin: true,
    biometric: false,
    login_alerts: true,
    dark_mode: false,
  });

  const toggle = (key: string) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
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

  const ToggleRow = ({ label, desc, settingKey }: { label: string; desc: string; settingKey: string }) => (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div>
        <p className="text-[0.82rem] font-semibold text-[#1a1a2e]">{label}</p>
        <p className="text-[0.62rem] text-[#7a8ba3] mt-0.5">{desc}</p>
      </div>
      <Toggle on={!!toggles[settingKey]} onToggle={() => toggle(settingKey)} />
    </div>
  );

  const NavRow = ({ label, desc, onClick }: { label: string; desc?: string; onClick?: () => void }) => (
    <button
      className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#fafbff] transition-colors cursor-pointer border-none bg-transparent text-left"
      onClick={onClick}
    >
      <div>
        <p className="text-[0.82rem] font-semibold text-[#1a1a2e]">{label}</p>
        {desc && <p className="text-[0.62rem] text-[#7a8ba3] mt-0.5">{desc}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-[#c8d0db]" />
    </button>
  );

  return (
    <div className="space-y-5 pb-6">
      {/* Profile peek */}
      <div className="bg-white border border-[#e8ecf1] rounded-[20px] px-5 py-5 flex items-center gap-4">
        <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[#1a5cff] to-[#4a7aff] flex items-center justify-center text-white font-bold text-[1rem] flex-shrink-0">
          AO
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[0.92rem] font-bold text-[#1a1a2e]">Adaeze Okonkwo</p>
          <p className="text-[0.68rem] text-[#7a8ba3]">Student · 400L Computer Science</p>
          <p className="text-[0.65rem] text-[#1a5cff] mt-0.5 font-medium">adaeze.okonkwo@campus.edu</p>
        </div>
        <ChevronRight className="w-4 h-4 text-[#c8d0db] flex-shrink-0" />
      </div>

      {/* Account section */}
      <Section title="Account" icon={User}>
        <NavRow label="Edit Profile"        desc="Update your name and contact info" />
        <NavRow label="Change Password"     desc="Last changed 3 months ago" />
        <NavRow label="Linked Bank Account" desc="Access Bank ••••7821" />
        <NavRow label="Linked Cards"        desc="2 cards linked" />
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        {NOTIFICATION_SETTINGS.map((s) => (
          <ToggleRow key={s.key} label={s.label} desc={s.desc} settingKey={s.key} />
        ))}
      </Section>

      {/* Security */}
      <Section title="Security" icon={Shield}>
        {SECURITY_SETTINGS.map((s) => (
          <ToggleRow key={s.key} label={s.label} desc={s.desc} settingKey={s.key} />
        ))}
        <NavRow label="View Active Sessions" desc="1 device" />
      </Section>

      {/* Payments */}
      <Section title="Payments & Cards" icon={CreditCard}>
        <NavRow label="Manage Virtual Card"  desc="4258 •••• •••• 3847" />
        <NavRow label="Transaction Limits"   desc="Max ₦200,000 / day" />
        <NavRow label="Auto-Save Rules"      desc="3 active rules" />
      </Section>

      {/* App preferences */}
      <Section title="App Preferences" icon={Smartphone}>
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2">
            {toggles.dark_mode ? <Moon className="w-4 h-4 text-[#7a8ba3]" /> : <Sun className="w-4 h-4 text-[#7a8ba3]" />}
            <div>
              <p className="text-[0.82rem] font-semibold text-[#1a1a2e]">Dark Mode</p>
              <p className="text-[0.62rem] text-[#7a8ba3] mt-0.5">Switch between light and dark</p>
            </div>
          </div>
          <Toggle on={!!toggles.dark_mode} onToggle={() => toggle('dark_mode')} />
        </div>
        <NavRow label="Language"      desc="English (Nigeria)" />
        <NavRow label="App Version"   desc="v1.2.0 — Up to date" />
      </Section>

      {/* Support */}
      <Section title="Help & Support" icon={HelpCircle}>
        <NavRow label="Help Centre"         desc="FAQs and guides" />
        <NavRow label="Contact Support"     desc="We typically reply in 2h" />
        <NavRow label="Privacy Policy"      />
        <NavRow label="Terms of Service"    />
      </Section>

      {/* Sign Out */}
      <button className="w-full flex items-center justify-center gap-2 bg-[#fde8e8] text-[#c05a5a] rounded-[14px] py-3.5 text-[0.85rem] font-bold border-none cursor-pointer hover:bg-[#fbd5d5] active:scale-[0.98] transition-all">
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>

      <p className="text-center text-[0.62rem] text-[#b0bac8]">Heightt · v1.2.0</p>
    </div>
  );
}
