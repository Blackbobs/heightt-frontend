import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { SUPPORT_EMAIL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy — Heightt",
  description: "How Heightt collects, uses, shares, and protects personal data.",
  alternates: { canonical: "/privacy" },
};

const sections: LegalSection[] = [
  {
    id: "scope",
    title: "Scope and who we are",
    content: <p>This policy explains how Heightt handles personal data when you visit our website, create or use an account, join a student organisation, pay a due, use guest checkout, receive a receipt, or contact us. Heightt is the controller of personal data used to operate the platform. A student organisation may separately control information it enters or uses to manage its members and dues.</p>,
  },
  {
    id: "data-we-collect",
    title: "Data we collect",
    content: <><p>Depending on how you use Heightt, we may collect:</p><ul><li><strong>Account data:</strong> email address, username, password hash, verification status, and account status.</li><li><strong>Profile and academic data:</strong> name, phone number, gender, country, profile image, institution, faculty, department, academic level, matriculation number, and academic status.</li><li><strong>Organisation data:</strong> memberships, roles, permissions, applications, announcements, and activity performed for an organisation.</li><li><strong>Payment data:</strong> dues, payment amount and status, transaction references, payment method, receipts, and refund or reconciliation information. Card details are entered with the payment provider and are not stored by Heightt.</li><li><strong>Guest payment data:</strong> name, email, phone number, matriculation number, academic scope, payment records, and claim-verification information.</li><li><strong>Technical and security data:</strong> IP address, browser or device information, session records, timestamps, request logs, and security events.</li></ul></>,
  },
  {
    id: "how-we-use-data",
    title: "How and why we use data",
    content: <><p>We use personal data to create and secure accounts; verify identity and email addresses; match students with eligible organisations and dues; initiate, confirm, and reconcile payments; issue receipts; support guest-payment claims; provide notifications; respond to support requests; prevent fraud and abuse; maintain audit records; and improve platform reliability.</p><p>Our lawful bases may include performing our contract with you, complying with legal obligations, pursuing legitimate interests such as security and service improvement, and consent where the law requires it.</p></>,
  },
  {
    id: "sharing",
    title: "When data is shared",
    content: <><p>We share only what is reasonably needed with:</p><ul><li>student organisations and authorised administrators so they can manage memberships, dues, payment status, and financial records;</li><li>payment providers, including Bachs and its payment partners, to create checkout sessions, process transactions, reconcile status, and address payment issues;</li><li>email, hosting, storage, security, and infrastructure providers that process data for Heightt under appropriate instructions;</li><li>professional advisers, regulators, law enforcement, or courts when disclosure is required or reasonably necessary to protect rights, users, and the service; and</li><li>a successor entity in a merger, restructuring, financing, or sale, subject to applicable safeguards.</li></ul><p>We do not sell personal data or use it for third-party behavioural advertising.</p></>,
  },
  {
    id: "payments",
    title: "Payments and receipts",
    content: <p>When you begin a payment, relevant contact, amount, organisation, and transaction information is sent to the payment provider. Its own privacy terms govern the information collected directly on its checkout page. Heightt retains transaction and receipt records needed to provide payment history, support reconciliation, meet financial-record obligations, and resolve disputes.</p>,
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    content: <><p>Heightt uses essential cookies and similar browser storage to authenticate sessions, protect requests against forgery, remember interface preferences, support installation of the web app, and safely continue payment status checks. Some short-lived guest-payment information is kept in session storage so it is removed when the browser session ends.</p><p>These technologies are necessary to deliver features you request. If optional analytics or advertising technologies are introduced, we will provide any notice and choices required by law.</p></>,
  },
  {
    id: "retention",
    title: "How long we keep data",
    content: <p>We keep personal data only for as long as it is needed for the purposes described here, including maintaining your account, preserving financial and audit records, meeting legal obligations, preventing fraud, and resolving disputes. Retention periods vary by record type. When data is no longer needed, we delete it, anonymise it, or securely isolate it until deletion is possible.</p>,
  },
  {
    id: "security",
    title: "How we protect data",
    content: <p>We use administrative and technical controls designed to protect personal data, including access controls, hashed passwords and tokens, secure session cookies, request-verification measures, scoped administrator permissions, and audit logging. No online service can guarantee absolute security. Keep your credentials and verification codes private and contact us if you suspect unauthorised access.</p>,
  },
  {
    id: "your-rights",
    title: "Your privacy rights",
    content: <><p>Subject to the Nigeria Data Protection Act 2023 and other applicable law, you may have the right to be informed, access your data, correct inaccurate data, object to or restrict certain processing, withdraw consent, request deletion, receive portable data, and challenge certain automated decisions. You may also complain to the Nigeria Data Protection Commission.</p><p>To make a request, email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. We may need to verify your identity. Some rights are limited where we must preserve records for legal, security, payment, or legitimate operational reasons.</p></>,
  },
  {
    id: "transfers",
    title: "International transfers",
    content: <p>Heightt serves African campuses and may use providers that process data in other countries. Where personal data is transferred across borders, we use safeguards required by applicable law and assess the protection available in the receiving location.</p>,
  },
  {
    id: "young-users",
    title: "Young users",
    content: <p>Heightt is intended for students who can lawfully use the service. If you are below the age at which you can independently agree to data processing or enter a contract in your location, a parent, guardian, or authorised institution representative must provide any permission required by law. Contact us if you believe a child’s data was provided without proper authority.</p>,
  },
  {
    id: "changes-contact",
    title: "Changes and contact",
    content: <p>We may update this policy as Heightt develops or legal requirements change. We will publish the revised version here, update the effective date, and provide additional notice when a change materially affects your rights. Questions and privacy requests can be sent to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>,
  },
];

export default function PrivacyPage() {
  return <LegalPage eyebrow="Your data, explained" title="Privacy Policy" description="A clear account of what Heightt collects, why we use it, and the choices you have." effectiveDate="7 September 2026" icon={ShieldCheck} highlights={["We collect data needed to run accounts, academic access, dues, payments, and receipts.", "Card details are handled by the payment provider and are not stored by Heightt.", "We do not sell personal data or use it for third-party behavioural advertising.", "You can contact us to exercise applicable access, correction, objection, and deletion rights."]} sections={sections} companion={{ label: "Terms of Service", href: "/terms" }} />;
}
