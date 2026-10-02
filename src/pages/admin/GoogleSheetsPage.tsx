import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Table,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const GoogleSheetsPage: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('02 Oct 2026 18:40 WIB');
  const [syncHistory, setSyncHistory] = useState([
    { id: 'sh-1', time: '02 Oct 2026 18:40', rows: 124, status: 'Success', trigger: 'Auto-Scheduled' },
    { id: 'sh-2', time: '02 Oct 2026 12:00', rows: 124, status: 'Success', trigger: 'Manual Sync' },
    { id: 'sh-3', time: '01 Oct 2026 18:40', rows: 122, status: 'Success', trigger: 'Auto-Scheduled' },
  ]);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const nowStr = new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

      setLastSyncTime(nowStr);
      setSyncHistory((prev) => [
        {
          id: `sh-${Date.now()}`,
          time: nowStr.replace(' WIB', ''),
          rows: 124,
          status: 'Success',
          trigger: 'Manual Sync (Admin)',
        },
        ...prev,
      ]);
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          Google Sheets Integration
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Sinkronisasi otomatis seluruh data presensi, keterlambatan, dan lembur langsung ke Google Spreadsheet perusahaan.
        </p>
      </div>

      {/* Main Connection Status Card (Prompt Specified Layout) */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-neutral-900">
                  Google Sheets Sync Active
                </h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Connected
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Akun terhubung: hr-ops-service@company.iam.gserviceaccount.com
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSyncing}
            onClick={handleSyncNow}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sync Now'}</span>
          </button>
        </div>

        {/* Spreadsheet Mapping Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-100 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block">
              Spreadsheet Target
            </span>
            <span className="font-bold text-neutral-900 text-sm mt-0.5 block truncate">
              Attendance Report 2026
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block">
              Sheet Aktif
            </span>
            <span className="font-bold text-neutral-900 text-sm mt-0.5 block">
              October 2026
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block">
              Last Sync
            </span>
            <span className="font-mono font-semibold text-neutral-800 text-xs mt-1 block">
              {lastSyncTime}
            </span>
          </div>
        </div>
      </div>

      {/* Sync Log History Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900">Riwayat Sinkronisasi Spreadsheet</h3>
          <span className="text-xs text-neutral-400 font-mono">100% Data Integrity</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 text-[11px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
              <tr>
                <th className="py-3 px-4">Waktu Eksekusi</th>
                <th className="py-3 px-4">Jumlah Baris</th>
                <th className="py-3 px-4">Pemicu (Trigger)</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {syncHistory.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-neutral-800">
                    {item.time}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-neutral-900">
                    {item.rows} Karyawan Terupdate
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600">{item.trigger}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" /> {item.status}
                    </span>
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
