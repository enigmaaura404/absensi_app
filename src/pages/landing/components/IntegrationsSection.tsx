import React from 'react';
import {
  HardDrive,
  FileSpreadsheet,
  Calendar,
  Send,
  Mail,
  MessageCircle,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';

export const IntegrationsSection: React.FC = () => {
  const activeIntegrations = [
    {
      name: 'Google Drive',
      badge: 'Active Native Sync',
      desc: 'Arsip otomatis seluruh foto selfie verifikasi kehadiran, lampiran surat sakit, dan ekspor laporan ke cloud storage perusahaan.',
      uses: ['Selfie Biometrik', 'Dokumen Surat Dokter', 'Laporan Bulanan'],
      icon: HardDrive,
    },
    {
      name: 'Google Sheets',
      badge: 'Active Two-Way Sync',
      desc: 'Ekspor dan sinkronisasi realtime seluruh logbook kehadiran ke spreadsheet cloud yang dapat diakses tim Finance & Management.',
      uses: ['Live Reporting Rekap', 'Analisis Spreadsheet', 'Ekspor CSV/XLSX'],
      icon: FileSpreadsheet,
    },
    {
      name: 'Google Calendar',
      badge: 'Active Calendar Sync',
      desc: 'Integrasi otomatis kalender kerja, jadwal cuti bersama, dan sinkronisasi hari libur nasional resmi pemerintah.',
      uses: ['Jadwal Cuti Bersama', 'Hari Libur Nasional', 'Agenda Regu Kerja'],
      icon: Calendar,
    },
    {
      name: 'Telegram Bot',
      badge: 'Active Bot Alert',
      desc: 'Bot realtime untuk notifikasi check-in sukses kepada karyawan, alert antrean approval ke manajer, dan verifikasi 2FA superadmin.',
      uses: ['Notifikasi Presensi', 'Approval Alerts', 'Superadmin 2FA OTP'],
      icon: Send,
    },
  ];

  const upcomingIntegrations = [
    {
      name: 'Email SMTP / Resend',
      tag: 'COMING SOON',
      desc: 'Notifikasi slip kehadiran dan rekap bulanan ke inbox email perusahaan.',
      icon: Mail,
    },
    {
      name: 'WhatsApp Business API',
      tag: 'COMING SOON',
      desc: 'Pengingat check-in pagi hari dan alert approval melalui pesan WhatsApp.',
      icon: MessageCircle,
    },
    {
      name: 'Direct Payroll Engine',
      tag: 'COMING SOON',
      desc: 'Koneksi API langsung dengan software payroll untuk perhitungan gaji otomatis.',
      icon: DollarSign,
    },
  ];

  return (
    <section className="py-24 bg-white border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Ekosistem Terintegrasi
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Terhubung dengan tools yang sudah Anda gunakan.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Hindari pembuatan sistem tertutup. ATTENDANCE terhubung mulus dengan aplikasi kerja cloud favorit tim Anda.
          </p>
        </div>

        {/* Active Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {activeIntegrations.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-neutral-900 transition-all flex flex-col justify-between text-left space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-neutral-900">
                      {item.name}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Kegunaan:
                  </p>
                  <ul className="space-y-0.5 text-xs text-neutral-700">
                    {item.uses.map((u) => (
                      <li key={u} className="flex items-center gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{u}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Future Integrations Roadmap Strip */}
        <div className="pt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 text-center mb-6">
            Peta Jalan Integrasi Mendatang (Roadmap)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {upcomingIntegrations.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="p-4 rounded-2xl bg-neutral-50 border border-dashed border-neutral-300 text-left space-y-2 opacity-85"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4 text-neutral-500" />
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800">{item.name}</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
