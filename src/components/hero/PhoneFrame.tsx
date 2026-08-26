'use client';

import { useEffect, useRef, useState } from 'react';
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  Bell,
  ChevronDown,
  Building2,
  AlertCircle,
  CheckCircle2,
  Users,
  Signal,
  Wifi,
  Battery,
  ArrowUpRight,
  Download,
  Sparkles,
} from 'lucide-react';
import gsap from 'gsap';

interface PhoneFrameProps {
  currentStep?: number;
  onStepSelect?: (step: number) => void;
}

export function PhoneFrame({ currentStep = 3, onStepSelect }: PhoneFrameProps) {
  const phoneRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const phone = phoneRef.current;
    const wrapper = wrapperRef.current;
    if (!phone || !wrapper) return;

    const handleMouseEnter = () => {
      gsap.to(phone, {
        rotationX: 3,
        rotationY: -2,
        scale: 1.02,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(wrapper, { z: 20, duration: 0.5, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(phone, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.7,
        ease: 'elastic.out(1, 0.6)',
        overwrite: 'auto',
      });
      gsap.to(wrapper, { z: 0, duration: 0.5, ease: 'power2.out' });
    };

    phone.addEventListener('mouseenter', handleMouseEnter);
    phone.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      phone.removeEventListener('mouseenter', handleMouseEnter);
      phone.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="perspective-1000 relative w-full flex justify-center items-center py-2">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] bg-gradient-to-tr from-primary/25 to-primary-glow/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Notification Badge */}
      <div className="hidden sm:flex absolute -top-3 -left-4 lg:-left-8 z-30 bg-white/95 backdrop-blur-xl border border-slate-200/80 p-2.5 rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.1)] items-center gap-2.5 animate-float-slow">
        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm shadow-emerald-500/30 shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#0b1a33]">Payment Verified</span>
            <span className="text-[9px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded-full">Live</span>
          </div>
          <p className="text-[10.5px] text-[#5b6d89]">Receipt #HT-84920 auto-generated</p>
        </div>
      </div>

      {/* Phone Hardware Shell - Compact & perfectly proportioned */}
      <div
        ref={phoneRef}
        className="w-full max-w-[280px] sm:max-w-[310px] aspect-[9/16.4] bg-[#0c101c] rounded-[44px] p-2.5 sm:p-3 shadow-[0_24px_70px_rgba(26,92,255,0.22),0_0_0_1px_rgba(255,255,255,0.15),0_0_0_6px_rgba(15,23,42,0.65)] relative will-change-transform cursor-default select-none"
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-[96px] h-4 bg-[#000000] rounded-full z-30 flex items-center justify-between px-2 shadow-inner">
          <div className="w-2 h-2 bg-[#141824] rounded-full border border-[#23293d]" />
          <div className="w-8 h-1 bg-[#141824] rounded-full" />
        </div>

        {/* Screen Container */}
        <div className="w-full h-full bg-[#f8faff] rounded-[34px] overflow-hidden flex flex-col justify-between text-foreground relative shadow-inner">
          
          {/* Top Fixed Area: Status Bar + App Top Bar */}
          <div className="px-3.5 pt-2 pb-1.5 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shrink-0 z-20">
            {/* Status Bar */}
            <div className="flex justify-between items-center pb-1 text-[9.5px] font-bold text-[#0b1a33]">
              <span>{time}</span>
              <div className="flex items-center gap-1 text-[#0b1a33]">
                <Signal className="w-2.5 h-2.5" />
                <Wifi className="w-2.5 h-2.5" />
                <Battery className="w-3 h-2.5" />
              </div>
            </div>

            {/* Dashboard Header Bar */}
            <div className="flex items-center justify-between gap-1.5 pt-0.5">
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-[#0b1a33] leading-tight truncate">
                  Good morning, <span className="text-[#1a5cff]">Ayodeji</span>
                </p>
                <p className="text-[9px] text-[#5b6d89] truncate">What do you need to pay right now?</p>
              </div>
              <div className="relative w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0b1a33] shrink-0">
                <Bell className="w-3 h-3 text-[#5b6d89]" />
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#1a5cff] rounded-full" />
              </div>
            </div>

            {/* Organization Context Pill */}
            <div className="mt-1.5 flex items-center justify-between bg-[#f0f4ff] border border-[#1a5cff]/20 px-2 py-1 rounded-lg text-[10px]">
              <div className="flex items-center gap-1 text-[#0b1a33] font-semibold truncate">
                <Building2 className="w-3 h-3 text-[#1a5cff] shrink-0" />
                <span className="truncate">Computer Science (NACOS)</span>
              </div>
              <ChevronDown className="w-2.5 h-2.5 text-[#5b6d89] shrink-0" />
            </div>
          </div>

          {/* Middle Content - Snug, tightly fitting dashboard sections */}
          <div className="flex-1 flex flex-col justify-between px-3 py-2 space-y-1.5 overflow-hidden">
            
            {/* 2 Metric Cards */}
            <div className="grid grid-cols-2 gap-1.5 shrink-0">
              {/* Dues Paid */}
              <div className="bg-white rounded-xl p-2 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[8.5px] font-bold text-[#5b6d89] uppercase flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> Paid
                  </span>
                  <span className="text-[7.5px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded-full border border-emerald-200/60">
                    2 Done
                  </span>
                </div>
                <div className="text-[13px] font-extrabold text-[#0b1a33] leading-tight">₦12,500</div>
                <div className="text-[8px] text-[#1a5cff] font-semibold mt-0.5">Receipts ready →</div>
              </div>

              {/* Dues Pending */}
              <div className="bg-white rounded-xl p-2 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[8.5px] font-bold text-[#5b6d89] uppercase flex items-center gap-0.5">
                    <AlertCircle className="w-2.5 h-2.5 text-amber-500" /> Pending
                  </span>
                  <span className="text-[7.5px] font-bold text-amber-600 bg-amber-50 px-1 py-0.2 rounded-full border border-amber-200/60">
                    1 Due
                  </span>
                </div>
                <div className="text-[13px] font-extrabold text-[#0b1a33] leading-tight">₦8,000</div>
                <div className="text-[8px] text-amber-600 font-semibold mt-0.5">Due in 5 days</div>
              </div>
            </div>

            {/* Dues Pending Item */}
            <div className="bg-white rounded-xl p-2 border border-slate-200/80 shadow-xs shrink-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9.5px] font-bold text-[#0b1a33] flex items-center gap-1">
                  <span>Dues Pending</span>
                  <span className="text-[7.5px] bg-amber-100 text-amber-800 font-bold px-1 rounded-full">1</span>
                </span>
                <span className="text-[8.5px] font-semibold text-[#1a5cff]">View all</span>
              </div>

              <div className="p-1.5 rounded-lg bg-[#f8faff] border border-slate-200/60 flex items-center justify-between gap-1.5">
                <div className="min-w-0">
                  <p className="text-[9.5px] font-bold text-[#0b1a33] truncate">Faculty Development Levy</p>
                  <p className="text-[8px] text-[#5b6d89] truncate">Faculty of Physical Sciences</p>
                  <p className="text-[9.5px] font-extrabold text-[#0b1a33]">₦8,000</p>
                </div>
                <button
                  type="button"
                  className="bg-[#1a5cff] hover:bg-[#124bda] text-white text-[9px] font-bold px-2.5 py-1 rounded-md shadow-xs shrink-0 flex items-center gap-0.5 cursor-pointer"
                >
                  Pay <ArrowUpRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* Recent Payment Receipts */}
            <div className="bg-white rounded-xl p-2 border border-slate-200/80 shadow-xs shrink-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9.5px] font-bold text-[#0b1a33]">Recent Payment Receipts</span>
                <span className="text-[8.5px] font-semibold text-[#1a5cff]">All (2)</span>
              </div>

              <div className="p-1.5 rounded-lg bg-[#f0fdf4] border border-emerald-200/60 flex items-center justify-between gap-1.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-[9.5px] font-bold text-[#0b1a33] truncate">Departmental Annual Dues</p>
                    <span className="text-[7px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded">PAID</span>
                  </div>
                  <p className="text-[8px] text-emerald-700 font-mono">Receipt #HT-84920 · ₦12,500</p>
                </div>
                <div className="w-5 h-5 rounded bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs shrink-0">
                  <Download className="w-2.5 h-2.5" />
                </div>
              </div>
            </div>

            {/* Step-Interactive Dynamic Highlight Pill */}
            <div className="py-1 px-2 rounded-lg bg-[#eef4ff] border border-[#1a5cff]/20 flex items-center justify-between text-[8.5px] text-[#1a5cff] font-semibold shrink-0">
              <span className="flex items-center gap-1 truncate">
                <Sparkles className="w-2.5 h-2.5 text-[#1a5cff] shrink-0" />
                {currentStep === 0 && 'Step 1: NACOS verified & live'}
                {currentStep === 1 && 'Step 2: 500 students synced'}
                {currentStep === 2 && 'Step 3: Dues assigned to level'}
                {currentStep === 3 && 'Step 4: Instant online checkout'}
                {currentStep === 4 && 'Step 5: Automated digital records'}
              </span>
              <span className="font-bold shrink-0">Step {currentStep + 1}/5</span>
            </div>

          </div>

          {/* Bottom Fixed Navigation Bar (Tightly attached with zero dead space) */}
          <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 flex justify-around items-center shrink-0 z-20">
            <div className="flex flex-col items-center gap-0.5 text-[#1a5cff]">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="text-[7.5px] font-bold leading-none">Home</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 text-[#5b6d89]">
              <CreditCard className="w-3.5 h-3.5" />
              <span className="text-[7.5px] font-semibold leading-none">Dues</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 text-[#5b6d89]">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[7.5px] font-semibold leading-none">Orgs</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 text-[#5b6d89]">
              <Receipt className="w-3.5 h-3.5" />
              <span className="text-[7.5px] font-semibold leading-none">Receipts</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
