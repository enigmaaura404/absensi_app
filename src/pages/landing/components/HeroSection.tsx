import React from 'react';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  ScanFace,
  Smartphone,
  LogOut,
  Layers,
  Lock,
} from 'lucide-react';

interface HeroSectionProps {
  onStartClick: () => void;
  onExploreWorkflow: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartClick,
  onExploreWorkflow,
}) => {
  return (
    <section id="product" className="relative pt-28 sm:pt-36 pb-20 overflow-hidden">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Kicker Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SMART ATTENDANCE MANAGEMENT SYSTEM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.12]">
              Absensi karyawan yang{' '}
              <span className="text-neutral-950 underline decoration-emerald-400 decoration-wavy decoration-2 underline-offset-4">
                lebih sederhana
              </span>
              , aman, dan terkontrol.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed max-w-xl">
              Kelola kehadiran, pengajuan, approval, dan laporan dalam satu platform modern. Menggabungkan biometrik wajah, liveness detection, GPS geofencing, dan audit trail enterprise.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onStartClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                <span>Mulai Sekarang</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                type="button"
                onClick={onExploreWorkflow}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-neutral-500 fill-neutral-500" />
                <span>Lihat Cara Kerja</span>
              </button>
            </div>

            {/* Micro Quote */}
            <p className="text-xs text-neutral-400 font-medium pt-1">
              Dirancang untuk kemudahan karyawan dan kepastian data perusahaan.
            </p>
          </div>

          {/* Right Column: Interactive Product Mockup */}
          <div className="lg:col-span-6 relative">
            {/* Background Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-100 to-neutral-200/50 rounded-3xl blur-2xl -z-10 opacity-70" />

            {/* Product Card Container */}
            <div className="relative bg-white rounded-3xl border border-neutral-200/90 shadow-2xl p-6 sm:p-7 max-w-lg mx-auto">
              {/* Mockup Header */}
              <div className="flex items-center justify-between pb-5 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden border border-neutral-300">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Budi Santoso"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-neutral-900 leading-tight">
                      Good Morning, Budi
                    </h2>
                    <p className="text-[11px] text-neutral-400 font-medium">
                      Senior Software Engineer • Kantor Pusat
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-700">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>08:01 WIB</span>
                </div>
              </div>

              {/* Status Section */}
              <div className="my-5 p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Today's Attendance
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Hadir Tepat Waktu
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-neutral-900 tracking-tight font-mono">
                    08:01
                  </span>
                  <span className="text-xs font-semibold text-neutral-500">
                    Checked In
                  </span>
                </div>

                {/* Sub Metadata Grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-neutral-200/60 text-left">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">
                      Location
                    </span>
                    <span className="text-xs font-bold text-neutral-900 truncate block mt-0.5">
                      Office HQ
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">
                      Face
                    </span>
                    <span className="text-xs font-bold text-emerald-700 truncate block mt-0.5">
                      Verified
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">
                      GPS
                    </span>
                    <span className="text-xs font-bold text-emerald-700 truncate block mt-0.5">
                      Inside Radius
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button Mockup */}
              <div className="mt-4">
                <button
                  type="button"
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-amber-200" />
                  <span>CHECK-OUT SEKARANG</span>
                </button>
              </div>

              {/* Security Validation Badges */}
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Device Bound
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Liveness Valid
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Encrypted
                </span>
              </div>
            </div>

            {/* Floating Card 1: Face Verified */}
            <div className="hidden sm:flex absolute -top-4 -left-6 bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-neutral-200/90 shadow-xl items-center gap-3 animate-bounce [animation-duration:4s]">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ScanFace className="w-4 h-4" />
              </div>
              <div className="text-left pr-2">
                <p className="text-xs font-bold text-neutral-900 leading-tight">Face Verified</p>
                <p className="text-[10px] text-neutral-400">99.8% biometric match</p>
              </div>
            </div>

            {/* Floating Card 2: Location Verified */}
            <div className="hidden sm:flex absolute -bottom-5 -right-4 bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-neutral-200/90 shadow-xl items-center gap-3 animate-bounce [animation-duration:5s]">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left pr-2">
                <p className="text-xs font-bold text-neutral-900 leading-tight">Location Verified</p>
                <p className="text-[10px] text-neutral-400">Radius kantor 32m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Trust Indicators Bar */}
        <div className="mt-20 pt-8 border-t border-neutral-200/80">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6 text-center">
            Pilar Keamanan & Kendali Absensi Terpadu
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white border border-neutral-200/70 shadow-2xs">
              <ScanFace className="w-4 h-4 text-neutral-700 shrink-0" />
              <span className="text-xs font-bold text-neutral-800">Selfie Verification</span>
            </div>

            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white border border-neutral-200/70 shadow-2xs">
              <MapPin className="w-4 h-4 text-neutral-700 shrink-0" />
              <span className="text-xs font-bold text-neutral-800">GPS & Geofencing</span>
            </div>

            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white border border-neutral-200/70 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-neutral-700 shrink-0" />
              <span className="text-xs font-bold text-neutral-800">Liveness Detection</span>
            </div>

            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white border border-neutral-200/70 shadow-2xs">
              <Lock className="w-4 h-4 text-neutral-700 shrink-0" />
              <span className="text-xs font-bold text-neutral-800">Role-Based Access</span>
            </div>

            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white border border-neutral-200/70 shadow-2xs col-span-2 sm:col-span-1">
              <Layers className="w-4 h-4 text-neutral-700 shrink-0" />
              <span className="text-xs font-bold text-neutral-800">Audit Trail</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
