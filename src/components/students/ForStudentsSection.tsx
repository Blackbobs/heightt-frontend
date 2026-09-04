'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Eye,
  CreditCard,
  CheckCircle2,
  FileCheck,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Sparkles,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const studentDues = [
  {
    id: 'dept',
    title: 'Departmental Annual Dues',
    org: 'Computer Science (NACOS)',
    amount: '₦12,500',
    receiptNo: 'HT-84920',
    status: 'Auto-Cleared',
  },
  {
    id: 'fac',
    title: 'Faculty Development Levy',
    org: 'Faculty of Physical Sciences',
    amount: '₦8,000',
    receiptNo: 'HT-84921',
    status: 'Auto-Cleared',
  },
  {
    id: 'sug',
    title: 'Student Union Government',
    org: 'SUG General Dues',
    amount: '₦2,500',
    receiptNo: 'HT-84922',
    status: 'Auto-Cleared',
  },
];

const studentPillars = [
  {
    icon: Eye,
    title: 'See Your Dues',
    desc: 'Clear breakdown of active dues and assigned amounts.',
  },
  {
    icon: CreditCard,
    title: 'Pay Online',
    desc: 'Pay directly via card or bank transfer without queueing.',
  },
  {
    icon: CheckCircle2,
    title: 'Track Payments',
    desc: 'Instant confirmation without asking excos if they received it.',
  },
  {
    icon: FileCheck,
    title: 'Keep Your Records',
    desc: 'Permanent digital clearance receipts saved to your account.',
  },
];

export function ForStudentsSection() {
  const [selectedDue, setSelectedDue] = useState(studentDues[0]);

  return (
    <section
      id="for-students"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Blue Background Framer Banner Container */}
      <ScrollReveal direction="up">
        <div className="relative rounded-[36px] bg-gradient-to-br from-[#2563EB] via-[#124bda] to-[#0932a3] text-white p-8 sm:p-12 md:p-14 lg:p-16 overflow-hidden shadow-[0_30px_90px_rgba(26,92,255,0.3)] border border-white/20">
          {/* Ambient Lighting & Glow Flares */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/20 rounded-full blur-3xl pointer-events-none" />

          {/* Floating Subtle Ambient Icons in Background */}
          <div className="absolute top-8 right-16 text-white/10 hidden md:block animate-float-slow">
            <GraduationCap className="w-16 h-16" />
          </div>
          <div className="absolute bottom-10 left-12 text-white/10 hidden md:block animate-float-slow [animation-delay:2s]">
            <Receipt className="w-14 h-14" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
            {/* Left Column: Clean Scannable Text & White Icon Cards */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs font-bold mb-3 backdrop-blur-md shadow-sm">
                  <GraduationCap className="w-3.5 h-3.5" />
                  For Students
                </div>

                <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight text-white leading-[1.12]">
                  Paying your dues should be <br className="hidden sm:inline" />
                  the easy part.
                </h2>

                <p className="text-sm sm:text-base text-white/85 mt-3 leading-relaxed max-w-lg font-normal">
                  No more chasing executives or wondering if your transfer was recorded. View dues, pay online, and access verified digital receipts instantly.
                </p>
              </div>

              {/* 4 White Floating Icon Cards with Hover Animations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {studentPillars.map((item, idx) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/10 hover:bg-white border border-white/15 hover:border-white text-white hover:text-primary transition-all duration-300 group shadow-sm hover:shadow-xl hover:-translate-y-1 backdrop-blur-md cursor-default"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white text-primary flex items-center justify-center mb-2.5 shadow-sm group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-foreground transition-colors mb-0.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/75 group-hover:text-muted-foreground transition-colors leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-white text-primary hover:bg-white/95 font-bold rounded-2xl px-8 py-3.5 shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer w-full sm:w-auto"
                  asChild
                >
                  <Link href="/signup">
                    Create Student Account
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column: Clean Interactive Digital Receipt Showcase */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 text-foreground shadow-2xl border border-white/40 relative overflow-hidden">
                {/* Header Profile Bar */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      AO
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Adaeze Okafor</h4>
                      <p className="text-[11px] text-muted-foreground">CSC/2021/049 · Computer Science</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    100% Cleared
                  </span>
                </div>

                {/* Dues Switcher Pills */}
                <div className="flex flex-col gap-2 mb-5">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Select Receipt:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {studentDues.map((due) => (
                      <button
                        key={due.id}
                        onClick={() => setSelectedDue(due)}
                        className={`px-2.5 py-2 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer border ${
                          selectedDue.id === due.id
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-muted text-muted-foreground border-border hover:bg-border/60'
                        }`}
                      >
                        {due.id === 'dept' ? 'Dept Dues' : due.id === 'fac' ? 'Faculty' : 'SUG'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Digital Receipt Box */}
                <div className="bg-muted/50 border border-border/80 rounded-2xl p-4.5 relative">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase flex items-center gap-1 w-fit mb-1">
                        <CheckCircle2 className="w-3 h-3" /> {selectedDue.status}
                      </span>
                      <h5 className="font-bold text-foreground text-sm leading-tight">
                        {selectedDue.title}
                      </h5>
                      <p className="text-[11px] text-muted-foreground">{selectedDue.org}</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center text-primary shadow-sm">
                      <QrCode className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-2.5 my-2 border-y border-border text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">AMOUNT</span>
                      <span className="font-extrabold text-foreground text-base font-display">
                        {selectedDue.amount}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">RECEIPT ID</span>
                      <span className="font-mono font-bold text-primary text-[11px]">
                        #{selectedDue.receiptNo}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Clearance Verified
                    </span>
                    <span className="text-primary font-bold hover:underline cursor-pointer">
                      Download PDF
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
