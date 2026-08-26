'use client';

import { useState } from 'react';
import {
  Route,
  Building2,
  UserPlus,
  FilePlus2,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { PhoneFrame } from '@/components/hero/PhoneFrame';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const steps = [
  {
    number: '01',
    icon: Building2,
    title: 'Onboard your organisation',
    description:
      'Create your organisation on Heightt and set up the executives responsible for managing it.',
    tag: 'Quick Setup',
  },
  {
    number: '02',
    icon: UserPlus,
    title: 'Add your members',
    description:
      'Bring your students onto the platform and organise your membership records.',
    tag: 'Roster Sync',
  },
  {
    number: '03',
    icon: FilePlus2,
    title: 'Create a due',
    description:
      'Enter the name, amount and relevant information for the payment you want to collect.',
    tag: 'Custom Amounts',
  },
  {
    number: '04',
    icon: CreditCard,
    title: 'Students pay',
    description:
      'Members can view their dues and make payments directly through Heightt.',
    tag: 'Online Checkout',
  },
  {
    number: '05',
    icon: CheckCircle2,
    title: 'Heightt keeps the records',
    description:
      'Payments are automatically recorded, giving executives an up-to-date view of collections without manually updating spreadsheets.',
    tag: 'Automated Audit',
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(3);

  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Header */}
      <ScrollReveal direction="up" className="text-center mb-16 md:mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-sm mb-4">
          <Route className="w-3.5 h-3.5" />
          How Heightt Works
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight text-balance">
          From creating a due to <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary">
            tracking every payment.
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A seamless 5-step workflow designed to eliminate manual reconciliation completely.
        </p>
      </ScrollReveal>

      {/* 2-Column Interactive Showcase with Steps on Left and Phone on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left: 5 Interactive Steps List */}
        <div className="lg:col-span-7 flex flex-col gap-3.5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;

            return (
              <ScrollReveal key={index} delay={index * 60}>
                <div
                  onClick={() => setActiveStep(index)}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex items-start gap-4 sm:gap-5 ${
                    isActive
                      ? 'bg-white border-2 border-primary shadow-[0_10px_30px_rgba(26,92,255,0.12)] -translate-y-0.5'
                      : 'bg-white/60 border-border hover:bg-white hover:border-primary/40 hover:shadow-md'
                  }`}
                >
                  {/* Numbered node */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-extrabold text-base flex-shrink-0 transition-colors ${
                      isActive
                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                        : 'bg-muted text-primary border border-border'
                    }`}
                  >
                    {step.number}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3
                        className={`text-base sm:text-lg font-bold transition-colors ${
                          isActive ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {step.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isActive
                            ? 'bg-primary/10 text-primary border-primary/20'
                            : 'bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        {step.tag}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Right: Phone Frame Preview Connected to the Walkthrough */}
        <ScrollReveal delay={150} direction="left" className="lg:col-span-5 flex justify-center items-center">
          <PhoneFrame currentStep={activeStep} onStepSelect={setActiveStep} />
        </ScrollReveal>
      </div>
    </section>
  );
}
