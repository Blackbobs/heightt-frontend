'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Heart,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
  Sparkles,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { SUPPORT_EMAIL } from '@/lib/seo';

export function Footer() {
  return (
    <footer className="bg-[#090d16] text-white/70 pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden mt-auto border-t border-white/10">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Footer Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Brand Column */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1 flex flex-col gap-4">
            <Logo variant="light" />

            <p className="text-sm text-white/80 leading-relaxed max-w-xs font-medium">
              Financial infrastructure for student organisations across Africa.
            </p>
            <p className="text-xs text-white/60 leading-relaxed max-w-xs">
              Starting with dues. Building for everything after.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 mt-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-xs font-bold tracking-wider uppercase">Product</h4>
            <ul className="flex flex-col gap-3 list-none p-0 text-sm">
              <li>
                <a href="#for-students" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  For Students
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </a>
              </li>
              <li>
                <a href="#for-executives" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  For Executives
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  How It Works
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </a>
              </li>
              <li>
                <a href="#why-heightt" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Why Heightt
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </a>
              </li>
              <li>
                <a href="#coming-soon" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Coming Soon
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  FAQ
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-xs font-bold tracking-wider uppercase">Company</h4>
            <ul className="flex flex-col gap-3 list-none p-0 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  About
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </a>
              </li>
              <li>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Contact
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Careers
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-xs font-bold tracking-wider uppercase">Support</h4>
            <ul className="flex flex-col gap-3 list-none p-0 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Help Centre
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </a>
              </li>
              <li>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Contact Support
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  FAQ
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-xs font-bold tracking-wider uppercase">Legal</h4>
            <ul className="flex flex-col gap-3 list-none p-0 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Privacy Policy
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Terms of Service
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Cookie Policy
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 text-xs text-white/60">
          <p className="flex items-center gap-1.5">
            &copy; 2026 <span className="text-white font-semibold">Heightt</span>. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-white font-bold bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <Globe className="w-3.5 h-3.5 text-primary-glow" /> Built for African campuses.
          </div>
        </div>
      </div>
    </footer>
  );
}
