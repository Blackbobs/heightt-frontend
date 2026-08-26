'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Briefcase,
  Eye,
  CreditCard,
  CheckCircle2,
  FileCheck,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Sparkles,
  Receipt,
  PlusCircle,
  Activity,
  Users,
  FolderLock,
  FileCheck2,
  TrendingDown,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

/* ── Student data ──────────────────────────────────────────── */
const studentDues = [
  {
    id: 'dept',
    label: 'Dept Dues',
    title: 'Departmental Annual Dues',
    org: 'Computer Science (NACOS)',
    amount: '₦12,500',
    receiptNo: 'HT-84920',
  },
  {
    id: 'fac',
    label: 'Faculty',
    title: 'Faculty Development Levy',
    org: 'Faculty of Physical Sciences',
    amount: '₦8,000',
    receiptNo: 'HT-84921',
  },
  {
    id: 'sug',
    label: 'SUG',
    title: 'Student Union Government',
    org: 'SUG General Dues',
    amount: '₦2,500',
    receiptNo: 'HT-84922',
  },
];

const studentPillars = [
  { icon: Eye,         title: 'See Your Dues',     desc: 'Clear breakdown of active dues and assigned amounts.' },
  { icon: CreditCard,  title: 'Pay Online',         desc: 'Pay directly via card or bank transfer without queueing.' },
  { icon: CheckCircle2, title: 'Track Payments',   desc: 'Instant confirmation — no need to ask the exco.' },
  { icon: FileCheck,   title: 'Keep Your Records',  desc: 'Permanent digital clearance receipts on your account.' },
];

/* ── Executive data ────────────────────────────────────────── */
const execPillars = [
  { icon: PlusCircle,  title: 'Create & Manage Dues',    desc: 'Set amounts, details and publish dues to your members in minutes.' },
  { icon: Activity,    title: 'Track Payments Live',      desc: 'See payments as they happen — no more spreadsheet updates.' },
  { icon: Users,       title: 'Know Who Has Paid',        desc: 'Filter by matric, department or payment status instantly.' },
  { icon: FolderLock,  title: 'Member Directory',         desc: 'All members and payment records in one organised place.' },
  { icon: FileCheck2,  title: 'Financial Records',        desc: 'Tamper-evident audit-ready history for every collection.' },
  { icon: TrendingDown, title: '90% Less Admin Work',    desc: 'Save 15+ hours weekly — focus on running your organisation.' },
];

type Tab = 'students' | 'executives';

export function AudienceSection() {
  const [tab, setTab] = useState<Tab>('students');
  const [selectedDue, setSelectedDue] = useState(studentDues[0]);

  return (
    <section id="audience" className="w-full relative overflow-hidden">
      {/* Full-width blue banner */}
      <div className="relative w-full bg-gradient-to-br from-[#1a5cff] via-[#124bda] to-[#0932a3] text-white px-4 sm:px-6 lg:px-12 xl:px-20 py-16 sm:py-20 md:py-24 overflow-hidden">
        {/* Ambient flares */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-black/20 rounded-full blur-3xl pointer-events-none" />

        {/* Floating ambient icons */}
        <GraduationCap className="absolute top-10 right-20 w-20 h-20 text-white/8 hidden lg:block animate-float-slow" />
        <Receipt        className="absolute bottom-10 left-16 w-16 h-16 text-white/8 hidden lg:block animate-float-slow [animation-delay:2s]" />
        <Briefcase      className="absolute top-1/2 right-8 w-14 h-14 text-white/6 hidden lg:block animate-float-slow [animation-delay:4s]" />

        {/* Inner content wrapper */}
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-10">

          {/* Toggle Pill */}
          <ScrollReveal direction="up" className="flex justify-center">
            <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-md shadow-inner">
              <button
                onClick={() => setTab('students')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                  tab === 'students'
                    ? 'bg-white text-primary shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                For Students
              </button>
              <button
                onClick={() => setTab('executives')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                  tab === 'executives'
                    ? 'bg-white text-primary shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                For Executives
              </button>
            </div>
          </ScrollReveal>

          {/* ── STUDENTS PANEL ── */}
          {tab === 'students' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left: Headline + 4 cards */}
              <ScrollReveal direction="right" className="lg:col-span-6 flex flex-col gap-6">
                <div>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight text-white leading-[1.12]">
                    Paying your dues should be <br className="hidden sm:inline" />
                    the easy part.
                  </h2>
                  <p className="text-sm sm:text-base text-white/80 mt-3 leading-relaxed max-w-lg">
                    View dues assigned to you, pay online, and get verified digital clearance receipts — without messaging a single executive.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                        <p className="text-xs text-white/70 group-hover:text-muted-foreground transition-colors leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-primary font-bold text-sm shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    Create Student Account <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollReveal>

              {/* Right: Interactive Receipt Card */}
              <ScrollReveal direction="left" className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 text-foreground shadow-2xl border border-white/30">
                  {/* Profile bar */}
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

                  {/* Due selector */}
                  <div className="flex flex-col gap-2 mb-5">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Select Receipt:</span>
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
                          {due.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Receipt */}
                  <div className="bg-muted/50 border border-border rounded-2xl p-4 relative">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase flex items-center gap-1 w-fit mb-1">
                          <CheckCircle2 className="w-3 h-3" /> Auto-Cleared
                        </span>
                        <h5 className="font-bold text-foreground text-sm">{selectedDue.title}</h5>
                        <p className="text-[11px] text-muted-foreground">{selectedDue.org}</p>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center text-primary shadow-sm">
                        <QrCode className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 py-2.5 my-2 border-y border-border text-xs">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">AMOUNT</span>
                        <span className="font-extrabold text-foreground text-base font-display">{selectedDue.amount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">RECEIPT ID</span>
                        <span className="font-mono font-bold text-primary text-[11px]">#{selectedDue.receiptNo}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Clearance Verified
                      </span>
                      <span className="text-primary font-bold hover:underline cursor-pointer">Download PDF</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          )}

          {/* ── EXECUTIVES PANEL ── */}
          {tab === 'executives' && (
            <div className="flex flex-col gap-10">
              <ScrollReveal direction="up">
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight text-white leading-[1.12]">
                    Your tenure shouldn't be spent <br className="hidden sm:inline" />
                    updating spreadsheets.
                  </h2>
                  <p className="text-sm sm:text-base text-white/80 mt-3 leading-relaxed">
                    Create a due once and let Heightt handle the records automatically as students pay.
                  </p>
                </div>
              </ScrollReveal>

              {/* 6 white hover cards in 3-col grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {execPillars.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <ScrollReveal key={idx} delay={idx * 60}>
                      <div className="p-5 rounded-2xl bg-white/10 hover:bg-white border border-white/15 hover:border-white text-white hover:text-primary transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 backdrop-blur-md cursor-default h-full">
                        <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-white group-hover:text-foreground transition-colors mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-white/70 group-hover:text-muted-foreground transition-colors leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>

              {/* CTA */}
              <ScrollReveal delay={200} className="flex justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-primary font-bold text-sm shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  Onboard Your Organisation <ArrowRight className="w-4 h-4" />
                </Link>
              </ScrollReveal>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
