'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  ArrowRight,
  Heart,
  ExternalLink,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[oklch(12%_.02_260)] text-white/70 pt-16 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Footer Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1 flex flex-col gap-4">
            <Logo className="text-white" />
            <p className="text-sm text-white/70 leading-relaxed max-w-xs">
              Financial infrastructure for student organisations across Africa. Built for students, by students.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 mt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-0.5"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-0.5"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-0.5"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-0.5"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase">Product</h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Features
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  How It Works
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a href="#transparency" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Transparency
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.studyhelp.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-primary font-semibold transition-colors flex items-center gap-1.5 group"
                >
                  Study Tool
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Roadmap
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase">Company</h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  About
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Careers
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Blog
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a href="mailto:support@heightt.com" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Contact
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase">Support</h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Help Center
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  FAQ
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Community
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Status
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase">Legal</h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Privacy Policy
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Terms of Service
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  Cookie Policy
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Box */}
        <div className="mt-8 p-6 sm:p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h4 className="text-white text-base sm:text-lg font-bold mb-1">
              📬 Stay in the loop
            </h4>
            <p className="text-sm text-white/70">
              Get product updates, tips, and student finance news.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/50 text-sm outline-none focus:border-primary transition-colors flex-1"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-[oklch(36%_.18_265)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
            >
              {subscribed ? 'Subscribed! 🎉' : 'Subscribe'}
              {!subscribed && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-white/60">
          <p className="flex items-center gap-1.5">
            &copy; 2026 <span className="text-white font-semibold">Heightt</span>. All rights reserved. Made with{' '}
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for African students.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
