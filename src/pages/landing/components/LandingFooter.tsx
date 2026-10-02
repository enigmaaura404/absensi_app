import React from 'react';
import { MapPin } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 border-t border-neutral-900 text-left text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-neutral-900">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-neutral-950 shadow-xs shrink-0">
                <MapPin className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-white">
                ATTENDANCE
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Smart Attendance Management System. Solusi absensi modern berbasis biometrik wajah, liveness detection, GPS geofencing, dan tata kelola RBAC terpusat.
            </p>
            <p className="text-xs font-semibold text-emerald-400 tracking-wide font-mono">
              Simple. Secure. Accurate.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Product
            </p>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <a href="#features" className="hover:text-white transition-colors">Features</a>
              </li>
              <li>
                <a href="#security" className="hover:text-white transition-colors">Security</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Company
            </p>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">About Us</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Contact Support</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Security Whitepaper</span>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Resources
            </p>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Documentation</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-neutral-500 gap-4">
          <p>© 2026 Attendance. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Enterprise Attendance Platform</span>
            <span>•</span>
            <span className="font-mono">ISO 27001 Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
