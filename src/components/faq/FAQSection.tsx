'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const faqs = [
  {
    number: '01',
    question: 'What is Heightt?',
    answer: [
      'Heightt is a financial operating platform for higher institutions and student organisations. It replaces manual cash collection, spreadsheets, and paper records with a modern digital infrastructure for managing student organisation finances.',
      'Students can join organisations, pay dues, manage a wallet, and stay on top of their financial activity. Organisation executives get admin tools to manage members, track payments, and publish announcements.',
    ],
  },
  {
    number: '02',
    question: 'How do I create an account?',
    answer: [
      'Signing up is simple and takes less than 2 minutes:',
      '1. Click "Get Started" on the homepage.\n2. Enter your student email address and create a password.\n3. Verify your email address.\n4. Complete your profile with your institution, faculty, department, and level.\n5. You\'re ready to start using Heightt!',
    ],
  },
  {
    number: '03',
    question: 'How do I pay my dues?',
    answer: [
      'Paying dues on Heightt is instant and secure:',
      '1. Open your Wallet from the dashboard.\n2. Click "Pay Dues".\n3. Select the organisation and due you want to pay.\n4. Review the amount and confirm.\n5. Your wallet balance is updated instantly, and you receive a digital receipt.',
      'You can also set up automatic savings toward your dues so you\'re always paid up on time.',
    ],
  },
  {
    number: '04',
    question: 'Is my money safe on Heightt?',
    answer: [
      'Absolutely. Security is our top priority.',
      '• All transactions are encrypted and secured with industry-standard protocols.\n• Every transaction is logged in a tamper-evident audit trail.\n• Your wallet balance is always backed by real funds held in trust.\n• We use two-factor authentication for sensitive actions.\n• Payment confirmations and receipts are generated instantly for every transaction.',
    ],
  },
  {
    number: '05',
    question: 'How do I fund my wallet?',
    answer: [
      'Funding your wallet is quick and easy:',
      '1. Go to your Wallet.\n2. Click "Fund Wallet".\n3. Enter the amount you want to add.\n4. Choose your preferred payment method (bank transfer, card, or mobile money).\n5. Complete the payment — your wallet updates instantly.',
      'You can also set up auto-funding to maintain a minimum balance.',
    ],
  },
  {
    number: '06',
    question: 'What is the savings feature?',
    answer: [
      'The savings feature lets you lock funds toward specific goals — like departmental dues, faculty fees, or a graduation gown.',
      '• Create a savings goal with a target amount and deadline.\n• Contribute small amounts regularly.\n• Watch your progress bar fill week by week.\n• When the due date arrives, you\'re already paid up.',
      'You can also create group savings (Esusu) with classmates for shared goals.',
    ],
  },
  {
    number: '07',
    question: 'Can I get a refund if I pay for an event?',
    answer: [
      'Yes. Heightt has built-in refund protection.',
      'If an event is cancelled, refunds flow straight back to your wallet — no stress, no delays.',
      'You\'ll receive a notification and a digital receipt confirming the refund. The funds are available in your wallet instantly.',
    ],
  },
  {
    number: '08',
    question: 'How do organisations withdraw funds?',
    answer: [
      'Organisation executives can request withdrawals directly from the admin dashboard:',
      '1. Go to "Withdrawals" in the admin panel.\n2. Enter the amount and select the verified bank account.\n3. Review and confirm the withdrawal request.\n4. Funds are transferred to the organisation\'s bank account.\n5. A digital receipt and audit log are generated automatically.',
      'All withdrawals are tracked and visible to members for full transparency.',
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
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative overflow-hidden"
    >
      {/* Header */}
      <div className="text-center mb-12 md:mb-16 relative z-10">
        <Badge className="mb-4 inline-flex items-center gap-2 cursor-default hover:bg-primary hover:text-white transition-all duration-300">
          <HelpCircle className="w-4 h-4 text-primary group-hover:text-white" />
          FAQ
        </Badge>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
          Got questions? <br className="hidden sm:inline" />
          <span className="text-primary relative inline-block">
            We've got answers.
            <span className="absolute bottom-1 left-0 right-0 h-1.5 md:h-2 bg-primary/15 rounded -z-10" />
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Everything you need to know about Heightt — from sign-up to settlement.
        </p>
      </div>

      {/* FAQ Accordion List */}
      <div className="flex flex-col gap-3 relative z-10">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`bg-card border rounded-2xl overflow-hidden transition-all duration-300 ${
                isOpen
                  ? 'border-primary shadow-lg shadow-primary/5'
                  : 'border-border hover:border-primary/40 hover:shadow-md'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left transition-colors hover:bg-muted/50 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <span
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center flex-shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-primary text-white'
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
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>

              {/* Accordion Answer Content */}
              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-border/60 text-sm sm:text-base text-muted-foreground leading-relaxed flex flex-col gap-3">
                  {faq.answer.map((paragraph, pIdx) => (
                    <p key={pIdx} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
