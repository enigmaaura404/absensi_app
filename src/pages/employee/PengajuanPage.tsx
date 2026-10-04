import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  Clock,
  Upload,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';
import { RequestItem, RequestType, User, HolidayItem } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { getTodayDateString, formatDateIndonesian } from '../../utils/time';
import { calculateWorkingDays } from '../../utils/leave';

interface PengajuanPageProps {
  requests: RequestItem[];
  user?: User;
  holidays?: HolidayItem[];
  onAddRequest: (item: RequestItem) => void;
  onCancelRequest: (id: string) => void;
}

export const PengajuanPage: React.FC<PengajuanPageProps> = ({
  requests,
  user,
  holidays = [],
  onAddRequest,
  onCancelRequest,
}) => {
  const [activeTab, setActiveTab] = useState<'Semua' | RequestType>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<RequestItem | null>(null);

  // Form states
  const [formType, setFormType] = useState<RequestType>('Izin');
  const [subType, setSubType] = useState('Izin Kepentingan Pribadi');
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getTodayDateString());
  const [daysCount, setDaysCount] = useState(1);
  const [reason, setReason] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper for working days calculation with holidays
  const holidayDates = holidays.map((h) => h.date);
  const leaveStats = calculateWorkingDays(startDate, endDate, holidayDates);

  const tabs: ('Semua' | RequestType)[] = ['Semua', 'Izin', 'Sakit', 'Cuti', 'Dinas', 'Koreksi'];

  const filteredRequests = requests.filter((req) => {
    const matchesTab = activeTab === 'Semua' || req.type === activeTab;
    const matchesSearch =
      req.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.subType && req.subType.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newReq: RequestItem = {
        id: `req-${Date.now()}`,
        employeeId: user?.employeeId || 'EMP-00124',
        employeeName: user?.name || 'Budi Santoso',
        department: user?.department || 'Technology',
        type: formType,
        subType: subType || formType,
        startDate,
        endDate,
        days: daysCount > 0 ? daysCount : 1,
        reason,
        status: 'Pending',
        submittedAt: `${formatDateIndonesian()} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
        attachmentName: attachmentName || (formType === 'Sakit' ? 'surat_keterangan_dokter.jpg' : undefined),
      };

      onAddRequest(newReq);
      setIsSubmitting(false);
      setIsModalOpen(false);
      // Reset form
      setReason('');
      setAttachmentName('');
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Pengajuan & Perizinan
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Kelola seluruh permohonan izin kerja, cuti, sakit, dan koreksi kehadiran.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Pengajuan</span>
        </button>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-2 sm:p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const count =
              tab === 'Semua'
                ? requests.length
                : requests.filter((r) => r.type === tab).length;

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
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-100 text-neutral-500'
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
            placeholder="Cari alasan / tipe..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* Main Requests Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 text-[11px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
              <tr>
                <th className="py-3 px-4">Pengajuan</th>
                <th className="py-3 px-4">Tanggal Pelaksanaan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <FileText className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-neutral-700">Belum ada pengajuan</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Anda belum memiliki permohonan pada kategori ini.
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Buat Pengajuan Baru
                    </button>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">{req.type}</span>
                        {req.subType && (
                          <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                            {req.subType}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">
                        {req.reason}
                      </p>
                      {req.attachmentName && (
                        <p className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>{req.attachmentName}</span>
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <p className="font-semibold text-neutral-800">
                        {req.startDate} {req.startDate !== req.endDate ? `s/d ${req.endDate}` : ''}
                      </p>
                      <p className="text-[11px] text-neutral-400 font-sans">
                        {req.days} Hari Kerja
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-neutral-500">
                      {req.submittedAt}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedDetail(req)}
                          className="px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-medium transition-colors"
                        >
                          Detail
                        </button>
                        {req.status === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => onCancelRequest(req.id)}
                            className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                          >
                            Batal
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Buat Pengajuan */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Pengajuan Baru"
        description="Pilih jenis pengajuan dan lengkapi data permohonan Anda"
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Jenis Pengajuan
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Izin', 'Sakit', 'Cuti', 'Koreksi'] as RequestType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => {
                    setFormType(t);
                    if (t === 'Izin') setSubType('Izin Keperluan Pribadi');
                    if (t === 'Sakit') setSubType('Sakit Rawat Jalan');
                    if (t === 'Cuti') {
                      setSubType('Cuti Tahunan');
                      const stats = calculateWorkingDays(startDate, endDate, holidayDates);
                      setDaysCount(stats.workingDays > 0 ? stats.workingDays : 1);
                    }
                    if (t === 'Koreksi') setSubType('Lupa Check-Out');
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    formType === t
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Kategori Spesifik
              </label>
              <input
                type="text"
                required
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
                placeholder="Contoh: Izin setengah hari / Flu berat"
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Jumlah Hari {formType === 'Cuti' && '(Hari Kerja)'}
              </label>
              <input
                type="number"
                min={0.5}
                step={0.5}
                max={14}
                required
                value={daysCount}
                onChange={(e) => setDaysCount(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Tanggal Mulai
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => {
                  const newStart = e.target.value;
                  setStartDate(newStart);
                  if (formType === 'Cuti') {
                    const stats = calculateWorkingDays(newStart, endDate, holidayDates);
                    setDaysCount(stats.workingDays > 0 ? stats.workingDays : 1);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Tanggal Selesai
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => {
                  const newEnd = e.target.value;
                  setEndDate(newEnd);
                  if (formType === 'Cuti') {
                    const stats = calculateWorkingDays(startDate, newEnd, holidayDates);
                    setDaysCount(stats.workingDays > 0 ? stats.workingDays : 1);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            {formType === 'Cuti' && (leaveStats.weekendDays > 0 || leaveStats.holidayDays > 0) && (
              <div className="sm:col-span-2 text-[11px] text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                ℹ️ Dari {leaveStats.totalCalendarDays} hari kalender, terhitung {leaveStats.workingDays} hari kerja efektif
                {leaveStats.weekendDays > 0 && ` (${leaveStats.weekendDays} hari libur akhir pekan)`}
                {leaveStats.holidayDays > 0 && ` (${leaveStats.holidayDays} hari libur nasional/bersama)`}.
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Alasan Pengajuan
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Jelaskan keperluan atau alasan pengajuan secara jelas..."
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Lampiran Pendukung {formType === 'Sakit' ? '(Wajib Surat Dokter)' : '(Opsional)'}
            </label>
            <div className="border border-dashed border-neutral-300 rounded-xl p-3 flex items-center justify-between bg-neutral-50/50">
              <span className="text-xs text-neutral-600 truncate">
                {attachmentName || (formType === 'Sakit' ? 'surat_keterangan_dokter.jpg' : 'Belum ada file dipilih')}
              </span>
              <label className="px-3 py-1 rounded-lg border border-neutral-200 bg-white text-xs font-medium text-neutral-700 cursor-pointer hover:bg-neutral-50 shrink-0">
                Pilih File
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setAttachmentName(e.target.files[0].name);
                  }}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Detail Request */}
      {selectedDetail && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDetail(null)}
          title={`Detail Pengajuan: ${selectedDetail.type}`}
          description={`ID: ${selectedDetail.id} • Diajukan pada ${selectedDetail.submittedAt}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-between">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                  Status Pengajuan
                </span>
                <StatusBadge status={selectedDetail.status} size="md" className="mt-1" />
              </div>
              <div className="text-right">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                  Jumlah Durasi
                </span>
                <span className="text-sm font-bold text-neutral-900 font-mono">
                  {selectedDetail.days} Hari
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                  Tanggal Mulai
                </span>
                <span className="font-semibold text-neutral-900 font-mono">
                  {selectedDetail.startDate}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                  Tanggal Selesai
                </span>
                <span className="font-semibold text-neutral-900 font-mono">
                  {selectedDetail.endDate}
                </span>
              </div>
            </div>

            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold mb-1">
                Alasan / Keperluan
              </span>
              <p className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-neutral-800 leading-relaxed font-medium">
                {selectedDetail.reason}
              </p>
            </div>

            {selectedDetail.approvedAt && (
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-emerald-800 font-bold block">
                  Disetujui oleh: {selectedDetail.approverName || 'HR Manager'}
                </span>
                <span className="text-[11px] text-emerald-700">
                  Tanggal: {selectedDetail.approvedAt}
                </span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-semibold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
