import React, { useState, useRef, useEffect } from 'react';
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
  KeyRound,
  Send,
  RefreshCw,
} from 'lucide-react';
import { authService } from '../../services/auth/auth.service';
import { DatabaseAuthProvider } from '../../services/auth/database-auth.provider';
import type { TwoFactorChallenge } from '../../services/auth/database-auth.provider';
import { AuthUser } from '../../services/auth/auth.types';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
  onBackToLanding?: () => void;
}

// ── 2FA Modal ─────────────────────────────────────────────────────────────────
interface TwoFAModalProps {
  challenge: TwoFactorChallenge;
  onSuccess: (user: AuthUser) => void;
  onCancel: () => void;
}

const TwoFAModal: React.FC<TwoFAModalProps> = ({ challenge, onSuccess, onCancel }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState(challenge.sessionId);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dbProvider = new DatabaseAuthProvider();

  // Countdown for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) newOtp[i] = pasted[i] || '';
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const otpStr = otp.join('');
    if (otpStr.length !== 6) {
      setError('Masukkan kode OTP 6 digit');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const user = await dbProvider.verify2FA(sessionId, otpStr);
      if (user) {
        onSuccess(user);
      } else {
        setError('Verifikasi gagal. Silakan coba lagi.');
      }
    } catch (err: any) {
      setError(err?.message || 'Kode OTP tidak valid atau sudah kadaluarsa.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError(null);
    try {
      const newSessionId = await dbProvider.resend2FA(sessionId);
      setSessionId(newSessionId);
      setOtp(['', '', '', '', '', '']);
      setResendCooldown(60);
      inputRefs.current[0]?.focus();
    } catch {
      setError('Gagal mengirim ulang OTP. Coba lagi.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-neutral-950 px-8 py-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7 text-emerald-400" />
          </div>
          <h2 className="text-lg font-bold text-white">Verifikasi 2FA</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Kode OTP 6 digit telah dikirim via Telegram
          </p>
          {challenge.devOtp && (
            <div className="mt-3 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
              🛠 Dev OTP: <strong>{challenge.devOtp}</strong>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-8 py-7 space-y-6">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* OTP Input Grid */}
          <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-11 h-12 text-center text-lg font-bold border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 transition-all"
                disabled={isLoading}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleVerify}
            disabled={isLoading || otp.join('').length !== 6}
            className="w-full py-3 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold tracking-wide shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <span>Verifikasi & Masuk</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={onCancel}
              className="text-neutral-500 hover:text-neutral-800 font-medium transition-colors"
            >
              ← Kembali
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-800 font-medium transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              {resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim ulang OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Login Page ────────────────────────────────────────────────────────────
export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBackToLanding }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [twoFAChallenge, setTwoFAChallenge] = useState<TwoFactorChallenge | null>(null);

  const dbProvider = new DatabaseAuthProvider();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await dbProvider.authenticate({
        email: email.trim(),
        password: password.trim(),
      });

      if (!result) {
        setError('Email atau password salah. Pastikan email & kata sandi sesuai dengan akun terdaftar.');
        return;
      }

      // 2FA Challenge
      if ('requires2FA' in result && result.requires2FA) {
        setTwoFAChallenge(result as TwoFactorChallenge);
        return;
      }

      onLogin(result as AuthUser);
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan koneksi server. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-neutral-50 text-neutral-900">
      {/* 2FA Modal */}
      {twoFAChallenge && (
        <TwoFAModal
          challenge={twoFAChallenge}
          onSuccess={(user) => {
            setTwoFAChallenge(null);
            onLogin(user);
          }}
          onCancel={() => setTwoFAChallenge(null)}
        />
      )}

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
