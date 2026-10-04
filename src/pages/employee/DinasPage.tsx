import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  Upload,
  CheckCircle2,
  FileText,
  AlertCircle,
  Plus,
  Search,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RequestItem, User } from '../../types';
import { getTodayDateString, formatDateIndonesian } from '../../utils/time';

interface DinasPageProps {
  onAddRequest: (item: RequestItem) => void;
  requests: RequestItem[];
  user?: User;
}

export const DinasPage: React.FC<DinasPageProps> = ({ onAddRequest, requests, user }) => {
  const [showForm, setShowForm] = useState(false);
  const [jenis, setJenis] = useState('Dinas Luar Kantor');
  const [tanggal, setTanggal] = useState(getTodayDateString());
  const [tanggalSelesai, setTanggalSelesai] = useState(getTodayDateString());
  const [jamMulai, setJamMulai] = useState('09:00');
  const [jamSelesai, setJamSelesai] = useState('17:00');
  const [tujuan, setTujuan] = useState('Customer Office PT Finansial Global');
  const [lokasi, setLokasi] = useState('Sudirman Central Business District, Jakarta');
  const [keperluan, setKeperluan] = useState('Meeting integrasi payment gateway dan audit API');
  const [keterangan, setKeterangan] = useState('Dibutuhkan akomodasi dan surat tugas resmi dari HRD');
  const [fileName, setFileName] = useState<string>('surat_undangan_klien.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dinasRequests = requests.filter((r) => r.type === 'Dinas');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newDinas: RequestItem = {
        id: `dinas-${Date.now()}`,
        employeeId: user?.employeeId || 'EMP-00124',
        employeeName: user?.name || 'Budi Santoso',
        department: user?.department || 'Technology',
        type: 'Dinas',
        subType: jenis,
        startDate: tanggal,
        endDate: tanggalSelesai || tanggal,
        days: 1,
        timeStart: jamMulai,
        timeEnd: jamSelesai,
        destination: tujuan,
        reason: keperluan,
        notes: keterangan,
        status: 'Pending',
        submittedAt: `${formatDateIndonesian()} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
        attachmentName: fileName,
      };

      onAddRequest(newDinas);
      setIsSubmitting(false);
      setShowForm(false);
    }, 400);
  };

  const filteredDinas = dinasRequests.filter(
    (d) =>
      d.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Dinas & Tugas Keluar
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Pengajuan dan pencatatan perjalanan dinas, tugas meeting klien, atau kunjungan luar kantor.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Tutup Formulir' : '+ Ajukan Dinas Keluar'}</span>
        </button>
      </div>

      {/* Interactive Form Drawer/Card */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-md animate-in fade-in-50 duration-200">
          <div className="border-b border-neutral-100 pb-4 mb-6">
            <h3 className="text-base font-bold text-neutral-900">
              Formulir Tugas & Perjalanan Dinas
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Isi parameter tugas keluar dengan jelas untuk verifikasi approval atasan & HR.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Jenis Penugasan
                </label>
                <select
                  value={jenis}
                  onChange={(e) => setJenis(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option>Dinas Luar Kantor (Dalam Kota)</option>
                  <option>Dinas Luar Kota</option>
                  <option>Meeting Klien / Partner</option>
                  <option>Training / Workshop Eksternal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Tanggal Pelaksanaan
                </label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Jam Mulai
                </label>
                <input
                  type="time"
                  required
                  value={jamMulai}
                  onChange={(e) => setJamMulai(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Jam Selesai
                </label>
                <input
                  type="time"
                  required
                  value={jamSelesai}
                  onChange={(e) => setJamSelesai(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Tujuan / Tempat
                </label>
                <input
                  type="text"
                  required
                  value={tujuan}
                  onChange={(e) => setTujuan(e.target.value)}
                  placeholder="Contoh: Customer Office / Gedung Bursa Efek"
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Kota / Lokasi
                </label>
                <input
                  type="text"
                  required
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  placeholder="Contoh: Bandung / Jakarta Selatan"
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Keperluan Tugas
              </label>
              <input
                type="text"
                required
                value={keperluan}
                onChange={(e) => setKeperluan(e.target.value)}
                placeholder="Contoh: Meeting dengan client / instalasi server klien"
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Keterangan Tambahan
              </label>
              <textarea
                rows={3}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Catatan transport, akomodasi, atau rincian agenda..."
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Lampiran / Dokumen Pendukung (Surat Tugas / Undangan Klien)
              </label>
              <div className="border border-dashed border-neutral-300 rounded-xl p-4 flex items-center justify-between bg-neutral-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-200 text-neutral-600 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-800">{fileName}</p>
                    <p className="text-[11px] text-neutral-500">PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                </div>
                <label className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-medium text-neutral-700 cursor-pointer hover:bg-neutral-50">
                  Ganti File
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

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
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
                {isSubmitting ? 'Mengirim...' : 'Ajukan Penugasan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History & Status Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-neutral-900">Daftar Pengajuan Dinas</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
              {filteredDinas.length} Catatan
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tujuan / keperluan..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 text-[11px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
              <tr>
                <th className="py-3 px-4">Tujuan & Keperluan</th>
                <th className="py-3 px-4">Tanggal & Jam</th>
                <th className="py-3 px-4">Lampiran</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Diajukan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredDinas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400">
                    Belum ada pengajuan dinas luar. Klik tombol "+ Ajukan Dinas Keluar" di atas.
                  </td>
                </tr>
              ) : (
                filteredDinas.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-neutral-900">{item.destination || item.subType}</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{item.reason}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <p className="font-semibold text-neutral-800">{item.startDate}</p>
                      <p className="text-[11px] text-neutral-400 font-sans">
                        {item.timeStart} - {item.timeEnd}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.attachmentName ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-600 font-medium">
                          <FileText className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="truncate max-w-[120px]">{item.attachmentName}</span>
                        </span>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 text-[11px]">
                      {item.submittedAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
