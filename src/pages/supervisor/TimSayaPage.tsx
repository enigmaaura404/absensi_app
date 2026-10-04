import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Phone,
  Calendar,
  MapPin,
  XCircle,
  CheckSquare,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { User, AttendanceRecord, RequestItem } from '../../types';

interface TimSayaPageProps {
  currentUser?: User;
  employees?: User[];
  todayAttendance?: AttendanceRecord[];
  requests?: RequestItem[];
  onApproveRequest?: (id: string, note?: string) => void;
  onRejectRequest?: (id: string, note?: string) => void;
}

/**
 * TimSayaPage — Supervisor view for monitoring real-time team attendance
 * and processing leave / correction requests from direct reports.
 *
 * Business Rules:
 * - BR-SPV-001: Supervisor can only see employees in their own department.
 * - BR-SPV-002: Self-approval is forbidden (BR-APP-001 cascade).
 * - BR-SPV-003: Supervisor can approve Pending requests from their team.
 */
export const TimSayaPage: React.FC<TimSayaPageProps> = ({
  currentUser,
  employees = [],
  todayAttendance = [],
  requests = [],
  onApproveRequest,
  onRejectRequest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [activeTab, setActiveTab] = useState<'kehadiran' | 'pengajuan'>('kehadiran');
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
  const [selectedReq, setSelectedReq] = useState<RequestItem | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  // BR-SPV-001: Filter to supervisor's department only
  const myDepartment = currentUser?.department;
  const teamMembers = useMemo(
    () =>
      myDepartment
        ? employees.filter(
            (e) => e.department === myDepartment && e.id !== currentUser?.id
          )
        : employees,
    [employees, myDepartment, currentUser?.id]
  );

  // Derive attendance status for each team member from today's records
  const teamWithAttendance = useMemo(() => {
    return teamMembers.map((member) => {
      const record = todayAttendance.find(
        (r) => r.employeeId === member.employeeId
      );
      return {
        member,
        record,
        status: record?.status ?? 'Belum Check-In',
        checkIn: record?.checkInTime ?? null,
        location: record?.location ?? '-',
      };
    });
  }, [teamMembers, todayAttendance]);

  // Derive pending requests from team members only (BR-SPV-003)
  const teamEmployeeIds = new Set(teamMembers.map((m) => m.employeeId));
  const teamPendingRequests = requests.filter(
    (r) => teamEmployeeIds.has(r.employeeId) && r.status === 'Pending'
  );

  // KPI stats
  const hadir = teamWithAttendance.filter((t) =>
    ['Hadir', 'Dinas'].includes(t.status)
  ).length;
  const terlambat = teamWithAttendance.filter((t) => t.status === 'Terlambat').length;
  const cutiIzin = teamWithAttendance.filter((t) =>
    ['Cuti', 'Izin', 'Sakit'].includes(t.status)
  ).length;
  const belumAbsen = teamWithAttendance.filter(
    (t) => t.status === 'Belum Check-In'
  ).length;

  // Filter attendance list
  const filteredTeam = teamWithAttendance.filter((t) => {
    const matchesSearch =
      t.member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.member.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'Semua' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (req: RequestItem, action: 'approve' | 'reject') => {
    // BR-SPV-002 / BR-APP-001: Prevent self-approval
    if (
      action === 'approve' &&
      currentUser &&
      req.employeeId === currentUser.employeeId
    ) {
      return;
    }
    setSelectedReq(req);
    setModalAction(action);
    setReviewNote(
      action === 'approve'
        ? 'Disetujui oleh Supervisor langsung.'
        : 'Alasan penolakan...'
    );
  };

  const handleConfirmAction = () => {
    if (!selectedReq || !modalAction) return;
    if (modalAction === 'approve') {
      onApproveRequest?.(selectedReq.id, reviewNote);
    } else {
      onRejectRequest?.(selectedReq.id, reviewNote);
    }
    setModalAction(null);
    setSelectedReq(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Kehadiran Tim Saya
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700">
            {teamMembers.length} Anggota
          </span>
          {myDepartment && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              {myDepartment}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Pantau status absensi real-time, jam masuk, lokasi, dan proses pengajuan bawahan divisi Anda.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Anggota Tim"
          value={String(teamMembers.length)}
          subtext={myDepartment || 'Semua Divisi'}
          icon={Users}
        />
        <StatCard
          title="Hadir Tepat Waktu"
          value={String(hadir)}
          subtext={`${teamMembers.length > 0 ? Math.round((hadir / teamMembers.length) * 100) : 0}% dari regu kerja`}
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Terlambat"
          value={String(terlambat)}
          subtext={terlambat > 0 ? `${terlambat} staf melewati jam masuk` : 'Nihil keterlambatan'}
          icon={Clock}
          variant={terlambat > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="Cuti / Izin / Sakit"
          value={String(cutiIzin)}
          subtext={belumAbsen > 0 ? `${belumAbsen} belum check-in` : 'Semua tercatat'}
          icon={Calendar}
          variant={cutiIzin > 0 ? 'info' : 'default'}
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-neutral-100 rounded-2xl p-1 w-full sm:w-fit">
        {(['kehadiran', 'pengajuan'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {tab === 'kehadiran' ? 'Kehadiran Hari Ini' : `Pengajuan Pending (${teamPendingRequests.length})`}
          </button>
        ))}
      </div>

      {/* ── TAB: Kehadiran Hari Ini ── */}
      {activeTab === 'kehadiran' && (
        <>
          {/* Toolbar */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
                Status:
              </span>
              {['Semua', 'Hadir', 'Terlambat', 'Cuti', 'Belum Check-In'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    statusFilter === s
                      ? 'bg-neutral-900 text-white font-semibold'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau jabatan..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          {filteredTeam.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
              <Users className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-neutral-800">Tidak Ada Anggota Ditemukan</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Coba ubah filter atau kata kunci pencarian.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeam.map(({ member, record, status, checkIn, location }) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-11 h-11 rounded-full object-cover border border-neutral-200"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900">{member.name}</h4>
                          <p className="text-xs text-neutral-500">{member.position}</p>
                        </div>
                      </div>
                      <StatusBadge status={status} size="sm" />
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Check-In:</span>
                        <strong className="text-neutral-900 font-mono">
                          {checkIn ? `${checkIn} WIB` : '-'}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Checkout:</span>
                        <strong className="text-neutral-900 font-mono">
                          {record?.checkOutTime ? `${record.checkOutTime} WIB` : '-'}
                        </strong>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-neutral-400 shrink-0">Lokasi:</span>
                        <span className="text-neutral-700 text-right max-w-[160px] font-medium leading-tight">
                          {location}
                        </span>
                      </div>
                      {record?.lateMinutes && record.lateMinutes > 0 && (
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Keterlambatan:</span>
                          <strong className="text-amber-700">{record.lateMinutes} menit</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-neutral-400">{member.employeeId}</span>
                    <a
                      href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>Hubungi</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── TAB: Pengajuan Pending ── */}
      {activeTab === 'pengajuan' && (
        <>
          {teamPendingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
              <CheckSquare className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-neutral-800">Tidak Ada Pengajuan Tertunda</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Semua permintaan dari tim Anda telah diproses.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamPendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900">{req.employeeName}</h4>
                        <p className="text-[11px] text-neutral-500">
                          {req.employeeId} • {req.department}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 shrink-0">
                        {req.type}
                      </span>
                    </div>

                    <div className="mt-4 p-3.5 rounded-xl bg-neutral-50 border border-neutral-100 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-400 font-medium">Jenis:</span>
                        <strong className="text-neutral-800">{req.subType || req.type}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400 font-medium">Periode:</span>
                        <strong className="text-neutral-800 font-mono">
                          {req.startDate}
                          {req.startDate !== req.endDate ? ` – ${req.endDate}` : ''}{' '}
                          ({req.days} Hari)
                        </strong>
                      </div>
                      <div>
                        <span className="text-neutral-400 font-medium block mb-0.5">Alasan:</span>
                        <p className="text-neutral-700 italic bg-white p-2 rounded-lg border border-neutral-100">
                          "{req.reason}"
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-2">
                      Diajukan: {req.submittedAt}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(req, 'reject')}
                      className="flex-1 py-2 px-3 rounded-xl border border-neutral-200 hover:border-rose-300 hover:bg-rose-50 text-neutral-700 hover:text-rose-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Tolak</span>
                    </button>

                    {currentUser && req.employeeId === currentUser.employeeId ? (
                      <button
                        type="button"
                        disabled
                        title="Self-Approval dilarang."
                        className="flex-1 py-2 px-3 rounded-xl bg-neutral-100 text-neutral-400 text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-1.5 border border-neutral-200"
                      >
                        Self-Approval Dilarang
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenModal(req, 'approve')}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Setujui</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      {selectedReq && modalAction && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => {
            setModalAction(null);
            setSelectedReq(null);
          }}
          onConfirm={handleConfirmAction}
          title={modalAction === 'approve' ? 'Setujui Pengajuan?' : 'Tolak Pengajuan?'}
          description={
            modalAction === 'approve'
              ? `Pengajuan ${selectedReq.type} dari ${selectedReq.employeeName} akan disetujui. Kuota/jadwal akan disesuaikan otomatis.`
              : `Pengajuan ${selectedReq.type} dari ${selectedReq.employeeName} akan ditolak.`
          }
          confirmText={modalAction === 'approve' ? 'Setujui' : 'Tolak'}
          cancelText="Batal"
          variant={modalAction === 'approve' ? 'success' : 'danger'}
        >
          <div className="mt-3">
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Catatan Supervisor (Opsional)
            </label>
            <input
              type="text"
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Catatan approval untuk rekaman audit..."
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
        </ConfirmationModal>
      )}
    </div>
  );
};
