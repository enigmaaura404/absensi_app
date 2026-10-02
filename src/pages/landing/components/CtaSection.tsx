import React from 'react';
import { ArrowRight, LogIn } from 'lucide-react';

interface CtaSectionProps {
  onStartClick: () => void;
  onLoginClick: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({
  onStartClick,
  onLoginClick,
}) => {
  return (
    <section className="py-24 bg-neutral-900 text-white relative overflow-hidden text-center">
      {/* Background Accent Grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Mulai Transformasi Presensi
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Mulai kelola kehadiran dengan cara yang lebih sederhana.
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Tinggalkan pencatatan manual dan nikmati transparansi data kehadiran berbasis biometrik wajah, geofencing, dan alur approval terstruktur.
          </p>
        </div>

        {/* CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={onStartClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-sm shadow-xl transition-all active:scale-98 cursor-pointer"
          >
            <span>Mulai Sekarang</span>
            <ArrowRight className="w-4 h-4 text-neutral-900" />
          </button>

          <button
            type="button"
            onClick={onLoginClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-neutral-400" />
            <span>Login ke Akun Anda</span>
          </button>
        </div>

        <p className="text-xs text-neutral-500 font-medium">
          Akun karyawan diterbitkan dan dikonfigurasi melalui Administrator perusahaan Anda.
        </p>
      </div>
    </section>
  );
};
