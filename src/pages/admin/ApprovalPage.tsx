import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Check,
  X,
  FileText,
  Clock,
  History,
} from 'lucide-react';
import { RequestItem, RequestType, User } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';

interface ApprovalPageProps {
  requests: RequestItem[];
  currentUser?: User;
  onApprove: (id: string, note?: string) => void;
  onReject: (id: string, note?: string) => void;
}

export const ApprovalPage: React.FC<ApprovalPageProps> = ({
  requests,
  currentUser,
  onApprove,
  onReject,
}) => {
  const [pageTab, setPageTab] = useState<'pending' | 'riwayat'>('pending');
  const [activeTab, setActiveTab] = useState<'All' | RequestType>('All');
  const [historyTab, setHistoryTab] = useState<'All' | 'Approved' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
  const [selectedReq, setSelectedReq] = useState<RequestItem | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const pendingList = requests.filter((r) => r.status === 'Pending');
  const resolvedList = requests.filter(
    (r) => r.status === 'Approved' || r.status === 'Rejected'
  );

  const filteredRequests = pendingList.filter((req) => {
    const matchesTab = activeTab === 'All' || req.type === activeTab;
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const filteredHistory = resolvedList.filter((req) => {
    const matchesStatus = historyTab === 'All' || req.status === historyTab;
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenModal = (req: RequestItem, action: 'approve' | 'reject') => {
    if (action === 'approve' && currentUser && req.employeeId === currentUser.employeeId) {
      alert('Akses Ditolak: Anda tidak dapat menyetujui pengajuan milik Anda sendiri (Self-Approval dilarang demi kepatuhan audit).');
      return;
    }
    setSelectedReq(req);
    setModalAction(action);
    setReviewNote(action === 'approve' ? 'Disetujui sesuai kuota dan regulasi kerja.' : 'Alasan penolakan...');
  };

  const handleConfirmAction = () => {
    if (!selectedReq || !modalAction) return;
    if (modalAction === 'approve') {
      onApprove(selectedReq.id, reviewNote);
    } else {
      onReject(selectedReq.id, reviewNote);
    }
    setModalAction(null);
    setSelectedReq(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Pusat Approval Pengajuan
            </h2>
            {pendingList.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                {pendingList.length} Menunggu Tindakan
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Tinjau dan proses permohonan cuti, surat sakit dokter, dinas luar, dan koreksi presensi.
          </p>
        </div>
      </div>

      {/* Page-level tab: Pending vs. Riwayat */}
      <div className="flex gap-1 bg-neutral-100 rounded-2xl p-1 w-full sm:w-fit">
        <button
          type="button"
          onClick={() => setPageTab('pending')}
          className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            pageTab === 'pending' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Menunggu Approval ({pendingList.length})
        </button>
        <button
          type="button"
          onClick={() => setPageTab('riwayat')}
          className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            pageTab === 'riwayat' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Riwayat Keputusan ({resolvedList.length})
        </button>
      </div>

      {/* ── PENDING TAB ── */}
      {pageTab === 'pending' && (
        <>
          {/* Type Filter Tabs + Search */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-2 sm:p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {(['All', 'Cuti', 'Sakit', 'Izin', 'Dinas', 'Koreksi'] as const).map((tab) => {
                const count =
                  tab === 'All'
                    ? pendingList.length
                    : pendingList.filter((r) => r.type === tab).length;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      activeTab === tab
                        ? 'bg-neutral-900 text-white shadow-2xs'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{tab === 'All' ? 'Semua' : tab}</span>
                    <span
                      className={`text-[10px] px-1.5 rounded-full font-bold ${
                        activeTab === tab ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama karyawan..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
              <CheckSquare className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-neutral-800">Semua Approval Telah Diproses</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                Tidak ada permohonan tertunda pada kategori ini. Kerja bagus!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-neutral-700 text-xs shrink-0">
                          {req.employeeName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900">{req.employeeName}</h4>
                          <p className="text-[11px] text-neutral-500">
                            {req.employeeId} • {req.department}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                        {req.type}
                      </span>
                    </div>

                    <div className="mt-4 p-3.5 rounded-xl bg-neutral-50 border border-neutral-100 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-400 font-medium">Jenis Pengajuan:</span>
                        <strong className="text-neutral-800">{req.subType || req.type}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400 font-medium">Periode:</span>
                        <strong className="text-neutral-800 font-mono">
                          {req.startDate} {req.startDate !== req.endDate ? `s/d ${req.endDate}` : ''} ({req.days} Hari)
                        </strong>
                      </div>
                      {req.destination && (
                        <div className="flex justify-between">
                          <span className="text-neutral-400 font-medium">Tujuan:</span>
                          <strong className="text-neutral-800 truncate max-w-[180px]">{req.destination}</strong>
                        </div>
                      )}
                      <div>
                        <span className="text-neutral-400 font-medium block mb-0.5">Alasan:</span>
                        <p className="text-neutral-700 italic bg-white p-2 rounded-lg border border-neutral-100">
                          "{req.reason}"
                        </p>
                      </div>
                      {req.attachmentName && (
                        <div className="flex items-center gap-1.5 text-neutral-600 pt-1 text-[11px]">
                          <FileText className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="underline cursor-pointer truncate">{req.attachmentName}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-2">
                      Submitted: {req.submittedAt}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(req, 'reject')}
                      className="flex-1 py-2 px-3 rounded-xl border border-neutral-200 hover:border-rose-300 hover:bg-rose-50 text-neutral-700 hover:text-rose-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    {currentUser && req.employeeId === currentUser.employeeId ? (
                      <button
                        type="button"
                        disabled
                        title="Self-Approval dilarang. Pengajuan harus disetujui atasan atau HR."
                        className="flex-1 py-2 px-3 rounded-xl bg-neutral-100 text-neutral-400 text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-1.5 border border-neutral-200"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Self-Approval Dilarang</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenModal(req, 'approve')}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── RIWAYAT TAB ── */}
      {pageTab === 'riwayat' && (
        <>
          {/* Status filter + search */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {(['All', 'Approved', 'Rejected'] as const).map((s) => {
                const count =
                  s === 'All'
                    ? resolvedList.length
                    : resolvedList.filter((r) => r.status === s).length;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setHistoryTab(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      historyTab === s
                        ? s === 'Approved'
                          ? 'bg-emerald-600 text-white'
                          : s === 'Rejected'
                          ? 'bg-rose-600 text-white'
                          : 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    <span>
                      {s === 'All' ? 'Semua' : s === 'Approved' ? 'Disetujui' : 'Ditolak'}
                    </span>
                    <span className="text-[10px] px-1.5 rounded-full font-bold bg-white/20">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama karyawan..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
              <History className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-neutral-800">Belum Ada Riwayat Keputusan</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Riwayat approval dan penolakan akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-neutral-500 font-semibold">Karyawan</th>
                    <th className="text-left px-4 py-3 text-neutral-500 font-semibold">Jenis</th>
                    <th className="text-left px-4 py-3 text-neutral-500 font-semibold">Periode</th>
                    <th className="text-left px-4 py-3 text-neutral-500 font-semibold">Status</th>
                    <th className="text-left px-4 py-3 text-neutral-500 font-semibold hidden sm:table-cell">
                      Diproses Oleh
                    </th>
                    <th className="text-left px-4 py-3 text-neutral-500 font-semibold hidden md:table-cell">
                      Catatan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredHistory.map((req) => (
                    <tr key={req.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-neutral-900">{req.employeeName}</div>
                        <div className="text-neutral-400 text-[10px]">{req.department}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-neutral-700">{req.type}</span>
                        {req.subType && req.subType !== req.type && (
                          <div className="text-neutral-400 text-[10px]">{req.subType}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-neutral-700">
                        {req.startDate}
                        {req.startDate !== req.endDate ? ` – ${req.endDate}` : ''}
                        <div className="text-neutral-400 text-[10px]">{req.days} hari</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {req.status === 'Approved' ? '✓ Approved' : '✗ Rejected'}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-neutral-700">
                        {req.approverName || '—'}
                        {req.approvedAt && (
                          <div className="text-neutral-400 text-[10px]">{req.approvedAt}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-neutral-500 max-w-[200px]">
                        <span className="line-clamp-2 italic">
                          {req.notes || req.rejectionReason || '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              ? `Pengajuan ${selectedReq.type} oleh ${selectedReq.employeeName} akan disetujui dan kuota/jadwal akan disesuaikan otomatis.`
              : `Pengajuan ${selectedReq.type} oleh ${selectedReq.employeeName} akan ditolak.`
          }
          confirmText={modalAction === 'approve' ? 'Approve' : 'Reject'}
          cancelText="Batal"
          variant={modalAction === 'approve' ? 'success' : 'danger'}
        >
          <div className="mt-3">
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Catatan Reviewer / HR (Opsional)
            </label>
            <input
              type="text"
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Berikan alasan atau catatan approval..."
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
        </ConfirmationModal>
      )}
    </div>
  );
};
