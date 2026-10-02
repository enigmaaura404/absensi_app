import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  Lock,
  Mail,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { UserRole } from '../../types';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onBackToLanding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBackToLanding }) => {
  const [email, setEmail] = useState('budi@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin('Employee');
    }, 600);
  };

  const handleQuickLogin = (role: UserRole) => {
    setIsLoading(true);
    if (role === 'Employee') {
      setEmail('budi@example.com');
    } else if (role === 'HR') {
      setEmail('siti.rahma@company.id');
    } else {
      setEmail('andi.wijaya@company.id');
    }
    setTimeout(() => {
      setIsLoading(false);
      onLogin(role);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-neutral-50 text-neutral-900">
      {/* Left Column: Brand & Security Overview */}
      <div className="lg:w-1/2 bg-neutral-950 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Top Logo & Back Button */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-neutral-950 flex items-center justify-center font-bold shadow-lg">
              <div className="relative">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                ATTENDANCE
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-emerald-400">
                  v2.6 Enterprise
                </span>
              </h1>
              <p className="text-xs text-neutral-400">Smart Attendance Management</p>
            </div>
          </div>

          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Landing Page</span>
            </button>
          )}
        </div>

        {/* Center Tagline & Feature List */}
        <div className="relative z-10 my-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-neutral-300 mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sistem Presensi Karyawan Generasi Baru</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Simple. Secure. Accurate.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
            Platform manajemen absensi enterprise berakurasi tinggi dengan verifikasi biometrik wajah, liveness detection, validasi geofence akurat, dan pelaporan otomatis.
          </p>

          <div className="mt-8 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm text-neutral-200">
                Anti-Spoofing & Liveness Detection 3D
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm text-neutral-200">
                Geofence Radius Presisi & Deteksi Fake GPS
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm text-neutral-200">
                Single Device Binding & Audit Trail Forensik
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Security Assurance */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ISO 27001 Certified & SOC 2 Type II</span>
          </div>
          <span>PT Teknologi Absensi Mandiri</span>
        </div>
      </div>

      {/* Right Column: Clean Enterprise Sign In Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
              Selamat Datang Kembali
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-500">
              Masuk dengan akun terdaftar untuk mengakses portal absensi.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Alamat Email Kantor
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@company.id"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  Kata Sandi
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  Lupa password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 accent-neutral-900"
                />
                <span className="text-xs text-neutral-600 select-none">
                  Ingat saya di perangkat ini
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Switchers */}
          <div className="mt-8 pt-6 border-t border-neutral-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 text-center mb-3">
              Akses Cepat Mode Demo
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('Employee')}
                className="p-2.5 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-all text-center flex flex-col items-center"
              >
                <UserCheck className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="text-[11px] font-bold text-neutral-900">Budi Santoso</span>
                <span className="text-[10px] text-neutral-500">Employee</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('HR')}
                className="p-2.5 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-all text-center flex flex-col items-center"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600 mb-1" />
                <span className="text-[11px] font-bold text-neutral-900">Siti Rahma</span>
                <span className="text-[10px] text-neutral-500">HR Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('Superadmin')}
                className="p-2.5 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-all text-center flex flex-col items-center"
              >
                <Sparkles className="w-4 h-4 text-purple-600 mb-1" />
                <span className="text-[11px] font-bold text-neutral-900">Andi Wijaya</span>
                <span className="text-[10px] text-neutral-500">Superadmin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
