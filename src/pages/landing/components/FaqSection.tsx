import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah karyawan perlu menginstal aplikasi?',
      a: 'Tidak wajib. Sistem ATTENDANCE dirancang berbasis Progressive Web App (PWA) yang dapat langsung diakses melalui peramban (browser) modern di smartphone Android maupun iOS tanpa perlu mengunduh aplikasi berukuran besar.',
    },
    {
      q: 'Apakah selfie wajib dilakukan saat absensi?',
      a: 'Ya, pengambilan foto selfie secara langsung (live capture) merupakan bagian inti dari alur verifikasi biometrik wajah dan deteksi liveness guna memastikan kehadiran fisik karyawan secara valid.',
    },
    {
      q: 'Bagaimana lokasi karyawan diverifikasi?',
      a: 'Sistem membaca koordinat GPS perangkat karyawan dan mencocokkannya dengan radius perimeter (geofence) kantor cabang yang telah didaftarkan. Presensi hanya diterima jika berada dalam jarak aman yang ditentukan.',
    },
    {
      q: 'Apakah semua user dapat mengubah data kehadiran?',
      a: 'Tidak. Akses diatur secara ketat berdasarkan Role-Based Access Control (RBAC) dan permission. Karyawan biasa hanya dapat mengajukan koreksi atau cuti yang memerlukan persetujuan berjenjang dari atasan dan HR.',
    },
    {
      q: 'Siapa yang mengelola master data seperti karyawan dan cabang kantor?',
      a: 'Seluruh manajemen master data, struktur organisasi, jadwal shift, hari libur, dan peran dikelola secara eksklusif oleh Superadmin melalui antarmuka Superadmin CMS internal yang terisolasi.',
    },
    {
      q: 'Apakah tersedia integrasi dengan layanan Google?',
      a: 'Ya. ATTENDANCE terintegrasi langsung dengan Google Drive untuk penyimpanan dokumen selfie & surat keterangan, Google Sheets untuk sinkronisasi rekap laporan dua arah, dan Google Calendar untuk hari libur nasional.',
    },
    {
      q: 'Apakah tersedia notifikasi melalui Telegram?',
      a: 'Ya, tersedia integrasi bot Telegram yang dapat mengirimkan konfirmasi presensi masuk kepada karyawan, peringatan antrean approval kepada manajer, dan verifikasi kode 2FA untuk akun Superadmin.',
    },
    {
      q: 'Bagaimana keamanan dan privasi data absensi dijaga?',
      a: 'Sistem menggunakan enkripsi transport HTTPS/TLS, validasi otorisasi sisi server (server-side authorization), stempel waktu server terpercaya, penguncian perangkat (device binding), dan catatan audit log (audit trail) permanen.',
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-white border-b border-neutral-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-neutral-600" />
            <span>Pertanyaan Umum</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Jawaban lengkap seputar cara kerja, privasi, keamanan, dan penerapan ATTENDANCE di perusahaan Anda.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="divide-y divide-neutral-200 border-y border-neutral-200 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.q} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left py-2 text-sm sm:text-base font-bold text-neutral-900 hover:text-neutral-700 transition-colors cursor-pointer gap-4"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <div
                    className={`w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-neutral-900 text-white' : 'text-neutral-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-2 pb-2 text-xs sm:text-sm text-neutral-600 leading-relaxed animate-in fade-in-50 duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
