'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Receipt, Sparkles, GraduationCap, Coins, ShieldCheck, Bell } from 'lucide-react';
import { Logo } from '../ui/Logo';

const STATS = [
  { value: '12,400+', label: 'Students' },
  { value: '200+', label: 'Orgs' },
  { value: '₦480M+', label: 'Collected' },
];

const DUES = [
  { label: 'Dept. Dues', pct: 100, color: 'from-blue-500 to-emerald-400', textColor: 'text-emerald-300' },
  { label: 'Faculty Week', pct: 0, color: 'from-amber-500 to-amber-300', textColor: 'text-amber-300' },
  { label: 'SUG Dues', pct: 0, color: 'from-violet-500 to-purple-400', textColor: 'text-violet-300' },
];

export function AuthHeroBanner() {
  const [mounted, setMounted] = useState(false);
  const [filledPcts, setFilledPcts] = useState([0, 0, 0]);

  useEffect(() => {
    setMounted(true);
    // stagger progress bar fills
    DUES.forEach((g, i) => {
      setTimeout(() => {
        setFilledPcts(prev => {
          const next = [...prev];
          next[i] = g.pct;
          return next;
        });
      }, 600 + i * 200);
    });
  }, []);

  return (
    <div className="relative flex flex-col justify-between w-full h-full p-8 sm:p-10 lg:p-12 bg-gradient-to-br from-[#060f23] via-[#0a1e3d] to-[#0f2d5c] text-white overflow-hidden select-none">

      {/* ── Animated Background Orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* large primary orb */}
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-[#2563EB]/18 blur-[80px] animate-orb-pulse" />
        {/* mid violet orb */}
        <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-violet-600/12 blur-[60px] animate-orb-pulse delay-1000" />
        {/* small cyan orb bottom */}
        <div className="absolute -bottom-20 right-1/3 w-56 h-56 rounded-full bg-cyan-500/10 blur-[50px] animate-orb-pulse delay-2000" />

        {/* Rotating ring */}
        <div className="absolute top-1/4 right-10 w-40 h-40 rounded-full border border-white/5 animate-spin-slow" />
        <div className="absolute top-1/4 right-10 w-56 h-56 -translate-x-8 -translate-y-8 rounded-full border border-white/3 animate-spin-slow delay-2000" style={{ animationDirection: 'reverse' }} />

        {/* Floating icons */}
        <div className="absolute top-[18%] right-[8%] text-white/6 animate-float-slow delay-300">
          <GraduationCap className="w-20 h-20" />
        </div>
        <div className="absolute bottom-[22%] left-[6%] text-white/5 animate-float-medium delay-700">
          <Coins className="w-16 h-16" />
        </div>
        <div className="absolute top-[55%] right-[12%] text-white/5 animate-float-slow delay-1500">
          <ShieldCheck className="w-12 h-12" />
        </div>

        {/* Grid dots pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ── Brand ── */}
      <div className={`relative z-10 ${mounted ? 'animate-fade-slide-up' : 'opacity-0'}`}>
        <Link href="/" className="inline-flex items-center gap-3 group no-underline">
          {/* Logo mark */}

          <div className="flex flex-col">
            <Logo variant="light" />
          </div>
        </Link>

        <h2 className={`mt-8 text-2xl sm:text-[1.7rem] font-extrabold tracking-tight text-white/95 leading-[1.25] font-display max-w-sm ${mounted ? 'animate-fade-slide-up delay-100' : 'opacity-0'}`}>
          Student finance, reimagined for the modern campus.
        </h2>
        <p className={`mt-3 text-sm text-slate-400 leading-relaxed max-w-xs ${mounted ? 'animate-fade-slide-up delay-200' : 'opacity-0'}`}>
          Save towards dues, pay securely, and manage student organisation finances effortlessly.
        </p>
      </div>

      {/* ── Demo Dashboard Card ── */}
      <div className={`relative z-10 my-8 ${mounted ? 'animate-fade-slide-up delay-300' : 'opacity-0'}`}>
        <div className="relative bg-white/8 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden group transition-all duration-500"
          style={{ border: '1px solid rgba(99,102,241,0.3)' }}
        >
          {/* Traveling sweep light — replaces the old broken shimmer bar */}
          <div
            className="absolute -top-10 -left-10 w-28 h-48 rotate-[20deg] pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.18) 40%, rgba(96,165,250,0.25) 60%, transparent 100%)',
              animation: 'sweep-light 4s ease-in-out infinite',
            }}
          />

          {/* card inner grid bg */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
              backgroundSize: '12px 12px',
            }}
          />

          {/* Header */}
          <div className="flex items-center justify-between mb-5 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB]/25 border border-blue-400/20 flex items-center justify-center">
                <Receipt className="w-4 h-4 text-blue-300" />
              </div>
              <span className="text-[0.72rem] font-bold text-slate-300 tracking-widest uppercase">
                Dues Overview
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.68rem] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              Live
            </span>
          </div>

          {/* Balance */}
          <div className="mb-5 relative z-10">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
                ₦184,500
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="text-[0.72rem] text-slate-400 font-medium">
                2 outstanding dues
              </span>
            </div>
          </div>

          {/* Progress bars */}
          <div className="flex flex-col gap-3 pt-4 border-t border-white/8 relative z-10">
            {DUES.map((g, i) => (
              <div key={g.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[0.7rem] font-semibold text-slate-300">{g.label}</span>
                  <span className={`text-[0.7rem] font-bold ${g.textColor}`}>{g.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${g.color} rounded-full transition-all duration-[1600ms] ease-out`}
                    style={{ width: `${filledPcts[i]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Notification chip */}
          <div className="mt-4 pt-3 border-t border-white/8 flex items-center gap-2 relative z-10">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/20 flex items-center justify-center shrink-0">
              <Bell className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <span className="text-[0.7rem] text-slate-400 leading-snug">
              <span className="font-semibold text-white">Faculty Week due in 3 days.</span>&nbsp;₦1,800 remaining.
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className={`relative z-10 pt-5 border-t border-white/10 ${mounted ? 'animate-fade-slide-up delay-500' : 'opacity-0'}`}>
        <div className="grid grid-cols-3 gap-2">
          {STATS.map((s, i) => (
            <div key={s.label} className={`flex flex-col ${i > 0 ? 'border-l border-white/10 pl-4' : ''}`}>
              <span className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight leading-none">
                {s.value}
              </span>
              <span className="text-[0.72rem] font-medium text-slate-400 mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
