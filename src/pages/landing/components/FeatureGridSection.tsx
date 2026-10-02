import React from 'react';
import {
  LogIn,
  LogOut,
  ScanFace,
  Sparkles,
  MapPin,
  Smartphone,
  Calendar,
  Briefcase,
  BarChart3,
  Layers,
  Send,
  FileSpreadsheet,
} from 'lucide-react';

export const FeatureGridSection: React.FC = () => {
  const features = [
    {
      number: '01',
      title: 'Smart Check-In',
      tag: 'Presensi Masuk',
      desc: 'Check-in cepat hanya dalam 3 detik dengan selfie kamera langsung, validasi biometrik, dan pencocokan radius geofence kantor.',
      icon: LogIn,
    },
    {
      number: '02',
      title: 'Check-Out Pulang',
      tag: 'Presensi Keluar',
      desc: 'Verifikasi ulang saat pulang kerja untuk menghitung durasi jam kerja riil, lembur, dan kepatuhan shift tanpa celah manipulasi.',
      icon: LogOut,
    },
    {
      number: '03',
      title: 'Face Verification',
      tag: 'Biometrik AI',
      desc: 'Wajah karyawan dicocokkan secara realtime dengan foto referensi terdaftar dengan tingkat akurasi tinggi dan toleransi pencahayaan adaptif.',
      icon: ScanFace,
    },
    {
      number: '04',
      title: 'Liveness Detection',
      tag: 'Anti-Spoofing',
      desc: 'Mendeteksi indikasi kehadiran fisik manusia nyata dan memitigasi risiko spoofing dari foto cetak, layar ponsel, maupun video playback.',
      icon: Sparkles,
    },
    {
      number: '05',
      title: 'GPS & Geofencing',
      tag: 'Akurasi Lokasi',
      desc: 'Validasi koordinat GPS kantor pusat dan cabang sebelum absensi disetujui, lengkap dengan deteksi Fake GPS dan toleransi sinyal.',
      icon: MapPin,
    },
    {
      number: '06',
      title: 'Device Binding',
      tag: 'Hardware Lock',
      desc: 'Membatasi login akun karyawan hanya pada perangkat smartphone / laptop terdaftar untuk mencegah peminjaman akun atau titip absen.',
      icon: Smartphone,
    },
    {
      number: '07',
      title: 'Leave & Permission',
      tag: 'Cuti & Izin',
      desc: 'Layanan mandiri pengajuan cuti tahunan, izin keluarga, sakit dengan lampiran surat dokter, serta koreksi jam kerja.',
      icon: Calendar,
    },
    {
      number: '08',
      title: 'Business Trip',
      tag: 'Dinas Luar',
      desc: 'Modul khusus tugas dinas luar kota dan kunjungan klien lengkap dengan geotag lokasi tujuan dan formulir pelaporan kegiatan.',
      icon: Briefcase,
    },
    {
      number: '09',
      title: 'Reporting & Analytics',
      tag: 'Rekapitulasi',
      desc: 'Dashboard analitik kehadiran, rasio tepat waktu, tren keterlambatan per departemen, dan unduh laporan CSV/Excel otomatis.',
      icon: BarChart3,
    },
    {
      number: '10',
      title: 'Audit Trail',
      tag: 'Forensik ISO',
      desc: 'Setiap aksi presensi, login, approval, dan perubahan data dicatat secara permanen dengan IP address, device ID, dan stempel waktu server.',
      icon: Layers,
    },
    {
      number: '11',
      title: 'Telegram Monitoring',
      tag: 'Alert Realtime',
      desc: 'Notifikasi bot Telegram otomatis untuk staf saat berhasil check-in, alert approval bagi manajer, dan verifikasi 2FA superadmin.',
      icon: Send,
    },
    {
      number: '12',
      title: 'Google Integration',
      tag: 'Ekosistem Cloud',
      desc: 'Sinkronisasi dua arah dengan Google Sheets untuk rekap kehadiran, Google Drive untuk arsip foto selfie, dan Google Calendar untuk hari libur.',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Ekosistem Fitur Lengkap
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Fitur yang dibutuhkan tim Anda.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Dirancang dari nol untuk memenuhi kebutuhan operasional perusahaan Indonesia, dari startup berkembang hingga korporasi multi-cabang.
          </p>
        </div>

        {/* 12 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.number}
                className="p-6 rounded-2xl bg-white border border-neutral-200/80 hover:border-neutral-900 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white text-neutral-800 flex items-center justify-center transition-colors shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-neutral-400">
                      {feat.number}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                    {feat.tag}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 mt-1">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
