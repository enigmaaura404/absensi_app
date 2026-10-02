import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  Send,
  Check,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const Security2FAPage: React.FC = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [isTestOtpOpen, setIsTestOtpOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [ipWhitelist, setIpWhitelist] = useState('182.253.14.88/24, 114.124.200.0/24');

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length === 6) {
      setOtpVerified(true);
      setTimeout(() => {
        setOtpVerified(false);
        setIsTestOtpOpen(false);
        setOtpCode('');
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          Superadmin Security & 2FA
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Proteksi otentikasi ganda tingkat tinggi khusus akun hak akses Superadmin dan Eksekutif.
        </p>
      </div>

      {/* Main 2FA Card (Prompt Specified Layout) */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0">
              <KeyRound className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-neutral-900">Two-Factor Authentication</h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Enabled
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Metode verifikasi: Telegram Bot One-Time Password (OTP)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsTestOtpOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Tes Kirim OTP</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-neutral-100 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block">
              Akun Telegram Terverifikasi
            </span>
            <span className="font-bold text-neutral-900 text-sm mt-0.5 block">
              @andi_superadmin (Connected ✓)
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block">
              Verifikasi Terakhir
            </span>
            <span className="font-mono font-semibold text-neutral-800 text-xs mt-1 block">
              02 Oct 2026 19:32 WIB
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Security Configuration */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-900">Kebijakan Sesi & IP Whitelisting</h3>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Session Timeout (Inaktivitas Superadmin)
            </label>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 rounded-xl border border-neutral-200 font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option value="15">15 Menit</option>
              <option value="30">30 Menit (Direkomendasikan)</option>
              <option value="60">1 Jam</option>
              <option value="240">4 Jam</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              IP Address Whitelist (Akses Ruang Server / VPN Kantor)
            </label>
            <input
              type="text"
              value={ipWhitelist}
              onChange={(e) => setIpWhitelist(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 font-mono text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Pisahkan beberapa subnet dengan tanda koma. Login Superadmin di luar IP ini akan ditolak otomatis.
            </p>
          </div>
        </div>
      </div>

      {/* Test OTP Modal */}
      {isTestOtpOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsTestOtpOpen(false)}
          title="Verifikasi 2FA Telegram"
          description="Kode keamanan 6-digit telah dikirimkan ke bot Telegram @AttendanceMonitoringBot."
          maxWidth="sm"
        >
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <span className="text-xs text-neutral-500 block mb-2 font-medium">
                Masukkan Kode OTP (Gunakan: 824190)
              </span>
              <input
                type="text"
                maxLength={6}
                autoFocus
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-48 text-center text-2xl font-mono font-bold tracking-widest px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 mx-auto block"
              />
            </div>

            {otpVerified && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Autentikasi 2FA Berhasil!</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsTestOtpOpen(false)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={otpCode.length < 6}
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                Verifikasi OTP
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
