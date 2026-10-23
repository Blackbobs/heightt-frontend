'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  FileText,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { faqs } from '@/lib/faq';
import { CollectionPreview, DashboardPreview } from './ProductPreview';
import './landing.css';

const steps = [
  ['1', 'Join your campus', 'Create your account and complete your student profile.'],
  ['2', 'See assigned dues', 'Every due from your organisations appears in one view.'],
  ['3', 'Pay securely', 'Complete payment through Heightt or use guest payment.'],
  ['4', 'Keep the receipt', 'Successful payments create a record you can access later.'],
] as const;

const studentBenefits = [
  'See every assigned due and its payment status',
  'Pay without sending proof through chat',
  'Find receipts and payment history in one account',
];

const organisationBenefits = [
  'Track collections and member payment status',
  'Reduce manual transfer confirmation',
  'Keep financial records ready for handover',
];

export function LandingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const needsOnboarding = user ? !user.profile?.onboardingCompleted : false;
  const signedIn = isAuthenticated && user;
  const startHref = signedIn ? (needsOnboarding ? '/onboarding' : '/dashboard') : '/signup';
  const startLabel = signedIn ? (needsOnboarding ? 'Complete onboarding' : 'Open dashboard') : 'Create account';
  const organisationHref = !signedIn ? '/signup' : needsOnboarding ? '/onboarding' : '/organizations/create';

  return (
    <div className="landing-page">
      <section className="landing-wrap landing-hero">
        <div className="hero-copy">
          <h1>Student payments, organised from start to receipt.</h1>
          <p>Heightt gives students one place to see and pay dues. Student organisations get clear collection records without spreadsheets or payment screenshots.</p>
          <div className="landing-actions">
            <Link className="landing-primary" href={startHref}>{startLabel}<ArrowRight /></Link>
            <Link className="landing-secondary" href="/payments/guest">Pay as guest</Link>
          </div>
          <div className="hero-points"><span><ShieldCheck /> Secure payment flow</span><span><FileCheck2 /> Verified records</span></div>
        </div>
        <DashboardPreview />
      </section>

      <section id="for-students" className="landing-wrap product-section">
        <div className="section-intro">
          <h2>Built around real campus payment work.</h2>
          <p>Students need clarity. Executives need reliable records. Heightt gives each person the right view of the same payment activity.</p>
        </div>
        <div className="audience-grid">
          <article className="audience-card">
            <div className="card-title"><CreditCard /><div><h3>For students</h3><p>Know what needs attention.</p></div></div>
            <ul>{studentBenefits.map((benefit) => <li key={benefit}><CheckCircle2 />{benefit}</li>)}</ul>
            <Link href={startHref}>View your dashboard <ArrowRight /></Link>
          </article>
          <article id="for-executives" className="audience-card">
            <div className="card-title"><Users /><div><h3>For organisations</h3><p>Know how collection is going.</p></div></div>
            <ul>{organisationBenefits.map((benefit) => <li key={benefit}><CheckCircle2 />{benefit}</li>)}</ul>
            <Link href={organisationHref}>Create an organisation <ArrowRight /></Link>
          </article>
        </div>
      </section>

      <section className="product-workspace">
        <div className="landing-wrap workspace-grid">
          <div className="workspace-copy">
            <h2>Collection progress without manual reconciliation.</h2>
            <p>Executives can see amounts collected and who has paid. Students see the same due status in their own account.</p>
            <div className="workspace-note"><FileText /><span><strong>One payment record</strong> connects collection reporting, student history, and receipts.</span></div>
          </div>
          <CollectionPreview />
        </div>
      </section>

      <section id="how-it-works" className="landing-wrap process-section">
        <div className="section-intro"><h2>A direct payment flow.</h2><p>No new process to learn. Heightt keeps each step clear and gives feedback when payment completes.</p></div>
        <ol className="process-grid">{steps.map(([number, title, description]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></li>)}</ol>
      </section>

      <section id="why-heightt" className="landing-wrap organisation-section">
        <div><h2>Bring your student organisation onto Heightt.</h2><p>Submit your organisation details for review. Admin access activates only after approval, while existing academic memberships stay unchanged.</p><Link className="landing-primary" href={organisationHref}>Start organisation request <ArrowRight /></Link></div>
        <div className="request-panel"><div><span>1</span><p><strong>Submit request</strong>Share organisation type, scope, and campus relationship.</p></div><div><span>2</span><p><strong>Platform review</strong>Heightt checks the request before access activates.</p></div><div><span>3</span><p><strong>Admin access</strong>Approved administrators receive the correct dashboard access.</p></div></div>
      </section>

      <section id="faq" className="landing-wrap faq-section">
        <div className="section-intro"><h2>Questions about Heightt.</h2><p>Clear answers about payments, organisations, and what the product supports today.</p></div>
        <div className="faq-list">{faqs.map((faq) => <details key={faq.number}><summary>{faq.question}</summary>{faq.answer.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</details>)}</div>
      </section>

      <section className="landing-wrap final-section"><div><h2>Ready to organise your campus payments?</h2><p>Create an account, connect with your organisations, and keep each payment record in one place.</p></div><Link className="landing-primary" href={startHref}>{startLabel}<ArrowRight /></Link></section>
    </div>
  );
}
