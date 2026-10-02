import React from 'react';
import {
  Users,
  UserCheck,
  Clock,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  MapPin,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { AttendanceRecord, RequestItem, SecurityEventItem } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';

interface AdminDashboardProps {
  todayAttendance: AttendanceRecord[];
  pendingRequests: RequestItem[];
  securityEvents: SecurityEventItem[];
  onNavigate: (route: string) => void;
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  todayAttendance,
  pendingRequests,
  securityEvents,
  onNavigate,
  onApproveRequest,
  onRejectRequest,
}) => {
  const totalEmployees = 124;
  const presentCount = 108;
  const lateCount = 8;
  const onLeaveCount = 4;
  const absentCount = 4;

  const weeklyTrend = [
    { day: 'Sen', hadir: 114, late: 6, leave: 4 },
    { day: 'Sel', hadir: 112, late: 7, leave: 5 },
    { day: 'Rab', hadir: 115, late: 4, leave: 5 },
    { day: 'Kam', hadir: 110, late: 9, leave: 5 },
    { day: 'Jum (Hari ini)', hadir: 108, late: 8, leave: 8 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Good Morning, HR & Management Team 👋
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Ringkasan kehadiran operasional perusahaan hari ini • Jumat, 02 Oktober 2026
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('laporan')}
            className="px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors"
          >
            Rekap Laporan
          </button>
          <button
            onClick={() => onNavigate('approval')}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Approval ({pendingRequests.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 5 KPI Metrics (Prompt Specified) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Total Karyawan"
          value={totalEmployees}
          subtext="Seluruh cabang kantor"
          icon={Users}
          variant="default"
          onClick={() => onNavigate('employees')}
        />

        <StatCard
          title="Hadir"
          value={presentCount}
          subtext="87.1% tingkat kehadiran"
          icon={UserCheck}
          variant="success"
          trend={{ value: '+2%', isPositive: true }}
          onClick={() => onNavigate('riwayat')}
        />

        <StatCard
          title="Terlambat"
          value={lateCount}
          subtext="Melewati jam 08:10 WIB"
          icon={Clock}
          variant="warning"
          onClick={() => onNavigate('laporan')}
        />

        <StatCard
          title="Cuti / Izin"
          value={onLeaveCount}
          subtext="Permohonan terkonfirmasi"
          icon={Calendar}
          variant="info"
          onClick={() => onNavigate('pengajuan')}
        />

        <StatCard
          title="Tidak Hadir"
          value={absentCount}
          subtext="Tanpa keterangan resmi"
          icon={AlertTriangle}
          variant="danger"
          onClick={() => onNavigate('laporan')}
        />
      </div>

      {/* Middle Grid: Trend Chart & Pending Approval Quick Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 7-Day Attendance Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-neutral-900">
                  Tren Kehadiran Minggu Ini
                </h4>
                <p className="text-xs text-neutral-500">
                  Perbandingan kehadiran tepat waktu, keterlambatan, dan perizinan
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-neutral-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                  Hadir
                </span>
                <span className="flex items-center gap-1.5 text-neutral-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                  Terlambat
                </span>
                <span className="flex items-center gap-1.5 text-neutral-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-xs bg-purple-500" />
                  Izin/Cuti
                </span>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="space-y-4 pt-2">
              {weeklyTrend.map((item) => (
                <div key={item.day} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-neutral-700">{item.day}</span>
                    <span className="text-neutral-900 font-mono">
                      {item.hadir} Hadir • {item.late} Terlambat • {item.leave} Cuti
                    </span>
                  </div>
                  {/* Segmented bar */}
                  <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${(item.hadir / 124) * 100}%` }}
                      className="bg-emerald-500 h-full transition-all"
                      title={`Hadir: ${item.hadir}`}
                    />
                    <div
                      style={{ width: `${(item.late / 124) * 100}%` }}
                      className="bg-amber-400 h-full transition-all"
                      title={`Terlambat: ${item.late}`}
                    />
                    <div
                      style={{ width: `${(item.leave / 124) * 100}%` }}
                      className="bg-purple-400 h-full transition-all"
                      title={`Cuti/Izin: ${item.leave}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Rata-rata tepat waktu bulan ini: <strong>92.4%</strong></span>
            <button
              onClick={() => onNavigate('laporan')}
              className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
            >
              Lihat Analisis Lengkap →
            </button>
          </div>
        </div>

        {/* Right 1 Col: Pending Approvals Quick Queue */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Pending Approvals</h4>
                <p className="text-xs text-neutral-500">Menunggu tindakan verifikasi</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {pendingRequests.length} Baru
              </span>
            </div>

            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all bg-neutral-50/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-neutral-900">
                      {req.employeeName}
                    </span>
                    <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.2 rounded font-semibold">
                      {req.type}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-600 mt-1 line-clamp-1 font-medium">
                    {req.reason}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    {req.startDate} ({req.days} hari)
                  </p>

                  <div className="mt-2 pt-2 border-t border-neutral-200/60 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onRejectRequest(req.id)}
                      className="px-2.5 py-1 rounded-lg border border-neutral-200 hover:bg-rose-50 hover:text-rose-600 text-neutral-600 text-[11px] font-semibold transition-colors"
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      onClick={() => onApproveRequest(req.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold shadow-2xs transition-colors"
                    >
                      Setujui
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('approval')}
            className="w-full mt-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 text-center transition-colors"
          >
            Buka Semua Pending Request ({pendingRequests.length}) →
          </button>
        </div>
      </div>

      {/* Bottom Grid: Today's Realtime Attendance & Security Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Attendance Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-neutral-900">Today's Attendance</h4>
              <p className="text-xs text-neutral-500">Live feed absensi masuk hari ini</p>
            </div>
            <button
              onClick={() => onNavigate('riwayat')}
              className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1"
            >
              <span>Lihat Seluruh Log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                <tr>
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Check-In</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Location & Device</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {todayAttendance.slice(0, 6).map((rec) => (
                  <tr key={rec.id} className="hover:bg-neutral-50/60">
                    <td className="py-3 px-3">
                      <p className="font-bold text-neutral-900">{rec.employeeName}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">{rec.employeeId} • {rec.department}</p>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-neutral-800">
                      {rec.checkInTime || '-'}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={rec.status} size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <p className="text-neutral-800 font-medium truncate max-w-[200px]">{rec.location}</p>
                      <p className="text-[10px] text-neutral-400 font-mono truncate max-w-[200px]">{rec.device}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Security Overview (Prompt Specified) */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Security Overview</h4>
                <p className="text-xs text-neutral-500">Peringatan fraud biometrik & GPS</p>
              </div>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-center">
                <span className="text-xs text-neutral-500 block">Failed Login</span>
                <span className="text-lg font-bold text-neutral-900 mt-0.5 block">12</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-center">
                <span className="text-xs text-neutral-500 block">Face Spoof</span>
                <span className="text-lg font-bold text-amber-600 mt-0.5 block">3</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-center">
                <span className="text-xs text-neutral-500 block">Suspicious GPS</span>
                <span className="text-lg font-bold text-rose-600 mt-0.5 block">2</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-center">
                <span className="text-xs text-neutral-500 block">Device Blocked</span>
                <span className="text-lg font-bold text-neutral-900 mt-0.5 block">1</span>
              </div>
            </div>

            <div className="space-y-2">
              {securityEvents.slice(0, 2).map((ev) => (
                <div key={ev.id} className="p-2.5 rounded-xl border border-neutral-100 bg-neutral-50/60 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900">{ev.type}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      ev.severity === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {ev.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 line-clamp-1">{ev.description}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('security-events')}
            className="w-full mt-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 text-center transition-colors"
          >
            Lihat Forensik Keamanan →
          </button>
        </div>
      </div>
    </div>
  );
};
