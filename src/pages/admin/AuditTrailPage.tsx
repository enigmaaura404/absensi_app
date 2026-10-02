import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Clock,
  Laptop,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { AuditLogItem } from '../../types';

interface AuditTrailPageProps {
  logs: AuditLogItem[];
}

export const AuditTrailPage: React.FC<AuditTrailPageProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('Semua');
  const [resultFilter, setResultFilter] = useState('Semua');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.includes(searchQuery) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesModule = moduleFilter === 'Semua' || log.module === moduleFilter;
    const matchesResult = resultFilter === 'Semua' || log.result === resultFilter;

    return matchesSearch && matchesModule && matchesResult;
  });

  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,User,Action,Module,IP,Device,Result,Details']
        .concat(
          filteredLogs.map(
            (l) =>
              `"${l.timestamp}","${l.user}","${l.action}","${l.module}","${l.ip}","${l.device}","${l.result}","${l.details || ''}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_trail_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Audit Trail Forensik
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700">
              Read-Only
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Log aktivitas sistem yang immutable dan terenkripsi untuk kebutuhan audit kepatuhan ISO 27001.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 bg-white text-neutral-800 font-semibold text-xs shadow-2xs transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-3 sm:p-4 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari user / IP / action..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option value="Semua">Modul: Semua</option>
              <option value="Attendance">Modul: Attendance</option>
              <option value="Approval">Modul: Approval</option>
              <option value="Employees">Modul: Employees</option>
              <option value="Security">Modul: Security</option>
              <option value="System">Modul: System</option>
            </select>
          </div>

          <div>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option value="Semua">Hasil: Semua</option>
              <option value="SUCCESS">Hasil: SUCCESS</option>
              <option value="FAILED">Hasil: FAILED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table (Prompt Specified) */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 text-[11px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3 px-4 text-neutral-600 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-neutral-900">
                    {log.user}
                  </td>
                  <td className="py-3 px-4 font-semibold text-neutral-800">
                    <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-neutral-600">{log.module}</td>
                  <td className="py-3 px-4 text-neutral-500">{log.ip}</td>
                  <td className="py-3 px-4 font-sans text-neutral-600 truncate max-w-[150px]">
                    {log.device}
                  </td>
                  <td className="py-3 px-4">
                    {log.result === 'SUCCESS' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> SUCCESS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full text-[10px]">
                        <XCircle className="w-3 h-3" /> FAILED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-sans text-neutral-500 max-w-xs truncate">
                    {log.details || '-'}
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
