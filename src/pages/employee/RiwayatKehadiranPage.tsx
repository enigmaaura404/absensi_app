import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Table as TableIcon,
  Search,
  Filter,
  Eye,
  MapPin,
  Clock,
  Smartphone,
  ShieldCheck,
  Download,
  Trash2,
  CheckSquare,
  Square,
  MinusSquare,
  X,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';

interface RiwayatKehadiranPageProps {
  history: AttendanceRecord[];
  isAdmin?: boolean;
  onBulkDelete?: (ids: string[]) => void;
}

export const RiwayatKehadiranPage: React.FC<RiwayatKehadiranPageProps> = ({
  history,
  isAdmin = false,
  onBulkDelete,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  // Bulk Selection States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  const filteredHistory = history.filter((item) => {
    const matchesStatus = statusFilter === 'Semua' || item.status === statusFilter;
    const matchesSearch =
      item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const isAllSelected =
    filteredHistory.length > 0 &&
    filteredHistory.every((item) => selectedIds.includes(item.id));
  const isPartiallySelected =
    filteredHistory.some((item) => selectedIds.includes(item.id)) && !isAllSelected;

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = isPartiallySelected;
    }
  }, [isPartiallySelected]);

  // Toggle select all in current filtered view
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      // Unselect all current filtered items
      const filteredIds = new Set(filteredHistory.map((item) => item.id));
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      // Select all current filtered items
      const newIds = new Set([...selectedIds, ...filteredHistory.map((item) => item.id)]);
      setSelectedIds(Array.from(newIds));
    }
  };

  // Toggle individual row
  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Export selection action (with console.log mock)
  const handleExportSelection = () => {
    const recordsToExport = history.filter((rec) => selectedIds.includes(rec.id));
    console.log('Export Selection (Mock):', {
      selectedCount: selectedIds.length,
      selectedIds,
      records: recordsToExport,
    });

    const headers = 'ID,Employee ID,Nama Karyawan,Departemen,Tanggal,Check In,Check Out,Status,Durasi,Lokasi,Device,IP\n';
    const rows = recordsToExport
      .map(
        (r) =>
          `"${r.id}","${r.employeeId || ''}","${r.employeeName}","${r.department || ''}","${r.date}","${r.checkInTime || '-'}","${r.checkOutTime || '-'}","${r.status}","${r.duration || '-'}","${r.location}","${r.device || ''}","${r.ip || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Presensi_Selected_${selectedIds.length}_Record_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage(`Berhasil mengekspor ${recordsToExport.length} data presensi.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Bulk Delete action - triggers confirmation modal
  const handleConfirmBulkDelete = () => {
    if (onBulkDelete) {
      onBulkDelete(selectedIds);
    }
    const count = selectedIds.length;
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
    setToastMessage(`${count} catatan presensi berhasil dihapus dari sistem.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Riwayat Kehadiran
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Log presensi terverifikasi dengan timestamp GPS, durasi kerja, dan foto biometrik.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-neutral-100 border border-neutral-200">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Tabel View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'calendar'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Kalender View</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Toolbar Bar (Appears when selectedIds.length > 0) */}
      {selectedIds.length > 0 && (
        <div className="bg-neutral-900 text-white rounded-2xl p-3 sm:p-4 shadow-xl border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-bold text-xs text-emerald-400">
              {selectedIds.length}
            </span>
            <div>
              <p className="text-xs font-bold text-white">
                {selectedIds.length} Catatan Absensi Terpilih
              </p>
              <p className="text-[11px] text-neutral-400">
                Pilih aksi massal untuk diekspor atau dikelola oleh admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleExportSelection}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 text-xs font-semibold transition-all active:scale-95 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-neutral-900" />
              <span>Export Selection</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all active:scale-95 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bulk Delete</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Batal Pilihan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
            Status:
          </span>
          {['Semua', 'Hadir', 'Terlambat', 'Dinas', 'Cuti', 'Sakit', 'Izin'].map((s) => (
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
            placeholder="Cari nama / tanggal / lokasi..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 text-[11px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
                <tr>
                  {/* Select All Checkbox Column */}
                  <th className="py-3 px-4 w-12 text-center">
                    <input
                      ref={selectAllCheckboxRef}
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900 align-middle"
                      title={isAllSelected ? 'Batalkan Semua Pilihan' : 'Pilih Semua'}
                    />
                  </th>
                  <th className="py-3 px-4">Karyawan</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Check-In</th>
                  <th className="py-3 px-4">Check-Out</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Durasi</th>
                  <th className="py-3 px-4">Lokasi</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-neutral-400">
                      Tidak ada catatan riwayat kehadiran yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item) => {
                    const isSelected = selectedIds.includes(item.id);

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedRecord(item)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-100/80 hover:bg-neutral-100 font-medium'
                            : 'hover:bg-neutral-50/70'
                        }`}
                      >
                        {/* Checkbox Cell */}
                        <td
                          className="py-3.5 px-4 w-12 text-center"
                          onClick={(e) => handleToggleRow(item.id, e)}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900 align-middle"
                          />
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-bold text-neutral-900">{item.employeeName}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">
                            {item.employeeId || 'EMP'} • {item.department || 'General'}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-semibold text-neutral-800">
                          {item.date}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-neutral-800">
                          {item.checkInTime || '-'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-neutral-800">
                          {item.checkOutTime || '-'}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={item.status} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 font-mono text-neutral-600">
                          {item.duration || '-'}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-600 truncate max-w-xs">
                          {item.location}
                        </td>
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedRecord(item)}
                            className="px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Calendar View Matrix */
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-neutral-900">Oktober 2026</h3>
            <span className="text-xs text-neutral-500">22 Hari Kerja Aktif</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
              <div key={day} className="py-2 text-[11px] font-bold text-neutral-400 uppercase">
                {day}
              </div>
            ))}

            {/* Empty slots for month start */}
            <div className="aspect-square p-2 border border-dashed border-neutral-100 rounded-xl text-neutral-300">
              28
            </div>
            <div className="aspect-square p-2 border border-dashed border-neutral-100 rounded-xl text-neutral-300">
              29
            </div>
            <div className="aspect-square p-2 border border-dashed border-neutral-100 rounded-xl text-neutral-300">
              30
            </div>

            {/* October days */}
            <div className="aspect-square p-2 border border-neutral-200 rounded-xl flex flex-col justify-between text-left hover:bg-neutral-50 cursor-pointer">
              <span className="font-bold text-neutral-900 text-xs">1</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded truncate">
                08:00
              </span>
            </div>

            <div className="aspect-square p-2 border-2 border-neutral-900 bg-neutral-50 rounded-xl flex flex-col justify-between text-left shadow-2xs cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 text-xs">2</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] bg-emerald-600 text-white font-bold px-1 rounded truncate">
                Hari Ini
              </span>
            </div>

            <div className="aspect-square p-2 bg-neutral-100/60 rounded-xl text-neutral-400 text-left">
              <span className="font-semibold text-xs">3</span>
              <span className="text-[9px] block text-neutral-400 mt-1">Sabtu</span>
            </div>

            <div className="aspect-square p-2 bg-neutral-100/60 rounded-xl text-neutral-400 text-left">
              <span className="font-semibold text-xs">4</span>
              <span className="text-[9px] block text-neutral-400 mt-1">Minggu</span>
            </div>

            {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map(
              (d) => (
                <div
                  key={d}
                  className={`aspect-square p-2 border border-neutral-200 rounded-xl flex flex-col justify-between text-left ${
                    d % 7 === 3 || d % 7 === 4 ? 'bg-neutral-50 text-neutral-400' : 'hover:bg-neutral-50'
                  }`}
                >
                  <span className="font-bold text-neutral-800 text-xs">{d}</span>
                  {d === 8 || d === 9 ? (
                    <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-1 rounded truncate">
                      Cuti Plan
                    </span>
                  ) : d === 24 ? (
                    <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1 rounded truncate">
                      HUT PT
                    </span>
                  ) : (
                    <span className="text-[9px] text-neutral-300">-</span>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setIsBulkDeleteModalOpen(false)}
          onConfirm={handleConfirmBulkDelete}
          title={`Hapus ${selectedIds.length} Catatan Presensi?`}
          description={`Anda akan menghapus ${selectedIds.length} rekaman absensi terpilih secara permanen. Tindakan ini memerlukan hak akses administratif dan akan tercatat di Audit Trail.`}
          confirmText="Hapus Terpilih"
          cancelText="Batal"
          variant="danger"
        />
      )}

      {/* Detail Record Modal */}
      {selectedRecord && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRecord(null)}
          title="Detail Verifikasi Absensi"
          description={`Log ID: ${selectedRecord.id} • Tanggal ${selectedRecord.date}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            {/* Selfie Preview if available */}
            {selectedRecord.selfieUrl && (
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                <img
                  src={selectedRecord.selfieUrl}
                  alt="Biometric Capture"
                  className="w-16 h-16 rounded-xl object-cover border border-neutral-200"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Biometrik Terverifikasi</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Kecocokan wajah: 99.1% • Anti-spoof Passed
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-mono text-neutral-400">
                    IP: {selectedRecord.ip}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                  Jam Check-In
                </span>
                <span className="text-sm font-bold text-neutral-900 font-mono">
                  {selectedRecord.checkInTime || '-'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                  Jam Check-Out
                </span>
                <span className="text-sm font-bold text-neutral-900 font-mono">
                  {selectedRecord.checkOutTime || '-'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900 block">{selectedRecord.location}</span>
                  {selectedRecord.coordinates && (
                    <span className="text-[10px] text-neutral-400 font-mono">
                      Koordinat: {selectedRecord.coordinates}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-neutral-200/60">
                <Smartphone className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-800 font-medium block">
                    Perangkat: {selectedRecord.device}
                  </span>
                </div>
              </div>
            </div>

            {selectedRecord.notes && (
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-amber-900">
                <strong className="block text-[11px] font-bold">Catatan Verifikasi:</strong>
                <p className="mt-0.5 text-xs">{selectedRecord.notes}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
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
