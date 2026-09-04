'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from '@/lib/faq';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="border-b border-slate-200/80 bg-[#F8FAFC] py-16 dark:border-slate-800 dark:bg-[#0B1020] sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
        
        <div className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2563EB]">
          FAQ
        </div>
        <h2 className="mb-10 mt-3 text-center text-3xl font-semibold tracking-[-0.045em] text-[#0B1020] dark:text-white sm:text-4xl">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white transition-colors dark:border-slate-800 dark:bg-[#131B2E]"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                >
                  <span className="text-sm sm:text-base font-bold text-[#0B1020] dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#2563EB] transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 space-y-2">
                    {faq.answer.map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
