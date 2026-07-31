'use client';

import React, { useState } from 'react';
import { PiggyBank, Plus, Target, TrendingUp, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Goal {
  id: number;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  color: string;
  bg: string;
}

const GOALS: Goal[] = [
  { id: 1, name: 'Departmental Dues 2025/26', target: 25000, saved: 18500,  deadline: 'Dec 15, 2025', color: 'bg-[#1a5cff]', bg: 'bg-[#eef3ff]' },
  { id: 2, name: 'Faculty Week Ticket',        target: 5000,  saved: 3200,   deadline: 'Nov 30, 2025', color: 'bg-amber-500', bg: 'bg-amber-50' },
  { id: 3, name: 'Convocation Gown',           target: 35000, saved: 12600,  deadline: 'Mar 10, 2026', color: 'bg-violet-500', bg: 'bg-violet-50' },
  { id: 4, name: 'Project Fund',               target: 50000, saved: 8400,   deadline: 'Jan 20, 2026', color: 'bg-emerald-500', bg: 'bg-emerald-50' },
];

const HISTORY = [
  { goal: 'Dept. Dues', amount: '+₦5,000', date: 'Nov 10, 2025', icon: 'D' },
  { goal: 'Faculty Week Ticket', amount: '+₦2,000', date: 'Nov 5, 2025', icon: 'F' },
  { goal: 'Dept. Dues', amount: '+₦8,000', date: 'Oct 30, 2025', icon: 'D' },
  { goal: 'Convocation Gown', amount: '+₦3,000', date: 'Oct 22, 2025', icon: 'C' },
];

export function SavingsPage() {
  const [activeGoal, setActiveGoal] = useState<number | null>(null);

  const totalSaved  = GOALS.reduce((a, g) => a + g.saved, 0);
  const totalTarget = GOALS.reduce((a, g) => a + g.target, 0);
  const overallPct  = Math.round((totalSaved / totalTarget) * 100);

  return (
    <div className="space-y-5 pb-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-br from-[#1a5cff] to-[#0f4ad0] rounded-[22px] px-6 py-6 text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="flex items-center gap-2 mb-4">
          <PiggyBank className="w-4 h-4 text-white/70" />
          <span className="text-[0.68rem] text-white/70 font-semibold uppercase tracking-widest">Savings Overview</span>
        </div>
        <p className="text-[2rem] font-extrabold tracking-tight leading-none mb-1">
          ₦{totalSaved.toLocaleString()}
        </p>
        <p className="text-[0.7rem] text-white/60 mb-4">
          of ₦{totalTarget.toLocaleString()} across {GOALS.length} goals
        </p>
        <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-1000"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[0.65rem] text-white/60">Overall progress</span>
          <span className="text-[0.7rem] font-bold text-white">{overallPct}%</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Goals', value: GOALS.length, icon: Target },
          { label: 'Total Saved', value: '₦39.7k',     icon: PiggyBank },
          { label: 'Avg Progress', value: '55%',        icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-[#e8ecf1] rounded-[14px] p-3.5 text-center">
            <div className="w-7 h-7 rounded-[8px] bg-[#eef3ff] flex items-center justify-center mx-auto mb-2">
              <Icon className="w-3.5 h-3.5 text-[#1a5cff]" />
            </div>
            <p className="text-[0.9rem] font-bold text-[#1a1a2e]">{value}</p>
            <p className="text-[0.58rem] text-[#7a8ba3] mt-0.5 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Goals List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[0.9rem] font-semibold text-[#1a1a2e]">My Goals</h3>
          <button className="flex items-center gap-1.5 text-[0.7rem] font-semibold text-[#1a5cff] bg-[#eef3ff] px-3 py-1.5 rounded-full border-none cursor-pointer hover:bg-[#dce8ff] transition-colors">
            <Plus className="w-3 h-3" />
            New Goal
          </button>
        </div>

        <div className="space-y-2.5">
          {GOALS.map((goal) => {
            const pct = Math.round((goal.saved / goal.target) * 100);
            const remaining = goal.target - goal.saved;
            const isExpanded = activeGoal === goal.id;

            return (
              <div
                key={goal.id}
                className="bg-white border border-[#e8ecf1] rounded-[16px] overflow-hidden cursor-pointer"
                onClick={() => setActiveGoal(isExpanded ? null : goal.id)}
              >
                <div className="px-4 py-4 hover:bg-[#fafbff] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0', goal.bg)}>
                      <PiggyBank className={cn('w-4 h-4', goal.color.replace('bg-', 'text-'))} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.82rem] font-semibold text-[#1a1a2e] truncate">{goal.name}</p>
                      <p className="text-[0.6rem] text-[#7a8ba3] mt-0.5">Due {goal.deadline}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[0.82rem] font-bold text-[#1a1a2e]">{pct}%</p>
                      <p className="text-[0.58rem] text-[#7a8ba3]">₦{goal.saved.toLocaleString()}</p>
                    </div>
                    <ChevronRight className={cn('w-4 h-4 text-[#c8d0db] flex-shrink-0 transition-transform', isExpanded && 'rotate-90')} />
                  </div>
                  <div className="mt-3 h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', goal.color)} style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-[#f0f2f5] px-4 py-4 bg-[#fafbff]">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'Target',    val: `₦${goal.target.toLocaleString()}` },
                        { label: 'Saved',     val: `₦${goal.saved.toLocaleString()}` },
                        { label: 'Remaining', val: `₦${remaining.toLocaleString()}` },
                      ].map(({ label, val }) => (
                        <div key={label} className="text-center">
                          <p className="text-[0.78rem] font-bold text-[#1a1a2e]">{val}</p>
                          <p className="text-[0.58rem] text-[#7a8ba3] mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full bg-[#1a5cff] text-white text-[0.75rem] font-semibold py-2.5 rounded-[10px] border-none cursor-pointer hover:bg-[#0f4ad0] active:scale-[0.98] transition-all">
                      Add to this Goal
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Savings Activity */}
      <div>
        <h3 className="text-[0.9rem] font-semibold text-[#1a1a2e] mb-3">Recent Activity</h3>
        <div className="bg-white border border-[#e8ecf1] rounded-[16px] divide-y divide-[#f0f2f5] overflow-hidden">
          {HISTORY.map((h, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-[#fafbff] transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#eef3ff] flex items-center justify-center text-[#1a5cff] text-[0.68rem] font-bold flex-shrink-0">
                {h.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.78rem] font-medium text-[#1a1a2e] truncate">{h.goal}</p>
                <p className="text-[0.58rem] text-[#7a8ba3]">{h.date}</p>
              </div>
              <span className="text-[0.78rem] font-bold text-[#0f7b4a]">{h.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
