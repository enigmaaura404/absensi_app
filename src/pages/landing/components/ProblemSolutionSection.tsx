import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  MessageSquareOff,
  Clock,
  Layers,
  ShieldAlert,
  ArrowDown,
  LogIn,
  FileText,
  CheckSquare,
  BarChart3,
  ShieldCheck,
  Sliders,
} from 'lucide-react';

export const ProblemSolutionSection: React.FC = () => {
  const problems = [
    {
      title: 'Absensi Manual & Biometrik Kaku',
      desc: 'Mesin fingerprint fisik rentan antre panjang, kotor, dan tidak mendukung staf mobile / remote.',
      icon: Clock,
    },
    {
      title: 'Data Tersebar & Tidak Sinkron',
      desc: 'Catatan presensi terpencar di file spreadsheet lokal yang rawan hilang dan tidak realtime.',
      icon: FileSpreadsheet,
    },
    {
      title: 'Koreksi Absensi Sulit Dilacak',
      desc: 'Karyawan lupa absen atau salah jam, proses verifikasi manual membebani admin HR.',
      icon: Layers,
    },
    {
      title: 'Approval Masih Melalui Chat WhatsApp',
      desc: 'Pengajuan cuti dan izin tenggelam dalam obrolan grup tanpa rekap saldo cuti yang pasti.',
      icon: MessageSquareOff,
    },
    {
      title: 'Laporan Rekap Dibuat Manual',
      desc: 'Tim HR menghabiskan berhari-hari menjelang payroll untuk merekap jam kerja dan keterlambatan.',
      icon: AlertTriangle,
    },
    {
      title: 'Risiko Manipulasi & Titip Absen',
      desc: 'Fake GPS, manipulasi foto galeri, atau peminjaman akun merusak integritas data absensi.',
      icon: ShieldAlert,
    },
  ];

  const solutions = [
    {
      title: 'Attendance',
      subtitle: 'Presensi Terverifikasi',
      desc: 'Check-In dan Check-Out instan 3 detik dengan validasi kamera selfie biometrik dan radius geofence GPS kantor.',
      icon: LogIn,
    },
    {
      title: 'Request',
      subtitle: 'Layanan Mandiri',
      desc: 'Pengajuan izin, sakit dengan surat dokter, cuti tahunan, dinas luar, hingga koreksi absensi dalam satu alur.',
      icon: FileText,
    },
    {
      title: 'Approval',
      subtitle: 'Alur Bertingkat',
      desc: 'Workflow persetujuan terstruktur dari supervisor hingga HR dengan notifikasi dan catatan keputusan transparan.',
      icon: CheckSquare,
    },
    {
      title: 'Reporting',
      subtitle: 'Rekapitulasi Otomatis',
      desc: 'Analisis tingkat kehadiran, keterlambatan, jam kerja efektif, dan ekspor langsung ke Google Sheets / Excel.',
      icon: BarChart3,
    },
    {
      title: 'Security',
      subtitle: 'Perlindungan Multi-Layer',
      desc: 'Face recognition, liveness spoof detection, validasi radius GPS, device hardware binding, dan audit log tamper-proof.',
      icon: ShieldCheck,
    },
    {
      title: 'Administration',
      subtitle: 'Manajemen Terpusat',
      desc: 'Kelola data karyawan, jadwal kerja shift, hari libur nasional, geofence cabang, dan matriks hak akses RBAC.',
      icon: Sliders,
    },
  ];

  return (
    <section className="py-20 bg-neutral-50/60 border-y border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top: The Problem */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
            Tantangan Operasional
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Absensi tidak harus rumit.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Banyak perusahaan masih menghabiskan waktu berharga menangani kendala administratif presensi tradisional.
          </p>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {problems.map((prob) => {
            const Icon = prob.icon;
            return (
              <div
                key={prob.title}
                className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs hover:shadow-xs transition-all space-y-3 text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                    {prob.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    {prob.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transition Divider Banner */}
        <div className="relative py-6 flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative bg-neutral-900 text-white px-6 py-2.5 rounded-full flex items-center gap-2.5 shadow-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold tracking-tight">
              ATTENDANCE menyatukan semuanya dalam satu sistem.
            </span>
            <ArrowDown className="w-3.5 h-3.5 text-neutral-400" />
          </div>
        </div>

        {/* Bottom: The Solution Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Solusi Terpadu
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              Satu platform untuk seluruh proses kehadiran.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600">
              Menghilangkan hambatan manual dan memberikan transparansi menyeluruh bagi karyawan, atasan, dan tim HR.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((sol) => {
              const Icon = sol.icon;
              return (
                <div
                  key={sol.title}
                  className="p-6 rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-900 shadow-2xs hover:shadow-md transition-all group text-left flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center group-hover:bg-emerald-500 transition-colors shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {sol.subtitle}
                      </span>
                      <h4 className="text-base font-bold text-neutral-900 mt-0.5">
                        {sol.title}
                      </h4>
                      <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed font-normal">
                        {sol.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
