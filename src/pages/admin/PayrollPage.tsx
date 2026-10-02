import React, { useState } from 'react';
import {
  DollarSign,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Table as TableIcon,
} from 'lucide-react';
import { PayrollPrepItem } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

interface PayrollPageProps {
  payrollData: PayrollPrepItem[];
}

export const PayrollPage: React.FC<PayrollPageProps> = ({ payrollData }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'preparation'>('preparation');

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Payroll Preparation & Salary Cutoff
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700">
              Periode 01 - 31 Okt 2026
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Rekapitulasi kalkulasi jam kerja aktual, akumulasi lembur, potongan telat, dan tunjangan kehadiran.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex p-1 rounded-xl bg-neutral-100 border border-neutral-200">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'overview'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Coming Soon Info
          </button>
          <button
            onClick={() => setActiveSubTab('preparation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'preparation'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Data Rekap Cutoff (Aktif)
          </button>
        </div>
      </div>

      {/* Prominent Coming Soon Enterprise Banner (Prompt Specified) */}
      {activeSubTab === 'overview' ? (
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-md">
            <DollarSign className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
            Coming Soon
          </span>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Payroll Automated Engine
          </h3>
          <p className="mt-2 text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
            Payroll integration is being prepared. Integrasi langsung dengan transfer bank payroll (BCA / Mandiri / BRI) dan slip gaji digital sedang dalam tahap finalisasi keamanan.
          </p>

          <div className="mt-8 p-6 rounded-2xl bg-neutral-50 border border-neutral-100 text-left max-w-lg mx-auto">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
              Current Data Ready & Available:
            </h4>
            <div className="grid grid-cols-2 gap-2.5 text-xs text-neutral-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Attendance Log</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Working Hours (Jam Kerja)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Late Deductions (Keterlambatan)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Overtime Hours (Lembur)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Leave Balance (Cuti)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Absence Penalty (Alpha)</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveSubTab('preparation')}
            className="mt-8 px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs inline-flex items-center gap-2"
          >
            <span>View Preparation Data</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Payroll Preparation Table (Prompt Specified) */
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs space-y-4">
          <div className="p-4 sm:p-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Data Rekapitulasi Komponen Penggajian
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Hitungan hari kerja efektif: 22 Hari (Cutoff tanggal 25 setiap bulan)
              </p>
            </div>

            <button
              type="button"
              onClick={() => alert('Data slip persiapan payroll berhasil diekspor ke format Excel (.xlsx)!')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Rekap Payroll (Excel)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 text-[11px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Working Days</th>
                  <th className="py-3 px-4">Present</th>
                  <th className="py-3 px-4">Late</th>
                  <th className="py-3 px-4">Overtime</th>
                  <th className="py-3 px-4">Leave</th>
                  <th className="py-3 px-4">Absence</th>
                  <th className="py-3 px-4">Tunjangan Kehadiran</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono text-xs">
                {payrollData.map((item) => (
                  <tr key={item.employeeId} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-sans">
                      <p className="font-bold text-neutral-900">{item.employeeName}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">
                        {item.employeeId} • {item.department}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-neutral-700">
                      {item.workingDays} Hari
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      {item.presentDays} Hari
                    </td>
                    <td className="py-3.5 px-4 text-amber-700 font-bold">
                      {item.lateCount}x
                    </td>
                    <td className="py-3.5 px-4 text-blue-700 font-semibold">
                      +{item.overtimeHours} Jam
                    </td>
                    <td className="py-3.5 px-4 text-purple-700">
                      {item.leaveDays} Hari
                    </td>
                    <td className="py-3.5 px-4 text-rose-600 font-bold">
                      {item.absentDays} Hari
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900">
                      {item.calculatedAllowance}
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
