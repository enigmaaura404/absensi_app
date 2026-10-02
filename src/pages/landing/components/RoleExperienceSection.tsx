import React, { useState } from 'react';
import {
  User,
  Users,
  Shield,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  BarChart3,
  Sliders,
  CheckSquare,
  ArrowRight,
  TrendingUp,
  MapPin,
  Smartphone,
} from 'lucide-react';

export const RoleExperienceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employee' | 'manager' | 'admin'>('employee');

  return (
    <section id="roles" className="py-24 bg-neutral-50/70 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Personalisasi Berdasarkan Peran
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Tampilan yang disesuaikan dengan tanggung jawab Anda.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Karyawan mendapatkan kemudahan aksi mandiri, manajer mendapatkan kendali persetujuan, dan administrator mendapatkan pengawasan operasional lengkap.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-neutral-200 shadow-2xs gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('employee')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'employee'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Untuk Karyawan
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('manager')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'manager'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Untuk Manager & HR
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Untuk Administrator
            </button>
          </div>
        </div>

        {/* Tab 1: Employee View */}
        {activeTab === 'employee' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto animate-in fade-in duration-200 text-left">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Workflow Minimalis
              </span>
              <h3 className="text-2xl font-bold text-neutral-900">
                Sederhana untuk karyawan.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Karyawan tidak terbebani menu yang tidak perlu. Sidebar difokuskan hanya pada 5 fungsi esensial:
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-between">
                  <span className="font-bold text-neutral-900">1. Dashboard</span>
                  <span className="text-[11px] text-neutral-500">Status harian, jam kerja & sisa cuti</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-between">
                  <span className="font-bold text-neutral-900">2. Kehadiran</span>
                  <span className="text-[11px] text-neutral-500">Check-in, check-out, dinas luar</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-between">
                  <span className="font-bold text-neutral-900">3. Pengajuan</span>
                  <span className="text-[11px] text-neutral-500">Izin, sakit, cuti & koreksi absensi</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-between">
                  <span className="font-bold text-neutral-900">4. Riwayat</span>
                  <span className="text-[11px] text-neutral-500">Logbook presensi & filter bulan</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-between">
                  <span className="font-bold text-neutral-900">5. Profil</span>
                  <span className="text-[11px] text-neutral-500">Biodata, face ID & status perangkat</span>
                </div>
              </div>
            </div>

            {/* Mock Employee Dashboard Preview */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200 shadow-xl p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      alt="Budi"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Selamat pagi, Budi 👋</h4>
                    <p className="text-[11px] text-neutral-400">Jumat, 02 Oktober 2026 • Shift Pagi</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block font-bold uppercase">Sisa Cuti</span>
                  <span className="text-sm font-bold text-neutral-900">4 Hari Kerja</span>
                </div>
              </div>

              {/* Big Attendance Hero Card */}
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-left w-full sm:w-auto">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Status Hari Ini</span>
                  <p className="text-2xl font-black text-neutral-900 font-mono">08:01 WIB</p>
                  <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Checked In • Kantor Pusat (32m)
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
                >
                  CHECK-OUT PULANG
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white border border-neutral-200/80 text-left">
                  <Calendar className="w-4 h-4 text-purple-600 mb-1" />
                  <p className="text-xs font-bold text-neutral-900">Cuti Tahunan</p>
                  <p className="text-[10px] text-neutral-400">Ajukan cuti</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-neutral-200/80 text-left">
                  <AlertCircle className="w-4 h-4 text-orange-600 mb-1" />
                  <p className="text-xs font-bold text-neutral-900">Izin & Sakit</p>
                  <p className="text-[10px] text-neutral-400">Upload surat</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-neutral-200/80 text-left">
                  <Clock className="w-4 h-4 text-blue-600 mb-1" />
                  <p className="text-xs font-bold text-neutral-900">Dinas Luar</p>
                  <p className="text-[10px] text-neutral-400">Tugas luar kota</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manager & HR View */}
        {activeTab === 'manager' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto animate-in fade-in duration-200 text-left">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Pusat Pengawasan Tim
              </span>
              <h3 className="text-2xl font-bold text-neutral-900">
                Kontrol yang lebih baik untuk HR dan Manager.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Melihat gambaran kehadiran tim hari ini secara realtime, memproses permohonan persetujuan izin, dan menganalisis tren kedisiplinan kerja tanpa dokumen fisik.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Monitoring presensi staf langsung begitu mereka melakukan check-in</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Antrean approval cuti dan dinas terstruktur dengan notifikasi instan</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Deteksi otomatis karyawan terlambat atau tidak hadir tanpa kabar</span>
                </div>
              </div>
            </div>

            {/* Mock HR & Manager Dashboard */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200 shadow-xl p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Today's Attendance Overview</h4>
                  <p className="text-[11px] text-neutral-500">124 Total Karyawan Perusahaan</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                  87.1% Hadir
                </span>
              </div>

              {/* KPI Cards Strip */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Present</span>
                  <span className="text-lg font-bold text-emerald-900">108</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">Late</span>
                  <span className="text-lg font-bold text-amber-900">8</span>
                </div>
                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/60">
                  <span className="text-[10px] font-bold text-purple-800 uppercase block">Leave</span>
                  <span className="text-lg font-bold text-purple-900">4</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/60">
                  <span className="text-[10px] font-bold text-rose-800 uppercase block">Absent</span>
                  <span className="text-lg font-bold text-rose-900">2</span>
                </div>
              </div>

              {/* Pending Approvals Strip & Trend */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                    8
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900">Pending Approvals</p>
                    <p className="text-[11px] text-neutral-500">Permohonan cuti dan tugas dinas menunggu persetujuan</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1">
                  Review →
                </span>
              </div>

              {/* Minimal Trend Chart Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-semibold text-neutral-600">
                  <span>Tren Kedisiplinan Minggu Ini</span>
                  <span className="text-emerald-700 font-mono">92.4% Tepat Waktu</span>
                </div>
                <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500 w-[87%]" />
                  <div className="h-full bg-amber-400 w-[6%]" />
                  <div className="h-full bg-purple-400 w-[5%]" />
                  <div className="h-full bg-rose-400 w-[2%]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Admin View */}
        {activeTab === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto animate-in fade-in duration-200 text-left">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Operasional & Kontrol
              </span>
              <h3 className="text-2xl font-bold text-neutral-900">
                Administrasi terpusat.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Kelola infrastruktur kehadiran, karyawan, cabang kantor, dan jadwal kerja dengan hak akses yang terukur. Akses setiap admin disesuaikan dengan izin (permission) yang diberikan.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80">
                  <span className="font-bold text-neutral-900 block">• Employee Directory</span>
                  <span className="text-[10px] text-neutral-500">Data staf & jabatan</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80">
                  <span className="font-bold text-neutral-900 block">• Schedule & Shifts</span>
                  <span className="text-[10px] text-neutral-500">Jadwal kerja & toleransi</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80">
                  <span className="font-bold text-neutral-900 block">• Geofence Cabang</span>
                  <span className="text-[10px] text-neutral-500">Radius lokasi kantor</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80">
                  <span className="font-bold text-neutral-900 block">• Device Management</span>
                  <span className="text-[10px] text-neutral-500">Binding smartphone</span>
                </div>
              </div>
            </div>

            {/* Mock Admin Console Preview */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200 shadow-xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-neutral-700" />
                  <h4 className="text-sm font-bold text-neutral-900">Admin Operations Console</h4>
                </div>
                <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-mono font-semibold">
                  Role: Admin
                </span>
              </div>

              {/* Sample Admin Modules Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                  <Users className="w-4 h-4 text-neutral-700 mb-1" />
                  <p className="font-bold text-neutral-900">Karyawan</p>
                  <p className="text-[10px] text-neutral-500">124 Aktif</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                  <MapPin className="w-4 h-4 text-neutral-700 mb-1" />
                  <p className="font-bold text-neutral-900">Lokasi Kantor</p>
                  <p className="text-[10px] text-neutral-500">3 Geofence</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                  <Calendar className="w-4 h-4 text-neutral-700 mb-1" />
                  <p className="font-bold text-neutral-900">Hari Libur</p>
                  <p className="text-[10px] text-neutral-500">18 Nasional</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                  <Smartphone className="w-4 h-4 text-neutral-700 mb-1" />
                  <p className="font-bold text-neutral-900">Perangkat</p>
                  <p className="text-[10px] text-neutral-500">Hardware Bound</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                  <BarChart3 className="w-4 h-4 text-neutral-700 mb-1" />
                  <p className="font-bold text-neutral-900">Rekap Laporan</p>
                  <p className="text-[10px] text-neutral-500">Export Siap</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                  <Clock className="w-4 h-4 text-neutral-700 mb-1" />
                  <p className="font-bold text-neutral-900">Audit Trail</p>
                  <p className="text-[10px] text-neutral-500">ISO 27001 Log</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/60 text-[11px] text-neutral-500 flex items-center justify-between">
                <span>Konfigurasi sensitif (Role, Superadmin 2FA, API Keys) dikendalikan Superadmin.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
