'use client';

import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Bell,
  Signal,
  Wifi,
  Battery,
  Receipt,
  Users,
  ShieldCheck,
  Building,
  UserPlus,
  FilePlus2,
  CreditCard,
  QrCode,
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
    <div ref={wrapperRef} className="perspective-1000 relative w-full flex justify-center items-center py-4">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[450px] sm:h-[450px] bg-gradient-to-tr from-primary/25 to-primary-glow/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Card: Live Notification */}
      <div className="hidden sm:flex absolute top-6 -left-6 lg:-left-10 z-30 bg-white/95 backdrop-blur-xl border border-white/80 p-3.5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] items-center gap-3 animate-float-slow">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 flex-shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">Dues Auto-Recorded</span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Live</span>
          </div>
          <p className="text-xs text-muted-foreground">Toluwalase A. paid ₦12,500</p>
        </div>
      </div>

      {/* Phone Hardware Shell */}
      <div
        ref={phoneRef}
        className="w-full max-w-[290px] sm:max-w-[330px] lg:max-w-[360px] aspect-[9/18.5] bg-[#0c101c] rounded-[48px] p-3 sm:p-3.5 shadow-[0_30px_90px_rgba(26,92,255,0.22),0_0_0_1px_rgba(255,255,255,0.15),0_0_0_8px_rgba(15,23,42,0.7)] relative will-change-transform cursor-pointer"
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[110px] h-5 bg-[#000000] rounded-full z-30 flex items-center justify-between px-2.5 shadow-inner">
          <div className="w-2.5 h-2.5 bg-[#141824] rounded-full border border-[#23293d]" />
          <div className="w-10 h-1 bg-[#141824] rounded-full" />
        </div>

        {/* Screen Content */}
        <div className="w-full h-full bg-[#f8fafc] rounded-[36px] overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 text-foreground relative shadow-inner">
          {/* Status Bar */}
          <div className="flex justify-between items-center pt-2 pb-1 text-[10px] font-bold text-foreground flex-shrink-0">
            <span>{time}</span>
            <div className="flex gap-1 text-foreground">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3" />
            </div>
          </div>

          {/* App Header */}
          <div className="flex items-center justify-between pt-1 pb-2 border-b border-border/80 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                H
              </div>
              <div>
                <p className="text-xs font-bold text-foreground leading-tight">NACOS Portal</p>
                <p className="text-[10px] text-muted-foreground">Step 0{currentStep + 1} Interactive View</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground shadow-sm">
              <Bell className="w-3 h-3" />
            </div>
          </div>

          {/* Dynamic Content based on currentStep (0 to 4) */}
          {currentStep === 0 && (
            /* Step 01: Onboard Org */
            <div className="space-y-2 flex-1 flex flex-col justify-center">
              <div className="bg-white border border-border rounded-2xl p-4 shadow-sm text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 font-bold">
                  <Building className="w-6 h-6" />
                </div>
                <h5 className="font-bold text-foreground text-sm">Computer Science Students</h5>
                <p className="text-[11px] text-muted-foreground">Executive setup complete · 4 Excos</p>
                <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Organisation Verified
                </span>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            /* Step 02: Add Members */
            <div className="space-y-2 flex-1 flex flex-col justify-center">
              <div className="bg-white border border-border rounded-2xl p-3.5 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Student Roster</span>
                  <span className="text-primary text-[10px]">500 Enrolled</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="p-2 rounded-xl bg-muted/60 flex justify-between items-center">
                    <span>Toluwalase A. (CSC/21/049)</span>
                    <span className="font-bold text-emerald-600">Active</span>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/60 flex justify-between items-center">
                    <span>Chioma O. (CSC/21/042)</span>
                    <span className="font-bold text-emerald-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            /* Step 03: Create a due */
            <div className="space-y-2 flex-1 flex flex-col justify-center">
              <div className="bg-white border border-border rounded-2xl p-4 shadow-sm space-y-2">
                <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">
                  New Due Published
                </span>
                <h5 className="font-bold text-foreground text-sm">Departmental Annual Dues</h5>
                <p className="text-xl font-extrabold text-foreground font-display">₦12,500</p>
                <p className="text-[10px] text-muted-foreground">Session: 2025/2026 · All levels</p>
              </div>
            </div>
          )}

          {(currentStep === 3 || currentStep === 4) && (
            /* Step 04 & 05: Student Pay & Auto Record */
            <div className="space-y-2.5 flex-shrink-0">
              <div className="bg-gradient-to-br from-primary via-[#2065ff] to-[#124bda] rounded-2xl p-4 text-white shadow-xl shadow-primary/25 relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                    Annual Dues
                  </span>
                  <span className="flex items-center gap-1 text-[10px] bg-emerald-400/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                    <CheckCircle2 className="w-3 h-3" /> Confirmed
                  </span>
                </div>

                <p className="text-xs font-medium text-white/85">Computer Science Dept Dues</p>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-2xl font-extrabold font-display">₦12,500</span>
                  <span className="text-[10px] text-white/70">/ student</span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-[10px] text-white/90">
                  <span className="flex items-center gap-1">
                    <Receipt className="w-3 h-3 text-emerald-300" /> Receipt #HT-84920
                  </span>
                  <span className="font-mono text-white/75 font-semibold">AUTO-RECORDED</span>
                </div>
              </div>

              {/* Real-time Tracking Feed */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <span>Executive Live Feed</span>
                  <span className="text-primary font-semibold flex items-center gap-0.5">
                    Live <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  </span>
                </div>

                <div className="bg-white border border-border/80 rounded-xl p-2 flex items-center justify-between text-[11px] shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[9px]">
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-[10px] leading-tight">Chioma O. (CSC/21/042)</p>
                      <p className="text-[8px] text-muted-foreground">Departmental Dues</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600 text-[10px]">+₦12,500</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Security Tag */}
          <div className="py-1.5 px-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center gap-1.5 text-[10px] text-primary font-bold text-center flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" /> No spreadsheets · Instant audit logs
          </div>
        </div>
      </div>
    </div>
  );
}
