import React, { useState, useEffect } from 'react';
import { MapPin, Menu, X, ArrowRight, LogIn, LayoutDashboard } from 'lucide-react';

interface LandingNavbarProps {
  onLoginClick: () => void;
  onEnterApp: () => void;
  isLoggedIn?: boolean;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onLoginClick,
  onEnterApp,
  isLoggedIn = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Produk', href: '#product' },
    { label: 'Fitur', href: '#features' },
    { label: 'Keamanan', href: '#security' },
    { label: 'Cara Kerja', href: '#how-it-works' },
    { label: 'Untuk Bisnis', href: '#roles' },
    { label: 'CMS', href: '#cms' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md border-b border-neutral-200/80 shadow-xs py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a
              href="#"
              className="flex items-center gap-2.5 group cursor-pointer"
              aria-label="ATTENDANCE Beranda"
            >
              <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-neutral-900 leading-tight">
                  ATTENDANCE
                </span>
                <span className="text-[10px] text-neutral-500 font-medium tracking-wide -mt-0.5">
                  Smart Attendance
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleLinkClick(link.href)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100/80 transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Desktop Action CTAs */}
            <div className="hidden sm:flex items-center gap-2.5">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={onEnterApp}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-98 cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Buka Aplikasi</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onLoginClick}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={onLoginClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-98 cursor-pointer"
                  >
                    <span>Mulai Sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={onLoginClick}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-900 border border-neutral-200 rounded-lg"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 right-0 bottom-0 w-72 bg-white border-l border-neutral-200 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Navigasi
              </p>
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => handleLinkClick(link.href)}
                    className="text-left px-3 py-2 text-sm font-semibold text-neutral-800 hover:text-neutral-950 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-neutral-100 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLoginClick();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 flex items-center justify-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk (Login)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLoginClick();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2"
              >
                <span>Mulai Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
