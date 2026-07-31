'use client';

import { useEffect, useRef, useState } from 'react';
import {
  PiggyBank,
  Coins,
  Wallet,
  Lock,
  TrendingUp,
  Bell,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const duesGoals = [
  {
    title: 'Departmental Dues',
    status: 'Active',
    statusType: 'active',
    currentAmount: '18,500',
    targetAmount: '25,000',
    progress: 74,
    colorClass: 'from-primary to-[oklch(60%_.2_270)]',
  },
  {
    title: 'Faculty Week',
    status: 'Urgent',
    statusType: 'urgent',
    currentAmount: '3,200',
    targetAmount: '5,000',
    progress: 64,
    colorClass: 'from-amber-500 to-amber-400',
  },
  {
    title: 'Convocation Gown',
    status: 'Active',
    statusType: 'active',
    currentAmount: '12,500',
    targetAmount: '35,000',
    progress: 36,
    colorClass: 'from-primary to-[oklch(60%_.2_270)]',
  },
  {
    title: 'Project Fund',
    status: 'Active',
    statusType: 'active',
    currentAmount: '28,000',
    targetAmount: '80,000',
    progress: 35,
    colorClass: 'from-primary to-[oklch(60%_.2_270)]',
  },
];

const featureTags = [
  { icon: Lock, label: 'Lock Funds' },
  { icon: TrendingUp, label: 'Track Progress' },
  { icon: Bell, label: 'Due Reminders' },
  { icon: CheckCircle, label: 'Auto-settle' },
];

export function SavingsSection() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [animatedProgress, setAnimatedProgress] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(duesGoals.map((g) => g.progress));
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleCardMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    const card = cardsRef.current[index];
    if (!card || window.innerWidth <= 768) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `perspective(600px) rotateX(${y * 6}deg) rotateY(${x * -6}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (card) {
      card.style.transform = '';
    }
  };

  return (
    <section
      id="study-tool"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-[oklch(38%_.18_265)] to-[oklch(30%_.18_265)] text-white relative overflow-hidden"
    >
      {/* Floating Animated Background Icons */}
      <div className="absolute top-10 left-[5%] text-white/5 animate-float-icon pointer-events-none">
        <PiggyBank className="w-16 h-16 sm:w-20 sm:h-20" />
      </div>
      <div className="absolute top-[50%] right-[8%] text-white/5 animate-float-icon pointer-events-none delay-1000">
        <Coins className="w-20 h-20 sm:w-28 sm:h-28" />
      </div>
      <div className="absolute bottom-12 left-[15%] text-white/5 animate-float-icon pointer-events-none delay-2000">
        <Wallet className="w-14 h-14 sm:w-16 sm:h-16" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14 md:mb-16">
          <Badge className="mb-4 inline-flex items-center gap-2 bg-white/12 text-white/90 border-white/20 backdrop-blur-md cursor-default hover:bg-white hover:text-primary transition-all duration-300">
            <PiggyBank className="w-4 h-4 text-white group-hover:text-primary" />
            Wallet &amp; Savings
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            Stop dreading dues. <br className="hidden sm:inline" />
            <span className="text-white/70">Save a little at a time.</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed">
            Lock funds into goals. Watch progress bars fill week by week.
            When the due date arrives, you're already paid up.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: 2x2 Dues Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {duesGoals.map((goal, index) => (
              <div
                key={index}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                onMouseMove={(e) => handleCardMouseMove(e, index)}
                onMouseLeave={() => handleCardMouseLeave(index)}
                className="bg-white/95 text-foreground backdrop-blur-lg border border-white/30 rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-500 hover:shadow-2xl hover:bg-white hover:-translate-y-1 group relative overflow-hidden cursor-default"
              >
                {/* Top Border Glow */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-[oklch(60%_.2_270)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Card Header */}
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {goal.title}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      goal.statusType === 'urgent'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-muted text-primary'
                    }`}
                  >
                    {goal.status}
                  </span>
                </div>

                {/* Amount Section */}
                <div className="mb-4">
                  <span className="text-xl sm:text-2xl font-extrabold text-foreground font-display">
                    <span className="text-sm font-semibold text-muted-foreground">₦</span>
                    {goal.currentAmount}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium mx-1">of</span>
                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                    ₦{goal.targetAmount}
                  </span>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-primary font-bold">{animatedProgress[index]}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${goal.colorClass} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${animatedProgress[index]}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Side Content CTA */}
          <div className="flex flex-col gap-6 lg:pl-6 pt-2">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
                Start saving <br />
                <span className="text-white/60">toward your goals</span>
              </h3>
              <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-md">
                Create a savings goal, lock funds, and watch your progress grow.
                When the due date arrives, you're already paid up.
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-2.5 mt-6">
                {featureTags.map((tag, idx) => {
                  const TagIcon = tag.icon;
                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 bg-white/12 border border-white/15 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-white/90 backdrop-blur-md"
                    >
                      <TagIcon className="w-3.5 h-3.5 text-white/80" />
                      {tag.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-2xl hover:scale-105 transition-all w-fit mt-2 font-bold cursor-pointer"
              asChild
            >
              <Link href="/signup">
                Create Account
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
