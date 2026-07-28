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
      gsap.to(wrapper, {
        z: 30,
        duration: 0.6,
        ease: 'power2.out',
      });
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
      gsap.to(wrapper, {
        z: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = phone.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * -12;
      const rotateX = (y - 0.5) * 12;

      gsap.to(phone, {
        rotationX: rotateX,
        rotationY: rotateY,
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
        className="w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[420px] aspect-[9/19] bg-card rounded-[40px] sm:rounded-[48px] p-3 sm:p-5 shadow-[0_30px_80px_rgba(0,0,0,0.1),0_0_0_4px_oklch(46%_.18_265),0_0_0_10px_rgba(46,92,210,0.06),inset_0_0_0_1px_rgba(255,255,255,0.8)] relative transition-shadow duration-500 transform-style-preserve-3d will-change-transform cursor-pointer mx-auto"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Border */}
        <div className="absolute -inset-1.5 rounded-[44px] sm:rounded-[52px] border-3 border-border pointer-events-none" />

        {/* Notch */}
        <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[110px] sm:w-[150px] h-6 sm:h-9 bg-foreground rounded-[18px] sm:rounded-[22px] z-10 flex items-center justify-center gap-2 sm:gap-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
          <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-[oklch(20%_.02_260)] rounded-full border border-[oklch(30%_.02_260)] shadow-[inset_0_0_4px_rgba(0,0,0,0.5)] relative">
            <div className="absolute w-1 sm:w-1.5 h-1 sm:h-1.5 bg-primary/20 rounded-full top-0.5 left-0.5" />
          </div>
          <div className="w-[40px] sm:w-[55px] h-1 sm:h-1.5 bg-[oklch(20%_.02_260)] rounded border border-[oklch(30%_.02_260)]" />
        </div>

        {/* Screen */}
        <div className="w-full h-full bg-card rounded-[28px] sm:rounded-[36px] overflow-hidden flex flex-col relative">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-5 pt-3.5 h-12 text-xs font-semibold text-foreground">
            <span className="font-bold text-sm">{time}</span>
            <div className="flex gap-2 text-sm">
              <Signal className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <Battery className="w-5 h-4" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-5 pb-5 flex flex-col gap-3.5 overflow-y-auto custom-scrollbar">
            {/* Wallet Header */}
            <div className="flex justify-between items-center py-1.5 pb-2.5 border-b border-border">
              <div className="font-bold text-base text-foreground flex items-center gap-2">
                <Wallet className="w-4.5 h-4.5 text-primary" />
                Wallet
              </div>
              <span className="bg-success/20 text-success text-xs font-semibold px-3 py-0.5 rounded-full flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3" />
                Active
              </span>
            </div>

            {/* Balance */}
            <div className="text-center py-4 pb-3">
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Available Balance
              </div>
              <div className="text-4xl font-bold text-foreground tracking-tight">
                <span className="text-2xl font-semibold text-muted-foreground">₦</span>24,500
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2.5 py-2">
              <button className="bg-primary text-primary-foreground rounded-lg py-3 px-2 text-sm font-medium transition-all hover:bg-[oklch(36%_.18_265)] hover:scale-102 flex items-center justify-center gap-2 font-sans">
                <ArrowDown className="w-4 h-4" />
                Pay Dues
              </button>
              <button className="bg-muted rounded-lg py-3 px-2 text-sm font-medium text-foreground transition-all hover:bg-border hover:scale-102 flex items-center justify-center gap-2 font-sans">
                <ArrowUp className="w-4 h-4 text-primary" />
                Fund
              </button>
              <button className="bg-muted rounded-lg py-3 px-2 text-sm font-medium text-foreground transition-all hover:bg-border hover:scale-102 flex items-center justify-center gap-2 font-sans">
                <Clock className="w-4 h-4 text-primary" />
                History
              </button>
              <button className="bg-muted rounded-lg py-3 px-2 text-sm font-medium text-foreground transition-all hover:bg-border hover:scale-102 flex items-center justify-center gap-2 font-sans">
                <Ticket className="w-4 h-4 text-primary" />
                Events
              </button>
            </div>

            {/* Recent Transactions */}
            <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider py-1.5">
              Recent Activity
              <a href="#" className="text-primary text-xs font-medium normal-case no-underline hover:underline">
                View All <ChevronRight className="inline w-3 h-3" />
              </a>
            </div>

            {transactions.map((tx, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border last:border-none transition-colors hover:bg-muted hover:-mx-2 hover:px-2 hover:rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-primary flex-shrink-0">
                    <tx.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{tx.name}</div>
                    <div className="text-xs text-muted-foreground">{tx.desc}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${tx.negative ? 'text-destructive' : 'text-success'}`}>
                    {tx.amount}
                  </div>
                  <span className="text-xs text-success block">Completed</span>
                </div>
              </div>
            ))}

            {/* Bottom Navigation */}
            <div className="flex justify-around items-center pt-2.5 pb-1.5 border-t border-border mt-auto">
              {[
                { icon: Home, label: 'Home', active: true },
                { icon: Wallet, label: 'Wallet', active: false },
                { icon: Building, label: 'Orgs', active: false },
                { icon: Bell, label: 'Alerts', active: false },
                { icon: User, label: 'Profile', active: false },
              ].map((item, index) => (
                <button
                  key={index}
                  className={`flex flex-col items-center gap-0.5 text-xs text-muted-foreground transition-colors hover:text-primary font-sans py-1 px-3 relative ${
                    item.active ? 'text-primary' : ''
                  }`}
                >
                  <item.icon className="w-[20px] h-[20px]" />
                  {item.label}
                  {item.active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded" />
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