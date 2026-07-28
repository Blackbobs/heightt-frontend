'use client';

import { Rocket, Users, Building2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const stats = [
  { icon: Users, value: '500+', label: 'students waiting' },
  { icon: Building2, value: '25+', label: 'institutions' },
  { icon: Clock, value: '2 min', label: 'to join' },
];

export function WaitlistSection() {
  return (
    <section
      id="waitlist"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8 md:mb-10">
        <Badge className="mb-4 inline-flex items-center gap-2 cursor-default hover:bg-primary hover:text-white transition-all duration-300">
          <Rocket className="w-4 h-4 text-primary" />
          Early Access
        </Badge>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
          Join the{' '}
          <span className="text-primary relative inline-block">
            Waitlist
            <span className="absolute bottom-1 left-0 right-0 h-1.5 md:h-2 bg-primary/15 rounded -z-10" />
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Be the first to know when Heightt launches. Get early access and exclusive perks.
        </p>
      </div>

      {/* Google Form Embed */}
      <div className="bg-card border border-border rounded-2xl p-2 shadow-[0_4px_24px_rgba(0,0,0,0.05)] overflow-hidden">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdceacpTCgkSmJDk6TvLSygeeONaX5bdnxrbH7pn6jcCo8fEw/viewform?embedded=true"
          width="100%"
          height="415"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          className="rounded-xl border-0 block"
          title="Heightt Waitlist Form"
        >
          Loading…
        </iframe>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-6 sm:mt-8">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon className="w-4 h-4 text-primary flex-shrink-0" />
            <span>
              <strong className="text-foreground font-bold">{value}</strong> {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
