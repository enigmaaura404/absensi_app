import React from 'react';
import {
  ShieldCheck,
  Smartphone,
  ScanFace,
  Sparkles,
  MapPin,
  Clock,
  Layers,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const securityLayers = [
    {
      label: 'Identity',
      icon: Lock,
      desc: 'Otentikasi Kredensial',
    },
    {
      label: 'Device',
      icon: Smartphone,
      desc: 'Hardware Binding',
    },
    {
      label: 'Face',
      icon: ScanFace,
      desc: 'Pencocokan Biometrik',
    },
    {
      label: 'Liveness',
      icon: Sparkles,
      desc: 'Deteksi Manusia Nyata',
    },
    {
      label: 'GPS',
      icon: MapPin,
      desc: 'Koordinat Riil',
    },
    {
      label: 'Geofence',
      icon: ShieldCheck,
      desc: 'Radius Kantor Valid',
    },
    {
      label: 'Timestamp',
      icon: Clock,
      desc: 'Waktu Server Resmi',
    },
    {
      label: 'Audit Trail',
      icon: Layers,
      desc: 'Log Forensik Tamper-Proof',
    },
  ];

  const securityCards = [
    {
      title: 'Face Verification',
      subtitle: 'Biometric Identity Control',
      desc: 'Membantu memvalidasi identitas pengguna dengan membandingkan fitur wajah saat selfie terhadap data referensi yang tersimpan secara terenkripsi.',
      icon: ScanFace,
      tag: 'Identity Layer',
    },
    {
      title: 'Liveness Detection',
      subtitle: 'Anti-Spoofing Mitigations',
      desc: 'Membantu mengurangi risiko penggunaan foto cetak, topeng, rekaman layar, atau video playback melalui algoritma analisis kedalaman dan pantulan cahaya.',
      icon: Sparkles,
      tag: 'Integrity Layer',
    },
    {
      title: 'GPS & Geofence Boundaries',
      subtitle: 'Perimeter Validation',
      desc: 'Membantu memastikan presensi hanya tercatat saat karyawan berada di dalam batas geofence kantor yang ditentukan, dilengkapi penyaringan indikasi Fake GPS.',
      icon: MapPin,
      tag: 'Location Layer',
    },
    {
      title: 'Server-Authoritative Timestamp',
      subtitle: 'Tamper-Resistant Clock',
      desc: 'Pencatatan waktu absensi mengacu pada stempel waktu server terpercaya (NTP synchronization) untuk mencegah manipulasi jam lokal pada perangkat.',
      icon: Clock,
      tag: 'Temporal Layer',
    },
    {
      title: 'Device Hardware Binding',
      subtitle: 'Single Device Access Policy',
      desc: 'Membantu mengontrol perangkat yang digunakan karyawan melalui pendaftaran fingerprint hardware unik, membatasi akun hanya login pada gadget resmi.',
      icon: Smartphone,
      tag: 'Hardware Layer',
    },
    {
      title: 'Immutable Audit Trail',
      subtitle: 'Forensic Compliance Log',
      desc: 'Setiap aksi presensi, approval, dan perubahan izin dicatat secara permanen dengan IP address, perangkat, serta riwayat lengkap untuk kebutuhan audit kepatuhan.',
      icon: Layers,
      tag: 'Governance Layer',
    },
  ];

  return (
    <section id="security" className="py-24 bg-neutral-50/70 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Multi-Layer Protection</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Kehadiran yang dapat diverifikasi.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Pendekatan keamanan bertingkat yang dirancang untuk mengurangi risiko fraud, melindungi integritas data kehadiran, dan memberikan kepastian kepatuhan bagi perusahaan.
          </p>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Alur Verifikasi Keamanan Berlapis (Defense in Depth)
              </h3>
              <p className="text-xs text-neutral-500">
                Setiap transaksi absensi harus melewati 8 kontrol keamanan sebelum dinyatakan sah
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">
              Security Controls Active
            </span>
          </div>

          {/* Diagram Flow */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
            {securityLayers.map((layer, idx) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.label}
                  className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/70 hover:border-neutral-900 transition-colors flex flex-col justify-between h-28 relative group text-left"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4 text-neutral-700 group-hover:text-emerald-600 transition-colors" />
                    <span className="text-[10px] font-mono text-neutral-400">
                      0{idx + 1}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block truncate">
                      {layer.label}
                    </span>
                    <span className="text-[10px] text-neutral-500 block truncate mt-0.5">
                      {layer.desc}
                    </span>
                  </div>
                  {idx < securityLayers.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-neutral-300">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 6 Security Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded-md">
                      {card.tag}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">
                      {card.subtitle}
                    </span>
                    <h4 className="text-base font-bold text-neutral-900 mt-0.5">
                      {card.title}
                    </h4>
                    <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kontrol audit & validasi server</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
