import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Smartphone,
  ScanFace,
  ArrowLeft,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { CameraScanner } from '../../components/common/CameraScanner';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';

interface CheckInPageProps {
  onSuccessCheckIn: (time: string, location: string) => void;
  onNavigate: (route: string) => void;
}

export const CheckInPage: React.FC<CheckInPageProps> = ({
  onSuccessCheckIn,
  onNavigate,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDateFormatted, setCurrentDateFormatted] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkInTimestamp, setCheckInTimestamp] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
      setCurrentDateFormatted(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerCheckIn = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    const timeNow = currentTime ? `${currentTime.slice(0, 5)} WIB` : '08:01 WIB';
    setCheckInTimestamp(timeNow);
    setIsConfirmOpen(false);
    setIsSuccess(true);
    onSuccessCheckIn(timeNow, 'Kantor Pusat Bandung');
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            Verifikasi Selesai ✓
          </span>

          <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Check-In Berhasil
          </h3>

          <div className="mt-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 font-mono">
            <p className="text-3xl font-bold text-neutral-900">{checkInTimestamp}</p>
            <p className="text-xs text-neutral-500 mt-1">{currentDateFormatted}</p>
          </div>

          <div className="mt-4 text-xs text-neutral-600 space-y-1">
            <p className="flex items-center justify-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>Lokasi: Kantor Pusat Bandung</span>
            </p>
            <p className="text-[11px] text-neutral-400">
              Koordinat: -6.917464, 107.619123 (Radius 32m)
            </p>
          </div>

          <p className="mt-6 text-sm font-semibold text-neutral-700">
            Selamat bekerja dan semoga hari Anda produktif!
          </p>

          <div className="mt-8 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onNavigate('riwayat')}
              className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              Lihat Riwayat
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="w-full py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:text-neutral-900 font-semibold text-xs transition-colors"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="p-2 -ml-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          Absen Masuk
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-sm">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Check-In</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Posisikan wajah Anda di dalam frame kamera
          </p>
        </div>

        {/* Camera Preview */}
        <div className="mb-5">
          <CameraScanner
            title="Posisikan wajah Anda di dalam frame"
            onCapture={(img) => setCapturedImage(img)}
          />
        </div>

        {/* Verification Checkpoints */}
        <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 space-y-2.5 mb-5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-neutral-600 flex items-center gap-2">
              <ScanFace className="w-4 h-4 text-emerald-600" />
              <span>Face Detection</span>
            </span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Wajah terdeteksi (99.1%)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Liveness Detection</span>
            </span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Live
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-600 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Location (Geofence)</span>
            </span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Dalam area kantor
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-600 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Device Binding</span>
            </span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Device terverifikasi
            </span>
          </div>
        </div>

        {/* Current Time Display */}
        <div className="text-center py-2 mb-4 font-mono">
          <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-sans">
            Waktu Sekarang
          </span>
          <span className="text-2xl font-bold text-neutral-900">
            {currentTime || '08:01:32'} <span className="text-sm font-semibold">WIB</span>
          </span>
        </div>

        {/* Large Submit Button */}
        <button
          type="button"
          onClick={handleTriggerCheckIn}
          className="w-full py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <span>CHECK-IN</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
        title="Konfirmasi Check-In"
        description="Anda akan melakukan absensi masuk."
        confirmText="Konfirmasi Check-In"
        cancelText="Batal"
        variant="info"
      >
        <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 text-center font-mono">
          <p className="text-2xl font-extrabold text-neutral-900">
            {currentTime ? `${currentTime.slice(0, 5)} WIB` : '08:01 WIB'}
          </p>
          <p className="text-xs text-neutral-500 mt-1 font-sans">{currentDateFormatted}</p>
          <div className="mt-3 pt-3 border-t border-neutral-200/60 text-xs font-sans text-neutral-700">
            <span className="text-neutral-500">Lokasi:</span>{' '}
            <strong className="text-neutral-900">Kantor Pusat</strong>
          </div>
        </div>
        <p className="text-[11px] text-neutral-400 text-center mt-3">
          Pastikan informasi sudah benar sebelum melanjutkan.
        </p>
      </ConfirmationModal>
    </div>
  );
};
