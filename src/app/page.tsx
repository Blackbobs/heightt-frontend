import { HeroSection } from '@/components/hero/HeroSection';
import { ProblemSection } from '@/components/problem/ProblemSection';
import { AudienceSection } from '@/components/audience/AudienceSection';
import { HowItWorksSection } from '@/components/how-it-works/HowItWorksSection';
import { FinalCTASection } from '@/components/cta/FinalCTASection';
import { FAQSection } from '@/components/faq/FAQSection';
import { faqs } from '@/lib/faq';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, SOCIAL_IMAGE } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE.url],
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        email: 'support@heightt.com',
        description: SITE_DESCRIPTION,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}/#software`,
        name: SITE_NAME,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        provider: { '@id': `${SITE_URL}/#organization` },
        audience: {
          '@type': 'Audience',
          audienceType: 'Students and student organisations in Africa',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer.join(' '),
          },
        })),
      },
    ],
  };

  return (
    <main className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* HERO */}
      <HeroSection />

      {/* THE PROBLEM */}
      <ProblemSection />

      {/* FOR STUDENTS + FOR EXECUTIVES (toggle) */}
      <AudienceSection />

      {/* HOW IT WORKS */}
      <HowItWorksSection />

      {/* FAQ */}
      <FAQSection />

      {/* FINAL CTA */}
      <FinalCTASection />
    </main>
  );
}
