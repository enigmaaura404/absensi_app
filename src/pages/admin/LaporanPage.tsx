import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { AttendanceRecord, User } from '../../types';
import { computeAttendanceSummary, computeDepartmentStats } from '../../utils/reporting';
import { getPayrollPeriods } from '../../utils/payroll';

interface LaporanPageProps {
  records: AttendanceRecord[];
  employees: User[];
  onSyncGoogleSheets: () => void;
}

export const LaporanPage: React.FC<LaporanPageProps> = ({ records, employees, onSyncGoogleSheets }) => {
  const payrollPeriods = getPayrollPeriods();
  const [periodeIndex, setPeriodeIndex] = useState(0);
  const [department, setDepartment] = useState('Semua');
  const [exportNotice, setExportNotice] = useState(false);

  const selectedPeriod = payrollPeriods[periodeIndex];

  // Filter records to selected period
  const periodRecords = useMemo(() => {
    const start = new Date(selectedPeriod.startDate);
    const end = new Date(selectedPeriod.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return records.filter((r) => {
      const d = new Date(r.date);
      return d >= start && d <= end;
    });
  }, [records, selectedPeriod]);

  // Filter by department if selected
  const filteredRecords = useMemo(() => {
    if (department === 'Semua') return periodRecords;
    return periodRecords.filter((r) => r.department === department);
  }, [periodRecords, department]);

  // Derive summary stats
  const summary = useMemo(() => computeAttendanceSummary(periodRecords), [periodRecords]);

  // Derive per-department stats
  const deptStats = useMemo(
    () => computeDepartmentStats(periodRecords, employees),
    [periodRecords, employees]
  );

  // Unique departments from employee roster
  const allDepartments = useMemo(() => {
    const deps = Array.from(new Set(employees.map((e) => e.department))).sort();
    return deps;
  }, [employees]);

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => {
      const csvContent =
        'data:text/csv;charset=utf-8,Tanggal,Nama,Departemen,CheckIn,CheckOut,Status,Durasi,Lokasi\n' +
        filteredRecords
          .map(
            (r) =>
              `"${r.date}","${r.employeeName}","${r.department}","${r.checkInTime || '-'}","${r.checkOutTime || '-'}","${r.status}","${r.duration || '-'}","${r.location}"`
          )
          .join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Rekap_Absensi_${selectedPeriod.label.replace(' ', '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportNotice(false);
    }, 600);
  };

  const avgDurationFormatted =
    summary.avgDurationMinutes > 0
      ? `${Math.floor(summary.avgDurationMinutes / 60)}j ${summary.avgDurationMinutes % 60}m`
      : '—';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Laporan &amp; Rekapitulasi Presensi
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

      {/* Filter Ribbon */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-3 sm:p-4 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
              Periode
            </label>
            <select
              value={periodeIndex}
              onChange={(e) => setPeriodeIndex(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              {payrollPeriods.map((p, i) => (
                <option key={p.label} value={i}>{p.label}</option>
              ))}
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
              <option value="Semua">Semua Department</option>
              {allDepartments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
              Data Period
            </label>
            <div className="w-full px-3 py-1.5 rounded-xl border border-neutral-100 bg-neutral-50 text-xs font-mono text-neutral-600">
              {selectedPeriod.startDate} → {selectedPeriod.endDate}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards — derived from real data */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Karyawan"
          value={String(employees.filter((e) => e.status !== 'Inactive').length)}
          subtext="Aktif terdaftar"
          icon={Users}
        />
        <StatCard
          title="Hadir"
          value={String(summary.presentCount + summary.lateCount)}
          subtext={`Rata-rata ${summary.attendanceRate}%`}
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Terlambat"
          value={String(summary.lateCount)}
          subtext={`${summary.lateRate}% dari yang hadir`}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Tidak Hadir"
          value={String(summary.absentCount)}
          subtext={summary.totalRecords > 0 ? 'Tanpa izin resmi' : 'Belum ada data'}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* Additional KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-neutral-400 mb-1">Total Catatan</p>
          <p className="text-2xl font-extrabold text-neutral-900">{summary.totalRecords}</p>
          <p className="text-xs text-neutral-500 mt-0.5">Rekaman kehadiran dalam periode</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-neutral-400 mb-1">Rata-Rata Durasi</p>
          <p className="text-2xl font-extrabold text-neutral-900">{avgDurationFormatted}</p>
          <p className="text-xs text-neutral-500 mt-0.5">Per sesi kerja (yang sudah check-out)</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <p className="text-[10px] uppercase font-bold text-neutral-400">Cuti &amp; Izin</p>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">{summary.leaveCount}</p>
          <p className="text-xs text-neutral-500 mt-0.5">Hari cuti/izin/sakit/dinas tercatat</p>
        </div>
      </div>

      {/* Distribution by Department — derived from real data */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">
              Distribusi Kehadiran Berdasarkan Departemen
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tingkat disiplin dan kehadiran masing-masing divisi periode {selectedPeriod.label}
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
            Target Kepatuhan: ≥ 95%
          </span>
        </div>

        {deptStats.length === 0 ? (
          <div className="py-8 text-center text-sm text-neutral-400">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-30" />
            Belum ada data kehadiran untuk periode {selectedPeriod.label}
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {deptStats.map((dept) => (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-neutral-800">
                    {dept.name} ({dept.total > 0 ? `${dept.total} Staf` : 'N/A'})
                  </span>
                  <span className="font-mono text-neutral-700">
                    {dept.hadir}% Kehadiran • {dept.late}% Terlambat • {dept.leave}% Cuti/Izin
                  </span>
                </div>
                <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(dept.hadir, 100)}%` }}
                    className={`h-full transition-all ${dept.hadir >= 95 ? 'bg-emerald-500' : dept.hadir >= 80 ? 'bg-amber-400' : 'bg-rose-500'}`}
                    title={`Hadir: ${dept.hadir}%`}
                  />
                  <div
                    style={{ width: `${Math.min(dept.late, 100 - dept.hadir)}%` }}
                    className="bg-orange-400 h-full"
                    title={`Terlambat: ${dept.late}%`}
                  />
                  <div
                    style={{ width: `${Math.min(dept.leave, 100)}%` }}
                    className="bg-purple-400 h-full"
                    title={`Cuti/Izin: ${dept.leave}%`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
