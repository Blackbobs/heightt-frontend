'use client';

import React, { useState } from 'react';
import {
  User, GraduationCap, Mail, Phone, MapPin, Edit3, Camera,
  BookOpen, Award, CreditCard, CheckCircle2,
} from 'lucide-react';

const BADGES = [
  { label: 'Early Adopter',    color: 'bg-amber-100 text-amber-700' },
  { label: 'Dues Champion',    color: 'bg-[#eef3ff] text-[#1a5cff]' },
  { label: 'Event Goer',       color: 'bg-violet-100 text-violet-700' },
  { label: 'Savings Starter',  color: 'bg-emerald-100 text-emerald-700' },
];

const ACTIVITY = [
  { label: 'Payments Made',  value: '12', icon: CreditCard,    color: 'text-[#c05a5a]', bg: 'bg-[#fde8e8]' },
  { label: 'Events Attended',value: '5',  icon: Award,         color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Goals Completed', value: '2', icon: CheckCircle2,  color: 'text-[#0f7b4a]', bg: 'bg-[#e6f7f0]' },
  { label: 'Courses Ongoing', value: '6', icon: BookOpen,      color: 'text-amber-600',  bg: 'bg-amber-50'  },
];

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#fafbff] transition-colors">
      <div className="w-8 h-8 rounded-[8px] bg-[#f0f2f5] flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-[#6b7a8f]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[0.62rem] text-[#7a8ba3] font-medium uppercase tracking-wide">{label}</p>
        <p className="text-[0.82rem] font-semibold text-[#1a1a2e] mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [phone, setPhone] = useState('08012345678');
  const [address, setAddress] = useState('Block B, Hall 3, University Campus');

  return (
    <div className="space-y-5 pb-6">
      {/* Profile Hero */}
      <div className="bg-gradient-to-br from-[#1a5cff] to-[#0f4ad0] rounded-[22px] px-6 py-8 text-white relative overflow-hidden text-center">
        <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

        {/* Avatar */}
        <div className="relative inline-block mb-4">
          <div className="w-[72px] h-[72px] rounded-full bg-white/20 flex items-center justify-center text-[1.6rem] font-extrabold mx-auto">
            AO
          </div>
          <button
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white flex items-center justify-center border-none cursor-pointer shadow-md hover:scale-105 transition-transform"
            aria-label="Change profile photo"
          >
            <Camera className="w-3.5 h-3.5 text-[#1a5cff]" />
          </button>
        </div>

        <h1 className="text-[1.25rem] font-extrabold tracking-tight">Adaeze Okonkwo</h1>
        <p className="text-[0.72rem] text-white/70 mt-1">400 Level · Computer Science</p>
        <p className="text-[0.68rem] text-white/50 mt-0.5">Matric No: CSC/20/0047</p>

        {/* Membership tag */}
        <div className="inline-flex items-center gap-1.5 mt-4 bg-white/15 px-4 py-1.5 rounded-full">
          <CheckCircle2 className="w-3 h-3 text-emerald-300" />
          <span className="text-[0.68rem] font-semibold text-white">Verified Student · Since 2020</span>
        </div>
      </div>

      {/* Activity stats */}
      <div className="grid grid-cols-2 gap-3">
        {ACTIVITY.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-[#e8ecf1] rounded-[16px] px-4 py-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 ${bg}`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <p className="text-[1.1rem] font-extrabold text-[#1a1a2e] leading-none">{value}</p>
              <p className="text-[0.6rem] text-[#7a8ba3] mt-0.5 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Personal Info */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[0.9rem] font-semibold text-[#1a1a2e]">Personal Information</h3>
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-1.5 text-[0.7rem] font-semibold text-[#1a5cff] bg-[#eef3ff] px-3 py-1.5 rounded-full border-none cursor-pointer hover:bg-[#dce8ff] transition-colors"
          >
            <Edit3 className="w-3 h-3" />
            {editMode ? 'Save' : 'Edit'}
          </button>
        </div>
        <div className="bg-white border border-[#e8ecf1] rounded-[16px] divide-y divide-[#f0f2f5] overflow-hidden">
          <InfoRow icon={User}          label="Full Name"           value="Adaeze Okonkwo" />
          <InfoRow icon={Mail}          label="Email Address"        value="adaeze.okonkwo@campus.edu" />
          <InfoRow icon={GraduationCap} label="Department"           value="Computer Science" />
          <InfoRow icon={GraduationCap} label="Level / Faculty"      value="400L · Faculty of Science" />
          {editMode ? (
            <div className="px-4 py-3.5 space-y-3">
              <div>
                <label className="text-[0.62rem] text-[#7a8ba3] font-medium uppercase tracking-wide block mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-[#1a5cff]/40 rounded-[10px] px-3 py-2 text-[0.82rem] text-[#1a1a2e] outline-none focus:border-[#1a5cff]"
                />
              </div>
              <div>
                <label className="text-[0.62rem] text-[#7a8ba3] font-medium uppercase tracking-wide block mb-1">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-[#1a5cff]/40 rounded-[10px] px-3 py-2 text-[0.82rem] text-[#1a1a2e] outline-none focus:border-[#1a5cff]"
                />
              </div>
            </div>
          ) : (
            <>
              <InfoRow icon={Phone}  label="Phone Number" value={phone} />
              <InfoRow icon={MapPin} label="Address"      value={address} />
            </>
          )}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-[0.9rem] font-semibold text-[#1a1a2e] mb-3">My Badges</h3>
        <div className="flex flex-wrap gap-2">
          {BADGES.map((b) => (
            <span key={b.label} className={`text-[0.72rem] font-semibold px-4 py-2 rounded-full ${b.color}`}>
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
