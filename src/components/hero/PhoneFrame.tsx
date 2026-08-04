'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Wallet,
  CheckCircle,
  ArrowDown,
  ArrowUp,
  Clock,
  Ticket,
  ChevronRight,
  Home,
  Building,
  Bell,
  User,
  Signal,
  Wifi,
  Battery,
  PiggyBank,
  CreditCard,
  Receipt,
  CalendarDays,
} from 'lucide-react';
import gsap from 'gsap';

const transactions = [
  {
    icon: Building,
    name: 'CS Society Dues',
    desc: 'Today, 2:15 PM',
    amount: '-₦5,000',
    negative: true,
  },
  {
    icon: ArrowUp,
    name: 'Wallet Funding',
    desc: 'Yesterday',
    amount: '+₦10,000',
    negative: false,
  },
];

export function PhoneFrame() {
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
        rotationX: 8,
        rotationY: -5,
        rotationZ: 2,
        scale: 1.03,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(wrapper, { z: 30, duration: 0.6, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(phone, {
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
      gsap.to(wrapper, { z: 0, duration: 0.6, ease: 'power2.out' });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = phone.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      gsap.to(phone, {
        rotationX: (y - 0.5) * 12,
        rotationY: (x - 0.5) * -12,
        duration: 0.3,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    };

    phone.addEventListener('mouseenter', handleMouseEnter);
    phone.addEventListener('mouseleave', handleMouseLeave);
    phone.addEventListener('mousemove', handleMouseMove);

    return () => {
      phone.removeEventListener('mouseenter', handleMouseEnter);
      phone.removeEventListener('mouseleave', handleMouseLeave);
      phone.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="perspective-1000">
      <div
        ref={phoneRef}
        className="w-full max-w-[260px] sm:max-w-[340px] lg:max-w-[420px] aspect-[9/19] bg-[#f8f9fc] rounded-[36px] sm:rounded-[48px] p-2 sm:p-4 shadow-[0_30px_80px_rgba(0,0,0,0.1),0_0_0_3px_oklch(46%_.18_265),0_0_0_8px_rgba(46,92,210,0.06),inset_0_0_0_1px_rgba(255,255,255,0.8)] relative transition-shadow duration-500 will-change-transform cursor-pointer mx-auto"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {/* Border ring */}
        <div className="absolute -inset-1 rounded-[40px] sm:rounded-[52px] border border-border pointer-events-none" />

        {/* Notch */}
        <div className="absolute top-3 sm:top-5 left-1/2 -translate-x-1/2 w-[80px] sm:w-[130px] h-4 sm:h-7 bg-foreground rounded-[12px] sm:rounded-[18px] z-10 flex items-center justify-center gap-1.5 sm:gap-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
          <div className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 bg-[oklch(20%_.02_260)] rounded-full border border-[oklch(30%_.02_260)] relative">
            <div className="absolute w-0.5 h-0.5 bg-primary/20 rounded-full top-0.5 left-0.5" />
          </div>
          <div className="w-[26px] sm:w-[48px] h-0.5 sm:h-1 bg-[oklch(20%_.02_260)] rounded border border-[oklch(30%_.02_260)]" />
        </div>

        {/* Screen */}
        <div className="w-full h-full bg-white rounded-[24px] sm:rounded-[36px] overflow-hidden flex flex-col">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-3 sm:px-4 pt-3 sm:pt-4 pb-1 text-[9px] sm:text-[11px] font-semibold text-foreground flex-shrink-0">
            <span className="font-bold">{time}</span>
            <div className="flex gap-1 sm:gap-1.5">
              <Signal className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              <Wifi className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              <Battery className="w-3 h-2.5 sm:w-4 sm:h-3.5" />
            </div>
          </div>

          {/* Content — no overflow, everything fits with breathing room */}
          <div className="flex-1 px-3 sm:px-4 flex flex-col gap-2.5 sm:gap-3 pb-2">

            {/* Header */}
            <div className="flex items-center justify-between pt-1 pb-2 border-b border-[#e8ecf1] flex-shrink-0">
              <span className="text-[0.75rem] sm:text-[0.95rem] font-bold text-[#1a1a2e]">
                Hi, <span className="text-[#1a5cff]">Adaeze</span>
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#f0f2f5] flex items-center justify-center">
                  <Bell className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#1a1a2e]" />
                </div>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-[#1a5cff] to-[#4a7aff] flex items-center justify-center text-white font-bold text-[0.45rem] sm:text-[0.55rem]">
                  AO
                </div>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-[#1a5cff] to-[#0f4ad0] rounded-[12px] sm:rounded-[16px] px-3 sm:px-4 py-2.5 sm:py-3.5 text-white relative overflow-hidden flex-shrink-0">
              <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
              <p className="text-[0.45rem] sm:text-[0.6rem] text-white/70 font-medium uppercase tracking-wide mb-0.5">Total Balance</p>
              <p className="text-[1.1rem] sm:text-[1.4rem] font-bold tracking-tight leading-none">₦184,500</p>
              <p className="text-[0.42rem] sm:text-[0.58rem] text-white/60 mt-1">Avail. ₦122,300 · Locked ₦62,200</p>
              <div className="flex gap-1.5 mt-2">
                <button className="bg-white text-[#1a5cff] rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[0.45rem] sm:text-[0.6rem] font-bold border-none">
                  Add to wallet
                </button>
                <button className="bg-white/20 text-white rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[0.45rem] sm:text-[0.6rem] font-bold border-none">
                  Withdraw
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 flex-shrink-0">
              {[
                { label: 'Pay Dues',  desc: '2 pending', icon: CreditCard },
                { label: 'Tickets',   desc: 'Events',    icon: CalendarDays },
                { label: 'Save',      desc: '3 goals',   icon: PiggyBank },
                { label: 'Receipts',  desc: '6 issued',  icon: Receipt },
              ].map(({ label, desc, icon: Icon }) => (
                <button
                  key={label}
                  className="bg-white border border-[#e8ecf1] rounded-[8px] sm:rounded-[10px] py-1.5 sm:py-2 px-0.5 flex flex-col items-center gap-0.5 sm:gap-1 w-full"
                >
                  <div className="w-4.5 h-4.5 sm:w-6 sm:h-6 rounded-[6px] bg-[#eef3ff] flex items-center justify-center text-[#1a5cff]">
                    <Icon className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="text-[0.42rem] sm:text-[0.55rem] font-semibold text-[#1a1a2e] leading-tight text-center w-full truncate">{label}</span>
                  <span className="text-[0.38rem] sm:text-[0.48rem] text-[#6b7a8f] text-center">{desc}</span>
                </button>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="flex-shrink-0">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[0.48rem] sm:text-[0.6rem] font-semibold text-[#7a8ba3] uppercase tracking-wider">Recent Activity</span>
                <span className="text-[0.48rem] sm:text-[0.6rem] text-[#1a5cff] font-medium flex items-center gap-0.5">
                  View All <ChevronRight className="w-2 h-2" />
                </span>
              </div>
              <div className="flex flex-col gap-1 sm:gap-1.5">
                {transactions.map((tx, index) => (
                  <div key={index} className="flex items-center justify-between py-1 sm:py-1.5 px-2 sm:px-2.5 bg-[#f8f9fc] rounded-[8px]">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <div className="w-5 h-5 sm:w-6.5 sm:h-6.5 rounded-full bg-white border border-[#e8ecf1] flex items-center justify-center text-[#1a5cff] flex-shrink-0">
                        <tx.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[0.5rem] sm:text-[0.65rem] font-semibold text-[#1a1a2e] truncate">{tx.name}</div>
                        <div className="text-[0.42rem] sm:text-[0.55rem] text-[#7a8ba3] truncate">{tx.desc}</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-1">
                      <div className={`text-[0.5rem] sm:text-[0.65rem] font-bold ${tx.negative ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {tx.amount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="flex justify-around items-center pt-2 sm:pt-2.5 border-t border-[#e8ecf1] mt-auto flex-shrink-0">
              {[
                { icon: Home,         label: 'Home',    active: true },
                { icon: Wallet,       label: 'Pay',     active: false },
                { icon: CalendarDays, label: 'Events',  active: false },
                { icon: User,         label: 'Profile', active: false },
              ].map((item, index) => (
                <button
                  key={index}
                  className={`flex flex-col items-center gap-0.5 text-[0.42rem] sm:text-[0.55rem] font-medium py-0.5 px-1.5 ${item.active ? 'text-[#1a5cff]' : 'text-[#7a8ba3]'}`}
                >
                  <item.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  {item.label}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
