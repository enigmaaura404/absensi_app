import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  ScanFace,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  LogOut,
  Briefcase,
  AlertCircle,
  Sparkles,
  Check,
  ArrowRight,
} from 'lucide-react';
import { User, AttendanceRecord, RequestItem } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CameraScanner } from '../../components/common/CameraScanner';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';

interface KehadiranPageProps {
  user: User;
  todayRecord?: AttendanceRecord;
  onSuccessCheckIn: (time: string, location: string) => void;
  onSuccessCheckOut: (time: string) => void;
  onAddDinasRequest: (item: RequestItem) => void;
  onNavigate: (route: string) => void;
}

export const KehadiranPage: React.FC<KehadiranPageProps> = ({
  user,
  todayRecord,
  onSuccessCheckIn,
  onSuccessCheckOut,
  onAddDinasRequest,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'checkin' | 'checkout' | 'dinas'>('status');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDateFormatted, setCurrentDateFormatted] = useState<string>('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'in' | 'out'>('in');

  // Dinas Form States
  const [dinasTujuan, setDinasTujuan] = useState('');
  const [dinasLokasi, setDinasLokasi] = useState('');
  const [dinasKeperluan, setDinasKeperluan] = useState('');
  const [dinasJamMulai, setDinasJamMulai] = useState('09:00');
  const [dinasJamSelesai, setDinasJamSelesai] = useState('17:00');

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

  const isCheckedIn = !!todayRecord?.checkInTime;
  const isCheckedOut = !!todayRecord?.checkOutTime;

  const handleTriggerCheckIn = () => {
    setConfirmAction('in');
    setIsConfirmOpen(true);
  };

  const handleTriggerCheckOut = () => {
    setConfirmAction('out');
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    const timeNow = currentTime ? `${currentTime.slice(0, 5)} WIB` : '08:01 WIB';
    setIsConfirmOpen(false);

    if (confirmAction === 'in') {
      onSuccessCheckIn(timeNow, 'Kantor Pusat Bandung');
      setActiveTab('status');
    } else {
      onSuccessCheckOut(timeNow);
      setActiveTab('status');
    }
  };

  const handleDinasSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const newDinas: RequestItem = {
      id: `dinas-${Date.now()}`,
      employeeId: user.employeeId,
      employeeName: user.name,
      department: user.department,
      type: 'Dinas',
      subType: 'Dinas Luar Kantor',
      startDate: '2026-10-02',
      endDate: '2026-10-02',
      days: 1,
      timeStart: dinasJamMulai,
      timeEnd: dinasJamSelesai,
      destination: dinasTujuan,
      reason: dinasKeperluan,
      status: 'Pending',
      submittedAt: `02 Oct 2026 ${timeNow}`,
    };
    onAddDinasRequest(newDinas);
    setActiveTab('status');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          Presensi & Kehadiran
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Pusat pencatatan jam masuk, pulang, tugas luar, dan validasi biometrik wajah.
        </p>
      </div>

      {/* Workflow Tabs (Clean unified secondary navigation) */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-2 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('status')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'status'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Status Hari Ini
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('checkin')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'checkin'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <LogIn className="w-3.5 h-3.5 text-emerald-500" />
          <span>Check-In</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('checkout')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'checkout'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <LogOut className="w-3.5 h-3.5 text-amber-500" />
          <span>Check-Out</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dinas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'dinas'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Dinas / Tugas Keluar</span>
        </button>
      </div>

      {/* TAB 1: Status Hari Ini & Primary Action Hub */}
      {activeTab === 'status' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Status Kehadiran Hari Ini
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-1">
                  {isCheckedOut
                    ? `Sudah Pulang (${todayRecord?.checkOutTime} WIB)`
                    : isCheckedIn
                    ? `Hadir (${todayRecord?.checkInTime} WIB)`
                    : 'Belum Melakukan Check-In'}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">{currentDateFormatted}</p>
              </div>

              <StatusBadge
                status={isCheckedOut ? 'Hadir' : isCheckedIn ? (todayRecord?.status || 'Hadir') : 'Belum Check-In'}
                size="lg"
              />
            </div>

            {/* Shift Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5 text-xs">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-neutral-400 font-bold block text-[10px] uppercase">Jam Masuk</span>
                <span className="text-base font-bold text-neutral-900 font-mono mt-0.5 block">
                  {todayRecord?.checkInTime || '-'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-neutral-400 font-bold block text-[10px] uppercase">Jam Pulang</span>
                <span className="text-base font-bold text-neutral-900 font-mono mt-0.5 block">
                  {todayRecord?.checkOutTime || '-'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-neutral-400 font-bold block text-[10px] uppercase">Durasi Kerja</span>
                <span className="text-base font-bold text-neutral-900 font-mono mt-0.5 block">
                  {todayRecord?.duration || (isCheckedIn ? 'Sedang Berjalan' : '-')}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-neutral-400 font-bold block text-[10px] uppercase">Target Pulang</span>
                <span className="text-base font-bold text-neutral-900 font-mono mt-0.5 block">
                  17:00 WIB
                </span>
              </div>
            </div>

            {/* Big Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {!isCheckedIn ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('checkin')}
                  className="flex-1 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span>CHECK-IN MASUK SEKARANG</span>
                </button>
              ) : !isCheckedOut ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('checkout')}
                  className="flex-1 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>CHECK-OUT PULANG SEKARANG</span>
                </button>
              ) : (
                <div className="flex-1 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center font-bold text-xs text-emerald-800">
                  Presensi hari ini telah lengkap (Check-In & Check-Out selesai).
                </div>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('dinas')}
                className="px-5 py-3.5 rounded-2xl border border-neutral-200 hover:border-neutral-900 text-xs font-semibold text-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-neutral-500" />
                <span>Ajukan Dinas / Tugas Luar</span>
              </button>
            </div>
          </div>

          {/* Verification Status Layer (Security & Geofence Checks) */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Parameter Verifikasi Presensi
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">GPS Aktif (Akurasi 12m)</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">Kantor Pusat (Radius 32m)</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">Device Samsung S24 Bound</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">Face Match 99.1% Ready</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Check-In Camera Flow */}
      {activeTab === 'checkin' && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-2xs max-w-lg mx-auto animate-in fade-in duration-150">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-neutral-900">Check-In Masuk</h3>
            <p className="text-xs text-neutral-500">Posisikan wajah Anda di dalam frame kamera</p>
          </div>

          <CameraScanner title="Tatap kamera dengan stabil" />

          <div className="mt-5 text-center font-mono py-2">
            <span className="text-2xl font-bold text-neutral-900">{currentTime || '08:01:32'} WIB</span>
            <p className="text-xs text-neutral-500 font-sans mt-0.5">{currentDateFormatted}</p>
          </div>

          <button
            type="button"
            onClick={handleTriggerCheckIn}
            className="w-full py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm tracking-wide shadow-md transition-all mt-3"
          >
            KONFIRMASI CHECK-IN
          </button>
        </div>
      )}

      {/* TAB 3: Check-Out Camera Flow */}
      {activeTab === 'checkout' && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-2xs max-w-lg mx-auto animate-in fade-in duration-150">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-neutral-900">Check-Out Pulang</h3>
            <p className="text-xs text-neutral-500">Verifikasi biometrik sebelum mengakhiri jam kerja</p>
          </div>

          <CameraScanner title="Verifikasi absen pulang" />

          <div className="mt-5 text-center font-mono py-2">
            <span className="text-2xl font-bold text-neutral-900">{currentTime || '17:04:15'} WIB</span>
            <p className="text-xs text-neutral-500 font-sans mt-0.5">Estimasi durasi: 9 Jam 03 Menit</p>
          </div>

          <button
            type="button"
            onClick={handleTriggerCheckOut}
            className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm tracking-wide shadow-md transition-all mt-3"
          >
            KONFIRMASI CHECK-OUT
          </button>
        </div>
      )}

      {/* TAB 4: Dinas / Tugas Luar Form */}
      {activeTab === 'dinas' && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-2xs animate-in fade-in duration-150">
          <h3 className="text-base font-bold text-neutral-900 mb-1">Formulir Tugas / Dinas Luar</h3>
          <p className="text-xs text-neutral-500 mb-5">
            Ajukan izin tugas dinas atau kunjungan meeting klien di luar kantor.
          </p>

          <form onSubmit={handleDinasSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Tujuan / Tempat
                </label>
                <input
                  type="text"
                  required
                  value={dinasTujuan}
                  onChange={(e) => setDinasTujuan(e.target.value)}
                  placeholder="Contoh: Kantor Klien PT Mandiri Finance"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 font-medium focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Kota / Wilayah
                </label>
                <input
                  type="text"
                  required
                  value={dinasLokasi}
                  onChange={(e) => setDinasLokasi(e.target.value)}
                  placeholder="Contoh: Jakarta Selatan"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 font-medium focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Jam Mulai
                </label>
                <input
                  type="time"
                  required
                  value={dinasJamMulai}
                  onChange={(e) => setDinasJamMulai(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Jam Selesai
                </label>
                <input
                  type="time"
                  required
                  value={dinasJamSelesai}
                  onChange={(e) => setDinasJamSelesai(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Keperluan Tugas
              </label>
              <textarea
                rows={2}
                required
                value={dinasKeperluan}
                onChange={(e) => setDinasKeperluan(e.target.value)}
                placeholder="Rincian agenda meeting atau pekerjaan..."
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 font-medium focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setActiveTab('status')}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold shadow-xs"
              >
                Kirim Permohonan Dinas
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
        title={confirmAction === 'in' ? 'Konfirmasi Check-In' : 'Konfirmasi Check-Out'}
        description={
          confirmAction === 'in'
            ? 'Anda akan melakukan absensi masuk kerja hari ini.'
            : 'Anda akan mengakhiri jam kerja hari ini.'
        }
        confirmText={confirmAction === 'in' ? 'Konfirmasi Masuk' : 'Konfirmasi Pulang'}
        cancelText="Batal"
        variant={confirmAction === 'in' ? 'info' : 'warning'}
      >
        <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100 text-center font-mono">
          <p className="text-2xl font-bold text-neutral-900">{currentTime || '08:01 WIB'}</p>
          <p className="text-xs text-neutral-500 font-sans mt-0.5">{currentDateFormatted}</p>
        </div>
      </ConfirmationModal>
    </div>
  );
};
