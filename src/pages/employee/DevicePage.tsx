import React, { useState } from 'react';
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  Info,
} from 'lucide-react';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';

export const DevicePage: React.FC = () => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleConfirmReset = () => {
    setIsResetModalOpen(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          Perangkat Saya (Device Management)
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Satu akun karyawan hanya diizinkan melakukan presensi absensi melalui 1 perangkat resmi terverifikasi.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Permohonan reset/unbind perangkat berhasil diajukan ke tim IT Security & HR!</span>
        </div>
      )}

      {/* Main Device Card (Prompt Specified) */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-emerald-400 flex items-center justify-center shrink-0 shadow-md">
            <Smartphone className="w-8 h-8" />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg font-bold text-neutral-900">
                    Samsung Galaxy S24 Ultra
                  </h3>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Verified ✓
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Operating System: Android 15 • Browser: Chrome Mobile 128
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-800 self-center sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Status: Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                  Device Hardware ID
                </span>
                <span className="font-mono font-bold text-neutral-900 mt-0.5 block">
                  ••••••8241 (SM-S928B)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                  Aktivitas Terakhir
                </span>
                <span className="font-mono font-semibold text-neutral-800 mt-0.5 block">
                  02 Oktober 2026 08:01 WIB
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                <span>Ajukan Ganti / Reset Perangkat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Policies */}
      <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-5 text-xs text-neutral-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-neutral-900">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Aturan Kebijakan Perangkat (Single Device Policy)</span>
        </div>
        <p className="leading-relaxed">
          Untuk mencegah kecurangan absensi (titip absen), satu akun karyawan hanya diizinkan login dan melakukan absensi melalui perangkat yang sudah di-binding. Jika Anda mengganti ponsel baru atau rusak, hubungi IT/HR untuk menyetujui unbind perangkat.
        </p>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="Ajukan Reset Perangkat?"
        description="Apakah Anda yakin ingin melepas tautan (unbind) Samsung Galaxy S24 Ultra dari akun Anda? Setelah disetujui HRD, Anda dapat mengaitkan perangkat smartphone baru."
        confirmText="Ajukan Unbind"
        cancelText="Batal"
        variant="warning"
      />
    </div>
  );
};
