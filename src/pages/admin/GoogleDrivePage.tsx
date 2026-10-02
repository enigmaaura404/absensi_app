import React, { useState } from 'react';
import {
  HardDrive,
  Check,
  ExternalLink,
  Folder,
  FileText,
  Image,
  ShieldCheck,
  DownloadCloud,
  CheckCircle2,
} from 'lucide-react';

export const GoogleDrivePage: React.FC = () => {
  const [backupTriggered, setBackupTriggered] = useState(false);

  const handleBackupNow = () => {
    setBackupTriggered(true);
    setTimeout(() => setBackupTriggered(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          Google Drive Storage
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Penyimpanan cloud terenkripsi untuk arsip foto selfie biometrik, surat dokter, dan laporan presensi.
        </p>
      </div>

      {backupTriggered && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Backup incremental ke Google Drive berhasil disinkronkan!</span>
        </div>
      )}

      {/* Main Connection Status Card (Prompt Specified Layout) */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
              <HardDrive className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-neutral-900">Google Drive Cloud Storage</h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Connected
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Root Directory: /PT-Attendance-Enterprise-Storage/
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleBackupNow}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Trigger Backup
            </button>
            <button
              type="button"
              onClick={() => window.open('https://drive.google.com', '_blank')}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Open Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Storage Breakdown Cards (Prompt Specified) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-100">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">
                Selfie Biometrics
              </span>
              <span className="text-xl font-bold text-neutral-900 mt-0.5 block">1.2 GB</span>
              <span className="text-[11px] text-neutral-500">12,480 foto terenkripsi</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">
                Medical & Task Docs
              </span>
              <span className="text-xl font-bold text-neutral-900 mt-0.5 block">340 MB</span>
              <span className="text-[11px] text-neutral-500">Surat dokter & dinas</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">
                Audit Reports
              </span>
              <span className="text-xl font-bold text-neutral-900 mt-0.5 block">890 MB</span>
              <span className="text-[11px] text-neutral-500">Rekap PDF & CSV berkala</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Directory Structure */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-900">Struktur Direktori Google Drive</h3>

        <div className="divide-y divide-neutral-100 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Folder className="w-4 h-4 text-amber-500" />
              <span className="font-mono font-medium text-neutral-800">/Attendance/Selfie-2026-10/</span>
            </div>
            <span className="text-neutral-400 font-mono">1.2 GB</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Folder className="w-4 h-4 text-amber-500" />
              <span className="font-mono font-medium text-neutral-800">/Leave-Docs/Surat-Dokter-2026/</span>
            </div>
            <span className="text-neutral-400 font-mono">340 MB</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Folder className="w-4 h-4 text-amber-500" />
              <span className="font-mono font-medium text-neutral-800">/Audit-Exports/Monthly-Recap/</span>
            </div>
            <span className="text-neutral-400 font-mono">890 MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
