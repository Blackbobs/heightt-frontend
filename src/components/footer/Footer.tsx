import React from 'react';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Footer() {
  return (
    <footer className="bg-[#0B1020] text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto transition-colors">
      <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand */}
          <div className="space-y-4 text-left lg:col-span-2">
            <Logo variant="light" />
            <p className="text-sm font-semibold text-white">
              Financial infrastructure for student organisations across Africa.
            </p>
            <p className="text-xs text-slate-400">
              Starting with dues. Building for everything after.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs text-slate-400 list-none p-0">
              <li><a href="#for-students" className="hover:text-white transition-colors">For Students</a></li>
              <li><a href="#for-executives" className="hover:text-white transition-colors">For Executives</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#why-heightt" className="hover:text-white transition-colors">Why Heightt</a></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company & Support</h4>
            <ul className="space-y-2 text-xs text-slate-400 list-none p-0">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Centre</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400 list-none p-0">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col items-start justify-between gap-4 pt-8 text-left text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Heightt. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-400">Theme</span>
            <ThemeToggle />
          </div>
          <p className="font-semibold text-slate-400">Built for African campuses.</p>
        </div>

      </div>
    </footer>
  );
}
