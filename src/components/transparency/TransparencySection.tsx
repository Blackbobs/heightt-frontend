'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Eye,
  BarChart3,
  Users,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const transparencyFeatures = [
  {
    icon: BarChart3,
    title: 'Public collection summaries per due',
    description: "See exactly what's been collected and what's left.",
  },
  {
    icon: Users,
    title: 'Per-student payment ledger',
    description: "Track who has paid and who hasn't — individually.",
  },
  {
    icon: ShieldCheck,
    title: 'Tamper-evident audit logs',
    description: 'Every action is logged and immutable. Full accountability.',
  },
  {
    icon: FileSpreadsheet,
    title: 'CSV exports for reconciliation',
    description: 'Download reports in one click. Reconcile with ease.',
  },
];

const budgetItems = [
  {
    label: 'Project Defense Logistics',
    amount: '₦1,200,000',
    dotColor: 'bg-primary shadow-primary/40',
  },
  {
    label: 'Lab Maintenance',
    amount: '₦900,000',
    dotColor: 'bg-success shadow-success/40',
  },
  {
    label: 'Department T-shirts',
    amount: '₦480,000',
    dotColor: 'bg-warning shadow-warning/40',
  },
  {
    label: 'Welfare & Awards',
    amount: '₦620,000',
    dotColor: 'bg-destructive shadow-destructive/40',
  },
];

export function TransparencySection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(60);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth <= 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    cardRef.current.style.transform = `perspective(800px) rotateX(${y * 6}deg) rotateY(${x * -6}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = '';
    }
  };

  return (
    <section
      id="transparency"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Header */}
      <div className="text-center mb-14 md:mb-20 relative z-10">
        <Badge className="mb-5 inline-flex items-center gap-2 cursor-default hover:bg-primary hover:text-white transition-all duration-300">
          <Eye className="w-4 h-4 text-primary group-hover:text-white" />
          Financial Transparency
        </Badge>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
          Every kobo, <br className="hidden sm:inline" />
          <span className="text-primary relative inline-block">
            accounted for.
            <span className="absolute bottom-1 left-0 right-0 h-1.5 md:h-2 bg-primary/15 rounded -z-10" />
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Students can see what's been collected and how it's been spent.
          Organizations get receipts, audit logs, and exportable reports —
          turning every treasury into a glass house.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left: Features List */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {transparencyFeatures.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-all duration-300 hover:translate-x-2 hover:border-primary/40 hover:shadow-lg group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-105 group-hover:-rotate-3">
                  <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Interactive Stats Card */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl transition-all duration-500 hover:border-primary/40 hover:shadow-2xl"
        >
          {/* Stats Header */}
          <div className="flex justify-between items-start pb-6 mb-6 border-b border-border flex-wrap gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                Departmental Dues
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">CSC 2025/26</p>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-2xl sm:text-3xl font-extrabold text-primary font-display block">
                ₦7,800,000
              </span>
              <span className="text-xs text-muted-foreground font-medium">Collected</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs sm:text-sm font-semibold mb-2">
              <span className="text-foreground">Progress</span>
              <span className="text-primary">{progress}% of target</span>
            </div>
            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-[oklch(60%_.2_270)] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className="flex flex-col gap-3">
            {budgetItems.map((budget, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/60 hover:bg-muted transition-all duration-300 hover:translate-x-1 group cursor-default"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full ${budget.dotColor} transition-transform duration-300 group-hover:scale-125`}
                  />
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    {budget.label}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-foreground font-display">
                  {budget.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
