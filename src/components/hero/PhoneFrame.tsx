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
    desc: 'Yesterday, 10:30 AM',
    amount: '+₦10,000',
    negative: false,
  },
  {
    icon: Ticket,
    name: 'Tech Fest Ticket',
    desc: 'Yesterday, 9:00 AM',
    amount: '-₦3,000',
    negative: true,
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
        className="w-full max-w-[260px] sm:max-w-[340px] lg:max-w-[420px] aspect-[9/19] bg-card rounded-[36px] sm:rounded-[48px] p-2 sm:p-5 shadow-[0_30px_80px_rgba(0,0,0,0.1),0_0_0_3px_oklch(46%_.18_265),0_0_0_8px_rgba(46,92,210,0.06),inset_0_0_0_1px_rgba(255,255,255,0.8)] relative transition-shadow duration-500 will-change-transform cursor-pointer mx-auto"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {/* Border ring */}
        <div className="absolute -inset-1 rounded-[40px] sm:rounded-[52px] border border-border pointer-events-none" />

        {/* Notch */}
        <div className="absolute top-3 sm:top-6 left-1/2 -translate-x-1/2 w-[90px] sm:w-[150px] h-5 sm:h-9 bg-foreground rounded-[14px] sm:rounded-[22px] z-10 flex items-center justify-center gap-1.5 sm:gap-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
          <div className="w-2 sm:w-3 h-2 sm:h-3 bg-[oklch(20%_.02_260)] rounded-full border border-[oklch(30%_.02_260)] relative">
            <div className="absolute w-1 h-1 bg-primary/20 rounded-full top-0.5 left-0.5" />
          </div>
          <div className="w-[30px] sm:w-[55px] h-0.5 sm:h-1.5 bg-[oklch(20%_.02_260)] rounded border border-[oklch(30%_.02_260)]" />
        </div>

        {/* Screen */}
        <div className="w-full h-full bg-card rounded-[24px] sm:rounded-[36px] overflow-hidden flex flex-col">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-3 sm:px-5 pt-3 sm:pt-3.5 h-9 sm:h-12 text-[10px] sm:text-xs font-semibold text-foreground flex-shrink-0">
            <span className="font-bold text-[11px] sm:text-sm">{time}</span>
            <div className="flex gap-1 sm:gap-2">
              <Signal className="w-3 h-3 sm:w-4 sm:h-4" />
              <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />
              <Battery className="w-3.5 h-3 sm:w-5 sm:h-4" />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 px-2.5 sm:px-5 pb-2 sm:pb-5 flex flex-col gap-2 sm:gap-3.5 overflow-hidden">
            {/* Wallet Header */}
            <div className="flex justify-between items-center py-1 sm:py-1.5 border-b border-border flex-shrink-0">
              <div className="font-bold text-[11px] sm:text-base text-foreground flex items-center gap-1.5">
                <Wallet className="w-3 h-3 sm:w-4.5 sm:h-4.5 text-primary" />
                Wallet
              </div>
              <span className="bg-success/20 text-success text-[9px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Active
              </span>
            </div>

            {/* Balance */}
            <div className="text-center py-1 sm:py-4 flex-shrink-0">
              <div className="text-[9px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Available Balance
              </div>
              <div className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight mt-0.5">
                <span className="text-base sm:text-2xl font-semibold text-muted-foreground">₦</span>
                24,500
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5 flex-shrink-0">
              <button className="bg-primary text-primary-foreground rounded-lg py-2 sm:py-3 px-1 text-[10px] sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-2 font-sans">
                <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />
                Pay Dues
              </button>
              <button className="bg-muted rounded-lg py-2 sm:py-3 px-1 text-[10px] sm:text-sm font-medium text-foreground flex items-center justify-center gap-1 sm:gap-2 font-sans">
                <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                Fund
              </button>
              <button className="bg-muted rounded-lg py-2 sm:py-3 px-1 text-[10px] sm:text-sm font-medium text-foreground flex items-center justify-center gap-1 sm:gap-2 font-sans">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                History
              </button>
              <button className="bg-muted rounded-lg py-2 sm:py-3 px-1 text-[10px] sm:text-sm font-medium text-foreground flex items-center justify-center gap-1 sm:gap-2 font-sans">
                <Ticket className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                Events
              </button>
            </div>

            {/* Recent Transactions */}
            <div className="flex justify-between items-center text-[9px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider py-0.5 sm:py-1.5 flex-shrink-0">
              Recent Activity
              <a href="#" className="text-primary text-[9px] sm:text-xs font-medium normal-case no-underline hover:underline flex items-center gap-0.5">
                View All <ChevronRight className="inline w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </a>
            </div>

            <div className="flex flex-col flex-shrink-0">
              {transactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1.5 sm:py-2 border-b border-border last:border-none"
                >
                  <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted flex items-center justify-center text-primary flex-shrink-0">
                      <tx.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-sm font-medium text-foreground truncate">{tx.name}</div>
                      <div className="text-[9px] sm:text-xs text-muted-foreground truncate">{tx.desc}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-1">
                    <div className={`text-[10px] sm:text-sm font-semibold ${tx.negative ? 'text-destructive' : 'text-success'}`}>
                      {tx.amount}
                    </div>
                    <span className="text-[9px] sm:text-xs text-success block">Done</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Nav */}
            <div className="flex justify-around items-center pt-1.5 sm:pt-2.5 pb-0.5 sm:pb-1.5 border-t border-border mt-auto flex-shrink-0">
              {[
                { icon: Home, label: 'Home', active: true },
                { icon: Wallet, label: 'Wallet', active: false },
                { icon: Building, label: 'Orgs', active: false },
                { icon: Bell, label: 'Alerts', active: false },
                { icon: User, label: 'Profile', active: false },
              ].map((item, index) => (
                <button
                  key={index}
                  className={`flex flex-col items-center gap-0.5 text-[8px] sm:text-xs text-muted-foreground hover:text-primary font-sans py-0.5 sm:py-1 px-1 sm:px-3 relative ${item.active ? 'text-primary' : ''}`}
                >
                  <item.icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  {item.label}
                  {item.active && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 sm:w-5 h-0.5 bg-primary rounded" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}