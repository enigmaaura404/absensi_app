import React from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  TrendingUp,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const ReportingSection: React.FC = () => {
  return (
    <section className="py-24 bg-neutral-50/70 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Analitik & Rekapitulasi
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Laporan yang siap digunakan.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Tidak perlu lagi lembur merekap spreadsheet manual saat tanggal cut-off payroll. Data presensi dikompilasi secara otomatis dan akurat.
          </p>
        </div>

        {/* Mockup Reporting Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-neutral-200/90 shadow-xl p-6 sm:p-8 space-y-6 text-left">
          {/* Top Bar with Export Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-neutral-800" />
                <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                  Attendance Summary Report
                </h3>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Periode: 01 Oktober 2026 – 31 Oktober 2026 • Cut-off Payroll Bulanan
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV/XLSX</span>
              </button>
              <button
                type="button"
                className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sync Google Sheets</span>
              </button>
            </div>
          </div>

          {/* Metric Breakdown Grid (Specified in Prompt) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                Present (Tepat Waktu)
              </span>
              <span className="text-3xl font-extrabold text-emerald-600 block mt-1 font-mono">
                91%
              </span>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">2,184 Kehadiran</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                Late (Terlambat)
              </span>
              <span className="text-3xl font-extrabold text-amber-600 block mt-1 font-mono">
                5%
              </span>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">120 Transaksi</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                Leave (Izin / Cuti)
              </span>
              <span className="text-3xl font-extrabold text-purple-600 block mt-1 font-mono">
                3%
              </span>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">72 Hari Kerja</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                Absent (Alpa)
              </span>
              <span className="text-3xl font-extrabold text-rose-600 block mt-1 font-mono">
                1%
              </span>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">24 Kasus</span>
            </div>
          </div>

          {/* Minimalist Visual Chart Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-semibold text-neutral-700">
              <span>Distribusi Kehadiran Kumulatif</span>
              <span className="font-mono text-emerald-700">96% Kepatuhan Kehadiran</span>
            </div>
            <div className="h-4 w-full bg-neutral-100 rounded-full overflow-hidden flex shadow-inner">
              <div style={{ width: '91%' }} className="bg-emerald-500 h-full" title="Hadir: 91%" />
              <div style={{ width: '5%' }} className="bg-amber-400 h-full" title="Terlambat: 5%" />
              <div style={{ width: '3%' }} className="bg-purple-400 h-full" title="Cuti: 3%" />
              <div style={{ width: '1%' }} className="bg-rose-400 h-full" title="Alpa: 1%" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Hadir 91%</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Terlambat 5%</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400" /> Cuti/Izin 3%</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400" /> Alpa 1%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
