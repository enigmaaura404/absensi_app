import React from 'react';
import { Sparkles, ShieldCheck, Share2, Sliders } from 'lucide-react';

export const WhyAttendanceSection: React.FC = () => {
  const pillars = [
    {
      title: 'Simple',
      subtitle: 'Workflow Karyawan yang Alami',
      desc: 'Proses absensi dan permohonan izin didesain tanpa friksi. Karyawan hanya memerlukan beberapa detik untuk melakukan presensi masuk dan pulang.',
      icon: Sparkles,
      highlight: 'Fokus pada kemudahan pengguna',
    },
    {
      title: 'Secure',
      subtitle: 'Verifikasi Bertingkat Terpercaya',
      desc: 'Penggabungan face recognition, analisis liveness, pembatasan geofence GPS, hardware binding, dan audit trail untuk menjaga integritas data kehadiran.',
      icon: ShieldCheck,
      highlight: 'Mitigasi risiko kecurangan',
    },
    {
      title: 'Connected',
      subtitle: 'Terhubung ke Ekosistem Anda',
      desc: 'Terintegrasi langsung dengan Google Drive untuk penyimpanan dokumen, Google Sheets untuk rekap laporan, dan Telegram Bot untuk notifikasi realtime.',
      icon: Share2,
      highlight: 'Sinergi tools produktivitas',
    },
    {
      title: 'Controlled',
      subtitle: 'Tata Kelola RBAC Terpusat',
      desc: 'Setiap peran memiliki wewenang yang terukur jelas. Seluruh pengelolaan konfigurasi sistem dan master data dikendalikan melalui Superadmin CMS.',
      icon: Sliders,
      highlight: 'Kepatuhan & audit operasional',
    },
  ];

  return (
    <section className="py-24 bg-neutral-50/70 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Nilai Keunggulan
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Mengapa ATTENDANCE?
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Keseimbangan antara kemudahan pengalaman harian karyawan dan kendali pengawasan perusahaan.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-neutral-900 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-neutral-900">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                      {item.subtitle}
                    </p>
                    <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 text-[11px] font-mono text-neutral-500">
                  {item.highlight}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
