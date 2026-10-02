import React from 'react';
import {
  Smartphone,
  Globe,
  ScanFace,
  MapPin,
  CheckCircle2,
  Compass,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const MobileSection: React.FC = () => {
  const steps = [
    { label: 'Dashboard', icon: Compass },
    { label: 'Kehadiran', icon: Smartphone },
    { label: 'Selfie', icon: ScanFace },
    { label: 'Face Verification', icon: ShieldCheck },
    { label: 'GPS Geofence', icon: MapPin },
    { label: 'Check-In Sukses', icon: CheckCircle2 },
  ];

  return (
    <section className="py-24 bg-white border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Aksesibilitas Seluler & PWA
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Dibuat untuk digunakan dari mana saja.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Karyawan dapat melakukan absensi melalui smartphone tanpa ketergantungan pada hardware khusus atau pengunduhan file aplikasi berukuran ratusan megabyte.
          </p>
        </div>

        {/* Visual Workflow Cards Bar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50/80 border border-neutral-200/80 max-w-5xl mx-auto space-y-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200/60 pb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Alur Mobile Mandiri Karyawan
              </h3>
              <p className="text-xs text-neutral-500">
                PWA-friendly, kompatibel di Chrome Android & Safari iOS
              </p>
            </div>
            <span className="text-[11px] font-semibold text-neutral-700 bg-white border border-neutral-200 px-2.5 py-1 rounded-full w-fit">
              Progressive Web App Ready
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.label}
                  className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 flex flex-col items-center justify-center text-center space-y-2 relative group hover:border-neutral-900 transition-colors shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-emerald-400 text-neutral-800 flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 block">
                      Langkah 0{i + 1}
                    </span>
                    <span className="text-xs font-bold text-neutral-900 block mt-0.5">
                      {st.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-2">
            <span className="flex items-center gap-1.5 text-neutral-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Sensor kamera dan geolocation API terintegrasi standar HTML5 W3C
            </span>
            <span>Tidak perlu update manual berkala</span>
          </div>
        </div>
      </div>
    </section>
  );
};
