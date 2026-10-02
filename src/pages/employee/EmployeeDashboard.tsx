import React from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Smartphone,
  ScanFace,
  LogIn,
  LogOut,
  Calendar,
  Briefcase,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { User, AttendanceRecord } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

interface EmployeeDashboardProps {
  user: User;
  todayRecord?: AttendanceRecord;
  recentHistory: AttendanceRecord[];
  onNavigate: (route: string) => void;
  onOpenCheckIn: () => void;
  onOpenCheckOut: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  user,
  todayRecord,
  recentHistory,
  onNavigate,
  onOpenCheckIn,
  onOpenCheckOut,
}) => {
  const isCheckedIn = !!todayRecord?.checkInTime;
  const isCheckedOut = !!todayRecord?.checkOutTime;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Selamat pagi, {user.name.split(' ')[0]} 👋
            </h2>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-700">
              {user.position}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">
            Jumat, 02 Oktober 2026 • Shift Pagi (08:00 - 17:00 WIB)
          </p>
        </div>

        {/* Cuti Balance Quick Pill */}
        <div className="flex items-center gap-3 bg-neutral-50 px-4 py-2.5 rounded-xl border border-neutral-200/60">
          <div>
            <span className="block text-[10px] uppercase font-bold text-neutral-400">
              Sisa Cuti Tahunan
            </span>
            <span className="text-base font-bold text-neutral-900">
              {user.leaveBalance.remaining} Hari
            </span>
          </div>
          <button
            onClick={() => onNavigate('cuti')}
            className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 underline ml-2"
          >
            Lihat
          </button>
        </div>
      </div>

      {/* Main Hero Attendance Card (Core of Employee Experience) */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Status details & Work Hours */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Status Hari Ini
                </span>
                <StatusBadge
                  status={isCheckedOut ? 'Hadir' : isCheckedIn ? (todayRecord?.status || 'Hadir') : 'Belum Check-In'}
                  size="md"
                />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  {isCheckedOut
                    ? `Sudah Check-Out (${todayRecord?.checkOutTime} WIB)`
                    : isCheckedIn
                    ? `Sudah Check-In (${todayRecord?.checkInTime} WIB)`
                    : 'Belum Melakukan Check-In'}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  {isCheckedOut
                    ? 'Durasi kerja hari ini: ' + (todayRecord?.duration || '8 jam') + '. Selamat beristirahat!'
                    : isCheckedIn
                    ? 'Jam kerja sedang berjalan. Jangan lupa check-out sebelum pukul 18:00 WIB.'
                    : 'Silakan posisikan wajah di dalam frame kamera dan pastikan GPS aktif.'}
                </p>
              </div>

              {/* Working Hours Indicator */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Jam Kerja
                  </span>
                  <span className="text-sm sm:text-base font-bold text-neutral-900 mt-0.5 block">
                    08:00 WIB
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Target Pulang
                  </span>
                  <span className="text-sm sm:text-base font-bold text-neutral-900 mt-0.5 block">
                    17:00 WIB
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Lokasi Kantor
                  </span>
                  <span className="text-sm font-semibold text-neutral-900 mt-0.5 block truncate">
                    Kantor Pusat
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Big Prominent Action Button */}
            <div className="flex flex-col items-center justify-center lg:border-l lg:border-neutral-100 lg:pl-10">
              {!isCheckedIn ? (
                <button
                  type="button"
                  onClick={onOpenCheckIn}
                  className="w-full sm:w-64 h-16 sm:h-20 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 group active:scale-98"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block leading-tight">CHECK-IN</span>
                    <span className="text-[10px] text-neutral-400 font-normal">Absen Masuk Sekarang</span>
                  </div>
                </button>
              ) : !isCheckedOut ? (
                <button
                  type="button"
                  onClick={onOpenCheckOut}
                  className="w-full sm:w-64 h-16 sm:h-20 rounded-2xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 group active:scale-98"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block leading-tight">CHECK-OUT</span>
                    <span className="text-[10px] text-amber-100 font-normal">Absen Pulang Sekarang</span>
                  </div>
                </button>
              ) : (
                <div className="w-full sm:w-64 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                  <span className="text-xs font-bold text-emerald-800 block">Absensi Lengkap</span>
                  <span className="text-[11px] text-emerald-700">Check-In & Check-Out selesai</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification Status Bar (Requirements Checklist) */}
        <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2 text-neutral-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Lokasi terdeteksi (32m)</span>
            </div>

            <div className="flex items-center gap-2 text-neutral-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Dalam area kantor</span>
            </div>

            <div className="flex items-center gap-2 text-neutral-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Perangkat terverifikasi</span>
            </div>

            <div className="flex items-center gap-2 text-neutral-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Face verification siap</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-3">
          Layanan Mandiri Karyawan
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => onNavigate('cuti')}
            className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-900 transition-all text-left flex flex-col justify-between h-28 group"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-neutral-900">Pengajuan Cuti</p>
              <p className="text-[11px] text-neutral-500">Sisa {user.leaveBalance.remaining} hari kerja</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('pengajuan')}
            className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-900 transition-all text-left flex flex-col justify-between h-28 group"
          >
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-neutral-900">Izin & Sakit</p>
              <p className="text-[11px] text-neutral-500">Dengan lampiran surat</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('dinas')}
            className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-900 transition-all text-left flex flex-col justify-between h-28 group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-neutral-900">Dinas Luar</p>
              <p className="text-[11px] text-neutral-500">Tugas / meeting klien</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('riwayat')}
            className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-900 transition-all text-left flex flex-col justify-between h-28 group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-neutral-900">Riwayat Absensi</p>
              <p className="text-[11px] text-neutral-500">Log kehadiran lengkap</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Attendance Strip & Team Presence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Attendance */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-neutral-900">Riwayat Kehadiran Terakhir</h4>
              <p className="text-xs text-neutral-500">Catatan absensi 5 hari kerja terakhir</p>
            </div>
            <button
              onClick={() => onNavigate('riwayat')}
              className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1"
            >
              <span>Selengkapnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-neutral-100">
            {recentHistory.slice(0, 5).map((rec) => (
              <div key={rec.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center font-mono text-xs font-bold text-neutral-700 shrink-0">
                    {rec.date.split('-')[2]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">
                      {new Date(rec.date).toLocaleDateString('id-ID', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {rec.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-mono font-medium text-neutral-900">
                      {rec.checkInTime || '-'} {rec.checkOutTime ? `→ ${rec.checkOutTime}` : ''}
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      {rec.duration ? `Durasi ${rec.duration}` : 'Shift Pagi'}
                    </p>
                  </div>
                  <StatusBadge status={rec.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Device & Security Status Card */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-neutral-900">Status Keamanan Akun</h4>
            <p className="text-xs text-neutral-500 mt-0.5">Parameter perlindungan identitas</p>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-neutral-900">Perangkat Utama Terikat</p>
                  <p className="text-[11px] text-neutral-500">Samsung Galaxy S24 Ultra</p>
                  <span className="inline-block mt-1 text-[10px] font-mono text-neutral-400">
                    ID: ••••••8241
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-start gap-2.5">
                <ScanFace className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-neutral-900">Biometrik Wajah Aktif</p>
                  <p className="text-[11px] text-neutral-500">Kesesuaian 99.1% • Anti-spoof ON</p>
                  <button
                    onClick={() => onNavigate('face-verification')}
                    className="text-[11px] font-semibold text-neutral-800 hover:underline mt-1 block"
                  >
                    Perbarui Foto Wajah →
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-neutral-900">Geofence Valid</p>
                  <p className="text-[11px] text-neutral-500">Kantor Pusat Bandung (Radius 100m)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 font-medium">
            <span>Audit Level 1</span>
            <span>Enkripsi AES-256</span>
          </div>
        </div>
      </div>
    </div>
  );
};
