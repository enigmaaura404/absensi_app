import React, { useState } from 'react';
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  Info,
  Clock,
  Wifi,
  Monitor,
} from 'lucide-react';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { User, DeviceItem } from '../../types';

interface DevicePageProps {
  user?: User;
  devices?: DeviceItem[];
}

/**
 * DevicePage — Employee self-service device binding view.
 *
 * Business Rules:
 * - BR-DEV-001: One employee = one bound device at any time.
 * - BR-DEV-002: Attendance check-in/out is ONLY permitted from the bound device.
 * - BR-DEV-003: Device reset requires IT/HR approval (ticket workflow).
 */
export const DevicePage: React.FC<DevicePageProps> = ({ user, devices = [] }) => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleConfirmReset = () => {
    setIsResetModalOpen(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 4000);
  };

  // Find the device bound to the current employee
  const boundDevice = devices.find(
    (d) => d.employeeId === user?.employeeId && d.status !== 'Disabled'
  );

  const deviceStatus = boundDevice?.status ?? 'Active';
  const isDeviceSuspicious = deviceStatus === 'Suspicious';
  const isDeviceDisabled = deviceStatus === 'Disabled';

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

      {/* Success Banner */}
      {resetSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Permohonan reset/unbind perangkat berhasil diajukan ke tim IT Security & HR!
            Anda akan dihubungi dalam 1×24 jam kerja.
          </span>
        </div>
      )}

      {/* Suspicious Device Warning */}
      {isDeviceSuspicious && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            Perangkat ini ditandai mencurigakan oleh sistem keamanan. Hubungi IT Security segera.
          </span>
        </div>
      )}

      {/* Main Device Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-2xs">
        {boundDevice ? (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                isDeviceSuspicious
                  ? 'bg-amber-800 text-amber-300'
                  : isDeviceDisabled
                  ? 'bg-rose-800 text-rose-300'
                  : 'bg-neutral-900 text-emerald-400'
              }`}
            >
              <Smartphone className="w-8 h-8" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-lg font-bold text-neutral-900">
                      {boundDevice.deviceModel}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isDeviceSuspicious
                          ? 'text-amber-800 bg-amber-100'
                          : isDeviceDisabled
                          ? 'text-rose-800 bg-rose-100'
                          : 'text-emerald-800 bg-emerald-100'
                      }`}
                    >
                      {isDeviceSuspicious ? '⚠ Suspicious' : isDeviceDisabled ? '✗ Disabled' : '✓ Verified'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {boundDevice.os} • {boundDevice.browser}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold self-center sm:self-auto ${
                    isDeviceSuspicious
                      ? 'bg-amber-100 text-amber-800'
                      : isDeviceDisabled
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isDeviceSuspicious
                        ? 'bg-amber-500'
                        : isDeviceDisabled
                        ? 'bg-rose-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  Status: {boundDevice.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                    <Monitor className="w-3 h-3" />
                    Device Hardware ID
                  </span>
                  <span className="font-mono font-bold text-neutral-900 mt-0.5 block">
                    ••••••{boundDevice.deviceId.slice(-4)} ({boundDevice.deviceId.split('-')[0]})
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Aktivitas Terakhir
                  </span>
                  <span className="font-mono font-semibold text-neutral-800 mt-0.5 block">
                    {boundDevice.lastActive}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Karyawan Terdaftar
                  </span>
                  <span className="font-semibold text-neutral-800 mt-0.5 block">
                    {boundDevice.employeeName}
                  </span>
                  <span className="text-neutral-400 text-[10px]">{boundDevice.employeeId}</span>
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
        ) : (
          /* No device bound yet */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 mb-1">
              Belum Ada Perangkat Terdaftar
            </h3>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto mb-4">
              Akun Anda belum memiliki perangkat yang di-binding. Hubungi IT/HR untuk melakukan pendaftaran perangkat pertama.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold">
              <Wifi className="w-3.5 h-3.5" />
              Hubungi IT / HR untuk Binding
            </div>
          </div>
        )}
      </div>

      {/* Single Device Policy Explanation */}
      <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-5 text-xs text-neutral-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-neutral-900">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Aturan Kebijakan Perangkat (Single Device Policy)</span>
        </div>
        <ul className="space-y-1.5 text-neutral-600 leading-relaxed list-none">
          <li className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
            Satu akun karyawan hanya diizinkan login dan melakukan absensi melalui 1 perangkat resmi terverifikasi.
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
            Akses dari perangkat lain akan diblokir otomatis oleh sistem keamanan (BR-DEV-002).
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
            Jika Anda mengganti ponsel baru atau rusak, ajukan permohonan unbind dan tunggu persetujuan HR/IT dalam 1×24 jam.
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
            Pelanggaran kebijakan ini dapat berakibat pada penonaktifan akun dan laporan keamanan (BR-DEV-003).
          </li>
        </ul>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="Ajukan Reset Perangkat?"
        description={`Apakah Anda yakin ingin melepas tautan (unbind) ${boundDevice?.deviceModel ?? 'perangkat terdaftar'} dari akun ${user?.name ?? 'Anda'}? Setelah disetujui HRD, Anda dapat mengaitkan perangkat smartphone baru.`}
        confirmText="Ajukan Unbind"
        cancelText="Batal"
        variant="warning"
      />
    </div>
  );
};
