import React, { useState } from 'react';
import {
  LogIn,
  Camera,
  ScanFace,
  Sparkles,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: 1,
      title: 'Login Akun',
      shortTitle: 'Login',
      desc: 'Karyawan masuk melalui smartphone atau browser dengan akun terdaftar dan validasi perangkat.',
      icon: LogIn,
      details: 'Otentikasi cepat dengan Single Device Binding untuk keamanan akun.',
    },
    {
      step: 2,
      title: 'Ambil Selfie',
      shortTitle: 'Selfie',
      desc: 'Kamera depan aktif otomatis dalam frame biometrik tanpa perlu unggah foto galeri.',
      icon: Camera,
      details: 'Pengambilan foto langsung (live capture) berkecepatan tinggi.',
    },
    {
      step: 3,
      title: 'Face Verification',
      shortTitle: 'Biometrik',
      desc: 'Sistem mencocokkan fitur wajah dengan data registrasi karyawan secara realtime.',
      icon: ScanFace,
      details: 'Pencocokan biometrik terenkripsi dengan toleransi sudut dan pencahayaan.',
    },
    {
      step: 4,
      title: 'Liveness Check',
      shortTitle: 'Liveness',
      desc: 'Validasi kehadiran fisik manusia untuk memastikan pengguna hadir langsung dan bukan foto.',
      icon: Sparkles,
      details: 'Pencegahan upaya spoofing dari cetakan foto atau layar perangkat lain.',
    },
    {
      step: 5,
      title: 'GPS & Geofence',
      shortTitle: 'Geofence',
      desc: 'Sistem membaca koordinat GPS dan memverifikasi posisi berada dalam radius kantor.',
      icon: MapPin,
      details: 'Deteksi Fake GPS dan pencatatan nama cabang kantor resmi.',
    },
    {
      step: 6,
      title: 'Check-In Sukses',
      shortTitle: 'Selesai',
      desc: 'Kehadiran tercatat ke server dengan stempel waktu resmi, notifikasi terkirim seketika.',
      icon: CheckCircle2,
      details: 'Audit trail tersimpan permanen dan rekapitulasi HR diperbarui realtime.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Alur Verifikasi Presensi</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Cara Kerja: Untuk Karyawan
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Enam tahap verifikasi otomatis berjalan hanya dalam hitungan detik untuk memastikan kehadiran yang valid, cepat, dan tanpa friksi.
          </p>
        </div>

        {/* Desktop Horizontal Timeline */}
        <div className="hidden lg:block relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-neutral-800 -translate-y-8 z-0" />

          <div className="grid grid-cols-6 gap-4 relative z-10">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = activeStep === idx;

              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between h-64 ${
                    isSelected
                      ? 'bg-neutral-800 border-emerald-400/80 ring-2 ring-emerald-400/20 shadow-xl'
                      : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isSelected
                            ? 'bg-emerald-400 text-neutral-950'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {item.step}
                      </div>
                      <Icon
                        className={`w-4 h-4 ${
                          isSelected ? 'text-emerald-400' : 'text-neutral-500'
                        }`}
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-800/80 text-[10px] text-emerald-400/90 font-mono">
                    {item.shortTitle} ✓
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Step Highlight Box for Desktop */}
        <div className="hidden lg:block max-w-2xl mx-auto p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/80 text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0 font-mono font-bold text-sm">
              0{steps[activeStep].step}
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Detail Tahap: {steps[activeStep].title}
              </p>
              <p className="text-xs text-neutral-400">
                {steps[activeStep].details}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden space-y-4">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 flex items-start gap-4 text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-400 text-neutral-950 flex items-center justify-center font-bold text-sm shrink-0">
                  {item.step}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {item.desc}
                  </p>
                  <p className="text-[11px] text-neutral-400 pt-1 font-mono">
                    {item.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
