import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Calendar,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AttendanceRecord } from '../../types';

interface LaporanPageProps {
  records: AttendanceRecord[];
  onSyncGoogleSheets: () => void;
}

export const LaporanPage: React.FC<LaporanPageProps> = ({ records, onSyncGoogleSheets }) => {
  const [periode, setPeriode] = useState('Oktober 2026');
  const [department, setDepartment] = useState('Semua');
  const [exportNotice, setExportNotice] = useState(false);

  const deptStats = [
    { name: 'Technology', hadir: 96, late: 2, leave: 2, total: 32 },
    { name: 'Finance', hadir: 92, late: 5, leave: 3, total: 18 },
    { name: 'Operations', hadir: 90, late: 6, leave: 4, total: 30 },
    { name: 'Human Resources', hadir: 98, late: 1, leave: 1, total: 12 },
    { name: 'Marketing', hadir: 88, late: 8, leave: 4, total: 20 },
    { name: 'Legal', hadir: 85, late: 5, leave: 10, total: 12 },
  ];

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => {
      const csvContent =
        'data:text/csv;charset=utf-8,Tanggal,Nama,Departemen,CheckIn,CheckOut,Status,Lokasi\n' +
        records
          .map(
            (r) =>
              `"${r.date}","${r.employeeName}","${r.department}","${r.checkInTime || '-'}","${r.checkOutTime || '-'}","${r.status}","${r.location}"`
          )
          .join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Rekap_Absensi_${periode.replace(' ', '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportNotice(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Laporan & Rekapitulasi Presensi
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Analisis metrik jam kerja, tren ketepatan waktu, dan ekspor data kepatuhan bulanan.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onSyncGoogleSheets}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 bg-white text-neutral-800 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sync Google Sheets</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Laporan presensi sedang diunduh ke komputer Anda...</span>
        </div>
      )}

      {/* Filter Ribbon (Prompt Specified) */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-3 sm:p-4 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
              Periode
            </label>
            <select
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option>Oktober 2026</option>
              <option>September 2026</option>
              <option>Agustus 2026</option>
              <option>Q3 2026</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option>Semua Department</option>
              <option>Technology</option>
              <option>Human Resources</option>
              <option>Finance</option>
              <option>Operations</option>
              <option>Marketing</option>
              <option>Legal</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
              Employee Filter
            </label>
            <select className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900">
              <option>Semua Karyawan (124 Orang)</option>
              <option>Hanya Karyawan Tetap</option>
              <option>Hanya Karyawan Kontrak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top 4 Cards (Prompt Specified Numbers) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Karyawan"
          value="124"
          subtext="Aktif terdaftar"
          icon={Users}
        />
        <StatCard
          title="Hadir"
          value="108"
          subtext="Rata-rata 87.1%"
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Terlambat"
          value="8"
          subtext="6.4% dari total"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Tidak Hadir"
          value="4"
          subtext="Tanpa izin resmi"
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* Distribution by Department Table & Bars */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">
              Distribusi Kehadiran Berdasarkan Departemen
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tingkat disiplin dan kehadiran masing-masing divisi bulan {periode}
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
            Target Kepatuhan: ≥ 95%
          </span>
        </div>

        <div className="space-y-4 pt-2">
          {deptStats.map((dept) => (
            <div key={dept.name} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-neutral-800">{dept.name} ({dept.total} Staf)</span>
                <span className="font-mono text-neutral-700">
                  {dept.hadir}% Kehadiran • {dept.late}% Terlambat • {dept.leave}% Cuti
                </span>
              </div>
              <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${dept.hadir}%` }}
                  className="bg-emerald-500 h-full"
                  title={`Hadir: ${dept.hadir}%`}
                />
                <div
                  style={{ width: `${dept.late}%` }}
                  className="bg-amber-400 h-full"
                  title={`Terlambat: ${dept.late}%`}
                />
                <div
                  style={{ width: `${dept.leave}%` }}
                  className="bg-purple-400 h-full"
                  title={`Cuti: ${dept.leave}%`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
