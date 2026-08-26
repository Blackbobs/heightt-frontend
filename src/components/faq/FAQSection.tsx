'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const faqs = [
  {
    number: '01',
    question: 'What is Heightt?',
    answer: [
      'Heightt is a financial management platform built for student organisations and their members.',
      'It helps organisations collect dues digitally, track payments and maintain organised financial records while giving students a simple way to make and track their payments.',
    ],
  },
  {
    number: '02',
    question: 'Who can use Heightt?',
    answer: [
      'Heightt is designed for student organisations including departments, faculties, associations, clubs, societies and other organised student communities.',
    ],
  },
  {
    number: '03',
    question: 'How do students pay their dues?',
    answer: [
      'When an organisation creates a due, eligible members can see the payment on their Heightt account and pay through the available payment methods.',
      'Once the payment is successful, Heightt automatically records it.',
    ],
  },
  {
    number: '04',
    question: 'Do executives need to manually confirm payments?',
    answer: [
      'Payments successfully processed through Heightt are recorded automatically, reducing the need for executives to manually verify transfers and update spreadsheets.',
    ],
  },
  {
    number: '05',
    question: 'Can executives see who has paid?',
    answer: [
      'Yes. Executives can track their organisation\'s collections and see members\' payment status from their dashboard.',
    ],
  },
  {
    number: '06',
    question: 'Is Heightt only for collecting dues?',
    answer: [
      'For now, dues collection and management are the core focus.',
      'We\'re building additional tools around student finance, payments and campus organisations, which will gradually become available on Heightt.',
    ],
  },
  {
    number: '07',
    question: 'Are savings, wallets and event tickets available?',
    answer: [
      'Not yet.',
      'These are part of the Heightt roadmap and will be clearly marked as Coming Soon until they become available.',
    ],
  },
  {
    number: '08',
    question: 'Can my organisation join Heightt?',
    answer: [
      'Yes. Student organisations interested in using Heightt can begin the onboarding process through the platform.',
    ],
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <ScrollReveal direction="up" className="text-center mb-14 md:mb-18 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-sm mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          FAQ
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight text-balance">
          Frequently Asked Questions
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Everything you need to know about Heightt and managing dues digitally.
        </p>
      </ScrollReveal>

      {/* FAQ Accordion List */}
      <div className="flex flex-col gap-4 relative z-10">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <ScrollReveal key={index} delay={index * 50}>
              <div
                className={`bg-white border rounded-3xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? 'border-primary shadow-[0_10px_30px_rgba(26,92,255,0.08)]'
                    : 'border-border hover:border-primary/40 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-2xl text-xs font-extrabold flex items-center justify-center flex-shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-muted text-primary'
                      }`}
                    >
                      {faq.number}
                    </span>
                    <span
                      className={`text-base sm:text-lg font-bold transition-colors ${
                        isOpen ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full border border-border flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-primary/10 border-primary/20 text-primary rotate-180' : 'text-muted-foreground'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Answer Content */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-muted-foreground leading-relaxed flex flex-col gap-3 border-t border-border/60">
                    {faq.answer.map((paragraph, pIdx) => (
                      <p key={pIdx} className="whitespace-pre-line pt-2">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
