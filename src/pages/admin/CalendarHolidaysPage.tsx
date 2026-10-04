import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  CalendarDays,
  CheckCircle2,
  Tag,
  Info,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { HolidayItem, UserRole } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

interface CalendarHolidaysPageProps {
  holidays: HolidayItem[];
  onAddHoliday: (item: HolidayItem) => void;
  onDeleteHoliday: (id: string) => void;
  userRole?: UserRole;
  isSuperadmin?: boolean;
}

export const CalendarHolidaysPage: React.FC<CalendarHolidaysPageProps> = ({
  holidays,
  onAddHoliday,
  onDeleteHoliday,
  userRole,
  isSuperadmin,
}) => {
  const canManage = isSuperadmin || userRole === 'Superadmin' || userRole === 'Admin' || userRole === 'HR';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('2026-10-24');
  const [type, setType] = useState<'Nasional' | 'Perusahaan' | 'Cuti Bersama'>('Perusahaan');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) {
      alert('Akses Ditolak: Hanya Superadmin, Admin, atau HR yang berhak menambahkan hari libur.');
      return;
    }

    const newHol: HolidayItem = {
      id: `hol-${Date.now()}`,
      name,
      date,
      type,
      description,
    };
    onAddHoliday(newHol);
    setIsModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Kalender Kerja & Hari Libur
            </h2>
            {canManage ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Akses Kelola Aktif
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-600 flex items-center gap-1">
                <Lock className="w-3 h-3 text-neutral-400" /> Mode Read-Only
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Konfigurasi hari libur nasional, cuti bersama SKB 3 Menteri, dan agenda libur internal perusahaan.
          </p>
        </div>

        {canManage ? (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Holiday</span>
          </button>
        ) : (
          <div
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-100 text-neutral-500 font-semibold text-xs border border-neutral-200 cursor-not-allowed select-none"
            title="Hanya Superadmin, Admin, atau HR yang berhak menambahkan hari libur"
          >
            <Lock className="w-3.5 h-3.5 text-neutral-400" />
            <span>+ Add Holiday (Restricted)</span>
          </div>
        )}
      </div>

      {/* Holiday Types Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase">Libur Nasional</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>
          <p className="text-xl font-bold text-neutral-900 mt-2">
            {holidays.filter((h) => h.type === 'Nasional').length} Hari
          </p>
          <p className="text-[11px] text-neutral-400 mt-0.5">Ditetapkan oleh Pemerintah RI</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase">Cuti Bersama</span>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          </div>
          <p className="text-xl font-bold text-neutral-900 mt-2">
            {holidays.filter((h) => h.type === 'Cuti Bersama').length} Hari
          </p>
          <p className="text-[11px] text-neutral-400 mt-0.5">Memotong saldo cuti tahunan</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase">Company Holiday</span>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          </div>
          <p className="text-xl font-bold text-neutral-900 mt-2">
            {holidays.filter((h) => h.type === 'Perusahaan').length} Hari
          </p>
          <p className="text-[11px] text-neutral-400 mt-0.5">Ulang tahun PT & Family Gathering</p>
        </div>
      </div>

      {/* Holidays List Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900">Jadwal Hari Libur Terdaftar</h3>
          <span className="text-xs text-neutral-500">Tahun 2026 - 2027</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 text-[11px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
              <tr>
                <th className="py-3 px-4">Nama Hari Libur</th>
                <th className="py-3 px-4">Tanggal Pelaksanaan</th>
                <th className="py-3 px-4">Kategori Libur</th>
                <th className="py-3 px-4">Deskripsi / Keterangan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {holidays.map((h) => (
                <tr key={h.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-neutral-900">{h.name}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-neutral-800">
                    {h.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={h.type} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 max-w-sm">
                    {h.description}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {canManage ? (
                      <button
                        type="button"
                        onClick={() => onDeleteHoliday(h.id)}
                        className="p-1.5 rounded-lg border border-neutral-200 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Libur"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-neutral-400 font-mono text-[11px] select-none">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Holiday (Prompt Specified Form) */}
      {isModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          title="Tambah Hari Libur Baru"
          description="Masukkan nama, tanggal, jenis hari libur, dan deskripsi."
          maxWidth="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Name (Nama Hari Libur)
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Hari Pahlawan Nasional"
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Date (Tanggal)
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Type (Jenis Libur)
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="Nasional">National Holiday</option>
                  <option value="Perusahaan">Company Holiday</option>
                  <option value="Cuti Bersama">Cuti Bersama</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Description (Deskripsi)
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Keterangan hari libur..."
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs"
              >
                Save Holiday
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
