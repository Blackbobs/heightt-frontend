'use client';

import {
  GraduationCap,
  Building,
  Users2,
  Landmark,
  Compass,
  Award,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const communities = [
  {
    icon: GraduationCap,
    title: 'Departments',
    example: 'NACOS, NESA, ASES, NUESA...',
    description: 'Collect level & departmental annual dues seamlessly.',
    tag: '100 - 1,000+ Students',
  },
  {
    icon: Building,
    title: 'Faculties',
    example: 'Science, Engineering, Law, Arts...',
    description: 'Scale collections across thousands of students in multiple departments.',
    tag: 'Faculty Levies',
  },
  {
    icon: Users2,
    title: 'Student Associations',
    example: 'State & Regional Student Unions...',
    description: 'Manage member dues, registration fees and event levies.',
    tag: 'Union Dues',
  },
  {
    icon: Landmark,
    title: 'Student Representative Councils',
    example: 'SUG, SRC & Legislative Councils...',
    description: 'Centralized financial oversight and institution-wide dues collection.',
    tag: 'Campus-wide',
  },
  {
    icon: Compass,
    title: 'Clubs & Societies',
    example: 'Rotaract, Toastmasters, Tech Hubs...',
    description: 'Membership subscriptions, project funds and chapter fees.',
    tag: 'Subscriptions',
  },
  {
    icon: Award,
    title: 'Professional Student Bodies',
    example: 'NIM, ICAN, IEEE Student Chapters...',
    description: 'Professional dues, induction fees and certification drives.',
    tag: 'Induction Fees',
  },
  {
    icon: Sparkles,
    title: 'Campus Organisations',
    example: 'Fellowships, Fraternities, Sports...',
    description: 'Custom dues and shared community finances.',
    tag: 'Custom Collections',
  },
];

export function BuiltForCampusSection() {
  return (
    <section
      id="communities"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <ScrollReveal direction="up" className="text-center mb-16 md:mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-sm mb-4">
          <Building className="w-3.5 h-3.5" />
          Built for campus
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight text-balance">
          One platform. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary">
            Different student communities.
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Whether you're collecting departmental dues from 100 students or managing payments across a much larger student body, Heightt gives you one system for keeping everything organised.
        </p>
      </ScrollReveal>

      {/* Grid of 7 Communities in Framer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
        {communities.map((item, index) => {
          const Icon = item.icon;

          return (
            <ScrollReveal key={index} delay={index * 60} className="h-full">
              <div className="bg-white border border-border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/40 group flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-primary mb-2.5">
                    {item.example}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-border/70 flex items-center justify-between text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Start collecting</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
