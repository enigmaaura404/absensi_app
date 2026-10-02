import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  ScanFace,
  Smartphone,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  LogIn,
} from 'lucide-react';

export const AttendanceExperienceSection: React.FC = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateCheckIn = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setIsCheckedIn(true);
    }, 1200);
  };

  const handleReset = () => {
    setIsCheckedIn(false);
  };

  return (
    <section className="py-24 bg-white border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Pengalaman Pengguna
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Absensi dalam beberapa langkah sederhana.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Meskipun validasi keamanan di balik layar sangat ketat, pengalaman bagi karyawan tetap secepat membuka kamera ponsel: cukup satu sentuhan.
          </p>
        </div>

        {/* Interactive Experience Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-5xl mx-auto">
          {/* Left: Mobile Phone Simulation */}
          <div className="lg:col-span-6 flex justify-center">
            {/* Phone Bezel */}
            <div className="w-[310px] sm:w-[330px] rounded-[2.5rem] bg-neutral-900 p-3 shadow-2xl border-4 border-neutral-800">
              {/* Phone Inner Screen */}
              <div className="w-full bg-neutral-50 rounded-[2rem] overflow-hidden p-4 min-h-[530px] flex flex-col justify-between text-left">
                {/* Phone Notch / Status Bar */}
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pb-2 border-b border-neutral-200/60">
                  <span className="font-bold text-neutral-800">08:01</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px]">4G</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>

                {!isCheckedIn ? (
                  /* State 1: Ready to Check-In */
                  <div className="space-y-4 my-auto">
                    {/* User Greeting */}
                    <div className="text-center pt-2">
                      <div className="w-14 h-14 rounded-full bg-neutral-200 mx-auto overflow-hidden border-2 border-white shadow-xs mb-2">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                          alt="Budi"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-base font-bold text-neutral-900">
                        Good Morning, Budi
                      </h3>
                      <p className="text-[11px] text-neutral-500">
                        Jumat, 02 Oktober 2026
                      </p>
                    </div>

                    {/* Camera Scanner Viewfinder */}
                    <div className="relative w-full aspect-4/3 rounded-2xl bg-neutral-900 overflow-hidden flex items-center justify-center border border-neutral-800 shadow-inner">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                        alt="Camera Viewfinder"
                        className="w-full h-full object-cover opacity-60"
                      />
                      {/* Biometric Scan Frame */}
                      <div className="absolute inset-4 border-2 border-dashed border-emerald-400/80 rounded-xl flex items-center justify-center">
                        {isSimulating ? (
                          <div className="text-center space-y-1 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg text-emerald-400 font-mono text-[11px]">
                            <RefreshCw className="w-4 h-4 animate-spin mx-auto text-emerald-400" />
                            <span>Memindai...</span>
                          </div>
                        ) : (
                          <span className="text-[10px] bg-black/50 text-emerald-300 font-semibold px-2 py-0.5 rounded">
                            Posisi Wajah Pas
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Verification Checklist */}
                    <div className="bg-white p-3 rounded-xl border border-neutral-200/80 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 text-neutral-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Face Ready (Terdeteksi)</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Location Ready (Kantor Pusat)</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Device Verified (Galaxy S24)</span>
                      </div>
                    </div>

                    {/* Check-In CTA Button */}
                    <button
                      type="button"
                      disabled={isSimulating}
                      onClick={handleSimulateCheckIn}
                      className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-70"
                    >
                      <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isSimulating ? 'Sedang Memverifikasi...' : 'CHECK-IN SEKARANG'}</span>
                    </button>
                  </div>
                ) : (
                  /* State 2: Check-In Selesai */
                  <div className="space-y-4 my-auto text-center animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Tervalidasi Resmi
                      </span>
                      <h3 className="text-lg font-extrabold text-neutral-900 mt-0.5">
                        Check-In Berhasil
                      </h3>
                      <p className="text-2xl font-black font-mono text-neutral-900 mt-1">
                        08:01 <span className="text-xs text-neutral-500 font-sans font-normal">WIB</span>
                      </p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-neutral-200/80 text-left text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Lokasi:</span>
                        <span className="font-bold text-neutral-800">Kantor Pusat Bandung</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Jarak:</span>
                        <span className="font-semibold text-emerald-700 font-mono">32 meter (Aman)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Metode:</span>
                        <span className="font-semibold text-neutral-800">Biometrik + GPS</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full py-2.5 px-3 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      Coba Simulasi Lagi ↺
                    </button>
                  </div>
                )}

                {/* Bottom Bar */}
                <div className="pt-2 border-t border-neutral-200/60 text-center text-[10px] text-neutral-400 font-mono">
                  ATTENDANCE Mobile Engine v2.4
                </div>
              </div>
            </div>
          </div>

          {/* Right: Key Value Points */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Simplicity Meets Security
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Validasi kompleks, antarmuka tanpa beban.
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Karyawan tidak perlu mempelajari alur rumit. Cukup buka aplikasi di smartphone, hadapkan wajah ke kamera, dan tombol check-in langsung siap digunakan saat berada di kantor.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>3 Detik Tanpa Antrean</span>
                </h4>
                <p className="text-xs text-neutral-500">
                  Tidak ada penumpukan antre di pintu masuk kantor jam 07:55 pagi seperti pada mesin fingerprint lama.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Notifikasi Transparan</span>
                </h4>
                <p className="text-xs text-neutral-500">
                  Status jam masuk, durasi kerja, dan konfirmasi presensi langsung tampil tanpa rasa cemas "apakah absensi saya tercatat?".
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Bekerja di Seluruh Browser</span>
                </h4>
                <p className="text-xs text-neutral-500">
                  PWA-ready dan responsif di Chrome, Safari, Firefox, Android, dan iOS tanpa perlu instalasi file berat dari app store.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
