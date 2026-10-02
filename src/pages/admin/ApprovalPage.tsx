import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Check,
  X,
  FileText,
  Clock,
  Calendar,
  AlertTriangle,
  User,
  Filter,
} from 'lucide-react';
import { RequestItem, RequestType } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';

interface ApprovalPageProps {
  requests: RequestItem[];
  onApprove: (id: string, note?: string) => void;
  onReject: (id: string, note?: string) => void;
}

export const ApprovalPage: React.FC<ApprovalPageProps> = ({
  requests,
  onApprove,
  onReject,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | RequestType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
  const [selectedReq, setSelectedReq] = useState<RequestItem | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const pendingList = requests.filter((r) => r.status === 'Pending');

  const filteredRequests = pendingList.filter((req) => {
    const matchesTab = activeTab === 'All' || req.type === activeTab;
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleOpenModal = (req: RequestItem, action: 'approve' | 'reject') => {
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
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
              {pendingList.length} Menunggu Tindakan
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Tinjau dan proses permohonan cuti, surat sakit dokter, dinas luar, dan koreksi presensi.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-2 sm:p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Navigation Tabs */}
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
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
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

      {/* Requests Card Grid (Prompt Specified Layout) */}
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

              {/* Action Buttons: Reject & Approve */}
              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOpenModal(req, 'reject')}
                  className="flex-1 py-2 px-3 rounded-xl border border-neutral-200 hover:border-rose-300 hover:bg-rose-50 text-neutral-700 hover:text-rose-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenModal(req, 'approve')}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal (Prompt Specified) */}
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
