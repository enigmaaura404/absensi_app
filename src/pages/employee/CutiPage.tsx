import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Calendar,
  FileText,
  Upload,
  Plus,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { User, RequestItem, HolidayItem } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';

import { calculateWorkingDays } from '../../utils/leave';
import { getTodayDateString, formatDateIndonesian } from '../../utils/time';

interface CutiPageProps {
  user: User;
  requests: RequestItem[];
  holidays?: HolidayItem[];
  onAddRequest: (item: RequestItem) => void;
}

export const CutiPage: React.FC<CutiPageProps> = ({ user, requests, holidays = [], onAddRequest }) => {
  const [showForm, setShowForm] = useState(false);
  const [jenisCuti, setJenisCuti] = useState('Cuti Tahunan');
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getTodayDateString());
  const [reason, setReason] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Auto calculate working days skipping weekends and registered holidays (BR-LEAVE-005)
  const holidayDates = holidays.map((h) => h.date);
  const dayStats = calculateWorkingDays(startDate, endDate, holidayDates);
  const workingDaysCount = dayStats.workingDays > 0 ? dayStats.workingDays : 1;
  const cutiList = requests.filter((r) => r.type === 'Cuti');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (jenisCuti === 'Cuti Tahunan' && user.leaveBalance.remaining < workingDaysCount) {
      setFormError(`Sisa cuti tidak mencukupi! Anda memiliki ${user.leaveBalance.remaining} hari, namun pengajuan ini memerlukan ${workingDaysCount} hari kerja.`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newCuti: RequestItem = {
        id: `cuti-${Date.now()}`,
        employeeId: user.employeeId,
        employeeName: user.name,
        department: user.department,
        type: 'Cuti',
        subType: jenisCuti,
        startDate,
        endDate,
        days: workingDaysCount,
        reason,
        status: 'Pending',
        submittedAt: `${formatDateIndonesian()} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
        attachmentName: fileName || undefined,
      };

      onAddRequest(newCuti);
      setIsSubmitting(false);
      setShowForm(false);
      setReason('');
      setFileName('');
      setFormError(null);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Cuti Saya
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Informasi saldo cuti tahunan, pengajuan cuti baru, dan riwayat permohonan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Tutup Formulir' : '+ Ajukan Cuti'}</span>
        </button>
      </div>

      {/* Top KPI Metric Cards (Prompt Specified) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Sisa Cuti"
          value={`${user.leaveBalance.remaining} Hari`}
          subtext={`Dari total ${user.leaveBalance.total} hari per tahun`}
          icon={CalendarDays}
          variant="success"
        />

        <StatCard
          title="Digunakan"
          value={`${user.leaveBalance.used} Hari`}
          subtext="Telah disetujui & diambil tahun ini"
          icon={CheckCircle2}
          variant="info"
        />

        <StatCard
          title="Menunggu Approval"
          value={`${user.leaveBalance.pending} Hari`}
          subtext="Sedang dalam proses review atasan"
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Form Cuti Accordion / Card */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-md animate-in fade-in-50 duration-200">
          <div className="border-b border-neutral-100 pb-3 mb-5">
            <h3 className="text-base font-bold text-neutral-900">Formulir Pengajuan Cuti</h3>
            <p className="text-xs text-neutral-500">
              Pengajuan dianjurkan minimal 3 hari sebelum tanggal mulai pelaksanaan cuti.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Jenis Cuti
                </label>
                <select
                  value={jenisCuti}
                  onChange={(e) => setJenisCuti(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option>Cuti Tahunan</option>
                  <option>Cuti Khusus / Pernikahan (3 Hari)</option>
                  <option>Cuti Bersama Perusahaan</option>
                  <option>Cuti Melahirkan / Melahirkan Istri</option>
                  <option>Cuti Duka Cita</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Jumlah Hari Otomatis
                </label>
                <div className="px-3 py-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-900 font-mono">
                  {workingDaysCount} Hari Kerja
                </div>
                {(dayStats.weekendDays > 0 || dayStats.holidayDays > 0) && (
                  <p className="text-[10px] text-neutral-500 mt-1">
                    {dayStats.totalCalendarDays} hari kalender
                    {dayStats.weekendDays > 0 && ` • ${dayStats.weekendDays} akhir pekan`}
                    {dayStats.holidayDays > 0 && ` • ${dayStats.holidayDays} libur nasional`}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
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
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Alasan Cuti
              </label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tuliskan keterangan dan alasan cuti..."
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Lampiran Pendukung (Opsional)
              </label>
              <div className="border border-dashed border-neutral-300 rounded-xl p-3 flex items-center justify-between bg-neutral-50/50">
                <span className="text-xs text-neutral-600 truncate">
                  {fileName || 'Pilih dokumen jika diperlukan (surat nikah, tiket, dll)'}
                </span>
                <label className="px-3 py-1 rounded-lg border border-neutral-200 bg-white text-xs font-medium text-neutral-700 cursor-pointer hover:bg-neutral-50 shrink-0">
                  Upload Dokumen
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setFileName(e.target.files[0].name);
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2"
              >
                {isSubmitting ? 'Mengirim...' : 'Submit Permohonan Cuti'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cuti Requests Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900">Riwayat Pengajuan Cuti</h3>
          <span className="text-xs text-neutral-500">Tahun 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 text-[11px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
              <tr>
                <th className="py-3 px-4">Jenis Cuti</th>
                <th className="py-3 px-4">Rentang Tanggal</th>
                <th className="py-3 px-4">Durasi</th>
                <th className="py-3 px-4">Alasan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tanggal Diajukan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {cutiList.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-neutral-900">
                    {item.subType || item.type}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-neutral-800">
                    {item.startDate} s/d {item.endDate}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-neutral-900">
                    {item.days} Hari
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 max-w-xs truncate">
                    {item.reason}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400 text-[11px]">
                    {item.submittedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
