import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  Lock,
  Mail,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { authService } from '../../services/auth/auth.service';
import { AuthUser } from '../../services/auth/auth.types';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
  onBackToLanding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBackToLanding }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await authService.authenticate({
        email: email.trim(),
        password: password.trim(),
      });

      if (!user) {
        // Deliberately vague — do not reveal which field is wrong
        setError('Email atau password salah.');
        return;
      }

      onLogin(user);
    } catch (err) {
      setError('Terjadi kesalahan sistem. Coba lagi.');
      console.error('[LoginPage] Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-neutral-50 text-neutral-900">
      {/* Left Column: Brand & Feature Overview */}
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

        {/* Center Tagline & Features */}
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
            {[
              'Anti-Spoofing & Liveness Detection 3D',
              'Geofence Radius Presisi & Deteksi Fake GPS',
              'Single Device Binding & Audit Trail Forensik',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm text-neutral-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Security Assurance */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Role-Based Access Control &amp; Audit Trail</span>
          </div>
          <span>PT Teknologi Absensi Mandiri</span>
        </div>
      </div>

      {/* Right Column: Sign In Form */}
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

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Error Alert */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Alamat Email Kantor
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="nama@company.id"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-semibold text-neutral-700">
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
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={isLoading || !email || !password}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

            {/* Quick Demo Accounts Selector (Seeded Database Accounts) */}
            <div className="mt-6 pt-5 border-t border-neutral-100">
              <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2.5">
                Akun Demo Terdaftar (Live Database):
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('andi.wijaya@company.id');
                    setPassword('Superadmin123!');
                  }}
                  className="p-2 text-left rounded-xl border border-neutral-200 hover:border-neutral-900 bg-neutral-50 hover:bg-white transition-all cursor-pointer group"
                >
                  <div className="font-semibold text-neutral-900 group-hover:text-black">Superadmin</div>
                  <div className="text-[11px] text-neutral-500 truncate">andi.wijaya@company.id</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('siti.rahma@company.id');
                    setPassword('HR123!');
                  }}
                  className="p-2 text-left rounded-xl border border-neutral-200 hover:border-neutral-900 bg-neutral-50 hover:bg-white transition-all cursor-pointer group"
                >
                  <div className="font-semibold text-neutral-900 group-hover:text-black">HR Admin</div>
                  <div className="text-[11px] text-neutral-500 truncate">siti.rahma@company.id</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('ahmad.fauzi@company.id');
                    setPassword('Supervisor123!');
                  }}
                  className="p-2 text-left rounded-xl border border-neutral-200 hover:border-neutral-900 bg-neutral-50 hover:bg-white transition-all cursor-pointer group"
                >
                  <div className="font-semibold text-neutral-900 group-hover:text-black">Supervisor</div>
                  <div className="text-[11px] text-neutral-500 truncate">ahmad.fauzi@company.id</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('budi.santoso@company.id');
                    setPassword('Employee123!');
                  }}
                  className="p-2 text-left rounded-xl border border-neutral-200 hover:border-neutral-900 bg-neutral-50 hover:bg-white transition-all cursor-pointer group"
                >
                  <div className="font-semibold text-neutral-900 group-hover:text-black">Karyawan</div>
                  <div className="text-[11px] text-neutral-500 truncate">budi.santoso@company.id</div>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
